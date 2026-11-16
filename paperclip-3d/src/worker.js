import { definePlugin, runWorker } from '@paperclipai/plugin-sdk';
import { publicSnapshot } from './model.js';

async function allPages(read, companyId) {
  const result = [];
  for (let offset = 0; ; offset += 200) {
    const page = await read({ companyId, limit: 200, offset });
    result.push(...page);
    if (page.length < 200) return result;
    if (offset > 100000) throw new Error('Ofis veri sınırı aşıldı.');
  }
}

const plugin = definePlugin({
  async setup(ctx) {
    const cache = new Map();
    ctx.data.register('snapshot', async ({ companyId, viewerUserId }) => {
      if (typeof companyId !== 'string' || !companyId) throw new Error('Önce bir şirket seçin.');
      // Host SDK enforces the active board invocation's company scope.
      const company = await ctx.companies.get(companyId);
      if (!company) throw new Error('Şirket bulunamadı.');
      const [agents, issues] = await Promise.all([
        allPages(p => ctx.agents.list(p), companyId),
        allPages(p => ctx.issues.list(p), companyId)
      ]);
      const interactions = [];
      const tasks = issues.filter(i => i.companyId === companyId);
      const taskIds = new Set(tasks.map(i => `${companyId}:${i.id}`));
      for (const key of cache.keys()) if (key.startsWith(`${companyId}:`) && !taskIds.has(key)) cache.delete(key);
      let cursor = 0;
      await Promise.all(Array.from({ length: Math.min(6, tasks.length) }, async () => {
        while (cursor < tasks.length) {
          const issue = tasks[cursor++], key = `${companyId}:${issue.id}`;
          const saved = cache.get(key);
          const ttl = issue.status === 'blocked' || saved?.items.some(i => i.status === 'pending') ? 2000 : 10000;
          let items = saved && Date.now() - saved.at < ttl ? saved.items : null;
          if (!items) {
            const [records, relations] = await Promise.all([ctx.issues.listInteractions(issue.id, companyId), ctx.issues.relations.get(issue.id, companyId)]);
            items = records.filter(i => i.companyId === companyId && i.kind === 'ask_user_questions');
            cache.set(key, { items, blockedByIssueIds: relations.blockedBy.map(b => b.id), at: Date.now() });
          }
          issue.blockedByIssueIds = cache.get(key)?.blockedByIssueIds || [];
          interactions.push(...items);
        }
      }));
      return { ...publicSnapshot(company, agents, issues, interactions, [], viewerUserId), humanQueueEnabled: true };
    });
  },
  async onHealth() { return { status: 'ok', message: 'Company-scoped read-only office ready' }; }
});
export default plugin;
runWorker(plugin, import.meta.url);
