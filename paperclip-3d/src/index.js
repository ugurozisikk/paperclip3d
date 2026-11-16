import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHostContext, useHostNavigation, usePluginData } from '@paperclipai/plugin-sdk/ui';
import { transitions } from './model.js';
import { QuestionChat } from './question-chat.js';
import { Television } from './television.js';
import { AgentInspector } from './agent-inspector.js';
const h = React.createElement;
export function OfficeLink() {
  const nav = useHostNavigation();
  return h('a', { href: nav.resolveHref('/office3d'), style: { display: 'flex', gap: 9, alignItems: 'center', padding: '7px 12px', fontSize: 14 } }, h('span', { 'aria-hidden': true }, '◈'), '3D Ofis');
}
export function OfficePage({ slot }) {
  const context = useHostContext();
  return h(Office, { key: context.companyId || 'none', context, pluginId: slot.pluginId });
}
function Office({ context, pluginId }) {
  const { data, error, refresh } = usePluginData('snapshot', { companyId: context.companyId, viewerUserId: context.userId });
  const snapshot = data?.company?.id === context.companyId ? data : null;
  const [floor, setFloor] = useState(0), [question, setQuestion] = useState(null), [showTV, setShowTV] = useState(false), [inspect, setInspect] = useState(null);
  const [sceneError, setSceneError] = useState(null), [ready, setReady] = useState(false);
  const frame = useRef(null), last = useRef(null), snapshotRef = useRef(snapshot), floorRef = useRef(floor), refreshRef = useRef(refresh);
  snapshotRef.current = snapshot; floorRef.current = floor; refreshRef.current = refresh;
  const humanName = useRef('Sen');
  const base = `/${context.companyPrefix || snapshot?.company.prefix || context.companyId}`;
  function send(type, extra = {}) {
    frame.current?.contentWindow?.postMessage({ type, companyId: context.companyId, ...extra }, location.origin);
  }
  useEffect(() => {
    try { humanName.current = localStorage.getItem(`office3d:human:${context.companyId}`) || 'Sen'; } catch {}
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let active = true, inFlight = false;
    const poll = async () => {
      if (!active || inFlight || document.hidden) return;
      inFlight = true;
      try { await refreshRef.current(); } catch {} finally { inFlight = false; }
    };
    const timer = setInterval(poll, 3000);
    document.addEventListener('visibilitychange', poll);
    return () => { active = false; clearInterval(timer); document.removeEventListener('visibilitychange', poll); document.body.style.overflow = oldOverflow; };
  }, []);
  useEffect(() => {
    const receive = event => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || event.data?.companyId !== context.companyId) return;
      if (event.data.type === 'office-ready') {
        setReady(true); setSceneError(null);
        send('office-snapshot', { snapshot: snapshotRef.current, floor: floorRef.current, humanName: humanName.current });
      }
      if (event.data.type === 'office-question') {
        const item = snapshotRef.current?.attention?.find(q => q.id === event.data.questionId);
        if (item) { setInspect(null); setShowTV(false); setQuestion(item); }
      }
      if (event.data.type === 'office-select' && snapshotRef.current?.agents.some(a => a.id === event.data.agentId)) { setShowTV(false); setQuestion(null); setInspect(event.data.agentId); }
      if (event.data.type === 'office-tv') { setInspect(null); setQuestion(null); setShowTV(true); }
      if (event.data.type === 'office-error') setSceneError(event.data.message);
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);
  useEffect(() => {
    if (!snapshot) return;
    send('office-snapshot', { snapshot, floor, changes: transitions(last.current, snapshot), humanName: humanName.current });
    last.current = snapshot;
    const max = Math.max(0, Math.ceil(snapshot.agents.length / 5) - 1);
    if (floor > max) setFloor(max);
  }, [snapshot, floor]);
  const people = snapshot?.agents || [];
  // A body portal covers the host navigation and avoids layout/transform constraints.
  return createPortal(h('main', { className: 'o3d-immersive', 'data-company-id': context.companyId, 'aria-label': 'Canlı 3D ofis' },
    h('link', { rel: 'stylesheet', href: `/_plugins/${encodeURIComponent(pluginId)}/ui/office.css` }),
    h('iframe', { ref: frame, title: '3D ofis sahnesi', src: `/_plugins/${encodeURIComponent(pluginId)}/ui/scene.html?company=${encodeURIComponent(context.companyId || '')}`, inert: question || showTV || inspect ? true : undefined }),
    !ready && h('div', { className: 'o3d-message', role: 'status' }, 'Ofis hazırlanıyor…'),
    (error || sceneError) && h('div', { className: 'o3d-message o3d-error', role: 'alert' }, sceneError || 'Ofis bağlantısı yenileniyor…', h('button', { onClick: () => { if (sceneError) { setReady(false); setSceneError(null); frame.current.src = frame.current.src; } else refresh(); } }, 'Tekrar dene')),
    h('nav', { className: 'o3d-tools', 'aria-label': 'Ofis kontrolleri', inert: question || showTV || inspect ? true : undefined },
      h('a', { href: `${base}/dashboard`, 'aria-label': 'Paperclip’e dön', title: 'Paperclip’e dön' }, '↗'),
      people.length > 5 && h('select', { value: floor, onChange: e => setFloor(Number(e.target.value)), 'aria-label': 'Ofis katı' }, ...Array.from({ length: Math.ceil(people.length / 5) }, (_, i) => h('option', { key: i, value: i }, `Kat ${i + 1}`))),
      h('button', { onClick: () => send('office-focus', { agentId: 'office-human' }), 'aria-label': 'Masama git', title: 'Masama git' }, '⌂'),
      h('button', { onClick: () => send('office-lobby'), 'aria-label': 'Lobiye git', title: 'Lobiye git' }, '☕'),
      h('button', { onClick: () => send('office-reset'), 'aria-label': 'Görünümü sıfırla', title: 'Görünümü sıfırla' }, '⤢')),
    inspect && h(AgentInspector, { key: inspect, agentId: inspect, snapshot, companyId: context.companyId, base, onClose: () => { setInspect(null); frame.current?.focus(); } }),
    showTV && h(Television, { snapshot, onClose: () => { setShowTV(false); frame.current?.focus(); } }),
    question && h(QuestionChat, { key: question.id, question, companyId: context.companyId, base, people, stillPending: snapshot?.attention?.some(q => q.id === question.id), onClose: () => { setQuestion(null); frame.current?.focus(); }, onAnswered: () => refreshRef.current() })
  ), document.body);
}
