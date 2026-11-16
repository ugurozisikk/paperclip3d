import * as THREE from 'three';
import { createRenderer } from './roving/src/scene/renderer.js';
import { createCamera, createControls, updateCameraAspect, clampPan } from './roving/src/scene/camera.js';
import { addLighting, applyTimeOfDay, createReflectionEnvironment } from './roving/src/scene/lighting.js';
import { applyNightLights } from './roving/src/scene/night-lights.js';
import { buildEnvironment } from './roving/src/scene/environment.js';
import { buildProps } from './roving/src/scene/props.js';
import { createScene, resolveTheme } from './roving/src/projects.js';
import { applyPalette, CAMERA, ROOM, FLOOR_TOP } from './roving/src/config.js';
import { roomScreenBox, zoomForFrame, verticalCentre } from './roving/src/scene/framing.js';
import { stationsOfKind } from './roving/src/layout.js';
import { disposeSubtree, clearMaterialCache } from './roving/src/scene/build.js';
import { MailFlights } from './roving/src/scene/mail.js';
import { BirdFlights } from './roving/src/scene/birds.js';
import { CourierDeliveries } from './roving/src/scene/courier.js';
import { AgentManager, sitDownOn } from './roving/src/agents/AgentManager.js';
import { COUCH_SEAT_HEIGHT } from './roving/src/scene/props/couch.js';
import { Agent } from './roving/src/agents/Agent.js';
import { walk, lookAt, wait, status, carry, act } from './roving/src/agents/states.js';
import { currentIssue, agentState, idlePlayers, blockingVisits } from './model.js';
import { buildLobby, buildTelevision, updateTelevision } from './office-props.js';
import { LOBBY, PRIVATE_ROOM, configureOfficeLayout, humanQueueSlots } from './office-layout.js';

const companyId = new URLSearchParams(location.search).get('company');
const notify = (type, data = {}) => parent.postMessage({ type, companyId, ...data }, location.origin);
const canvas = document.getElementById('scene'), hint = document.getElementById('hint');
let world = null, snapshot = null, floor = 0, evening = false, selected = null;
let signatures = new Map(), ready = false;
let humanName = 'Sen';
const HUMAN_ID = 'office-human';
const source = { id: 'paperclip', label: 'Paperclip', kind: 'live', mark: '', accent: '#64866b' };
const ray = new THREE.Raycaster(), pointer = new THREE.Vector2();
const bubbleLayer = document.getElementById('question-bubbles');
const bubbleGroups = new Map();
let bubbleSignature = '';
const actorButtons = new Map();

function report(error) { notify('office-error', { message: `3D sahne açılamadı: ${error.message || String(error)}` }); }
window.addEventListener('error', event => report(event.error || event.message));
window.addEventListener('unhandledrejection', event => report(event.reason));

try {
  const renderer = createRenderer({ canvas, pixelRatio: Math.min(Math.max(devicePixelRatio, 1.5), 2) });
  const scene = new THREE.Scene();
  const environment = createReflectionEnvironment(renderer);
  scene.environment = environment.texture;
  const camera = createCamera(canvas.clientWidth / canvas.clientHeight);
  const controls = createControls(camera, canvas);
  camera.position.set(...CAMERA.position); controls.target.set(...CAMERA.target); controls.update();
  const defaultPosition = camera.position.clone(), defaultTarget = controls.target.clone();
  function fit() {
    camera.updateMatrixWorld();
    const box = roomScreenBox({ elements: camera.matrixWorldInverse.elements, room: ROOM, headroom: 1 });
    camera.zoom = zoomForFrame({ mode: 'fit', aspect: canvas.clientWidth / Math.max(canvas.clientHeight, 1), frustum: CAMERA.frustum,
      halfW: box.halfW, halfH: box.halfH, minZoom: .3, maxZoom: CAMERA.maxZoom, margin: .98 });
    camera.updateProjectionMatrix();
    const e = camera.matrixWorld.elements, inverse = camera.matrixWorldInverse.elements, t = controls.target;
    const wantY = verticalCentre({ frustum: CAMERA.frustum, zoom: camera.zoom, boxTop: box.top, boxBottom: box.bottom, bottomSlackShare: .45 });
    const dx = box.centreX - (inverse[0]*t.x + inverse[4]*t.y + inverse[8]*t.z + inverse[12]);
    const dy = wantY - (inverse[1]*t.x + inverse[5]*t.y + inverse[9]*t.z + inverse[13]);
    const move = new THREE.Vector3(e[0]*dx+e[4]*dy, e[1]*dx+e[5]*dy, e[2]*dx+e[6]*dy);
    controls.target.add(move); camera.position.add(move); controls.update();
  }
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); updateCameraAspect(camera, w / Math.max(h, 1)); fit();
  };
  new ResizeObserver(resize).observe(canvas); resize();

  function build() {
    if (world) {
      for (const id of [...world.manager.agents.keys()]) world.manager.handleEvent({ type: 'despawn', id });
      scene.remove(world.root); disposeSubtree(world.root, { keep: scene });
    }
    clearMaterialCache(); configureOfficeLayout(); signatures.clear();
    const theme = resolveTheme(createScene({ id: companyId, name: snapshot?.company.name || 'Ofis', building: 'simple', season: 'spring' }), { building: 'simple', season: 'spring' });
    applyPalette(theme.palette); scene.background = new THREE.Color(theme.sky);
    const root = new THREE.Group(); scene.add(root);
    const lights = addLighting(root, theme.light);
    applyTimeOfDay(lights, evening ? 19 : 11, theme, scene);
    const exterior = buildEnvironment(root, theme), handles = buildProps(root, theme);
    const boxAt = id => handles.byStation[id] || handles.mailbox;
    const mail = new MailFlights(root, boxAt), birds = new BirdFlights(root, boxAt);
    const deliveries = new CourierDeliveries(root, { boxAt, ...exterior });
    const props = { ...handles, ...exterior, mail, birds, deliveries };
    const humanDesk = props.desks.find(d => d.id === 'human-desk');
    const human = new Agent({ id: HUMAN_ID, name: humanName || 'Sen', color: 0xbe9855 });
    human.setPositionXZ(humanDesk.seat.x, humanDesk.seat.z); human.setRotation(humanDesk.sitRotation);
    human.setSeated(true, { instant: true }); human.setStatus('idle'); root.add(human.root);
    humanDesk.occupiedBy = HUMAN_ID; humanDesk.setAssignment(human);
    const manager = new AgentManager(root, props);
    const boardCanvas = document.createElement('canvas'); boardCanvas.width = 1536; boardCanvas.height = 768;
    const texture = new THREE.CanvasTexture(boardCanvas); texture.colorSpace = THREE.SRGBColorSpace;
    const board = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.6), new THREE.MeshStandardMaterial({ map: texture, roughness: .85, side: THREE.DoubleSide }));
    board.position.set(13.1, 4.5, .34); board.userData.officeBoard = true; root.add(board);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(3.34, 1.74, .1), new THREE.MeshStandardMaterial({ color: '#62755a', roughness: .8 }));
    frame.position.set(13.1, 4.5, .27); root.add(frame);
    const lobby = buildLobby(root, manager.nav), television = buildTelevision(root);
    world = { root, theme, lights, props, mail, birds, deliveries, manager, boardCanvas, texture, board, human, humanDesk, lobby, television, waiting: new Map(), blocked: new Map(), social: null, socialKey: '', busyAnimations: new Set() };
    canvas.dataset.roomSize = `${ROOM.W}x${ROOM.D}`;
    canvas.dataset.privateRoom = JSON.stringify({ ...PRIVATE_ROOM, humanX: human.position.x, humanZ: human.position.z });
    canvas.dataset.lobbySofas = String(props.couches.length);
    canvas.dataset.lobbySeats = String(props.couches.reduce((sum, entry) => sum + entry.couch.seats.length, 0));
    const targets = [...humanQueueSlots(3, manager.nav), ...props.couches.flatMap(entry => entry.couch.seats.map(seat => seat.front))];
    canvas.dataset.layoutRoutes = JSON.stringify(targets.map(point => ({ x: point.x, z: point.z, walkable: manager.nav.walkableAt(point.x, point.z), reachable: (manager.nav.findPath({ x: 3.4, z: 2.4 }, point) || []).length > 0 })));
  }
  function paintBoard() {
    if (!world || !snapshot) return;
    const ctx = world.boardCanvas.getContext('2d');
    ctx.fillStyle = '#f7f8ee'; ctx.fillRect(0, 0, 1536, 768);
    ctx.fillStyle = '#365741'; ctx.font = 'bold 45px sans-serif'; ctx.fillText(snapshot.company.name.slice(0, 35), 45, 70);
    ctx.fillStyle = '#839079'; ctx.font = '24px sans-serif'; ctx.fillText('PAPERCLIP  /  GÖREV TAHTASI', 45, 115);
    const groups = [['BEKLİYOR', ['backlog', 'todo'], '#d5dec5'], ['GELİŞTİRME', ['in_progress'], '#c3d9db'], ['TEST / İNCELEME', ['in_review', 'blocked'], '#e7d4b9'], ['TAMAMLANDI', ['done', 'cancelled'], '#cbdcc1']];
    groups.forEach(([label, states, color], col) => {
      const x = 30 + col * 377, items = snapshot.issues.filter(i => states.includes(i.status));
      ctx.fillStyle = color; ctx.fillRect(x, 155, 355, 565);
      ctx.fillStyle = '#3b5443'; ctx.font = 'bold 23px sans-serif'; ctx.fillText(`${label} · ${items.length}`, x + 15, 195);
      items.slice(0, 4).forEach((item, index) => {
        const y = 215 + index * 113;
        ctx.fillStyle = '#fffef7'; ctx.fillRect(x + 12, y, 330, 99);
        ctx.fillStyle = '#84927d'; ctx.font = '19px sans-serif'; ctx.fillText(item.identifier || '', x + 24, y + 26);
        ctx.fillStyle = '#354b3c'; ctx.font = '22px sans-serif'; ctx.fillText(item.title.slice(0, 24), x + 24, y + 60);
        ctx.fillStyle = '#81917e'; ctx.font = '17px sans-serif'; ctx.fillText((snapshot.agents.find(a => a.id === item.assigneeAgentId)?.name || 'Atanmamış').slice(0, 28), x + 24, y + 84);
      });
    });
    world.texture.needsUpdate = true;
  }
  function restore(id) {
    world?.busyAnimations.delete(id); signatures.delete(id);
    if (world?.waiting.has(id) || world?.blocked.has(id)) return;
    const a = snapshot?.agents.find(a => a.id === id);
    if (a && world.manager.agents.has(id)) world.manager.handleEvent({ type: 'status', id, status: agentState(a, snapshot.issues) });
  }
  function handoff(event) {
    if (world.waiting.has(event.from) || world.blocked.has(event.from)) return;
    const from = world.manager.agents.get(event.from), to = world.manager.agents.get(event.to);
    if (!from || !to || from.leaving || to.leaving) return;
    world.busyAnimations.add(event.from); stopSocial();
    // Local choreography over the pinned upstream controller. It never changes a Paperclip issue.
    const target = () => {
      const anchor = to.desk?.seat || to.agent.position;
      return { x: anchor.x + 2.2, z: anchor.z + .8 };
    };
    world.manager._begin(from, [
      ...world.manager._release(from), carry('letter'), status('walking'), walk(target),
      lookAt(() => to.agent.position), wait(1.4), carry(null),
      act(() => queueMicrotask(() => restore(event.from)))
    ]);
  }
  function queueSlots(count) {
    return humanQueueSlots(count, world.manager.nav);
  }
  function syncBubbles() {
    const items = snapshot.humanQueueEnabled ? snapshot.attention || [] : [];
    const signature = JSON.stringify(items.map(q => [q.id, q.agentId, q.title]));
    if (signature === bubbleSignature) return;
    bubbleSignature = signature; bubbleLayer.replaceChildren(); bubbleGroups.clear();
    items.forEach((q, index) => {
      let group = bubbleGroups.get(q.agentId);
      if (!group) {
        group = document.createElement('div'); group.className = 'question-group'; group.dataset.agentId = q.agentId;
        bubbleGroups.set(q.agentId, group); bubbleLayer.append(group);
      }
      const button = document.createElement('button'); button.type = 'button'; button.className = 'question-bubble';
      const author = snapshot.agents.find(a => a.id === q.agentId)?.name || 'Ekip üyesi';
      button.textContent = String(index + 1); button.title = `${author}: ${q.title}`;
      button.setAttribute('aria-label', `${index + 1}. soru · ${author} · ${q.title}`);
      button.dataset.questionId = q.id;
      button.addEventListener('click', () => notify('office-question', { questionId: q.id }));
      group.append(button);
    });
  }
  const projectedHead = new THREE.Vector3();
  function positionBubbles() {
    let atDesk = 0;
    const waitingPositions = [];
    for (const [id, position] of world.waiting) {
      const rec = world.manager.agents.get(id);
      if (!rec) continue;
      const arrived = Math.hypot(rec.agent.position.x - position.x, rec.agent.position.z - position.z) < .5;
      if (arrived) atDesk++;
      waitingPositions.push({ id, x: rec.agent.position.x, z: rec.agent.position.z, targetX: position.x, targetZ: position.z, arrived });
    }
    world.television.group.localToWorld(projectedHead.copy(world.television.openAnchor)); projectedHead.project(camera);
    const tvOpen = document.getElementById('tv-open');
    tvOpen.style.left = `${(projectedHead.x + 1) * canvas.clientWidth / 2}px`;
    tvOpen.style.top = `${(1 - projectedHead.y) * canvas.clientHeight / 2}px`;
    canvas.dataset.renderScale = String(renderer.getPixelRatio());
    canvas.dataset.atDeskCount = String(atDesk);
    canvas.dataset.queuePositions = JSON.stringify(waitingPositions);
    for (const [id, button] of actorButtons) {
      const actor = world.manager.agents.get(id)?.agent;
      if (!actor) { button.hidden = true; continue; }
      actor.head.getWorldPosition(projectedHead); projectedHead.project(camera);
      button.hidden = Math.abs(projectedHead.x) > 1 || Math.abs(projectedHead.y) > 1 || projectedHead.z < -1 || projectedHead.z > 1;
      button.style.left = `${(projectedHead.x + 1) * canvas.clientWidth / 2}px`;
      button.style.top = `${(1 - projectedHead.y) * canvas.clientHeight / 2}px`;
    }
    canvas.dataset.blockerPositions = JSON.stringify([...world.blocked.values()].map(plan => { const actor = world.manager.agents.get(plan.agentId)?.agent; return { ...plan.position, agentId: plan.agentId, blockerAgentId: plan.blockerAgentId, actualX: actor?.position.x, actualZ: actor?.position.z }; }));
    for (const [id, group] of bubbleGroups) {
      const rec = world.manager.agents.get(id);
      if (!rec || rec.leaving || !world.waiting.has(id)) { group.hidden = true; continue; }
      rec.agent.head.getWorldPosition(projectedHead); projectedHead.y += 1.15; projectedHead.project(camera);
      group.hidden = projectedHead.z < -1 || projectedHead.z > 1 || Math.abs(projectedHead.x) > 1 || Math.abs(projectedHead.y) > 1;
      group.style.left = `${(projectedHead.x + 1) * canvas.clientWidth / 2}px`;
      group.style.top = `${(1 - projectedHead.y) * canvas.clientHeight / 2}px`;
    }
  }
  function syncActorButtons() {
    for (const [id, button] of actorButtons) if (!world.manager.agents.has(id)) { button.remove(); actorButtons.delete(id); }
    for (const [id, rec] of world.manager.agents) {
      if (actorButtons.has(id)) continue;
      const button = document.createElement('button'); button.className = 'agent-hotspot'; button.type = 'button';
      button.setAttribute('aria-label', `${rec.agent.name} ayrıntıları`); button.title = `${rec.agent.name} · Durum ve prompt geçmişi`; button.textContent = 'i';
      button.addEventListener('click', () => notify('office-select', { agentId: id }));
      document.getElementById('agent-hotspots').append(button); actorButtons.set(id, button);
    }
  }
  function waitAtHuman(agentId, position) {
    const rec = world.manager.agents.get(agentId);
    if (!rec || !position) return;
    world.manager._begin(rec, [
      ...world.manager._release(rec), carry('letter'), status('walking'), walk(position),
      lookAt(() => world.human.position), carry(null), status('waiting'), wait(86400)
    ]);
  }
  function blockerPlans(visits) {
    const plans = new Map(), occupied = [];
    const perHost = new Map();
    for (const visit of visits) {
      const host = world.manager.agents.get(visit.blockerAgentId), desk = host?.desk;
      if (!desk || !world.manager.agents.has(visit.agentId)) continue;
      const heading = desk.sitRotation, index = perHost.get(visit.blockerAgentId) || 0;
      perHost.set(visit.blockerAgentId, index + 1);
      const lateral = index === 0 ? 0 : Math.ceil(index / 2) * 1.4 * (index % 2 ? 1 : -1);
      let position = null;
      for (const distance of [3.4, 4.2, 4.8]) {
        for (const side of [lateral, lateral + .7, lateral - .7]) {
          const point = { x: desk.seat.x + Math.sin(heading) * distance + Math.cos(heading) * side, z: desk.seat.z + Math.cos(heading) * distance - Math.sin(heading) * side };
          if (world.manager.nav.walkableAt(point.x, point.z) && occupied.every(p => Math.hypot(p.x - point.x, p.z - point.z) > 1.2)) { position = point; break; }
        }
        if (position) break;
      }
      if (position) { occupied.push(position); plans.set(visit.agentId, { ...visit, position, desk: desk.id }); }
    }
    return plans;
  }
  function waitAtBlocker(plan) {
    const rec = world.manager.agents.get(plan.agentId), host = world.manager.agents.get(plan.blockerAgentId);
    if (!rec || !host?.desk) return;
    world.manager._begin(rec, [...world.manager._release(rec), carry('letter'), status('walking'), walk(plan.position), lookAt(() => host.desk.seat), carry(null), status('waiting'), wait(86400)]);
  }
  function stopSocial() {
    if (world?.social) for (const id of world.social.people.keys()) {
      const agent = world.manager.agents.get(id)?.agent;
      if (agent) { agent.setElevation(0); agent.trunk.rotation.x = 0; agent.head.rotation.x = 0; for (const arm of agent.shoulders) arm.rotation.z = 0; }
    }
    if (world) { world.lobby.bubble.visible = false; world.social = null; world.socialKey = ''; world.pendingSocial = null; canvas.dataset.socialPhase = 'off'; }
  }
  function arrangeSocial(ids) {
    stopSocial(); world.socialKey = ids.join('|');
    if (!ids.length) return;
    if (ids.some(id => world.manager.agents.get(id)?.arriving)) {
      world.pendingSocial = [...ids]; canvas.dataset.socialPhase = 'gathering'; return;
    }
    const social = { ids, people: new Map(), elapsed: 0 };
    world.social = social; canvas.dataset.socialPhase = 'gathering';
    const sofas = world.props.couches.map(entry => entry.couch);
    const seats = Array.from({ length: 3 }, (_, index) => sofas.map(couch => ({ couch, seat: couch.seats[index] }))).flat();
    ids.forEach((id, index) => {
      const rec = world.manager.agents.get(id), allocation = seats[index];
      if (!rec || rec.leaving || !allocation?.seat) return;
      const { couch, seat } = allocation, position = seat.position;
      const participant = { position, couch, seat, ready: false }; social.people.set(id, participant);
      rec.agent.job = ids.length > 1 ? 'Boşta · Lobide sohbet ediyor' : 'Boşta · Lobide mola';
      world.manager._begin(rec, [
        ...world.manager._release(rec),
        act(() => { rec.couchSeat = seat; rec.couch = couch; seat.occupiedBy = id; }),
        carry(null), status('walking'), ...sitDownOn(seat, COUCH_SEAT_HEIGHT),
        status('idle'), act(() => { participant.ready = true; }), wait(86400)
      ]);
    });
  }
  function alignAt(rec, position, dt, face) {
    const actor = rec.agent, dx = position.x - actor.position.x, dz = position.z - actor.position.z;
    if (Math.hypot(dx, dz) <= .15) { if (face) actor.setRotation(Math.atan2(face.x - actor.position.x, face.z - actor.position.z)); return true; }
    const key = `${position.x}:${position.z}`;
    if (rec.officeAlignment?.key !== key) rec.officeAlignment = { key, path: [] };
    const alignment = rec.officeAlignment;
    if (!alignment.path.length) alignment.path = world.manager.nav.findPath(actor.position, position) || [];
    while (alignment.path.length && Math.hypot(alignment.path[0].x - actor.position.x, alignment.path[0].z - actor.position.z) < .04) alignment.path.shift();
    const next = alignment.path[0];
    if (!next) return false;
    const px = next.x - actor.position.x, pz = next.z - actor.position.z;
    const step = Math.min(1, dt * 1.8 / Math.max(Math.hypot(px, pz), .001));
    actor.setPositionXZ(actor.position.x + px * step, actor.position.z + pz * step);
    actor.setRotation(Math.atan2(px, pz)); actor.update(dt, { moving: true });
    return false;
  }
  function tickWaiting(dt) {
    for (const [id, position] of world.waiting) {
      const rec = world.manager.agents.get(id);
      if (rec?.agent.status === 'waiting' && rec.controller.current?.kind === 'wait') alignAt(rec, position, dt, world.human.position);
    }
    for (const [id, plan] of world.blocked) {
      const rec = world.manager.agents.get(id), host = world.manager.agents.get(plan.blockerAgentId);
      if (rec?.agent.status === 'waiting' && rec.controller.current?.kind === 'wait') alignAt(rec, plan.position, dt, host?.desk?.seat);
    }
  }
  function tickSocial(dt) {
    if (world?.pendingSocial) {
      if (world.pendingSocial.every(id => world.manager.agents.has(id) && !world.manager.agents.get(id).arriving)) {
        const ids = world.pendingSocial; world.pendingSocial = null; arrangeSocial(ids);
      }
      return;
    }
    const social = world?.social;
    if (!social || !social.people.size) return;
    const ready = [...social.people.values()].every(p => p.ready);
    let settled = ready;
    for (const [id, participant] of social.people) {
      const actor = world.manager.agents.get(id)?.agent;
      if (!actor?.seated || Math.hypot(actor.position.x - participant.position.x, actor.position.z - participant.position.z) > .15) settled = false;
    }
    const positions = [...social.people].map(([id, p]) => {
      const agent = world.manager.agents.get(id)?.agent;
      return { id, x: agent?.position.x, z: agent?.position.z, targetX: p.position.x, targetZ: p.position.z, ready: p.ready, seated: agent?.seated, sofaId: p.couch.id };
    });
    canvas.dataset.socialPositions = JSON.stringify(positions);
    if (!ready || !settled) { canvas.dataset.socialPhase = 'gathering'; world.lobby.bubble.visible = false; return; }
    social.elapsed += dt;
    const ids = [...social.people.keys()], speaker = ids[Math.floor(social.elapsed / 4) % ids.length];
    canvas.dataset.socialPhase = ids.length > 1 ? 'chatting' : 'on-break';
    canvas.dataset.socialSpeaker = ids.length > 1 ? speaker : '';
    for (const [index, id] of ids.entries()) {
      const agent = world.manager.agents.get(id)?.agent;
      if (!agent) continue;
      const talking = ids.length > 1 && id === speaker;
      agent.head.rotation.x = Math.sin(social.elapsed * (talking ? 4 : 1.4) + index) * (talking ? .08 : .025);
      agent.shoulders[0].rotation.z = talking ? -.3 - Math.sin(social.elapsed * 3.5) * .12 : 0;
      agent.shoulders[0].rotation.x = talking ? -.45 + Math.sin(social.elapsed * 2.6) * .16 : 0;
    }
    world.lobby.bubble.visible = ids.length > 1;
    const actor = world.manager.agents.get(speaker)?.agent;
    if (actor) { actor.head.getWorldPosition(world.lobby.bubble.position); world.lobby.bubble.position.y += 1.5; }
  }
  function apply(next, nextFloor, changes = []) {
    if (!next || next.company.id !== companyId) return;
    const rebuild = !world || nextFloor !== floor;
    snapshot = next; floor = nextFloor;
    if (rebuild) build();
    const floorMembers = snapshot.agents.slice(floor * 5, floor * 5 + 5);
    const floorIds = new Set(floorMembers.map(a => a.id));
    const visits = blockingVisits(snapshot.agents, snapshot.issues, snapshot.humanQueueEnabled ? snapshot.attention || [] : []);
    const visitByAgent = new Map(visits.map(v => [v.agentId, v]));
    const onFloor = floorMembers.filter(a => !visitByAgent.has(a.id) || floorIds.has(visitByAgent.get(a.id).blockerAgentId));
    const queueIds = [...new Set((snapshot.humanQueueEnabled ? snapshot.attention || [] : []).map(item => item.agentId))];
    // Visitors from other floors can join the human desk without moving their actual Paperclip assignments.
    const positions = queueSlots(queueIds.length);
    const guestIds = [...new Set([...queueIds.slice(0, positions.length), ...visits.filter(v => floorIds.has(v.blockerAgentId)).map(v => v.agentId)])];
    const guests = guestIds.map(id => snapshot.agents.find(a => a.id === id)).filter(Boolean);
    const visible = [...onFloor, ...guests.filter(a => !onFloor.some(p => p.id === a.id))], ids = new Set(visible.map(a => a.id));
    const nextWaiting = new Map();
    for (const [index, id] of queueIds.slice(0, positions.length).entries()) nextWaiting.set(id, positions[index]);
    const previousWaiting = world.waiting;
    world.waiting = nextWaiting;
    const idleIds = idlePlayers(visible, snapshot.issues, snapshot.humanQueueEnabled ? snapshot.attention || [] : []).map(a => a.id).filter(id => !world.busyAnimations.has(id) && !visitByAgent.has(id));
    const idleSet = new Set(idleIds);
    for (const id of previousWaiting.keys()) if (!nextWaiting.has(id)) signatures.delete(id);
    for (const id of [...world.manager.agents.keys()]) {
      if (!ids.has(id)) { if (!world.manager.agents.get(id)?.leaving) world.manager.handleEvent({ type: 'exit', id }); signatures.delete(id); }
    }
    for (const [index, a] of visible.entries()) if (!world.manager.agents.has(a.id)) world.manager.handleEvent({ type: 'spawn', id: a.id, name: a.name, color: [0x66826a, 0xb78357, 0x6b8c9b, 0x8d7aa0, 0xb28c64][index % 5] }, source);
    const oldBlocked = world.blocked;
    world.blocked = blockerPlans(visits);
    for (const id of oldBlocked.keys()) if (!world.blocked.has(id)) signatures.delete(id);
    for (let index = 0; index < visible.length; index++) {
      const a = visible[index];
      if (!world.manager.agents.has(a.id)) {
        const color = [0x66826a, 0xb78357, 0x6b8c9b, 0x8d7aa0, 0xb28c64][index % 5];
        world.manager.handleEvent({ type: 'spawn', id: a.id, name: a.name, color }, source);
      }
      const rec = world.manager.agents.get(a.id);
      if (rec.agent.name !== a.name) world.manager.handleEvent({ type: 'rename', id: a.id, name: a.name });
      const job = currentIssue(a.id, snapshot.issues), state = agentState(a, snapshot.issues);
      const waitingAt = nextWaiting.get(a.id), wasAt = previousWaiting.get(a.id);
      if (waitingAt) {
        world.busyAnimations.delete(a.id);
        rec.agent.job = 'Yanıtını bekliyor';
        if (!wasAt || waitingAt.x !== wasAt.x || waitingAt.z !== wasAt.z) waitAtHuman(a.id, waitingAt);
        continue;
      }
      const plan = world.blocked.get(a.id), oldPlan = oldBlocked.get(a.id);
      if (plan) {
        world.busyAnimations.delete(a.id); rec.agent.job = `${snapshot.agents.find(p => p.id === plan.blockerAgentId)?.name || 'Ajan'} bekleniyor · ${plan.blockerIdentifier || ''}`;
        if (!oldPlan || oldPlan.blockerAgentId !== plan.blockerAgentId || oldPlan.position.x !== plan.position.x || oldPlan.position.z !== plan.position.z) waitAtBlocker(plan);
        continue;
      }
      if (world.busyAnimations.has(a.id)) {
        if (state === 'idle') continue;
        world.busyAnimations.delete(a.id);
      }
      if (idleSet.has(a.id)) { signatures.delete(a.id); continue; }
      if (world.social?.people.has(a.id)) { rec.agent.setElevation(0); rec.agent.trunk.rotation.x = 0; }
      const signature = `${state}:${job?.id || ''}:${job?.title || ''}`;
      if (signatures.get(a.id) !== signature) {
        if (job) world.manager.handleEvent({ type: 'job', id: a.id, job: `${job.identifier} · ${job.title}` });
        else rec.agent.job = null;
        world.manager.handleEvent({ type: 'status', id: a.id, status: state });
        signatures.set(a.id, signature);
      }
    }
    if (world.socialKey !== idleIds.join('|')) arrangeSocial(idleIds);
    canvas.dataset.socialCount = String(idleIds.length);
    canvas.dataset.socialAgents = idleIds.join(',');
    document.getElementById('social-status').textContent = `LOBİ · ${idleIds.length} ajan boşta`;
    for (const event of changes) {
      if (event.kind === 'handoff') handoff(event);
      if (event.kind === 'complete' && world.manager.agents.has(event.from) && !world.waiting.has(event.from) && !world.blocked.has(event.from)) {
        world.busyAnimations.add(event.from); stopSocial();
        world.manager.handleEvent({ type: 'dispatch', id: event.from, summary: event.issue.title });
        world.manager.agents.get(event.from)?.controller.push([act(() => queueMicrotask(() => restore(event.from)))]);
      }
    }
    paintBoard();
    syncBubbles();
    hint.textContent = `${snapshot.company.name} · Kat ${floor + 1} · ${onFloor.length} / ${snapshot.agents.length} ajan`;
    document.getElementById('human-status').textContent = snapshot.humanQueueEnabled ? `Senin odan · ${queueIds.length} kişi bekliyor${queueIds.length > positions.length ? ` · İlk ${positions.length} kişi ofiste` : ''}` : 'Senin odan';
    canvas.dataset.waitingCount = String(queueIds.length);
    canvas.dataset.waitingAgents = [...nextWaiting.keys()].join(',');
    canvas.dataset.blockedVisits = JSON.stringify([...world.blocked.values()].map(p => ({ agentId: p.agentId, blockerAgentId: p.blockerAgentId, desk: p.desk, x: p.position.x, z: p.position.z })));
    syncActorButtons();
    canvas.dataset.humanSeated = 'true';
    canvas.setAttribute('aria-label', `Üç boyutlu ofis. ${humanName} masasında oturuyor. ${snapshot.humanQueueEnabled ? `${queueIds.length} kişi yanıt bekliyor.` : 'Soru bekleme sırası kapalı.'}`);
  }
  window.addEventListener('message', event => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.companyId !== companyId) return;
    try {
      const m = event.data;
      if (m.type === 'office-snapshot') { if (m.humanName) humanName = m.humanName; apply(m.snapshot, m.floor || 0, m.changes || []); }
      if (m.type === 'office-human-name') { humanName = m.name || 'Sen'; world?.human.setName(humanName); if (world) world.humanDesk.setAssignment(world.human); }
      if (m.type === 'office-light') evening = !evening;
      if (m.type === 'office-lobby') { const delta = new THREE.Vector3(LOBBY.x, controls.target.y, LOBBY.z).sub(controls.target); controls.target.add(delta); camera.position.add(delta); }
      if (m.type === 'office-reset') { camera.position.copy(defaultPosition); controls.target.copy(defaultTarget); controls.update(); fit(); }
      if (m.type === 'office-focus') {
        selected = m.agentId;
        const person = selected === HUMAN_ID ? world?.human : world?.manager.agents.get(selected)?.agent;
        if (person) { const delta = new THREE.Vector3().subVectors(person.position, controls.target); delta.y = 0; controls.target.add(delta); camera.position.add(delta); }
      }
    } catch (error) { report(error); }
  });
  document.getElementById('tv-open').addEventListener('click', () => notify('office-tv'));
  let down = null;
  canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointerup', e => {
    if (!world || !down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return;
    const rect = canvas.getBoundingClientRect(); pointer.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
    ray.setFromCamera(pointer, camera);
    for (const hit of ray.intersectObjects(world.root.children, true)) {
      if (hit.object.userData.officeTV) { notify('office-tv'); break; }
      if (hit.object.userData.officeBoard) { notify('office-board'); break; }
      const id = world.manager.agentIdFromObject(hit.object);
      if (id) { selected = id; notify(id === HUMAN_ID ? 'office-human' : 'office-select', { agentId: id }); break; }
    }
  });
  let previous = performance.now();
  function animate(now) {
    const dt = Math.min((now - previous) / 1000, .05); previous = now;
    if (world && !document.hidden) {
      world.manager.update(dt);
      world.human.update(dt);
      tickWaiting(dt); tickSocial(dt);
      if (snapshot) updateTelevision(world.television, snapshot, dt, canvas);
      for (const desk of world.props.desks) desk.update(dt);
      world.props.mailbox?.update(dt); world.props.door?.update(dt);
      for (const s of stationsOfKind('printer')) world.props.byStation[s.id]?.update?.(dt);
      for (const shelf of world.props.bookshelves) shelf.globe?.update(dt);
      for (const t of world.props.telescopes || []) t.scope?.update(dt);
      world.mail.update(dt); world.birds.update(dt); world.deliveries.update(dt);
      const sun = applyTimeOfDay(world.lights, evening ? 19 : 11, world.theme, scene);
      applyNightLights(world.props.nightLights, sun.lampOn);
      world.props.wallClock?.setTime?.(new Date());
    }
    controls.update(); clampPan(camera, controls); renderer.render(scene, camera);
    if (world) positionBubbles();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  ready = true; notify('office-ready');
} catch (error) { report(error); }
