import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const file of ['paperclip/control.mjs', 'paperclip/app/package-lock.json', 'paperclip/runtime/package-lock.json', 'paperclip/local-patches/apply-local-cli-auth.mjs', 'paperclip-3d/src/scene.js', 'paperclip-3d/dist/manifest.js', 'blog-demo/frontend/src/App.jsx', 'blog-demo/backend/Program.cs', 'blog-demo/qa/playwright.config.mjs', 'team/team-template.json']) await fs.access(path.join(root, file));
let count = 0;
async function scan(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'bin', 'obj', '.runtime', '.tmp', 'data', 'test-results', 'playwright-report', 'dist'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    assert.ok(!entry.isSymbolicLink(), 'Sembolik bağlantı pakete girmemeli.');
    if (entry.isDirectory()) { await scan(file); continue; }
    assert.ok(!['auth.json', '.DS_Store'].includes(entry.name) && !/^\.env(?:\.|$)/.test(entry.name), path.relative(root, file));
    const text = await fs.readFile(file, 'utf8');
    assert.ok(!/\x2fUsers\x2f|sk-proj-[A-Za-z0-9_-]{24,}/.test(text), `Kişisel yol veya anahtar: ${path.relative(root, file)}`);
    count++;
  }
}
await scan(root);
console.log(`Proje bileşenleri doğrulandı; ${count} kaynak/belge kontrol edildi.`);
