import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const server = path.resolve(root, '../app/node_modules/@paperclipai/server/dist');
const route = path.join(server, 'routes/agents.js');
let source = await fs.readFile(route, 'utf8');
const original = path.join(root, 'agents.js.original');
try { await fs.access(original); } catch { await fs.copyFile(route, original); }
if (!source.includes('selectLocalCliAuth')) {
  const before = `        if (existing.runtimeConfig.aiConnection && requestedRuntimeConfig && !requestedRuntimeConfig.aiConnection)
            requestedRuntimeConfig.aiConnection = existing.runtimeConfig.aiConnection;
        const nextAiBinding = aiRuntimeConnectionBindingSchema.safeParse(requestedRuntimeConfig?.aiConnection ?? existing.runtimeConfig.aiConnection).data;`;
  const after = `        // Explicit local operator opt-in: use the already signed-in host CLI with ChatGPT-only auth.
        const localCliEnvironmentId = patchData.defaultEnvironmentId !== undefined ? patchData.defaultEnvironmentId : existing.defaultEnvironmentId;
        const localCliEnvironment = requestedRuntimeConfig?.localCliAuth === true && localCliEnvironmentId ? await environmentsSvc.getById(localCliEnvironmentId) : null;
        const localCliRuntime = selectLocalCliAuth(req.actor, requestedAdapterType, requestedRuntimeConfig, patchData.adapterConfig ?? existing.adapterConfig, localCliEnvironment);
        if (localCliRuntime) requestedRuntimeConfig = localCliRuntime;
        if (existing.runtimeConfig.aiConnection && requestedRuntimeConfig && !requestedRuntimeConfig.aiConnection && !localCliRuntime)
            requestedRuntimeConfig.aiConnection = existing.runtimeConfig.aiConnection;
        const nextAiBinding = localCliRuntime ? undefined : aiRuntimeConnectionBindingSchema.safeParse(requestedRuntimeConfig?.aiConnection ?? existing.runtimeConfig.aiConnection).data;`;
  if (!source.includes(before)) throw new Error('Paperclip route changed; review the local patch before applying.');
  source = `import { selectLocalCliAuth } from '../services/local-cli-auth.js';\n` + source.replace(before, after);
  await fs.writeFile(route, source);
}
await fs.copyFile(path.join(root, 'local-cli-auth.js'), path.join(server, 'services/local-cli-auth.js'));
console.log('Local operator Codex CLI auth option installed.');
