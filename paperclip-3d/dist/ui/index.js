// src/index.js
import React4, { useEffect as useEffect4, useRef as useRef4, useState as useState3 } from "react";
import { createPortal } from "react-dom";
import { useHostContext, useHostNavigation, usePluginData } from "@paperclipai/plugin-sdk/ui";

// src/model.js
function currentIssue(agentId, issues) {
  const rank = { in_progress: 0, blocked: 1, in_review: 2, todo: 3, backlog: 4 };
  return issues.filter((i) => i.assigneeAgentId === agentId && i.status in rank).sort((a, b) => rank[a.status] - rank[b.status] || String(b.updatedAt).localeCompare(String(a.updatedAt)))[0] ?? null;
}
function transitions(previous, next) {
  if (!previous || previous.company.id !== next.company.id) return [];
  const old = new Map(previous.issues.map((i) => [i.id, i]));
  const events = [];
  for (const issue of next.issues) {
    const before = old.get(issue.id);
    if (before && before.assigneeAgentId && issue.assigneeAgentId && before.assigneeAgentId !== issue.assigneeAgentId) {
      events.push({ kind: "handoff", from: before.assigneeAgentId, to: issue.assigneeAgentId, issue });
    } else if (!before && issue.parentId && issue.assigneeAgentId) {
      const parent = next.issues.find((i) => i.id === issue.parentId);
      if (parent?.assigneeAgentId && parent.assigneeAgentId !== issue.assigneeAgentId)
        events.push({ kind: "handoff", from: parent.assigneeAgentId, to: issue.assigneeAgentId, issue });
    }
    if (before && before.status !== "done" && issue.status === "done" && issue.assigneeAgentId)
      events.push({ kind: "complete", from: issue.assigneeAgentId, issue });
  }
  return events;
}
function taskBroadcast(issues) {
  if (!issues.length) return { main: null, children: [], completed: 0, total: 0 };
  const byId = new Map(issues.map((i) => [i.id, i]));
  const rootOf = (item) => {
    const visited = /* @__PURE__ */ new Set();
    while (item.parentId && byId.has(item.parentId) && !visited.has(item.id)) {
      visited.add(item.id);
      item = byId.get(item.parentId);
    }
    return item;
  };
  const rank = { in_progress: 0, in_review: 1, blocked: 2, todo: 3, backlog: 4, done: 5, cancelled: 6 };
  const candidates = issues.filter((i) => i.status !== "cancelled").sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")) || a.id.localeCompare(b.id));
  const main = candidates.length ? rootOf(candidates[0]) : null;
  const children = main ? issues.filter((i) => i.id !== main.id && i.status !== "cancelled" && rootOf(i).id === main.id) : [];
  return { main, children, completed: children.filter((i) => i.status === "done").length, total: children.length };
}
function kanbanColumns(issues) {
  return [
    { id: "waiting", label: "Bekliyor", states: ["backlog", "todo"], color: "#c4c9ad" },
    { id: "doing", label: "Geli\u015Ftirme", states: ["in_progress"], color: "#9dc9cf" },
    { id: "review", label: "\u0130nceleme", states: ["in_review", "blocked"], color: "#e3c494" },
    { id: "done", label: "Tamamland\u0131", states: ["done"], color: "#b7d59a" }
  ].map((column) => ({ ...column, issues: issues.filter((i) => column.states.includes(i.status)).sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))) }));
}
function blockingVisits(agents, issues, attention = []) {
  const people = new Set(agents.map((a) => a.id)), tasks = new Map(issues.map((i) => [i.id, i]));
  const askingHuman = new Set(attention.map((q) => q.agentId)), seen = /* @__PURE__ */ new Set(), result = [];
  for (const issue of [...issues].sort((a, b) => (a.status === "blocked" ? -1 : 0) - (b.status === "blocked" ? -1 : 0) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))) {
    const agentId = issue.assigneeAgentId;
    if (!people.has(agentId) || seen.has(agentId) || askingHuman.has(agentId) || ["done", "cancelled"].includes(issue.status)) continue;
    for (const id of issue.blockedByIssueIds || (issue.blockedBy || []).map((b) => b.id)) {
      const blocker = tasks.get(id), blockerAgentId = blocker?.assigneeAgentId;
      if (!blocker || ["done", "cancelled"].includes(blocker.status) || !people.has(blockerAgentId) || blockerAgentId === agentId) continue;
      result.push({ agentId, blockerAgentId, issueId: issue.id, blockerIssueId: blocker.id, identifier: issue.identifier, blockerIdentifier: blocker.identifier });
      seen.add(agentId);
      break;
    }
  }
  return result;
}

// src/question-chat.js
import React, { useEffect, useRef, useState } from "react";
var h = React.createElement;
async function api(path, init = {}) {
  const response = await fetch(path, { credentials: "same-origin", ...init, headers: { "Content-Type": "application/json", ...init.headers } });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || data?.message || `\u0130\u015Flem tamamlanamad\u0131 (${response.status}).`);
  return data;
}
function QuestionChat({ question, companyId, base, people, stillPending, onClose, onAnswered }) {
  const [comments, setComments] = useState([]), [draft, setDraft] = useState({}), [sent, setSent] = useState(null);
  const [error, setError] = useState(""), [sending, setSending] = useState(false), [verified, setVerified] = useState(false);
  const dialog = useRef(null), close = useRef(null), submitting = useRef(false);
  const author = people.find((p) => p.id === question.agentId)?.name || "Ekip \xFCyesi";
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
        if (issue.companyId !== companyId) throw new Error("Bu konu\u015Fma se\xE7ili \u015Firkete ait de\u011Fil.");
        if (!controller.signal.aborted) setVerified(true);
        const history = await api(`${issuePath}/comments`, { signal: controller.signal });
        if (!controller.signal.aborted) setComments(Array.isArray(history) ? history : []);
      } catch (e) {
        if (!controller.signal.aborted) setError(e.message);
      } finally {
        inFlight = false;
      }
    }
    load();
    const timer = setInterval(load, 5e3);
    close.current?.focus();
    window.addEventListener("keydown", trap, true);
    return () => {
      controller.abort();
      clearInterval(timer);
      window.removeEventListener("keydown", trap, true);
    };
  }, [question.id, companyId]);
  function trap(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    }
    if (event.key !== "Tab") return;
    const nodes = [...dialog.current.querySelectorAll("a[href],button:not(:disabled),textarea:not(:disabled),input:not(:disabled)")].filter((n) => n.getClientRects().length);
    const first = nodes[0], last = nodes.at(-1);
    if (!dialog.current.contains(document.activeElement)) {
      event.preventDefault();
      first?.focus();
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
  const change = (id, next) => {
    setError("");
    setDraft((old) => ({ ...old, [id]: { ...old[id], ...next } }));
  };
  async function submit(event) {
    event.preventDefault();
    if (submitting.current || resolved || !verified) return;
    setError("");
    const answers = questions.map((q) => ({ questionId: q.id, optionIds: draft[q.id]?.options || [], otherText: draft[q.id]?.text || null }));
    for (const q of questions) {
      const answer = answers.find((a) => a.questionId === q.id);
      if (q.required && !answer.optionIds.length && !answer.otherText?.trim()) {
        setError("L\xFCtfen zorunlu sorular\u0131 yan\u0131tla.");
        return;
      }
      if (q.options.some((o) => o.freeText && answer.optionIds.includes(o.id)) && !answer.otherText?.trim()) {
        setError("Se\xE7ti\u011Fin yan\u0131t i\xE7in a\xE7\u0131klama yaz.");
        return;
      }
    }
    submitting.current = true;
    setSending(true);
    try {
      const issue = await api(issuePath);
      if (issue.companyId !== companyId) throw new Error("\u015Eirket do\u011Frulanamad\u0131.");
      await api(`${issuePath}/interactions/${encodeURIComponent(question.interactionId)}/respond`, { method: "POST", body: JSON.stringify({ answers }) });
      setSent(answers);
      close.current?.focus();
      await onAnswered();
    } catch (e) {
      setError(e.message);
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }
  return h(
    "section",
    { className: "o3d-chat", role: "dialog", "aria-modal": true, "aria-labelledby": "o3d-chat-title", ref: dialog },
    h(
      "header",
      { className: "o3d-chat-header" },
      h("div", { className: "o3d-chat-avatar", "aria-hidden": true }, author.slice(0, 1)),
      h("div", null, h("h1", { id: "o3d-chat-title" }, author), h("p", null, `${question.identifier || "G\xF6rev"} \xB7 ${resolved ? "Yan\u0131tland\u0131 / kapat\u0131ld\u0131" : "Yan\u0131t\u0131n\u0131 bekliyor"}`)),
      h("a", { href: `${base}/${question.path}`, target: "_blank", rel: "noopener noreferrer" }, "G\xF6revi a\xE7 \u2197"),
      h("button", { ref: close, onClick: onClose, "aria-label": "Konu\u015Fmay\u0131 kapat" }, "\xD7")
    ),
    h("div", { className: "o3d-chat-scroll" }, h(
      "div",
      { className: "o3d-conversation" },
      h("p", { className: "o3d-chat-context" }, "G\xF6rev konu\u015Fmas\u0131"),
      ...comments.filter((c) => c.body).map((c) => h(
        "article",
        { key: c.id, className: `o3d-message-bubble ${c.authorUserId ? "human" : ""}` },
        h("small", null, c.authorUserId ? "Sen / Y\xF6netim" : people.find((p) => p.id === c.authorAgentId)?.name || "Ekip", c.createdAt && ` \xB7 ${new Date(c.createdAt).toLocaleString("tr-TR")}`),
        h("p", null, c.body)
      )),
      h("article", { className: "o3d-message-bubble question" }, h("small", null, `${author} sana soruyor`), h("h2", null, question.title), question.summary && question.summary !== question.title && h("p", null, question.summary)),
      !resolved && questions.length > 0 && questions.length <= 20 && h(
        "form",
        { onSubmit: submit, className: "o3d-answer-form" },
        ...questions.map((q) => {
          const value = draft[q.id] || {}, options = value.options || [];
          const freeTextSelected = q.options.some((o) => o.freeText && options.includes(o.id));
          const custom = q.mode === "text" || q.allowOther || freeTextSelected;
          return h(
            "fieldset",
            { key: q.id, disabled: sending },
            h("legend", null, q.prompt, q.required && h("span", { className: "o3d-required" }, " *")),
            q.helpText && h("p", null, q.helpText),
            ...q.options.map((o) => h(
              "label",
              { key: o.id, className: `o3d-option ${options.includes(o.id) ? "selected" : ""}` },
              h("input", { type: q.mode === "multi" ? "checkbox" : "radio", name: q.id, value: o.id, checked: options.includes(o.id), onChange: (e) => change(q.id, { options: q.mode === "multi" ? e.target.checked ? [...options, o.id] : options.filter((x) => x !== o.id) : [o.id] }) }),
              h("span", null, o.label, o.description && h("small", null, o.description))
            )),
            custom && h("label", { className: "o3d-text-answer" }, q.mode === "text" ? "Yan\u0131t\u0131n" : freeTextSelected ? "A\xE7\u0131klaman" : "Di\u011Fer / a\xE7\u0131klama", h("textarea", { "aria-label": q.prompt, maxLength: 1e5, required: q.required && q.mode === "text" || freeTextSelected, value: value.text || "", onChange: (e) => change(q.id, { text: e.target.value }), rows: 3, placeholder: "Yan\u0131t\u0131n\u0131 yaz\u2026" }))
          );
        }),
        h("button", { type: "submit", className: "o3d-send", disabled: sending || !verified }, sending ? "G\xF6nderiliyor\u2026" : "Yan\u0131t\u0131 g\xF6nder")
      ),
      !resolved && (!questions.length || questions.length > 20) && h("p", null, "Bu sorunun yan\u0131t formunu ", h("a", { href: `${base}/${question.path}`, target: "_blank", rel: "noopener noreferrer" }, "Paperclip\u2019te a\xE7 \u2197")),
      sent && h("article", { className: "o3d-message-bubble human" }, h("small", null, "Sen"), ...sent.map((a) => h("p", { key: a.questionId }, a.optionIds.map((id) => questions.find((q) => q.id === a.questionId)?.options.find((o) => o.id === id)?.label).filter(Boolean).join(", "), a.otherText && `${a.optionIds.length ? " \xB7 " : ""}${a.otherText}`))),
      resolved && h("p", { className: "o3d-chat-context", role: "status" }, sent ? "Yan\u0131t\u0131n g\xF6nderildi. Bu soru art\u0131k beklemiyor." : "Bu soru art\u0131k yan\u0131t beklemiyor."),
      error && h("p", { className: "o3d-chat-error", role: "alert" }, error)
    ))
  );
}

// src/television.js
import React2, { useEffect as useEffect2, useRef as useRef2 } from "react";
var h2 = React2.createElement;
var labels = { backlog: "Planlan\u0131yor", todo: "S\u0131rada", in_progress: "Geli\u015Ftiriliyor", in_review: "\u0130ncelemede", blocked: "Engel var", done: "Tamamland\u0131", cancelled: "\u0130ptal edildi" };
function Television({ snapshot, onClose }) {
  const close = useRef2(null), panel = useRef2(null);
  const { main, completed, total } = taskBroadcast(snapshot?.issues || []);
  const columns = kanbanColumns(snapshot?.issues || []);
  useEffect2(() => {
    close.current?.focus();
    const key = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
      if (event.key === "Tab") {
        event.preventDefault();
        close.current?.focus();
      }
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, []);
  return h2(
    "section",
    { className: "o3d-broadcast", ref: panel, role: "dialog", "aria-modal": true, "aria-labelledby": "o3d-tv-title" },
    h2("header", null, h2("span", null, "OF\u0130S TV"), h2("span", { className: "o3d-tv-live" }, "\u25CF CANLI"), h2("button", { ref: close, onClick: onClose, "aria-label": "Televizyonu kapat" }, "\xD7")),
    h2(
      "div",
      { className: "o3d-tv-content" },
      h2("p", { className: "o3d-tv-label" }, `ANA G\xD6REV${main?.identifier ? ` / ${main.identifier}` : ""}`),
      h2("h1", { id: "o3d-tv-title" }, main?.title || "Yeni g\xF6rev bekleniyor"),
      h2("div", { className: "o3d-tv-status", "data-status": main?.status }, main ? labels[main.status] || main.status : "Hen\xFCz g\xF6rev yok"),
      total > 0 && h2("div", { className: "o3d-tv-progress" }, h2("strong", null, `${completed} / ${total}`), h2("span", null, "alt g\xF6rev tamamland\u0131"), h2("progress", { value: completed, max: total, "aria-label": "Tamamlanan alt g\xF6revler" })),
      h2("section", { className: "o3d-tv-kanban", "aria-label": "Canl\u0131 Kanban tahtas\u0131" }, ...columns.map((column) => h2(
        "section",
        { key: column.id, className: "o3d-tv-column", "aria-label": column.label },
        h2("h2", null, column.label, h2("span", null, column.issues.length)),
        h2("div", { className: "o3d-tv-cards" }, column.issues.length ? column.issues.map((issue) => h2(
          "article",
          { key: issue.id, "data-status": issue.status },
          h2("div", null, h2("small", null, issue.identifier), issue.status === "blocked" && h2("span", null, "Engel var")),
          h2("strong", null, issue.title),
          h2("p", null, snapshot?.agents.find((a) => a.id === issue.assigneeAgentId)?.name || "Atanmam\u0131\u015F")
        )) : h2("p", { className: "o3d-tv-empty" }, "G\xF6rev yok"))
      )))
    ),
    h2("div", { className: "o3d-tv-ticker", "aria-hidden": true }, h2("div", null, ...[0, 1].map((i) => h2("span", { key: i }, `${main?.identifier || "OF\u0130S TV"}  \u2022  ${main?.title || "G\xF6rev bekleniyor"}  \u2022  ${main ? labels[main.status] || main.status : "Canl\u0131 yay\u0131n"}  \u2022  ${snapshot?.attention?.length || 0} soru yan\u0131t bekliyor  \u2022  `))))
  );
}

// src/agent-inspector.js
import React3, { useEffect as useEffect3, useRef as useRef3, useState as useState2 } from "react";
var h3 = React3.createElement;
var labels2 = { running: "\xC7al\u0131\u015F\u0131yor", active: "Haz\u0131r", idle: "Bo\u015Fta", error: "Hata", paused: "Duraklat\u0131ld\u0131", pending_approval: "Onay bekliyor", queued: "S\u0131rada", succeeded: "Tamamland\u0131", failed: "Ba\u015Far\u0131s\u0131z", cancelled: "\u0130ptal", timed_out: "Zaman a\u015F\u0131m\u0131", in_progress: "Geli\u015Ftiriliyor", in_review: "\u0130ncelemede", blocked: "Engelli", done: "Tamamland\u0131", todo: "Bekliyor", backlog: "Planlanacak" };
function transcript(content) {
  const result = [];
  for (const line of String(content || "").split("\n")) {
    try {
      const record = JSON.parse(line);
      if (record.stream && record.stream !== "stdout") continue;
      for (const inner of String(record.chunk || line).split("\n")) {
        try {
          const event = JSON.parse(inner), item = event.item || event.message;
          const text = item?.text || (Array.isArray(item?.content) ? item.content.filter((p) => p.type === "text").map((p) => p.text).join("\n") : typeof item?.content === "string" ? item.content : null);
          if (text && (item?.type === "agent_message" || event.type === "assistant" || item.role === "assistant")) result.push(text);
        } catch {
        }
      }
    } catch {
    }
  }
  return [...new Set(result)];
}
function AgentInspector({ agentId, snapshot, companyId, base, onClose }) {
  const [runs, setRuns] = useState2([]), [selected, setSelected] = useState2(null), [detail, setDetail] = useState2(null), [error, setError] = useState2(""), [loading, setLoading] = useState2(true), [limit, setLimit] = useState2(30);
  const root = useRef3(null), close = useRef3(null);
  const person = snapshot?.agents.find((a) => a.id === agentId), task = currentIssue(agentId, snapshot?.issues || []);
  const manager = snapshot?.agents.find((a) => a.id === person?.reportsTo);
  const visit = blockingVisits(snapshot?.agents || [], snapshot?.issues || []).find((v) => v.agentId === agentId);
  const blockerName = snapshot?.agents.find((a) => a.id === visit?.blockerAgentId)?.name;
  useEffect3(() => {
    const controller = new AbortController();
    let inFlight = false;
    async function load() {
      if (inFlight) return;
      inFlight = true;
      try {
        const rows = await api(`/api/companies/${encodeURIComponent(companyId)}/heartbeat-runs?agentId=${encodeURIComponent(agentId)}&limit=${limit}&summary=true`, { signal: controller.signal });
        const clean = rows.filter((r) => r.companyId === companyId && r.agentId === agentId).map((r) => ({ id: r.id, status: r.status, startedAt: r.startedAt || r.createdAt, finishedAt: r.finishedAt, issueId: r.issueId }));
        if (controller.signal.aborted) return;
        setRuns(clean);
        setSelected((old) => clean.some((r) => r.id === old) ? old : clean[0]?.id || null);
        setError("");
      } catch (e) {
        if (!controller.signal.aborted) setError(e.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
        inFlight = false;
      }
    }
    load();
    const timer = setInterval(load, 5e3);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [agentId, companyId, limit]);
  useEffect3(() => {
    if (!selected) return;
    const controller = new AbortController();
    let inFlight = false;
    setDetail(null);
    async function load() {
      if (inFlight) return;
      inFlight = true;
      try {
        const runPath = `/api/heartbeat-runs/${encodeURIComponent(selected)}`;
        const run = await api(runPath, { signal: controller.signal });
        if (run.companyId !== companyId || run.agentId !== agentId) throw new Error("Bu \xE7al\u0131\u015Fma se\xE7ili ajana ait de\u011Fil.");
        const [eventsResult, logResult] = await Promise.allSettled([
          api(`${runPath}/events?limit=200`, { signal: controller.signal }),
          api(`${runPath}/log?offset=0&limitBytes=128000`, { signal: controller.signal })
        ]);
        if (controller.signal.aborted) return;
        const events = eventsResult.status === "fulfilled" ? eventsResult.value : [];
        const prompts = events.filter((e) => (!e.runId || e.runId === selected) && (!e.companyId || e.companyId === companyId) && typeof e.payload?.prompt === "string").map((e) => ({ id: e.id || e.seq, text: e.payload.prompt }));
        const log = logResult.status === "fulfilled" ? logResult.value : null;
        const outputs = transcript(log?.content);
        const context = run.contextSnapshot || {};
        setDetail({
          status: run.status,
          error: run.error,
          startedAt: run.startedAt,
          finishedAt: run.finishedAt,
          prompts,
          outputs: outputs.length ? outputs : typeof run.resultJson?.summary === "string" ? [run.resultJson.summary] : [],
          context: [context.paperclipTaskMarkdownAssignment, context.paperclipTaskMarkdown, context.paperclipWakeComment].filter((t) => typeof t === "string").join("\n\n"),
          inputTokens: run.usageJson?.inputTokens ?? run.inputTokens,
          outputTokens: run.usageJson?.outputTokens ?? run.outputTokens,
          warning: eventsResult.status === "rejected" ? `Prompt kayd\u0131 al\u0131namad\u0131: ${eventsResult.reason.message}` : logResult.status === "rejected" ? `\xC7\u0131kt\u0131 kayd\u0131 al\u0131namad\u0131: ${logResult.reason.message}` : null,
          hasMoreLog: Boolean(log?.nextOffset && run.logBytes && log.nextOffset < run.logBytes)
        });
      } catch (e) {
        if (!controller.signal.aborted) setError(e.message);
      } finally {
        inFlight = false;
      }
    }
    load();
    const timer = setInterval(load, 5e3);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [selected, companyId, agentId]);
  useEffect3(() => {
    close.current?.focus();
    const key = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
      if (event.key !== "Tab") return;
      const nodes = [...root.current.querySelectorAll("button:not(:disabled),a[href]")].filter((n) => n.getClientRects().length);
      if (!root.current.contains(document.activeElement) || !event.shiftKey && document.activeElement === nodes.at(-1)) {
        event.preventDefault();
        nodes[0]?.focus();
      } else if (event.shiftKey && document.activeElement === nodes[0]) {
        event.preventDefault();
        nodes.at(-1)?.focus();
      }
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, []);
  return h3(
    "section",
    { className: "o3d-agent", role: "dialog", "aria-modal": true, "aria-labelledby": "o3d-agent-title", ref: root },
    h3("header", { className: "o3d-chat-header" }, h3("div", { className: "o3d-chat-avatar" }, person?.name?.slice(0, 1)), h3("div", null, h3("h1", { id: "o3d-agent-title" }, person?.name || "Ajan"), h3("p", null, person?.title || person?.role)), h3("a", { href: `${base}/agents/${encodeURIComponent(agentId)}`, target: "_blank", rel: "noopener noreferrer" }, "Paperclip\u2019te a\xE7 \u2197"), h3("button", { ref: close, onClick: onClose, "aria-label": "Ajan penceresini kapat" }, "\xD7")),
    h3(
      "div",
      { className: "o3d-agent-layout" },
      h3(
        "aside",
        { className: "o3d-run-list" },
        h3("h2", null, "Prompt ge\xE7mi\u015Fi"),
        h3("p", null, "Ger\xE7ek Paperclip \xE7al\u0131\u015Fma kay\u0131tlar\u0131"),
        loading && h3("p", { role: "status" }, "Ge\xE7mi\u015F y\xFCkleniyor\u2026"),
        !loading && !runs.length && h3("p", null, "Hen\xFCz \xE7al\u0131\u015Fma kayd\u0131 yok."),
        ...runs.map((run) => h3("button", { key: run.id, className: selected === run.id ? "selected" : "", onClick: () => {
          setError("");
          setSelected(run.id);
        }, "aria-pressed": selected === run.id }, h3("strong", null, new Date(run.startedAt).toLocaleString("tr-TR")), h3("span", null, labels2[run.status] || run.status), h3("small", null, snapshot?.issues.find((i) => i.id === run.issueId)?.identifier || run.id.slice(0, 8)))),
        runs.length >= limit && limit < 1e3 && h3("button", { onClick: () => setLimit(Math.min(limit + 30, 1e3)) }, "Daha eski \xE7al\u0131\u015Fmalar\u0131 y\xFCkle")
      ),
      h3(
        "div",
        { className: "o3d-agent-content" },
        h3("section", { className: "o3d-agent-summary" }, h3("h2", null, "\u015Eu anki durum"), h3("strong", { className: `o3d-agent-state ${person?.status}` }, labels2[person?.status] || person?.status), manager && h3("p", null, `Y\xF6neticisi: ${manager.name}`), task && h3("p", null, `${task.identifier} \xB7 ${task.title}`, h3("br"), labels2[task.status] || task.status), visit && h3("p", { className: "o3d-dependency-note" }, `${blockerName} bekleniyor \xB7 ${visit.blockerIdentifier || ""}`)),
        error && h3("p", { className: "o3d-chat-error", role: "alert" }, error),
        selected && !detail && !error && h3("p", { role: "status" }, "\xC7al\u0131\u015Fma ayr\u0131nt\u0131lar\u0131 y\xFCkleniyor\u2026"),
        detail && h3(
          React3.Fragment,
          null,
          h3("section", { className: "o3d-agent-summary" }, h3("h2", null, "Se\xE7ili \xE7al\u0131\u015Fma"), h3("p", null, labels2[detail.status] || detail.status, detail.startedAt && ` \xB7 ${new Date(detail.startedAt).toLocaleString("tr-TR")}`), detail.error && h3("pre", { className: "o3d-run-error" }, detail.error)),
          detail.warning && h3("p", { className: "o3d-chat-error" }, detail.warning),
          ...detail.prompts.map((prompt, i) => h3("section", { className: "o3d-prompt", key: prompt.id || i }, h3("h2", null, `G\xF6nderilen prompt${detail.prompts.length > 1 ? ` ${i + 1}` : ""}`), h3("pre", null, prompt.text))),
          !detail.prompts.length && h3("section", { className: "o3d-agent-summary" }, h3("h2", null, "Prompt kayd\u0131"), h3("p", null, "Bu \xE7al\u0131\u015Fman\u0131n g\xF6nderilen prompt metni kay\u0131tta bulunmuyor.")),
          detail.context && h3("details", { className: "o3d-prompt" }, h3("summary", null, "G\xF6reve verilen ba\u011Flam"), h3("pre", null, detail.context)),
          ...detail.outputs.map((text, i) => h3("section", { className: "o3d-prompt output", key: i }, h3("h2", null, `Ajan \xE7\u0131kt\u0131s\u0131 ${i + 1}`), h3("pre", null, text))),
          detail.hasMoreLog && h3("p", null, "Bu pencerede \xE7al\u0131\u015Fma g\xFCnl\xFC\u011F\xFCn\xFCn ilk 128 KB b\xF6l\xFCm\xFC g\xF6steriliyor. Tam kay\u0131t Paperclip ajan sayfas\u0131nda bulunur.")
        )
      )
    )
  );
}

// src/index.js
var h4 = React4.createElement;
function OfficeLink() {
  const nav = useHostNavigation();
  return h4("a", { href: nav.resolveHref("/office3d"), style: { display: "flex", gap: 9, alignItems: "center", padding: "7px 12px", fontSize: 14 } }, h4("span", { "aria-hidden": true }, "\u25C8"), "3D Ofis");
}
function OfficePage({ slot }) {
  const context = useHostContext();
  return h4(Office, { key: context.companyId || "none", context, pluginId: slot.pluginId });
}
function Office({ context, pluginId }) {
  const { data, error, refresh } = usePluginData("snapshot", { companyId: context.companyId, viewerUserId: context.userId });
  const snapshot = data?.company?.id === context.companyId ? data : null;
  const [floor, setFloor] = useState3(0), [question, setQuestion] = useState3(null), [showTV, setShowTV] = useState3(false), [inspect, setInspect] = useState3(null);
  const [sceneError, setSceneError] = useState3(null), [ready, setReady] = useState3(false);
  const frame = useRef4(null), last = useRef4(null), snapshotRef = useRef4(snapshot), floorRef = useRef4(floor), refreshRef = useRef4(refresh);
  snapshotRef.current = snapshot;
  floorRef.current = floor;
  refreshRef.current = refresh;
  const humanName = useRef4("Sen");
  const base = `/${context.companyPrefix || snapshot?.company.prefix || context.companyId}`;
  function send(type, extra = {}) {
    frame.current?.contentWindow?.postMessage({ type, companyId: context.companyId, ...extra }, location.origin);
  }
  useEffect4(() => {
    try {
      humanName.current = localStorage.getItem(`office3d:human:${context.companyId}`) || "Sen";
    } catch {
    }
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let active = true, inFlight = false;
    const poll = async () => {
      if (!active || inFlight || document.hidden) return;
      inFlight = true;
      try {
        await refreshRef.current();
      } catch {
      } finally {
        inFlight = false;
      }
    };
    const timer = setInterval(poll, 3e3);
    document.addEventListener("visibilitychange", poll);
    return () => {
      active = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", poll);
      document.body.style.overflow = oldOverflow;
    };
  }, []);
  useEffect4(() => {
    const receive = (event) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || event.data?.companyId !== context.companyId) return;
      if (event.data.type === "office-ready") {
        setReady(true);
        setSceneError(null);
        send("office-snapshot", { snapshot: snapshotRef.current, floor: floorRef.current, humanName: humanName.current });
      }
      if (event.data.type === "office-question") {
        const item = snapshotRef.current?.attention?.find((q) => q.id === event.data.questionId);
        if (item) {
          setInspect(null);
          setShowTV(false);
          setQuestion(item);
        }
      }
      if (event.data.type === "office-select" && snapshotRef.current?.agents.some((a) => a.id === event.data.agentId)) {
        setShowTV(false);
        setQuestion(null);
        setInspect(event.data.agentId);
      }
      if (event.data.type === "office-tv") {
        setInspect(null);
        setQuestion(null);
        setShowTV(true);
      }
      if (event.data.type === "office-error") setSceneError(event.data.message);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);
  useEffect4(() => {
    if (!snapshot) return;
    send("office-snapshot", { snapshot, floor, changes: transitions(last.current, snapshot), humanName: humanName.current });
    last.current = snapshot;
    const max = Math.max(0, Math.ceil(snapshot.agents.length / 5) - 1);
    if (floor > max) setFloor(max);
  }, [snapshot, floor]);
  const people = snapshot?.agents || [];
  return createPortal(h4(
    "main",
    { className: "o3d-immersive", "data-company-id": context.companyId, "aria-label": "Canl\u0131 3D ofis" },
    h4("link", { rel: "stylesheet", href: `/_plugins/${encodeURIComponent(pluginId)}/ui/office.css` }),
    h4("iframe", { ref: frame, title: "3D ofis sahnesi", src: `/_plugins/${encodeURIComponent(pluginId)}/ui/scene.html?company=${encodeURIComponent(context.companyId || "")}`, inert: question || showTV || inspect ? true : void 0 }),
    !ready && h4("div", { className: "o3d-message", role: "status" }, "Ofis haz\u0131rlan\u0131yor\u2026"),
    (error || sceneError) && h4("div", { className: "o3d-message o3d-error", role: "alert" }, sceneError || "Ofis ba\u011Flant\u0131s\u0131 yenileniyor\u2026", h4("button", { onClick: () => {
      if (sceneError) {
        setReady(false);
        setSceneError(null);
        frame.current.src = frame.current.src;
      } else refresh();
    } }, "Tekrar dene")),
    h4(
      "nav",
      { className: "o3d-tools", "aria-label": "Ofis kontrolleri", inert: question || showTV || inspect ? true : void 0 },
      h4("a", { href: `${base}/dashboard`, "aria-label": "Paperclip\u2019e d\xF6n", title: "Paperclip\u2019e d\xF6n" }, "\u2197"),
      people.length > 5 && h4("select", { value: floor, onChange: (e) => setFloor(Number(e.target.value)), "aria-label": "Ofis kat\u0131" }, ...Array.from({ length: Math.ceil(people.length / 5) }, (_, i) => h4("option", { key: i, value: i }, `Kat ${i + 1}`))),
      h4("button", { onClick: () => send("office-focus", { agentId: "office-human" }), "aria-label": "Masama git", title: "Masama git" }, "\u2302"),
      h4("button", { onClick: () => send("office-lobby"), "aria-label": "Lobiye git", title: "Lobiye git" }, "\u2615"),
      h4("button", { onClick: () => send("office-reset"), "aria-label": "G\xF6r\xFCn\xFCm\xFC s\u0131f\u0131rla", title: "G\xF6r\xFCn\xFCm\xFC s\u0131f\u0131rla" }, "\u2922")
    ),
    inspect && h4(AgentInspector, { key: inspect, agentId: inspect, snapshot, companyId: context.companyId, base, onClose: () => {
      setInspect(null);
      frame.current?.focus();
    } }),
    showTV && h4(Television, { snapshot, onClose: () => {
      setShowTV(false);
      frame.current?.focus();
    } }),
    question && h4(QuestionChat, { key: question.id, question, companyId: context.companyId, base, people, stillPending: snapshot?.attention?.some((q) => q.id === question.id), onClose: () => {
      setQuestion(null);
      frame.current?.focus();
    }, onAnswered: () => refreshRef.current() })
  ), document.body);
}
export {
  OfficeLink,
  OfficePage
};
