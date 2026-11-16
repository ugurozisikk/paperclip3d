import React, { useEffect, useRef, useState } from 'react';
import { currentIssue, blockingVisits } from './model.js';
import { api } from './question-chat.js';
const h = React.createElement;
const labels = { running: 'Çalışıyor', active: 'Hazır', idle: 'Boşta', error: 'Hata', paused: 'Duraklatıldı', pending_approval: 'Onay bekliyor', queued: 'Sırada', succeeded: 'Tamamlandı', failed: 'Başarısız', cancelled: 'İptal', timed_out: 'Zaman aşımı', in_progress: 'Geliştiriliyor', in_review: 'İncelemede', blocked: 'Engelli', done: 'Tamamlandı', todo: 'Bekliyor', backlog: 'Planlanacak' };
function transcript(content) {
  const result = [];
  for (const line of String(content || '').split('\n')) {
    try {
      const record = JSON.parse(line);
      if (record.stream && record.stream !== 'stdout') continue;
      for (const inner of String(record.chunk || line).split('\n')) {
        try {
          const event = JSON.parse(inner), item = event.item || event.message;
          const text = item?.text || (Array.isArray(item?.content) ? item.content.filter(p => p.type === 'text').map(p => p.text).join('\n') : typeof item?.content === 'string' ? item.content : null);
          if (text && (item?.type === 'agent_message' || event.type === 'assistant' || item.role === 'assistant')) result.push(text);
        } catch {}
      }
    } catch {}
  }
  return [...new Set(result)];
}
export function AgentInspector({ agentId, snapshot, companyId, base, onClose }) {
  const [runs, setRuns] = useState([]), [selected, setSelected] = useState(null), [detail, setDetail] = useState(null), [error, setError] = useState(''), [loading, setLoading] = useState(true), [limit, setLimit] = useState(30);
  const root = useRef(null), close = useRef(null);
  const person = snapshot?.agents.find(a => a.id === agentId), task = currentIssue(agentId, snapshot?.issues || []);
  const manager = snapshot?.agents.find(a => a.id === person?.reportsTo);
  const visit = blockingVisits(snapshot?.agents || [], snapshot?.issues || []).find(v => v.agentId === agentId);
  const blockerName = snapshot?.agents.find(a => a.id === visit?.blockerAgentId)?.name;
  useEffect(() => {
    const controller = new AbortController(); let inFlight = false;
    async function load() {
      if (inFlight) return; inFlight = true;
      try {
        const rows = await api(`/api/companies/${encodeURIComponent(companyId)}/heartbeat-runs?agentId=${encodeURIComponent(agentId)}&limit=${limit}&summary=true`, { signal: controller.signal });
        const clean = rows.filter(r => r.companyId === companyId && r.agentId === agentId).map(r => ({ id: r.id, status: r.status, startedAt: r.startedAt || r.createdAt, finishedAt: r.finishedAt, issueId: r.issueId }));
        if (controller.signal.aborted) return;
        setRuns(clean); setSelected(old => clean.some(r => r.id === old) ? old : clean[0]?.id || null); setError('');
      } catch (e) { if (!controller.signal.aborted) setError(e.message); }
      finally { if (!controller.signal.aborted) setLoading(false); inFlight = false; }
    }
    load(); const timer = setInterval(load, 5000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [agentId, companyId, limit]);
  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController(); let inFlight = false;
    setDetail(null);
    async function load() {
      if (inFlight) return; inFlight = true;
      try {
        const runPath = `/api/heartbeat-runs/${encodeURIComponent(selected)}`;
        const run = await api(runPath, { signal: controller.signal });
        if (run.companyId !== companyId || run.agentId !== agentId) throw new Error('Bu çalışma seçili ajana ait değil.');
        const [eventsResult, logResult] = await Promise.allSettled([
          api(`${runPath}/events?limit=200`, { signal: controller.signal }),
          api(`${runPath}/log?offset=0&limitBytes=128000`, { signal: controller.signal })
        ]);
        if (controller.signal.aborted) return;
        const events = eventsResult.status === 'fulfilled' ? eventsResult.value : [];
        const prompts = events.filter(e => (!e.runId || e.runId === selected) && (!e.companyId || e.companyId === companyId) && typeof e.payload?.prompt === 'string').map(e => ({ id: e.id || e.seq, text: e.payload.prompt }));
        const log = logResult.status === 'fulfilled' ? logResult.value : null;
        const outputs = transcript(log?.content);
        const context = run.contextSnapshot || {};
        setDetail({ status: run.status, error: run.error, startedAt: run.startedAt, finishedAt: run.finishedAt, prompts,
          outputs: outputs.length ? outputs : typeof run.resultJson?.summary === 'string' ? [run.resultJson.summary] : [],
          context: [context.paperclipTaskMarkdownAssignment, context.paperclipTaskMarkdown, context.paperclipWakeComment].filter(t => typeof t === 'string').join('\n\n'),
          inputTokens: run.usageJson?.inputTokens ?? run.inputTokens, outputTokens: run.usageJson?.outputTokens ?? run.outputTokens,
          warning: eventsResult.status === 'rejected' ? `Prompt kaydı alınamadı: ${eventsResult.reason.message}` : logResult.status === 'rejected' ? `Çıktı kaydı alınamadı: ${logResult.reason.message}` : null,
          hasMoreLog: Boolean(log?.nextOffset && run.logBytes && log.nextOffset < run.logBytes)
        });
      } catch (e) { if (!controller.signal.aborted) setError(e.message); }
      finally { inFlight = false; }
    }
    load(); const timer = setInterval(load, 5000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [selected, companyId, agentId]);
  useEffect(() => {
    close.current?.focus();
    const key = event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
      if (event.key !== 'Tab') return;
      const nodes = [...root.current.querySelectorAll('button:not(:disabled),a[href]')].filter(n => n.getClientRects().length);
      if (!root.current.contains(document.activeElement) || !event.shiftKey && document.activeElement === nodes.at(-1)) { event.preventDefault(); nodes[0]?.focus(); }
      else if (event.shiftKey && document.activeElement === nodes[0]) { event.preventDefault(); nodes.at(-1)?.focus(); }
    };
    window.addEventListener('keydown', key, true);
    return () => window.removeEventListener('keydown', key, true);
  }, []);
  return h('section', { className: 'o3d-agent', role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'o3d-agent-title', ref: root },
    h('header', { className: 'o3d-chat-header' }, h('div', { className: 'o3d-chat-avatar' }, person?.name?.slice(0, 1)), h('div', null, h('h1', { id: 'o3d-agent-title' }, person?.name || 'Ajan'), h('p', null, person?.title || person?.role)), h('a', { href: `${base}/agents/${encodeURIComponent(agentId)}`, target: '_blank', rel: 'noopener noreferrer' }, 'Paperclip’te aç ↗'), h('button', { ref: close, onClick: onClose, 'aria-label': 'Ajan penceresini kapat' }, '×')),
    h('div', { className: 'o3d-agent-layout' },
      h('aside', { className: 'o3d-run-list' }, h('h2', null, 'Prompt geçmişi'), h('p', null, 'Gerçek Paperclip çalışma kayıtları'),
        loading && h('p', { role: 'status' }, 'Geçmiş yükleniyor…'), !loading && !runs.length && h('p', null, 'Henüz çalışma kaydı yok.'),
        ...runs.map(run => h('button', { key: run.id, className: selected === run.id ? 'selected' : '', onClick: () => { setError(''); setSelected(run.id); }, 'aria-pressed': selected === run.id }, h('strong', null, new Date(run.startedAt).toLocaleString('tr-TR')), h('span', null, labels[run.status] || run.status), h('small', null, snapshot?.issues.find(i => i.id === run.issueId)?.identifier || run.id.slice(0, 8)))),
        runs.length >= limit && limit < 1000 && h('button', { onClick: () => setLimit(Math.min(limit + 30, 1000)) }, 'Daha eski çalışmaları yükle')),
      h('div', { className: 'o3d-agent-content' },
        h('section', { className: 'o3d-agent-summary' }, h('h2', null, 'Şu anki durum'), h('strong', { className: `o3d-agent-state ${person?.status}` }, labels[person?.status] || person?.status), manager && h('p', null, `Yöneticisi: ${manager.name}`), task && h('p', null, `${task.identifier} · ${task.title}`, h('br'), labels[task.status] || task.status), visit && h('p', { className: 'o3d-dependency-note' }, `${blockerName} bekleniyor · ${visit.blockerIdentifier || ''}`)),
        error && h('p', { className: 'o3d-chat-error', role: 'alert' }, error),
        selected && !detail && !error && h('p', { role: 'status' }, 'Çalışma ayrıntıları yükleniyor…'),
        detail && h(React.Fragment, null,
          h('section', { className: 'o3d-agent-summary' }, h('h2', null, 'Seçili çalışma'), h('p', null, labels[detail.status] || detail.status, detail.startedAt && ` · ${new Date(detail.startedAt).toLocaleString('tr-TR')}`), detail.error && h('pre', { className: 'o3d-run-error' }, detail.error)),
          detail.warning && h('p', { className: 'o3d-chat-error' }, detail.warning),
          ...detail.prompts.map((prompt, i) => h('section', { className: 'o3d-prompt', key: prompt.id || i }, h('h2', null, `Gönderilen prompt${detail.prompts.length > 1 ? ` ${i + 1}` : ''}`), h('pre', null, prompt.text))),
          !detail.prompts.length && h('section', { className: 'o3d-agent-summary' }, h('h2', null, 'Prompt kaydı'), h('p', null, 'Bu çalışmanın gönderilen prompt metni kayıtta bulunmuyor.')),
          detail.context && h('details', { className: 'o3d-prompt' }, h('summary', null, 'Göreve verilen bağlam'), h('pre', null, detail.context)),
          ...detail.outputs.map((text, i) => h('section', { className: 'o3d-prompt output', key: i }, h('h2', null, `Ajan çıktısı ${i + 1}`), h('pre', null, text))),
          detail.hasMoreLog && h('p', null, 'Bu pencerede çalışma günlüğünün ilk 128 KB bölümü gösteriliyor. Tam kayıt Paperclip ajan sayfasında bulunur.')))));
}
