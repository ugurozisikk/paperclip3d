import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectLocalCliAuth } from '../app/node_modules/@paperclipai/server/dist/services/local-cli-auth.js';
const actor = { type: 'board', source: 'local_implicit' };
const config = { engine: 'cli', env: { OPENAI_API_KEY: '', CODEX_API_KEY: '' }, extraArgs: ['--add-dir', '/tmp/project', '-c', 'forced_login_method="chatgpt"'] };
test('local opt-in is separate from the existing managed connection flow', () => {
 assert.equal(selectLocalCliAuth(actor, 'codex_local', { aiConnection: { mode: 'responsible_user' } }, config), null);
 assert.deepEqual(selectLocalCliAuth(actor, 'codex_local', { localCliAuth: true, heartbeat: { enabled: false } }, config, { driver: 'local' }), { localCliAuth: true, heartbeat: { enabled: false } });
});
test('remote callers, remote environments, other adapters and API credentials cannot select this local mode', () => {
 for (const args of [
  [{ type: 'agent', source: 'local_implicit' }, 'codex_local', { localCliAuth: true }, config],
  [{ type: 'board', source: 'api_key' }, 'codex_local', { localCliAuth: true }, config],
  [actor, 'claude_local', { localCliAuth: true }, config],
  [actor, 'codex_local', { localCliAuth: true }, config, { driver: 'remote' }],
  [actor, 'codex_local', { localCliAuth: true }, { ...config, env: { OPENAI_API_KEY: 'test-only' } }],
  [actor, 'codex_local', { localCliAuth: true }, { ...config, extraArgs: [] }],
  [actor, 'codex_local', { localCliAuth: true, aiConnection: { mode: 'responsible_user' } }, config]
 ]) assert.throws(() => selectLocalCliAuth(...args));
});
test('normalized empty environment bindings are allowed but stored credentials are rejected', () => {
 const runtime = { localCliAuth: true };
 const normalized = { ...config, env: { OPENAI_API_KEY: { type: 'plain', value: '' }, CODEX_API_KEY: { type: 'plain', value: ' ' } } };
 assert.deepEqual(selectLocalCliAuth(actor, 'codex_local', runtime, normalized), runtime);
 for (const value of [{ type: 'plain', value: 'test-only' }, { type: 'secret_ref', secretId: 'test-only' }]) {
  assert.throws(() => selectLocalCliAuth(actor, 'codex_local', runtime, { ...config, env: { OPENAI_API_KEY: value } }));
 }
});
