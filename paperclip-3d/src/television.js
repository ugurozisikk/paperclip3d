import React, { useEffect, useRef } from 'react';
import { taskBroadcast, kanbanColumns } from './model.js';
const h = React.createElement;
const labels = { backlog: 'Planlanıyor', todo: 'Sırada', in_progress: 'Geliştiriliyor', in_review: 'İncelemede', blocked: 'Engel var', done: 'Tamamlandı', cancelled: 'İptal edildi' };
export function Television({ snapshot, onClose }) {
  const close = useRef(null), panel = useRef(null);
  const { main, completed, total } = taskBroadcast(snapshot?.issues || []);
  const columns = kanbanColumns(snapshot?.issues || []);
  useEffect(() => {
    close.current?.focus();
    const key = event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
      if (event.key === 'Tab') { event.preventDefault(); close.current?.focus(); }
    };
    window.addEventListener('keydown', key, true);
    return () => window.removeEventListener('keydown', key, true);
  }, []);
  return h('section', { className: 'o3d-broadcast', ref: panel, role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'o3d-tv-title' },
    h('header', null, h('span', null, 'OFİS TV'), h('span', { className: 'o3d-tv-live' }, '● CANLI'), h('button', { ref: close, onClick: onClose, 'aria-label': 'Televizyonu kapat' }, '×')),
    h('div', { className: 'o3d-tv-content' },
      h('p', { className: 'o3d-tv-label' }, `ANA GÖREV${main?.identifier ? ` / ${main.identifier}` : ''}`),
      h('h1', { id: 'o3d-tv-title' }, main?.title || 'Yeni görev bekleniyor'),
      h('div', { className: 'o3d-tv-status', 'data-status': main?.status }, main ? labels[main.status] || main.status : 'Henüz görev yok'),
      total > 0 && h('div', { className: 'o3d-tv-progress' }, h('strong', null, `${completed} / ${total}`), h('span', null, 'alt görev tamamlandı'), h('progress', { value: completed, max: total, 'aria-label': 'Tamamlanan alt görevler' })),
      h('section', { className: 'o3d-tv-kanban', 'aria-label': 'Canlı Kanban tahtası' }, ...columns.map(column =>
        h('section', { key: column.id, className: 'o3d-tv-column', 'aria-label': column.label },
          h('h2', null, column.label, h('span', null, column.issues.length)),
          h('div', { className: 'o3d-tv-cards' }, column.issues.length ? column.issues.map(issue => h('article', { key: issue.id, 'data-status': issue.status },
            h('div', null, h('small', null, issue.identifier), issue.status === 'blocked' && h('span', null, 'Engel var')),
            h('strong', null, issue.title),
            h('p', null, snapshot?.agents.find(a => a.id === issue.assigneeAgentId)?.name || 'Atanmamış')))
            : h('p', { className: 'o3d-tv-empty' }, 'Görev yok')))))),
    h('div', { className: 'o3d-tv-ticker', 'aria-hidden': true }, h('div', null, ...[0, 1].map(i => h('span', { key: i }, `${main?.identifier || 'OFİS TV'}  •  ${main?.title || 'Görev bekleniyor'}  •  ${main ? labels[main.status] || main.status : 'Canlı yayın'}  •  ${snapshot?.attention?.length || 0} soru yanıt bekliyor  •  `)))));
}
