// Only these public fields cross into the scene. Adapter configs, prompts and keys never do.
export function publicSnapshot(company, agents, issues, interactions = [], approvals = [], viewerUserId = null) {
  const companyId = company.id;
  const members = agents.filter(a => a.companyId === companyId && a.status !== 'terminated');
  const ids = new Set(members.map(a => a.id));
  const taskIds = new Set(issues.filter(i => i.companyId === companyId).map(i => i.id));
  const depth = (a, seen = new Set()) => {
    if (!a.reportsTo || seen.has(a.id)) return 0;
    seen.add(a.id);
    const parent = members.find(x => x.id === a.reportsTo);
    return parent ? 1 + depth(parent, seen) : 0;
  };
  members.sort((a, b) => depth(a) - depth(b) || a.name.localeCompare(b.name, 'tr'));
  return {
    company: { id: companyId, name: company.name, prefix: company.issuePrefix },
    agents: members.map(a => ({ id: a.id, name: a.name, role: a.role, title: a.title,
      status: a.status, reportsTo: ids.has(a.reportsTo) ? a.reportsTo : null })),
    issues: issues.filter(i => i.companyId === companyId).map(i => ({
      id: i.id, identifier: i.identifier, title: i.title, status: i.status,
      priority: i.priority, assigneeAgentId: i.assigneeAgentId, parentId: i.parentId,
      projectId: i.projectId, updatedAt: i.updatedAt,
      blockedByIssueIds: [...new Set(i.blockedByIssueIds || (i.blockedBy || []).map(b => b.id))].filter(id => taskIds.has(id))
    })),
    attention: humanAttention(companyId, members, issues, interactions, approvals, viewerUserId),
    updatedAt: new Date().toISOString()
  };
}

// Only explicit human questions / confirmations / approvals join the human desk queue.
// A failed run or a blocked task on its own is not a question addressed to the user.
export function humanAttention(companyId, agents, issues, interactions, approvals, viewerUserId = null) {
  const people = new Set(agents.filter(a => a.companyId === companyId).map(a => a.id));
  const tasks = new Map(issues.filter(i => i.companyId === companyId).map(i => [i.id, i]));
  const pending = [];
  for (const item of interactions) {
    const issue = tasks.get(item.issueId);
    if (item.companyId !== companyId || !issue || item.status !== 'pending' || item.addresseeAgentId) continue;
    if (item.addresseeUserId && item.addresseeUserId !== viewerUserId) continue;
    const policy = item.effectiveResolverPolicy || item.resolverPolicy;
    if (item.kind !== 'ask_user_questions' && !['human_only', 'board_only'].includes(policy)) continue;
    const agentId = item.createdByAgentId || issue.assigneeAgentId;
    if (!people.has(agentId)) continue;
    const first = item.payload?.questions?.[0];
    const title = item.title || item.payload?.title || first?.question || first?.prompt || issue.title;
    const canonical = item.payload?.questionSet?.questions;
    const questions = (canonical || item.payload?.questions || []).map(q => ({
      id: q.id, prompt: String(q.prompt || q.question || '').slice(0, 4000),
      helpText: q.helpText, required: q.required !== false,
      mode: q.answerMode === 'text' ? 'text' : q.answerMode === 'multi_select' || q.selectionMode === 'multi' ? 'multi' : 'single',
      allowOther: !!(q.customAnswer?.enabled || q.allowOther),
      options: (q.options || []).map(o => ({ id: o.id, label: o.label, description: o.description, freeText: !!o.freeText }))
    }));
    pending.push({ id: `interaction:${item.id}`, interactionId: item.id, kind: item.kind === 'ask_user_questions' ? 'question' : 'confirmation',
      agentId, issueId: issue.id, identifier: issue.identifier, title: String(title).slice(0, 200),
      questions,
      summary: String(item.summary || first?.question || first?.prompt || '').slice(0, 500),
      path: `issues/${encodeURIComponent(issue.identifier || issue.id)}`, createdAt: item.createdAt });
  }
  for (const approval of approvals) {
    if (approval.companyId !== companyId || approval.status !== 'pending' || !people.has(approval.requestedByAgentId)) continue;
    pending.push({ id: `approval:${approval.id}`, kind: 'approval', agentId: approval.requestedByAgentId,
      title: approval.type === 'hire_agent' ? 'Yeni ajan için onayın bekleniyor' : 'Kararın bekleniyor',
      summary: 'Paperclip onay talebi', path: `approvals/${encodeURIComponent(approval.id)}`, createdAt: approval.createdAt });
  }
  return pending.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)) || a.id.localeCompare(b.id));
}

export function agentState(agent, issues) {
  if (agent.status === 'running') return 'working';
  if (agent.status === 'error') return 'error';
  if (['paused', 'pending_approval'].includes(agent.status)) return 'waiting';
  if (issues.some(i => i.assigneeAgentId === agent.id && i.status === 'blocked')) return 'waiting';
  // An assigned in-progress ticket alone does not prove a model is currently running.
  return 'idle';
}

export function currentIssue(agentId, issues) {
  const rank = { in_progress: 0, blocked: 1, in_review: 2, todo: 3, backlog: 4 };
  return issues.filter(i => i.assigneeAgentId === agentId && i.status in rank)
    .sort((a, b) => rank[a.status] - rank[b.status] || String(b.updatedAt).localeCompare(String(a.updatedAt)))[0] ?? null;
}

export function idlePlayers(agents, issues, attention = []) {
  const waiting = new Set(attention.map(item => item.agentId));
  return agents.filter(a => ['idle', 'active'].includes(a.status) && agentState(a, issues) === 'idle' && !waiting.has(a.id));
}

export function transitions(previous, next) {
  if (!previous || previous.company.id !== next.company.id) return [];
  const old = new Map(previous.issues.map(i => [i.id, i]));
  const events = [];
  for (const issue of next.issues) {
    const before = old.get(issue.id);
    if (before && before.assigneeAgentId && issue.assigneeAgentId && before.assigneeAgentId !== issue.assigneeAgentId) {
      events.push({ kind: 'handoff', from: before.assigneeAgentId, to: issue.assigneeAgentId, issue });
    } else if (!before && issue.parentId && issue.assigneeAgentId) {
      const parent = next.issues.find(i => i.id === issue.parentId);
      if (parent?.assigneeAgentId && parent.assigneeAgentId !== issue.assigneeAgentId)
        events.push({ kind: 'handoff', from: parent.assigneeAgentId, to: issue.assigneeAgentId, issue });
    }
    if (before && before.status !== 'done' && issue.status === 'done' && issue.assigneeAgentId)
      events.push({ kind: 'complete', from: issue.assigneeAgentId, issue });
  }
  return events;
}

// Select the root of actual active work, including work on nested subtasks.
export function taskBroadcast(issues) {
  if (!issues.length) return { main: null, children: [], completed: 0, total: 0 };
  const byId = new Map(issues.map(i => [i.id, i]));
  const rootOf = item => {
    const visited = new Set();
    while (item.parentId && byId.has(item.parentId) && !visited.has(item.id)) {
      visited.add(item.id); item = byId.get(item.parentId);
    }
    return item;
  };
  const rank = { in_progress: 0, in_review: 1, blocked: 2, todo: 3, backlog: 4, done: 5, cancelled: 6 };
  const candidates = issues.filter(i => i.status !== 'cancelled').sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9) || String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')) || a.id.localeCompare(b.id));
  const main = candidates.length ? rootOf(candidates[0]) : null;
  const children = main ? issues.filter(i => i.id !== main.id && i.status !== 'cancelled' && rootOf(i).id === main.id) : [];
  return { main, children, completed: children.filter(i => i.status === 'done').length, total: children.length };
}

export function kanbanColumns(issues) {
  return [
    { id: 'waiting', label: 'Bekliyor', states: ['backlog', 'todo'], color: '#c4c9ad' },
    { id: 'doing', label: 'Geliştirme', states: ['in_progress'], color: '#9dc9cf' },
    { id: 'review', label: 'İnceleme', states: ['in_review', 'blocked'], color: '#e3c494' },
    { id: 'done', label: 'Tamamlandı', states: ['done'], color: '#b7d59a' }
  ].map(column => ({ ...column, issues: issues.filter(i => column.states.includes(i.status)).sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''))) }));
}

export function blockingVisits(agents, issues, attention = []) {
  const people = new Set(agents.map(a => a.id)), tasks = new Map(issues.map(i => [i.id, i]));
  const askingHuman = new Set(attention.map(q => q.agentId)), seen = new Set(), result = [];
  for (const issue of [...issues].sort((a, b) => (a.status === 'blocked' ? -1 : 0) - (b.status === 'blocked' ? -1 : 0) || String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))) {
    const agentId = issue.assigneeAgentId;
    if (!people.has(agentId) || seen.has(agentId) || askingHuman.has(agentId) || ['done', 'cancelled'].includes(issue.status)) continue;
    for (const id of issue.blockedByIssueIds || (issue.blockedBy || []).map(b => b.id)) {
      const blocker = tasks.get(id), blockerAgentId = blocker?.assigneeAgentId;
      if (!blocker || ['done', 'cancelled'].includes(blocker.status) || !people.has(blockerAgentId) || blockerAgentId === agentId) continue;
      result.push({ agentId, blockerAgentId, issueId: issue.id, blockerIssueId: blocker.id, identifier: issue.identifier, blockerIdentifier: blocker.identifier });
      seen.add(agentId); break;
    }
  }
  return result;
}
