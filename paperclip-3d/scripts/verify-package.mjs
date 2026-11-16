import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import manifest from '../dist/manifest.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
assert.equal(pkg.version, manifest.version);
assert.equal(pkg.paperclipPlugin.manifest, './dist/manifest.js');
const required = ['dist/worker.js', 'dist/ui/index.js', 'dist/ui/scene.js', 'dist/ui/scene.html', 'dist/ui/office.css', 'dist/ui/roving/LICENSE', 'dist/ui/roving/NOTICE', 'dist/ui/roving/vendor/three/LICENSE', 'vendor/roving-office/LICENSE', 'vendor/roving-office/NOTICE', 'vendor/roving-office/PROVENANCE.json', 'LICENSE', 'NOTICE', 'THIRD_PARTY_NOTICES.txt', 'KURULUM.md', 'package-lock.json'];
for (const name of required) assert.ok((await fs.stat(path.join(root, name))).isFile(), name);
const excluded = new Set(['node_modules', '.git', '.scene-inputs.json']);
let checked = 0;
async function scan(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const full = path.join(dir, entry.name), name = path.relative(root, full);
    assert.ok(!entry.isSymbolicLink(), `Symlink must not be distributed: ${name}`);
    if (entry.isDirectory()) { await scan(full); continue; }
    assert.ok(!/^\.env(?:\.|$)/.test(entry.name) && !['auth.json', '.DS_Store'].includes(entry.name), `Private file: ${name}`);
    const text = await fs.readFile(full, 'utf8');
    assert.ok(!/\x2fUsers\x2f|\x2fhome\x2f[^/\s]+\x2f/.test(text), `Machine-specific home directory: ${name}`);
    assert.ok(!/sk-proj-[A-Za-z0-9_-]{24,}/.test(text), `Credential-like content: ${name}`);
    if (name === 'package-lock.json') assert.ok(!/"(?:resolved|version)":\s*"file:/.test(text), 'Lockfile must use public dependencies');
    checked++;
  }
}
await scan(root);
assert.ok(!manifest.capabilities.includes('approvals.read'));
assert.ok(!manifest.capabilities.includes('issue.interactions.respond'));
const marks = await fs.readFile(path.join(root, 'vendor/roving-office/src/ui/marks.js'), 'utf8');
assert.ok(!marks.includes('<svg'));
for (const name of ['src/scene/standees.js', 'src/rovo-mark.js']) await assert.rejects(fs.access(path.join(root, 'vendor/roving-office', name)));
console.log(`Package ${pkg.version} verified: ${checked} files; portable paths, source, runtime, notices and permission boundary checked.`);
