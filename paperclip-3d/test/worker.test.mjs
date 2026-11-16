import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTestHarness } from '@paperclipai/plugin-sdk/testing';
import plugin from '../dist/worker.js';
import manifest from '../dist/manifest.js';
test('native SDK reader supports two companies and more than one page', async () => {
  const harness = createTestHarness({ manifest });
  const companies = [{ id: 'one', name: 'One' }, { id: 'two', name: 'Two' }];
  harness.seed({ companies, agents: [
    { id: 'alpha', name: 'Alpha', companyId: 'one', status: 'idle', adapterConfig: { apiKey: 'DO_NOT_EXPOSE' } },
    { id: 'beta', name: 'Beta', companyId: 'two', status: 'idle' }
  ], issues: Array.from({ length: 205 }, (_, i) => ({ id: `issue-${i}`, companyId: 'one', title: `Task ${i}`, status: 'todo' })) });
  await plugin.definition.setup(harness.ctx);
  const first = await harness.getData('snapshot', { companyId: 'one' });
  const second = await harness.getData('snapshot', { companyId: 'two' });
  assert.equal(first.issues.length, 205);
  assert.deepEqual(first.agents.map(a => a.name), ['Alpha']);
  assert.deepEqual(second.agents.map(a => a.name), ['Beta']);
  assert.equal(second.issues.length, 0);
  assert.ok(!JSON.stringify(first).includes('DO_NOT_EXPOSE'));
  await assert.rejects(harness.getData('snapshot', {}), /şirket/);
  await assert.rejects(harness.getData('snapshot', { companyId: 'missing' }), /bulunamadı/);
});
test('real human questions are read with company scoping; approvals and agent questions stay out', async () => {
  const harness = createTestHarness({ manifest });
  const question = { id: 'question', companyId: 'one', issueId: 'task', createdByAgentId: 'dev', kind: 'ask_user_questions', status: 'pending', title: 'Renk?', payload: { questions: [{ id: 'color', prompt: 'Hangi renk?', required: true, selectionMode: 'single', options: [{ id: 'green', label: 'Yeşil' }] }], adapterConfig: { token: 'SECRET' } } };
  harness.seed({ companies: [{ id: 'one', name: 'One' }, { id: 'two', name: 'Two' }], agents: [{ id: 'dev', name: 'Developer', companyId: 'one', status: 'idle' }], issues: [{ id: 'task', companyId: 'one', title: 'Task', status: 'in_progress', assigneeAgentId: 'dev' }], issueInteractions: [question, { ...question, id: 'foreign', companyId: 'two' }, { ...question, id: 'agent-directed', addresseeAgentId: 'dev' }, { ...question, id: 'answered', status: 'answered' }, { ...question, id: 'approval', kind: 'request_confirmation', effectiveResolverPolicy: 'human_only' }] });
  harness.ctx.approvals.list = () => { throw new Error('Must not read approvals'); };
  await plugin.definition.setup(harness.ctx);
  const snapshot = await harness.getData('snapshot', { companyId: 'one' });
  assert.equal(snapshot.humanQueueEnabled, true);
  assert.deepEqual(snapshot.attention.map(q => q.id), ['interaction:question']);
  assert.equal(snapshot.attention[0].questions[0].options[0].label, 'Yeşil');
  assert.ok(!JSON.stringify(snapshot).includes('SECRET'));
  assert.equal((await harness.getData('snapshot', { companyId: 'two' })).attention.length, 0);
  assert.ok(manifest.capabilities.includes('issue.interactions.read'));
  assert.ok(!manifest.capabilities.includes('approvals.read'));
  assert.ok(!manifest.capabilities.includes('issue.interactions.respond'));
});

test('native relation reader carries only same-company blocker issue IDs', async () => {
  const harness = createTestHarness({ manifest });
  harness.seed({ companies: [{ id: 'one', name: 'One' }], agents: [{ id: 'dev', name: 'Dev', companyId: 'one', status: 'idle' }], issues: [{ id: 'api', companyId: 'one', title: 'API', status: 'in_progress' }, { id: 'ui', companyId: 'one', title: 'UI', status: 'blocked', blockedBy: [{ id: 'api' }] }] });
  await plugin.definition.setup(harness.ctx);
  const result = await harness.getData('snapshot', { companyId: 'one' });
  assert.deepEqual(result.issues.find(i => i.id === 'ui').blockedByIssueIds, ['api']);
});
