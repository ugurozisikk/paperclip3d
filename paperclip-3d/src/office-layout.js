import { DESKS, FURNITURE, FURNITURE_KINDS, DECOR, STATIONS, resetLayout, addDesk, addFurniture, addPlant, reviseLayout } from './roving/src/layout.js';

export const LOBBY = { x: 36, z: 22, sofaZ: [18.7, 25.3] };
export const PRIVATE_ROOM = { left: 29.5, right: 43.5, back: .5, front: 13, doorStart: 7, doorEnd: 11, desk: { x: 36, z: 4.5 } };
// These footprints are used by both the visible partitions and the navigation grid.
export const EXTRA_OBSTACLES = [
  [29.3, .3, 29.7, 7], [29.3, 11, 29.7, 13.2], [29.3, 12.8, 43.7, 13.2],
  [43.3, .3, 43.7, 13.2], [34.7, 21.25, 37.3, 22.75],
  [13.8, 28, 19.6, 29.2],
];
export function configureOfficeLayout() {
  resetLayout();
  const workstations = [[10, 7.5, Math.PI], [22, 7.5, Math.PI], [7.5, 18, 0], [17, 18, 0], [25, 22, 0]];
  DESKS.forEach((desk, i) => { const [x, z, facing] = workstations[i]; Object.assign(desk, { x, z, facing }); });
  addDesk({ id: 'human-desk', ...PRIVATE_ROOM.desk, facing: Math.PI });
  Object.assign(STATIONS.inbox, { x: 8, z: 27 });
  Object.assign(STATIONS.bin, { x: 26, z: 1 });
  Object.assign(STATIONS.printer, { x: 23, z: 1 });
  const plants = [[9.5, 1.6], [41.5, 3], [41.5, 11], [1.8, 24.5], [1.5, 6.6]];
  DECOR.plants.forEach((plant, i) => { if (plants[i]) [plant.x, plant.z] = plants[i]; });
  addPlant('fig', { id: 'decor-fig', x: 12.3, z: 28.5, scale: 1.15 });
  addPlant('snake', { id: 'decor-snake', x: 21.1, z: 28.5, scale: 1.35 });
  // Two opposing three-seater sofas: enough distinct cushions for a whole five-agent floor.
  FURNITURE.splice(0);
  FURNITURE_KINDS.couch.hw = 3.2;
  FURNITURE_KINDS.couch.seatOffsets = [-2, 0, 2].map(x => ({ x, z: -.05 }));
  addFurniture('couch', { id: 'lobby-north', x: LOBBY.x, z: LOBBY.sofaZ[0], facing: 0 });
  addFurniture('couch', { id: 'lobby-south', x: LOBBY.x, z: LOBBY.sofaZ[1], facing: Math.PI });
  addFurniture('floorLamp', { id: 'lobby-lamp', x: 41, z: 24 });
  reviseLayout();
}

export function humanQueueSlots(count, nav) {
  const slots = [], candidates = [{ x: 36, z: 8.2 }, { x: 33.5, z: 9 }, { x: 31, z: 9 }];
  for (let row = 0; row < 9; row++) for (const x of [27, 24.8]) candidates.push({ x, z: 9.3 + row * 1.9 });
  for (const point of candidates) {
    if (slots.length >= count) break;
    if (nav.walkableAt(point.x, point.z) && slots.every(p => Math.hypot(p.x - point.x, p.z - point.z) > 1.5)) slots.push(point);
  }
  return slots;
}
