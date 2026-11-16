import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ui = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist/ui');
const port = Number(process.env.PORT || 4173);
const company = { id: 'demo-company', name: 'Demo Ekibi', prefix: 'DEMO' };
const agents = ['Müdür', 'Product Owner', 'Backend Developer', 'Frontend Developer', 'QA Developer'].map((name, i) => ({ id: `demo-agent-${i}`, name, companyId: company.id, status: 'idle', reportsTo: i === 0 ? null : i === 1 ? 'demo-agent-0' : 'demo-agent-1' }));
const snapshot = { company, agents, issues: [], attention: [], humanQueueEnabled: true };
const html = `<!doctype html><html lang="tr"><meta charset="utf-8"><title>3D Ofis — Görsel Demo</title><style>html,body,iframe{margin:0;width:100%;height:100%;border:0;overflow:hidden}nav{position:fixed;bottom:16px;left:16px;display:flex;gap:8px;background:#fffbed;padding:10px;border-radius:10px;font:14px sans-serif}button{cursor:pointer}</style><iframe id="office" title="3D ofis sahnesi" src="/scene.html?company=demo-company"></iframe><nav>Örnek veriler · Paperclip bağlantısı yok <button id="home">Odama git</button><button id="lobby">Lobiye git</button></nav><script>const frame=document.getElementById('office');const snapshot=${JSON.stringify(snapshot)};const send=(type,extra={})=>frame.contentWindow.postMessage({type,companyId:snapshot.company.id,...extra},location.origin);window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==frame.contentWindow)return;if(event.data.type==='office-ready')send('office-snapshot',{snapshot,floor:0,humanName:'Sen'});if(event.data.type==='office-error')document.body.dataset.error=event.data.message});document.getElementById('home').onclick=()=>send('office-focus',{agentId:'office-human'});document.getElementById('lobby').onclick=()=>send('office-lobby');</script></html>`;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/') { res.writeHead(200, { 'Content-Type': types['.html'] }); res.end(html); return; }
    const target = path.resolve(ui, `.${pathname}`);
    if (!target.startsWith(`${ui}${path.sep}`)) { res.writeHead(403); res.end(); return; }
    const file = await fs.readFile(target);
    res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' }); res.end(file);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log(`3D office visual preview: http://127.0.0.1:${port} (demo data only)`));
