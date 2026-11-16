import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const root = path.dirname(fileURLToPath(import.meta.url));
const cli = path.join(root, 'app/node_modules/paperclipai/dist/index.js');
const node = path.join(root, 'runtime/node_modules/node/bin/node');
const data = path.join(root, 'data');
const runtimeFile = path.join(data, 'instances/default/runtime-info.json');
const url = 'http://127.0.0.1:3100';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const env = {
  ...process.env,
  PATH: `${path.dirname(node)}:${process.env.PATH || ''}`,
  PAPERCLIP_HOME: data,
  PAPERCLIP_TELEMETRY_DISABLED: '1',
  DO_NOT_TRACK: '1',
  PAPERCLIP_NO_BROWSER: 'true',
};

function runtime() {
  try { return JSON.parse(fs.readFileSync(runtimeFile, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

function ownsProcess(pid) {
  if (!Number.isInteger(pid) || pid <= 1) return false;
  const result = spawnSync('/bin/ps', ['-p', String(pid), '-o', 'command='], { encoding: 'utf8' });
  return result.status === 0 && result.stdout.includes(cli) && result.stdout.includes(data);
}

async function healthy() {
  try {
    const response = await fetch(`${url}/api/health`, { signal: AbortSignal.timeout(1500) });
    const value = await response.json();
    return response.ok && value.status === 'ok' && value.startupRecovery?.phase === 'ready';
  } catch { return false; }
}

async function main() {
  const action = process.argv[2] || 'start';
  if (action === 'stop') {
    const info = runtime();
    if (!info || !ownsProcess(info.pid)) {
      console.log('Bu Paperclip kurulumu zaten kapalı.');
      return;
    }
    process.kill(info.pid, 'SIGTERM');
    for (let attempt = 0; attempt < 40; attempt++) {
      if (!ownsProcess(info.pid)) {
        console.log('Paperclip güvenli şekilde durduruldu.');
        return;
      }
      await sleep(500);
    }
    throw new Error('Kapanma henüz tamamlanmadı. Biraz sonra tekrar deneyin.');
  }
  if (action !== 'start') throw new Error('Geçerli seçenekler: start, stop');

  if (!await healthy()) {
    const info = runtime();
    if (!info || !ownsProcess(info.pid)) {
      const log = fs.openSync(path.join(root, 'server.log'), 'a', 0o600);
      const child = spawn(node, [cli, 'run', '--data-dir', data], {
        cwd: root, env, detached: true, stdio: ['ignore', log, log],
      });
      try {
        await new Promise((resolve, reject) => {
          child.once('spawn', resolve);
          child.once('error', reject);
        });
      } finally { fs.closeSync(log); }
      child.unref();
      console.log('Paperclip başlatılıyor…');
    }
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt++) {
      if (await healthy()) { ready = true; break; }
      await sleep(1000);
    }
    if (!ready) throw new Error(`Başlatma tamamlanmadı. Ayrıntılar: ${path.join(root, 'server.log')}`);
  }
  console.log(`Paperclip hazır: ${url}`);
  if (!process.argv.includes('--no-browser')) {
    const result = spawnSync('/usr/bin/open', [url], { stdio: 'inherit' });
    if (result.status !== 0) console.log('Adresi tarayıcınızda açabilirsiniz.');
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
