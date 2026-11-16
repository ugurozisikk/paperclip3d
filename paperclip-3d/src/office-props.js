import * as THREE from 'three';
import { FLOOR_TOP } from './roving/src/config.js';
import { taskBroadcast, kanbanColumns } from './model.js';
import { LOBBY, PRIVATE_ROOM, EXTRA_OBSTACLES } from './office-layout.js';
export const taskLabels = { backlog: 'Planlanıyor', todo: 'Sırada', in_progress: 'Geliştiriliyor', in_review: 'İncelemede', blocked: 'Engel var', done: 'Tamamlandı', cancelled: 'İptal edildi' };
function mesh(geometry, color, parent, x, y, z) {
  const result = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: .72 }));
  result.position.set(x, y, z); result.castShadow = true; result.receiveShadow = true; parent.add(result); return result;
}
function label(root, text, x, y, z, width, floor = false) {
  const surface = document.createElement('canvas'); surface.width = 1024; surface.height = 160;
  const ctx = surface.getContext('2d'); ctx.fillStyle = '#314f42'; ctx.font = '600 70px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(text, 512, 106);
  const texture = new THREE.CanvasTexture(surface); texture.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(width, width * 160 / 1024), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
  sign.position.set(x, y, z); if (floor) sign.rotation.x = -Math.PI / 2; root.add(sign); return sign;
}
export function buildLobby(root, nav) {
  buildDecor(root);
  const group = new THREE.Group(); group.position.set(LOBBY.x, FLOOR_TOP, LOBBY.z); root.add(group);
  mesh(new THREE.BoxGeometry(11.5, .028, 11), '#bdcbb7', group, 0, .02, 0);
  mesh(new THREE.BoxGeometry(2.6, .16, 1.5), '#ba9264', group, 0, .75, 0);
  for (const x of [-1.05, 1.05]) for (const z of [-.48, .48]) mesh(new THREE.CylinderGeometry(.06, .075, .65, 12), '#4a5549', group, x, .36, z);
  for (const x of [-.7, .7]) {
    mesh(new THREE.CylinderGeometry(.18, .18, .022, 20), '#f4ead8', group, x, .85, .16);
    mesh(new THREE.CylinderGeometry(.1, .075, .17, 20), '#ece0c8', group, x, .94, .16);
    mesh(new THREE.CylinderGeometry(.078, .078, .008, 16), '#593c28', group, x, 1.03, .16);
  }
  mesh(new THREE.BoxGeometry(.55, .045, .38), '#647e6d', group, 0, .86, -.25);
  label(root, 'LOBİ  /  MOLA ALANI', LOBBY.x, FLOOR_TOP + .06, 28.3, 7.5, true);
  // The room is cut away toward the viewer, with glass along the corridor and a real doorway.
  const room = new THREE.Group(); room.position.y = FLOOR_TOP; root.add(room);
  mesh(new THREE.BoxGeometry(13.6, .025, 12.4), '#ded4bd', room, 36.5, .022, 6.6);
  const glass = new THREE.MeshStandardMaterial({ color: '#aac6bd', transparent: true, opacity: .17, roughness: .15, metalness: .05, depthWrite: false, side: THREE.DoubleSide });
  for (const [start, end] of [[.5, PRIVATE_ROOM.doorStart], [PRIVATE_ROOM.doorEnd, PRIVATE_ROOM.front]]) {
    const length = end - start;
    mesh(new THREE.BoxGeometry(.22, .6, length), '#719080', room, PRIVATE_ROOM.left, .3, (start + end) / 2);
    const pane = new THREE.Mesh(new THREE.BoxGeometry(.07, 2.8, length), glass); pane.position.set(PRIVATE_ROOM.left, 2, (start + end) / 2); room.add(pane);
    for (const z of [start, end]) mesh(new THREE.BoxGeometry(.13, 3.5, .13), '#4e6e60', room, PRIVATE_ROOM.left, 1.75, z);
    mesh(new THREE.BoxGeometry(.14, .12, length), '#4e6e60', room, PRIVATE_ROOM.left, 3.5, (start + end) / 2);
  }
  mesh(new THREE.BoxGeometry(14, .65, .25), '#719080', room, 36.5, .325, PRIVATE_ROOM.front);
  mesh(new THREE.BoxGeometry(.25, .65, 12.5), '#719080', room, PRIVATE_ROOM.right, .325, 6.75);
  label(root, 'SENİN ODAN', 36, 4.8, .35, 7.5);
  label(root, 'GÖRÜŞME', 36, FLOOR_TOP + .06, 11, 5.5, true);
  const rebuild = nav.rebuild.bind(nav);
  nav.rebuild = () => {
    rebuild();
    for (const bounds of EXTRA_OBSTACLES) for (const target of [nav.blocked, nav.furniture]) nav.block(...bounds, target);
    nav._markTight();
  };
  nav.rebuild();
  const speech = document.createElement('canvas'); speech.width = 160; speech.height = 80;
  const c = speech.getContext('2d'); c.fillStyle = '#fffdf1'; c.beginPath(); c.roundRect(4, 4, 152, 58, 25); c.fill();
  c.beginPath(); c.moveTo(68, 58); c.lineTo(80, 76); c.lineTo(92, 58); c.fill();
  c.fillStyle = '#8b9d7d'; for (const x of [48, 80, 112]) { c.beginPath(); c.arc(x, 33, 7, 0, Math.PI * 2); c.fill(); }
  const bubble = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(speech), depthTest: false, transparent: true }));
  bubble.scale.set(1.15, .575, 1); bubble.visible = false; root.add(bubble);
  return { group, room, bubble };
}
function buildDecor(root) {
  const group = new THREE.Group(); group.name = 'office-decor'; group.position.set(16.7, FLOOR_TOP, 28.6); root.add(group);
  mesh(new THREE.BoxGeometry(9.8, .025, 2.65), '#c7c1a7', group, 0, .02, -.25);
  mesh(new THREE.BoxGeometry(8.9, .027, 1.95), '#d8d2bb', group, 0, .023, -.25);
  // A low oak console dresses the open edge while keeping the central walking lanes clear.
  mesh(new THREE.BoxGeometry(5.8, .12, 1.2), '#bc9769', group, 0, 1.28, 0);
  mesh(new THREE.BoxGeometry(5.5, .9, 1.04), '#8b714e', group, 0, .77, 0);
  for (const x of [-1.8, 0, 1.8]) {
    mesh(new THREE.BoxGeometry(1.72, .8, .045), '#c3a77d', group, x, .8, -.54);
    mesh(new THREE.BoxGeometry(.38, .035, .05), '#647464', group, x, 1, -.58);
  }
  for (const x of [-2.4, 2.4]) mesh(new THREE.BoxGeometry(.12, .35, .85), '#485747', group, x, .18, 0);
  for (let i = 0; i < 3; i++) {
    const book = mesh(new THREE.BoxGeometry(.9 - i * .08, .12, .62), ['#738e7b', '#d1b18b', '#a37258'][i], group, -1.8, 1.4 + i * .13, 0);
    book.rotation.y = i % 2 ? .12 : -.08;
  }
  mesh(new THREE.CylinderGeometry(.25, .29, .06, 24), '#e6decd', group, 0, 1.4, 0);
  const sculpture = mesh(new THREE.TorusGeometry(.43, .115, 12, 40), '#f1e8d5', group, 0, 1.94, 0); sculpture.rotation.y = .4;
  mesh(new THREE.SphereGeometry(.24, 20, 16), '#829d9c', group, 1.6, 1.58, .02);
  mesh(new THREE.CylinderGeometry(.09, .12, .36, 20), '#829d9c', group, 1.6, 1.84, .02);
  mesh(new THREE.CylinderGeometry(.14, .22, .45, 20), '#d4ad70', group, 2.25, 1.57, -.05);
}
export function buildTelevision(root) {
  const width = 27.2;
  const group = new THREE.Group(); group.position.set(.48, 5.35, 15); group.rotation.y = Math.PI / 2; root.add(group);
  mesh(new THREE.BoxGeometry(2.4, .9, .14), '#29332e', group, 0, -.04, -.12);
  mesh(new THREE.BoxGeometry(width, 4.3, .17), '#242d28', group, 0, 0, 0);
  const surface = document.createElement('canvas'); surface.width = 4096; surface.height = 640;
  const texture = new THREE.CanvasTexture(surface); texture.colorSpace = THREE.SRGBColorSpace;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(width - .4, 4.1), new THREE.MeshBasicMaterial({ map: texture }));
  screen.position.set(0, .02, .091); group.add(screen);
  mesh(new THREE.SphereGeometry(.025, 8, 6), '#89c68e', group, width / 2 - .35, -2.07, .09);
  texture.anisotropy = 8;
  group.traverse(object => { object.userData.officeTV = true; });
  return { group, surface, texture, openAnchor: new THREE.Vector3(width / 2 - 1.2, -1.45, .15), elapsed: 0, lastPaint: -1, broadcast: null };
}
function lines(ctx, text, width, max) {
  const result = []; let line = '';
  for (const word of String(text).split(/\s+/)) {
    if (ctx.measureText(`${line} ${word}`).width > width && line) { result.push(line); line = word; } else line += `${line ? ' ' : ''}${word}`;
  }
  if (line) result.push(line);
  return result.slice(0, max).map((line, i) => i === max - 1 && result.length > max ? `${line.slice(0, -1)}…` : line);
}
export function updateTelevision(tv, snapshot, dt, canvas) {
  tv.elapsed += dt;
  const second = Math.floor(tv.elapsed * 5);
  if (tv.lastPaint === second) return;
  tv.lastPaint = second;
  if (tv.issueSource !== snapshot.issues) { tv.issueSource = snapshot.issues; tv.broadcast = taskBroadcast(snapshot.issues); }
  const { main, children, completed, total } = tv.broadcast;
  const ctx = tv.surface.getContext('2d'), screenWidth = tv.surface.width;
  ctx.fillStyle = '#12271f'; ctx.fillRect(0, 0, screenWidth, 640);
  ctx.fillStyle = '#a9c590'; ctx.font = 'bold 38px sans-serif'; ctx.fillText('OFİS TV  /  KANBAN', 50, 55);
  const status = main ? taskLabels[main.status] || main.status : 'Görev yok';
  ctx.fillStyle = '#d4c99f'; ctx.font = 'bold 39px sans-serif'; ctx.textAlign = 'right'; ctx.fillText(main ? `${main.identifier || ''}  ·  ${status}  ·  ${completed}/${total} alt görev` : 'Yeni görev bekleniyor', screenWidth - 50, 55); ctx.textAlign = 'left';
  ctx.fillStyle = '#f7f5df'; ctx.font = 'bold 62px sans-serif';
  lines(ctx, main?.title || 'Ekibin görev tahtası', screenWidth - 100, 1).forEach(line => ctx.fillText(line, 50, 140));
  const columns = kanbanColumns(snapshot.issues);
  for (const [index, column] of columns.entries()) {
    const width = (screenWidth - 72 - 3 * 24) / 4, x = 36 + index * (width + 24);
    ctx.fillStyle = '#203a2d'; ctx.fillRect(x, 178, width, 312);
    ctx.fillStyle = column.color; ctx.font = 'bold 42px sans-serif'; ctx.fillText(`${column.label.toLocaleUpperCase('tr')}  ${column.issues.length}`, x + 20, 226);
    column.issues.slice(0, 2).forEach((issue, row) => {
      const y = 245 + row * 112;
      ctx.fillStyle = issue.status === 'blocked' ? '#594231' : '#314a3a'; ctx.fillRect(x + 13, y, width - 26, 102);
      ctx.fillStyle = column.color; ctx.font = '28px sans-serif'; ctx.fillText(`${issue.identifier || ''}${issue.status === 'blocked' ? ' · ENGEL VAR' : ''}`, x + 26, y + 33);
      ctx.fillStyle = '#f0f1dd'; ctx.font = '36px sans-serif';
      lines(ctx, issue.title, width - 52, 1).forEach(line => ctx.fillText(line, x + 26, y + 78));
    });
  }
  canvas.dataset.tvKanban = JSON.stringify(columns.map(c => ({ id: c.id, count: c.issues.length })));
  ctx.fillStyle = '#081c15'; ctx.fillRect(0, 518, screenWidth, 122);
  const ticker = main ? `${main.identifier || ''}  •  ${main.title}  •  ${status}  •  ${children.filter(i => i.status === 'in_progress').length} alt görev geliştiriliyor  •  ${snapshot.attention?.length || 0} soru yanıt bekliyor` : 'Ekibin ana görev durumu burada canlı yayınlanır.';
  ctx.font = '46px sans-serif'; ctx.fillStyle = '#dcebc4';
  const width = ctx.measureText(ticker).width + 220, offset = (tv.elapsed * 100) % width;
  ctx.save(); ctx.beginPath(); ctx.rect(45, 530, screenWidth - 90, 100); ctx.clip();
  for (let x = 65 - offset; x < screenWidth; x += width) ctx.fillText(ticker, x, 598);
  ctx.restore(); tv.texture.needsUpdate = true;
  canvas.dataset.tvTask = main?.identifier || '';
  canvas.dataset.tvStatus = main?.status || 'empty';
  canvas.dataset.tvProgress = `${completed}/${total}`;
  canvas.dataset.tvTicker = String(Math.floor(offset));
}
