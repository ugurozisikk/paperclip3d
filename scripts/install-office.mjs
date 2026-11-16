import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'paperclip/app/node_modules/paperclipai/dist/index.js');
const result = spawnSync(process.execPath, [cli, 'plugin', 'install', path.join(root, 'paperclip-3d'), '--local', '--data-dir', path.join(root, 'paperclip/data'), '--api-base', process.env.PAPERCLIP_API_BASE || 'http://127.0.0.1:3100'], { cwd: root, stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
