import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const options = new Set(process.argv.slice(2));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} işlemi başarısız (${result.status}).`);
}
run(npm, ['ci'], path.join(root, 'paperclip/runtime'));
run(npm, ['ci'], path.join(root, 'paperclip/app'));
if (options.has('--local-codex')) {
  run(process.execPath, ['paperclip/local-patches/apply-local-cli-auth.mjs']);
  run(process.execPath, ['--test', 'paperclip/local-patches/local-cli-auth.test.mjs']);
}
if (!options.has('--skip-blog')) {
  run(npm, ['ci'], path.join(root, 'blog-demo/frontend'));
  run(npm, ['ci'], path.join(root, 'blog-demo/qa'));
  run(process.env.BLOG_DOTNET_COMMAND || 'dotnet', ['restore', 'blog-demo/backend/Blog.Api.csproj']);
  if (options.has('--browsers')) run(npm, ['exec', '--', 'playwright', 'install', 'chromium'], path.join(root, 'blog-demo/qa'));
}
if (options.has('--dev-office')) run(npm, ['ci'], path.join(root, 'paperclip-3d'));
console.log('Bağımlılıklar hazır. İlk Paperclip kurulumu ve başlatma adımları README.md içinde.');
