import React, { useEffect, useRef, useState } from 'react';
const h = React.createElement;
export async function api(path, init = {}) {
  const response = await fetch(path, { credentials: 'same-origin', ...init, headers: { 'Content-Type': 'application/json', ...init.headers } });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || data?.message || `İşlem tamamlanamadı (${response.status}).`);
  return data;
}
export function QuestionChat({ question, companyId, base, people, stillPending, onClose, onAnswered }) {
  const [comments, setComments] = useState([]), [draft, setDraft] = useState({}), [sent, setSent] = useState(null);
  const [error, setError] = useState(''), [sending, setSending] = useState(false), [verified, setVerified] = useState(false);
  const dialog = useRef(null), close = useRef(null), submitting = useRef(false);
  const author = people.find(p => p.id === question.agentId)?.name || 'Ekip üyesi';
  const issuePath = `/api/issues/${encodeURIComponent(question.issueId)}`;
  const questions = question.questions || [];
  const resolved = stillPending === false || sent;
  useEffect(() => {
    const controller = new AbortController();
    let inFlight = false;
    async function load() {
      if (inFlight) return;
      inFlight = true;
      try {
        const issue = await api(issuePath, { signal: controller.signal });
        if (issue.companyId !== companyId) throw new Error('Bu konuşma seçili şirkete ait değil.');
        if (!controller.signal.aborted) setVerified(true);
        const history = await api(`${issuePath}/comments`, { signal: controller.signal });
        if (!controller.signal.aborted) setComments(Array.isArray(history) ? history : []);
      } catch (e) { if (!controller.signal.aborted) setError(e.message); }
      finally { inFlight = false; }
    }
    load(); const timer = setInterval(load, 5000); close.current?.focus();
    window.addEventListener('keydown', trap, true);
    return () => { controller.abort(); clearInterval(timer); window.removeEventListener('keydown', trap, true); };
  }, [question.id, companyId]);
  function trap(event) {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
    if (event.key !== 'Tab') return;
    const nodes = [...dialog.current.querySelectorAll('a[href],button:not(:disabled),textarea:not(:disabled),input:not(:disabled)')].filter(n => n.getClientRects().length);
    const first = nodes[0], last = nodes.at(-1);
    if (!dialog.current.contains(document.activeElement)) { event.preventDefault(); first?.focus(); return; }
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  const change = (id, next) => { setError(''); setDraft(old => ({ ...old, [id]: { ...old[id], ...next } })); };
  async function submit(event) {
    event.preventDefault(); if (submitting.current || resolved || !verified) return;
    setError('');
    const answers = questions.map(q => ({ questionId: q.id, optionIds: draft[q.id]?.options || [], otherText: draft[q.id]?.text || null }));
    for (const q of questions) {
      const answer = answers.find(a => a.questionId === q.id);
      if (q.required && !answer.optionIds.length && !answer.otherText?.trim()) { setError('Lütfen zorunlu soruları yanıtla.'); return; }
      if (q.options.some(o => o.freeText && answer.optionIds.includes(o.id)) && !answer.otherText?.trim()) { setError('Seçtiğin yanıt için açıklama yaz.'); return; }
    }
    submitting.current = true; setSending(true);
    try {
      // The logged-in board user submits the native answer. No agent identity or credentials are impersonated.
      const issue = await api(issuePath);
      if (issue.companyId !== companyId) throw new Error('Şirket doğrulanamadı.');
      await api(`${issuePath}/interactions/${encodeURIComponent(question.interactionId)}/respond`, { method: 'POST', body: JSON.stringify({ answers }) });
      setSent(answers); close.current?.focus(); await onAnswered();
    } catch (e) { setError(e.message); }
    finally { submitting.current = false; setSending(false); }
  }
  return h('section', { className: 'o3d-chat', role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'o3d-chat-title', ref: dialog },
    h('header', { className: 'o3d-chat-header' },
      h('div', { className: 'o3d-chat-avatar', 'aria-hidden': true }, author.slice(0, 1)),
      h('div', null, h('h1', { id: 'o3d-chat-title' }, author), h('p', null, `${question.identifier || 'Görev'} · ${resolved ? 'Yanıtlandı / kapatıldı' : 'Yanıtını bekliyor'}`)),
      h('a', { href: `${base}/${question.path}`, target: '_blank', rel: 'noopener noreferrer' }, 'Görevi aç ↗'),
      h('button', { ref: close, onClick: onClose, 'aria-label': 'Konuşmayı kapat' }, '×')),
    h('div', { className: 'o3d-chat-scroll' }, h('div', { className: 'o3d-conversation' },
      h('p', { className: 'o3d-chat-context' }, 'Görev konuşması'),
      ...comments.filter(c => c.body).map(c => h('article', { key: c.id, className: `o3d-message-bubble ${c.authorUserId ? 'human' : ''}` },
        h('small', null, c.authorUserId ? 'Sen / Yönetim' : people.find(p => p.id === c.authorAgentId)?.name || 'Ekip', c.createdAt && ` · ${new Date(c.createdAt).toLocaleString('tr-TR')}`), h('p', null, c.body))),
      h('article', { className: 'o3d-message-bubble question' }, h('small', null, `${author} sana soruyor`), h('h2', null, question.title), question.summary && question.summary !== question.title && h('p', null, question.summary)),
      !resolved && questions.length > 0 && questions.length <= 20 && h('form', { onSubmit: submit, className: 'o3d-answer-form' },
        ...questions.map(q => {
          const value = draft[q.id] || {}, options = value.options || [];
          const freeTextSelected = q.options.some(o => o.freeText && options.includes(o.id));
          const custom = q.mode === 'text' || q.allowOther || freeTextSelected;
          return h('fieldset', { key: q.id, disabled: sending },
            h('legend', null, q.prompt, q.required && h('span', { className: 'o3d-required' }, ' *')), q.helpText && h('p', null, q.helpText),
            ...q.options.map(o => h('label', { key: o.id, className: `o3d-option ${options.includes(o.id) ? 'selected' : ''}` },
              h('input', { type: q.mode === 'multi' ? 'checkbox' : 'radio', name: q.id, value: o.id, checked: options.includes(o.id), onChange: e => change(q.id, { options: q.mode === 'multi' ? e.target.checked ? [...options, o.id] : options.filter(x => x !== o.id) : [o.id] }) }),
              h('span', null, o.label, o.description && h('small', null, o.description)))),
            custom && h('label', { className: 'o3d-text-answer' }, q.mode === 'text' ? 'Yanıtın' : freeTextSelected ? 'Açıklaman' : 'Diğer / açıklama', h('textarea', { 'aria-label': q.prompt, maxLength: 100000, required: q.required && q.mode === 'text' || freeTextSelected, value: value.text || '', onChange: e => change(q.id, { text: e.target.value }), rows: 3, placeholder: 'Yanıtını yaz…' })));
        }),
        h('button', { type: 'submit', className: 'o3d-send', disabled: sending || !verified }, sending ? 'Gönderiliyor…' : 'Yanıtı gönder')),
      !resolved && (!questions.length || questions.length > 20) && h('p', null, 'Bu sorunun yanıt formunu ', h('a', { href: `${base}/${question.path}`, target: '_blank', rel: 'noopener noreferrer' }, 'Paperclip’te aç ↗')),
      sent && h('article', { className: 'o3d-message-bubble human' }, h('small', null, 'Sen'), ...sent.map(a => h('p', { key: a.questionId }, a.optionIds.map(id => questions.find(q => q.id === a.questionId)?.options.find(o => o.id === id)?.label).filter(Boolean).join(', '), a.otherText && `${a.optionIds.length ? ' · ' : ''}${a.otherText}`))),
      resolved && h('p', { className: 'o3d-chat-context', role: 'status' }, sent ? 'Yanıtın gönderildi. Bu soru artık beklemiyor.' : 'Bu soru artık yanıt beklemiyor.'),
      error && h('p', { className: 'o3d-chat-error', role: 'alert' }, error)
    )));
}
