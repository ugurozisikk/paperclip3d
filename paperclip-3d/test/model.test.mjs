import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicSnapshot, agentState, transitions, humanAttention, idlePlayers, taskBroadcast, kanbanColumns, blockingVisits } from '../src/model.js';
const company = { id: 'company-a', name: 'First team', issuePrefix: 'ONE' };
const agent = (id, extra = {}) => ({ id, companyId: company.id, name: id, status: 'idle', ...extra });
const issue = (id, extra = {}) => ({ id, companyId: company.id, title: id, status: 'todo', ...extra });
test('company scoping, DTO redaction and arbitrary org hierarchy', () => {
  const result = publicSnapshot(company, [agent('dev', { reportsTo: 'po', adapterConfig: { apiKey: 'SECRET' } }), agent('po', { reportsTo: 'manager' }), agent('manager'), agent('other', { companyId: 'company-b' }), agent('retired', { status: 'terminated' })], [issue('task'), issue('foreign', { companyId: 'company-b' })]);
  assert.deepEqual(result.agents.map(a => a.id), ['manager', 'po', 'dev']);
  assert.equal(result.issues.length, 1); assert.ok(!JSON.stringify(result).includes('SECRET'));
});
test('a different company works with no hardcoded team identifiers', () => {
  const other = { id: 'company-b', name: 'Second team' };
  const result = publicSnapshot(other, [agent('designer', { companyId: other.id }), agent('manager')], []);
  assert.equal(result.company.name, 'Second team'); assert.equal(result.agents[0].id, 'designer');
});
test('cycles and deleted managers do not break the roster', () => {
  const result = publicSnapshot(company, [agent('a', { reportsTo: 'b' }), agent('b', { reportsTo: 'a' }), agent('c', { reportsTo: 'deleted' })], []);
  assert.equal(result.agents.length, 3); assert.equal(result.agents.find(a => a.id === 'c').reportsTo, null);
});
test('assigned work does not pretend an idle agent is running', () => {
  assert.equal(agentState(agent('dev'), [issue('x', { assigneeAgentId: 'dev', status: 'in_progress' })]), 'idle');
  assert.equal(agentState(agent('dev', { status: 'running' }), []), 'working');
  assert.equal(agentState(agent('dev', { status: 'error' }), []), 'error');
});
test('real handoffs and completions are detected once, never on initial load', () => {
  const before = publicSnapshot(company, [agent('po'), agent('dev')], [issue('x', { assigneeAgentId: 'po' })]);
  const after = publicSnapshot(company, [agent('po'), agent('dev')], [issue('x', { assigneeAgentId: 'dev', status: 'done' })]);
  assert.equal(transitions(null, before).length, 0);
  assert.deepEqual(transitions(before, after).map(e => e.kind), ['handoff', 'complete']);
  assert.equal(transitions(after, after).length, 0);
  assert.equal(transitions(before, { ...after, company: { id: 'other' } }).length, 0);
});
test('creating a child task generates manager to worker handoff', () => {
  const before = publicSnapshot(company, [agent('po'), agent('dev')], [issue('parent', { assigneeAgentId: 'po' })]);
  const after = { ...before, issues: [...before.issues, issue('child', { parentId: 'parent', assigneeAgentId: 'dev' })] };
  assert.equal(transitions(before, after)[0].from, 'po'); assert.equal(transitions(before, after)[0].to, 'dev');
});
test('only pending questions addressed to humans enter the human desk queue', () => {
  const members = [agent('po'), agent('dev')], issues = [issue('one', { assigneeAgentId: 'dev', status: 'blocked' })];
  const question = { id: 'q', companyId: company.id, issueId: 'one', createdByAgentId: 'dev', status: 'pending', kind: 'ask_user_questions', payload: { questions: [{ question: 'Hangi rengi seçelim?' }] }, createdAt: '2026-11-05T10:00:00Z' };
  const records = [question, { ...question, id: 'answered', status: 'answered' }, { ...question, id: 'foreign', companyId: 'company-b' }, { ...question, id: 'other-agent', addresseeAgentId: 'po' }, { ...question, id: 'other-user', addresseeUserId: 'user-b' }, { ...question, id: 'suggestion', kind: 'suggest_tasks', effectiveResolverPolicy: 'anyone' }];
  const result = humanAttention(company.id, members, issues, records, [], 'user-a');
  assert.equal(humanAttention(company.id, members, issues, [{ ...question, addresseeUserId: 'user-b' }], []).length, 0, 'unknown viewer must not see another user’s targeted question');
  assert.equal(result.length, 1); assert.equal(result[0].agentId, 'dev'); assert.equal(result[0].title, 'Hangi rengi seçelim?');
  assert.equal(humanAttention(company.id, members, issues, [], []).length, 0, 'blocked alone never means awaiting the human');
});
test('human-only confirmations and agent approvals queue in oldest-first order without raw payloads', () => {
  const members = [agent('po')], issues = [issue('one')];
  const result = humanAttention(company.id, members, issues, [{ id: 'confirm', companyId: company.id, issueId: 'one', status: 'pending', kind: 'request_confirmation', effectiveResolverPolicy: 'human_only', createdByAgentId: 'po', title: 'Yayınlayalım mı?', createdAt: '2026-11-05T12:00:00Z' }], [
    { id: 'approval', companyId: company.id, status: 'pending', requestedByAgentId: 'po', type: 'hire_agent', payload: { apiKey: 'SECRET' }, createdAt: '2026-11-05T11:00:00Z' },
    { id: 'closed', companyId: company.id, status: 'approved', requestedByAgentId: 'po' }
  ]);
  assert.deepEqual(result.map(a => a.kind), ['approval', 'confirmation']);
  assert.ok(!JSON.stringify(result).includes('SECRET'));
});
test('only genuinely idle agents join the lobby; running/error/paused/question/blocker states do not', () => {
  const members = [agent('idle'), agent('working', { status: 'running' }), agent('error', { status: 'error' }), agent('paused', { status: 'paused' }), agent('asker'), agent('blocked')];
  assert.deepEqual(idlePlayers(members, [issue('blocker', { status: 'blocked', assigneeAgentId: 'blocked' })], [{ agentId: 'asker' }]).map(a => a.id), ['idle']);
});

test('TV follows the root of active nested work and counts actual child completions', () => {
  const tasks = [issue('old', { status: 'done' }), issue('main', { status: 'todo', identifier: 'ONE-10' }), issue('child', { parentId: 'main', status: 'in_progress' }), issue('nested', { parentId: 'child', status: 'done' }), issue('cancelled', { parentId: 'main', status: 'cancelled' })];
  const result = taskBroadcast(tasks);
  assert.equal(result.main.identifier, 'ONE-10'); assert.equal(result.completed, 1); assert.equal(result.total, 2);
  assert.equal(taskBroadcast([]).main, null);
  assert.equal(taskBroadcast([issue('cancelled', { status: 'cancelled' })]).main, null);
  assert.ok(taskBroadcast([issue('cycle-a', { parentId: 'cycle-b' }), issue('cycle-b', { parentId: 'cycle-a' })]).main);
});

test('Kanban reflects real task states, including blockers and empty columns', () => {
  const result = kanbanColumns([issue('todo'), issue('backlog', { status: 'backlog' }), issue('work', { status: 'in_progress' }), issue('review', { status: 'in_review' }), issue('blocked', { status: 'blocked' }), issue('done', { status: 'done' }), issue('cancelled', { status: 'cancelled' })]);
  assert.deepEqual(result.map(c => c.issues.length), [2, 1, 2, 1]);
  assert.equal(result[2].issues.find(i => i.id === 'blocked').status, 'blocked');
  assert.deepEqual(kanbanColumns([]).map(c => c.issues.length), [0, 0, 0, 0]);
});

test('explicit unresolved dependencies send the blocked agent to the responsible agent; human questions take priority', () => {
  const agents = [agent('backend'), agent('frontend')];
  const tasks = [issue('api', { status: 'in_progress', assigneeAgentId: 'backend' }), issue('ui', { status: 'blocked', assigneeAgentId: 'frontend', blockedByIssueIds: ['api'] })];
  assert.equal(blockingVisits(agents, tasks)[0].blockerAgentId, 'backend');
  assert.equal(blockingVisits(agents, tasks, [{ agentId: 'frontend' }]).length, 0);
  assert.equal(blockingVisits(agents, [{ ...tasks[0], status: 'done' }, tasks[1]]).length, 0);
  assert.equal(blockingVisits(agents, [{ ...tasks[0], assigneeAgentId: 'frontend' }, tasks[1]]).length, 0);
  assert.equal(blockingVisits(agents, [{ ...tasks[1], blockedByIssueIds: ['missing'] }]).length, 0);
  const dto = publicSnapshot(company, agents, [...tasks, issue('foreign', { companyId: 'other' }), issue('private', { blockedByIssueIds: ['foreign', 'missing'] })]);
  assert.deepEqual(dto.issues.find(i => i.id === 'private').blockedByIssueIds, []);
});
