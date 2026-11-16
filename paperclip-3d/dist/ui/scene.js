/*! Contains The Roving Office, Copyright (c) 2026 Atlassian US., Inc., Apache-2.0. Modified for Paperclip 3D Ofis: company-scoped scene integration, live task board, handoff choreography, floors, personal human desk, question bubbles, seated lobby conversations, private office, decor, panoramic task TV and controls; excluded vendor brand artwork removed. See roving/LICENSE, roving/NOTICE and package NOTICE. */

// dist/ui/scene.entry.js
import * as THREE42 from "three";

// dist/ui/roving/src/scene/renderer.js
import * as THREE from "three";
function createRenderer({ canvas: canvas2, transparent = false, pixelRatio } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas: canvas2, antialias: true, alpha: transparent });
  if (transparent) renderer.setClearColor(0, 0);
  renderer.setPixelRatio(pixelRatio ?? Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  return renderer;
}

// dist/ui/roving/src/scene/camera.js
import * as THREE2 from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// dist/ui/roving/src/config.js
var BASE_COLORS = {
  wallSage: 10467227,
  wallWhite: 15394781,
  baseboard: 15921126,
  floorWood: 13082472,
  floorWoodAlt: 12226649,
  // Alternative floor finishes, selected by the theme's `floor.kind`.
  floorConcrete: 10264223,
  floorConcreteAlt: 9737882,
  floorSeam: 8356485,
  floorCarpet: 9274743,
  floorCarpetAlt: 8682607,
  rugSage: 11125926,
  woodDark: 7293745,
  woodMid: 9067064,
  frame: 5913897,
  glass: 10470614,
  terracotta: 12545868,
  couch: 13599592,
  leaf: 7315050,
  leafDark: 5208652,
  grass: 8366187,
  pot: 12611919,
  // Houseplants. Held apart from `leaf`/`leafDark` above, which every season
  // repaints for the street outside — amber in autumn, blossom in spring. Most of
  // the office's planting is evergreen and uses these, so the room reads green in
  // every month; the plants that do turn with the season are the ones standing on
  // the open edges and in the window bay, and the troughs on the sills, which ask
  // for the seasonal pair instead (see scene/plants.js).
  houseLeaf: 6132067,
  houseLeafDark: 4288846,
  houseLeafLight: 8828015,
  cactusGreen: 8232554,
  cactusDark: 6455642,
  soil: 3812127,
  bloomWarm: 14983484,
  // cactus flower, violet heads
  bloomCool: 12614072,
  metalDark: 2830134,
  paper: 16052712,
  mailbox: 4156298,
  // Cardboard, shared so the parcel an agent carries, the pile beside the mailbox
  // and the one a courier throws are all visibly the same box. Three places wanted
  // these numbers and two of them had them written out by hand.
  parcel: 12557162,
  parcelTape: 14271386,
  // Brown for the courier's uniform. Deliberately darker than the cardboard, or
  // driver and delivery merge into one brown smudge at this camera distance.
  courier: 7031343,
  sky: 12375005,
  // Exterior
  road: 7304056,
  roadLine: 15262930,
  sidewalk: 11973288,
  curb: 10196877,
  buildingA: 10120018,
  buildingB: 9080726,
  buildingC: 11047036,
  buildingD: 7306628,
  windowLit: 16769192,
  // `windowDark` was declared twice in this table — 0x3e4a55 here and 0x2c3a44
  // in the storeys section below — and a later key silently wins, so 0x2c3a44 has
  // always been the value everything renders with. The shadowed one is removed
  // rather than restored: bringing 0x3e4a55 back would visibly relight every
  // unlit window, which is a look change and not a lint fix.
  // Aeron chair
  aeronFrame: 1974566,
  aeronMesh: 3949129,
  aeronGraphite: 3356477,
  // Water cooler
  coolerBody: 15330286,
  coolerWater: 9423326,
  // Printer
  printerBody: 15001322,
  // off-white shell, a shade cooler than the water cooler's
  printerPanel: 3093562,
  // control panel, the lid seam, the mouth of the output tray
  printerTrim: 10133670,
  // plinth, tray handles, the paper shelf
  // Winter dressing (only used by snowy exteriors).
  snow: 15922936,
  snowShade: 14674158,
  // The roof, for the buildings that have one over their two standing walls (see
  // scene/building.js). Timber by default, because the first roof was a chalet's;
  // a theme with a different one — zinc, say — overrides these two.
  roofPlane: 8017463,
  roofTrim: 6045480,
  chimneyPot: 11691071,
  branchBare: 7035467,
  evergreen: 4156239,
  evergreenDark: 3102016,
  // High-rise dressing (rooftops seen from an upper floor).
  roofDeck: 9341830,
  roofUnit: 11052448,
  roofTar: 7170662,
  haze: 13228258,
  // Autumn foliage and leaf litter.
  autumnLeaf: 14254884,
  autumnLeafAlt: 11883551,
  autumnLeafDeep: 9190166,
  autumnLitter: 12481587,
  // Structure of the storeys visible below this floor.
  slabEdge: 14078664,
  // exposed concrete floor-slab edge
  facadeLower: 12170150,
  // spandrel / wall panel of the level below
  windowDark: 2898500,
  // unlit glazing on a lower level
  windowFrame: 5858156,
  // steel window surrounds and glazing bars
  shutter: 8291465,
  // roller shutter / loading door leaf
  shutterRib: 6975606,
  // the slat lines across it
  mullion: 12173252,
  // anodised aluminium curtain-wall mullion
  spandrel: 3752780,
  // dark spandrel panel at each floor line
  brickPier: 9262400,
  // pilasters between arcade bays
  brickShade: 9064504,
  // recessed bay panel behind an arch
  baseCourse: 9408917,
  // painted plinth band along the pavement
  signPaint: 14275526
  // weathered painted signage on brick
};
var COLORS = { ...BASE_COLORS };
function applyPalette(overrides = {}) {
  for (const key of Object.keys(COLORS)) delete COLORS[key];
  Object.assign(COLORS, BASE_COLORS, overrides);
  return COLORS;
}
var STATUS_GROUPS = [
  {
    key: "idle",
    label: "Idle",
    color: 10133929,
    statuses: [
      // `bare` marks a family's plain case: the one its heading already names, so
      // it is counted under "Idle" and given no row of its own. A row reading
      // "idle · nothing on" was the label saying the same thing twice.
      { key: "idle", label: "nothing on", color: 10133929, bare: true },
      { key: "resting", label: "resting", color: 7898255 },
      // `alone` is the word for a panel that shows the status by itself, where the
      // family heading is not there to lean on: a legend row under "Idle" reads
      // "drink" perfectly well, and a roster row reading "Drink" does not. Only
      // this one needs it — everywhere else the legend's word capitalises into a
      // sentence about a person unchanged, which is what keeps the two panels
      // saying the same word for the same dot.
      { key: "drinking", label: "drink", color: 12765647, alone: "Getting a drink" }
    ]
  },
  {
    key: "working",
    label: "Working",
    color: 5878639,
    statuses: [
      { key: "working", label: "writing", color: 5878639 },
      { key: "researching", label: "researching", color: 4169614 },
      { key: "waiting", label: "waiting", color: 10469214 }
    ]
  },
  {
    key: "delivering",
    label: "Delivering",
    color: 11831776,
    statuses: [
      { key: "delivering", label: "success", color: 11831776 },
      { key: "error", label: "error", color: 14706535 }
    ]
  },
  {
    key: "moving",
    label: "Moving",
    color: 7320032,
    statuses: [
      { key: "walking", label: "walking", color: 7320032 },
      { key: "dancing", label: "dancing", color: 4622572 }
    ]
  }
];
var STATUS_LIST = STATUS_GROUPS.flatMap((g) => g.statuses.map((s) => s.key));
var STATUS_COLORS = Object.fromEntries(
  STATUS_GROUPS.flatMap((g) => g.statuses.map((s) => [s.key, s.color]))
);
var STATUS_INDEX = new Map(
  STATUS_GROUPS.flatMap((g) => g.statuses.map((s) => [s.key, { group: g, status: s }]))
);
var SOFA_COLORS = {
  terracotta: { label: "Terracotta", hex: 13599592, accent: 10466248 },
  moss: { label: "Moss", hex: 8360040, accent: 14263361 },
  navy: { label: "Navy", hex: 5071232, accent: 14258026 },
  mustard: { label: "Mustard", hex: 13214282, accent: 6258566 },
  charcoal: { label: "Charcoal", hex: 5922662, accent: 13208156 },
  blush: { label: "Blush", hex: 13208467, accent: 8362630 }
};
var RUG_COLORS = {
  sage: { label: "Sage", hex: 11125926 },
  clay: { label: "Clay", hex: 12618350 },
  sand: { label: "Sand", hex: 13877402 },
  slate: { label: "Slate", hex: 9279910 },
  plum: { label: "Plum", hex: 10257049 },
  ink: { label: "Ink", hex: 6253173 }
};
var ROOM = {
  W: 44,
  D: 30,
  H: 8,
  wallT: 0.4
};
var DOOR = {
  x: 3.4,
  // centre along the back wall
  width: 2.8,
  height: 5,
  inside: { x: 3.4, z: 2.4 },
  // interior staging point just inside
  outside: { x: 3.4, z: -2.2 },
  // on the entrance stoop (spawn / despawn)
  stoopDepth: 3
  // stoop reaches from the wall out to z = -3.0
};
var WINDOW_SILL_Y = 2.2;
var WINDOW_HEAD_Y = ROOM.H - 1.2;
var WINDOW_FRAME_T = 0.28;
var WINDOW_LEDGE_Y = WINDOW_SILL_Y + WINDOW_FRAME_T / 2;
var WINDOW_LIGHTS = { cols: 3, rows: 2, barT: 0.1, barD: 0.3 };
var WINDOW_FRAME_D = 0.5;
function windowLight(wall, index = 0, col = 0, row = 0) {
  const span = windowSpan(wall, index);
  if (!span) return null;
  const { cols, rows, barT } = WINDOW_LIGHTS;
  if (col < 0 || col >= cols || row < 0 || row >= rows) return null;
  const cellW = span.width / cols;
  const cellH = (WINDOW_HEAD_Y - WINDOW_SILL_Y) / rows;
  const edge = (i, n) => i === 0 || i === n ? WINDOW_FRAME_T / 2 : barT / 2;
  const from = span.from + cellW * col + edge(col, cols);
  const to = span.from + cellW * (col + 1) - edge(col + 1, cols);
  const y0 = WINDOW_SILL_Y + cellH * row + edge(row, rows);
  const y1 = WINDOW_SILL_Y + cellH * (row + 1) - edge(row + 1, rows);
  return {
    axis: span.axis,
    from,
    to,
    centre: (from + to) / 2,
    y0,
    y1,
    midY: (y0 + y1) / 2,
    width: to - from,
    height: y1 - y0
  };
}
var WINDOWS = {
  back: [
    { center: 0.33, width: 6 },
    // x  5.58 .. 11.58
    { center: 0.7, width: 6.5 }
    // x 14.95 .. 21.45
  ],
  left: [
    { center: 0.62, width: 6.5 }
    // z  4.35 .. 10.85 (mirrored: see below)
  ]
};
function windowSpan(wall, index = 0) {
  const win = WINDOWS[wall]?.[index];
  if (!win) return null;
  const len = wall === "back" ? ROOM.W : ROOM.D;
  const centre = wall === "back" ? win.center * len : (1 - win.center) * len;
  return {
    axis: wall === "back" ? "x" : "z",
    centre,
    width: win.width,
    from: centre - win.width / 2,
    to: centre + win.width / 2
  };
}
var STREET_Y = -1.3;
var FLOOR_THICKNESS = 0.2;
var FLOOR_TOP = FLOOR_THICKNESS / 2;
var CAMERA = {
  frustum: 22,
  position: [48, 42, 47],
  target: [22, 1.5, 15],
  minZoom: 0.7,
  maxZoom: 8,
  // close enough to inspect one desk and its materials
  allowRotate: true,
  // Vertical tilt limits (radians from straight down).
  minPolarAngle: Math.PI * 0.16,
  maxPolarAngle: Math.PI * 0.44,
  // How far the camera may swing left/right of its default heading.
  azimuthRange: Math.PI * 0.28,
  // ctrl/⌘/shift + drag pans across the ground plane, clamped to this box so
  // the office can't be pushed off screen.
  panBounds: { minX: -6, maxX: ROOM.W + 6, minZ: -6, maxZ: ROOM.D + 6 }
};
var FPV = {
  // Wide enough to read as a head rather than a telescope. 72 was the first guess
  // and it was too tight: at desk distance a narrow lens crops to a monitor and a
  // patch of desk, which reads as zoomed-in rather than as standing there. 85 takes
  // in the desk, its neighbours and the room behind — still short of the 90-plus
  // where the barrel distortion starts announcing itself at the edges.
  fov: 85,
  // The eye sits a hair in front of the face, so the near plane does not have to
  // do the work of hiding the agent's own head — but keep it tight anyway, since
  // a desk edge two near-planes away should not vanish when they lean in.
  near: 0.1,
  far: 400,
  // Offsets from the centre of the head box (0.62 on a side, so its face is at
  // 0.31). Deliberately *inside* the head rather than just in front of it: an eye
  // parked ahead of the face pokes through anything the agent stands close to, and
  // they stand very close to desks and bookshelves. From within, the body's own faces
  // are back-facing and culled, and the agent's own name tag is dropped by the
  // proximity fade below — but the hair is not, which is why the head is hidden
  // outright while ridden. See Agent.setHeadVisible.
  eyeForward: 0.12,
  eyeUp: 0.1,
  // A few degrees below level, which is where a person walking somewhere actually
  // looks: at the floor ahead, not the horizon. The agents are also tall next to
  // their furniture — eyes at 2.3, desks at 1.1 — so a little down puts the desk in
  // the frame. Negative tilts down; 0 is dead level.
  //
  // This was briefly -16, to duck a black band across the top of every shot that I
  // had put down to an unlit ceiling slab. It was the agent's own hair, a tenth of a
  // unit from the eye (see Agent.setHeadVisible). Hiding the head removed it at every
  // angle, so the tilt no longer has to pay for it and is back to being about where
  // people look. Worth remembering that a wider `fov` opens upward as well as down.
  pitchDeg: -7,
  // The walk cycle already bobs the body 0.07, which is the whole charm of the
  // view; this only takes the edge off the sharpest turns. Higher is snappier.
  smoothing: 18,
  // Name tags fade out as their owner gets close. Depth-testing them (see
  // `Agent.setTagMode`) stops them punching through furniture, but nothing stops a
  // label two feet from your face filling the frame — a perspective camera makes it
  // enormous however small it is in world units. Someone that close is legible as a
  // person anyway; the label is what is in the way. Invisible at or below `near`,
  // fully drawn at or beyond `far`, ramped between.
  tagFadeNear: 1.5,
  tagFadeFar: 3.2
};

// dist/ui/roving/src/local-store.js
function shelfFor(storage) {
  if (storage !== void 0) return storage;
  try {
    return globalThis.window?.localStorage ?? null;
  } catch {
    return null;
  }
}
function writeText(key, value, storage) {
  try {
    const shelf = shelfFor(storage);
    if (!shelf) return false;
    shelf.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
function readJson(key, fallback = null, storage) {
  try {
    const raw = shelfFor(storage)?.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key, value, storage) {
  try {
    return writeText(key, JSON.stringify(value), storage);
  } catch {
    return false;
  }
}

// dist/ui/roving/src/scene/camera-view.js
var KEY = "roving-office.camera.v1";
function vector(value) {
  if (!Array.isArray(value) || value.length !== 3 || !value.every(Number.isFinite)) return null;
  return value;
}
function loadCameraView(storage) {
  const parsed = readJson(KEY, null, storage);
  const position = vector(parsed?.position);
  const target = vector(parsed?.target);
  const zoom = parsed?.zoom;
  if (!position || !target || !Number.isFinite(zoom) || zoom <= 0) return null;
  return { position, target, zoom };
}
function saveCameraView(camera, controls, storage) {
  const view = {
    position: [camera.position.x, camera.position.y, camera.position.z],
    target: [controls.target.x, controls.target.y, controls.target.z],
    zoom: camera.zoom
  };
  if (!vector(view.position) || !vector(view.target) || !Number.isFinite(view.zoom) || view.zoom <= 0) return false;
  return writeJson(KEY, view, storage);
}
function restoreCameraView(camera, controls, storage) {
  const view = loadCameraView(storage);
  if (!view) return false;
  camera.position.set(...view.position);
  controls.target.set(...view.target);
  camera.zoom = Math.max(controls.minZoom, Math.min(controls.maxZoom, view.zoom));
  camera.updateProjectionMatrix();
  return true;
}

// dist/ui/roving/src/scene/camera-depth.js
function ensureOrbitDepth(camera, target) {
  let dx = camera.position.x - target.x;
  let dy = camera.position.y - target.y;
  let dz = camera.position.z - target.z;
  let distance = Math.hypot(dx, dy, dz);
  if (distance < 1e-6) {
    [dx, dy, dz] = CAMERA.position.map((n, i) => n - CAMERA.target[i]);
    distance = Math.hypot(dx, dy, dz);
  }
  const minimum = CAMERA.frustum / CAMERA.minZoom * Math.tan(CAMERA.maxPolarAngle) + 64;
  const radius = Math.max(distance, minimum);
  camera.position.set(
    target.x + dx * radius / distance,
    target.y + dy * radius / distance,
    target.z + dz * radius / distance
  );
  camera.far = radius + 400;
  camera.updateProjectionMatrix();
}

// dist/ui/roving/src/scene/camera.js
function createCamera(aspect) {
  const f = CAMERA.frustum;
  const cam = new THREE2.OrthographicCamera(
    -f * aspect,
    f * aspect,
    f,
    -f,
    0.1,
    400
  );
  cam.position.set(...CAMERA.position);
  const target = new THREE2.Vector3(...CAMERA.target);
  ensureOrbitDepth(cam, target);
  cam.lookAt(target);
  return cam;
}
function updateCameraAspect(cam, aspect) {
  const f = CAMERA.frustum;
  cam.left = -f * aspect;
  cam.right = f * aspect;
  cam.top = f;
  cam.bottom = -f;
  cam.updateProjectionMatrix();
}
function createControls(cam, domElement) {
  const controls = new OrbitControls(cam, domElement);
  controls.target.set(...CAMERA.target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableRotate = CAMERA.allowRotate;
  controls.rotateSpeed = 0.55;
  controls.enablePan = true;
  controls.screenSpacePanning = false;
  controls.panSpeed = 1;
  controls.minPolarAngle = CAMERA.minPolarAngle;
  controls.maxPolarAngle = CAMERA.maxPolarAngle;
  const [px, , pz] = CAMERA.position;
  const [tx, , tz] = CAMERA.target;
  const defaultAzimuth = Math.atan2(px - tx, pz - tz);
  controls.minAzimuthAngle = defaultAzimuth - CAMERA.azimuthRange;
  controls.maxAzimuthAngle = defaultAzimuth + CAMERA.azimuthRange;
  controls.enableZoom = true;
  controls.minZoom = CAMERA.minZoom;
  controls.maxZoom = CAMERA.maxZoom;
  const restored = restoreCameraView(cam, controls);
  controls.update();
  clampPan(cam, controls);
  ensureOrbitDepth(cam, controls.target);
  controls.update();
  if (restored) saveCameraView(cam, controls);
  controls.addEventListener("change", () => saveCameraView(cam, controls));
  return controls;
}
function clampPan(camera, controls) {
  const b = CAMERA.panBounds;
  const t = controls.target;
  const cx = Math.min(b.maxX, Math.max(b.minX, t.x));
  const cz = Math.min(b.maxZ, Math.max(b.minZ, t.z));
  const cy = Math.min(CAMERA.target[1] + 4, Math.max(CAMERA.target[1] - 4, t.y));
  if (cx !== t.x || cz !== t.z || cy !== t.y) {
    const dx = cx - t.x, dy = cy - t.y, dz = cz - t.z;
    t.set(cx, cy, cz);
    camera.position.x += dx;
    camera.position.y += dy;
    camera.position.z += dz;
  }
}
var PITCH_RISE = Math.tan(FPV.pitchDeg * Math.PI / 180);
var _eye = new THREE2.Vector3();
var _forward = new THREE2.Vector3();
var _look = new THREE2.Vector3();
var _smoothed = new THREE2.Vector3();

// dist/ui/roving/src/scene/lighting.js
import * as THREE3 from "three";

// dist/ui/roving/src/measure.js
var clamp01 = (v) => Math.min(1, Math.max(0, v));

// dist/ui/roving/src/ease.js
var lerp = (a, b, t) => a + (b - a) * t;
var smoothstep = (t) => {
  const k = clamp01(t);
  return k * k * (3 - 2 * k);
};
var easeOut = (t) => {
  const k = clamp01(t);
  return 1 - (1 - k) * (1 - k);
};

// dist/ui/roving/src/scene/lighting.js
var SUN_DISTANCE = 46;
var SUNRISE = 6;
var SUNSET = 20;
var NOON_AZIMUTH = Math.PI * 0.47;
var DAY_ARC = Math.PI;
var AXIAL_TILT = 23.44;
var NORTH_AZIMUTH = NOON_AZIMUTH + Math.PI;
var NIGHT_ELEVATION = 0.55;
var SUN_NOON = { r: 1, g: 0.96, b: 0.89 };
var SUN_LOW = { r: 1, g: 0.72, b: 0.44 };
var SUN_NIGHT = { r: 0.62, g: 0.72, b: 1 };
var SKY_NIGHT = 1186342;
var SKY_TWILIGHT = 14260844;
var NIGHT_SUN_INTENSITY = 0.14;
var NIGHT_HEMI_SCALE = 0.68;
var NIGHT_HEMI_SKY = 8558256;
var NIGHT_HEMI_GROUND = 5858677;
var LAMP_ON_FROM = 0.72;
var RAD = Math.PI / 180;
function createReflectionEnvironment(renderer) {
  const studio = new THREE3.Scene();
  studio.background = new THREE3.Color(10399680);
  const panels = [
    { size: [14, 10], position: [0, 9, 0], colour: [2.8, 2.7, 2.5] },
    { size: [8, 6], position: [7, 3, 4], colour: [3.8, 3.3, 2.6] },
    { size: [6, 8], position: [-7, 2, -3], colour: [1.8, 2.3, 3.1] },
    { size: [20, 20], position: [0, -6, 0], colour: [0.22, 0.16, 0.11] }
  ];
  for (const { size, position, colour } of panels) {
    const material = new THREE3.MeshBasicMaterial({ side: THREE3.DoubleSide });
    material.color.setRGB(...colour);
    const panel = new THREE3.Mesh(new THREE3.PlaneGeometry(...size), material);
    panel.position.set(...position);
    panel.lookAt(0, 0, 0);
    studio.add(panel);
  }
  const generator = new THREE3.PMREMGenerator(renderer);
  const target = generator.fromScene(studio, 0.06, 0.1, 30);
  generator.dispose();
  for (const panel of studio.children) {
    panel.geometry.dispose();
    panel.material.dispose();
  }
  return target;
}
function lerpRGB(a, b, t) {
  return { r: lerp(a.r, b.r, t), g: lerp(a.g, b.g, t), b: lerp(a.b, b.b, t) };
}
function lerpHex(a, b, t) {
  const mix = (shift2) => Math.round(lerp(a >> shift2 & 255, b >> shift2 & 255, t)) & 255;
  return mix(16) << 16 | mix(8) << 8 | mix(0);
}
function addLighting(scene, lightSpec) {
  const defaults = {
    hemi: { sky: 14674415, ground: 11569754, intensity: 1.1 },
    fill: { color: 16773597, intensity: 0.65, position: [20, 12, 18] }
  };
  const hemiSpec = lightSpec?.hemi ?? defaults.hemi;
  const fillSpec = lightSpec?.fill ?? defaults.fill;
  const hemi = new THREE3.HemisphereLight(hemiSpec.sky, hemiSpec.ground, hemiSpec.intensity);
  scene.add(hemi);
  const sun = new THREE3.DirectionalLight(16770749, 1.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const s = 34;
  sun.shadow.camera.left = -s;
  sun.shadow.camera.right = s;
  sun.shadow.camera.top = s;
  sun.shadow.camera.bottom = -s;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = SUN_DISTANCE * 2.6;
  sun.shadow.bias = -4e-4;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 3;
  sun.shadow.blurSamples = 8;
  sun.target.position.set(ROOM.W * 0.5, 0, ROOM.D * 0.5);
  scene.add(sun);
  scene.add(sun.target);
  const fill = new THREE3.DirectionalLight(fillSpec.color, fillSpec.intensity);
  fill.position.set(...fillSpec.position);
  scene.add(fill);
  return {
    hemi,
    sun,
    fill,
    // Kept so applyTimeOfDay can scale *against the theme's own values* rather
    // than against whatever it last wrote.
    base: { hemi: { ...hemiSpec }, fill: { ...fillSpec } }
  };
}
function declinationFor(sunTilt, lat) {
  return AXIAL_TILT * sunTilt * (lat >= 0 ? 1 : -1);
}
function solarPath(hours, { lat, declination, bearing }) {
  const phi = lat * RAD;
  const dec = declination * RAD;
  const H = (hours - 12) * 15 * RAD;
  const sinAlt = Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H);
  const elevation = Math.asin(Math.min(1, Math.max(-1, sinAlt)));
  const fromSouth = Math.atan2(
    Math.sin(H),
    Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi)
  );
  const compass = fromSouth + Math.PI;
  const sinNoon = Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec);
  const arch = sinNoon > 0 ? clamp01(sinAlt / sinNoon) : 0;
  return {
    elevation,
    // Opposite handedness, hence minus: see NORTH_AZIMUTH.
    azimuth: NORTH_AZIMUTH - compass + bearing,
    arch,
    isDay: elevation > 0
  };
}
function authoredPath(hours, { peakElevation, bearing }) {
  const u = (hours - SUNRISE) / (SUNSET - SUNRISE);
  const isDay = u >= 0 && u <= 1;
  const arch = isDay ? Math.sin(Math.PI * u) : 0;
  return {
    elevation: isDay ? Math.max(0.04, arch * peakElevation) : NIGHT_ELEVATION,
    azimuth: NOON_AZIMUTH + bearing + (clamp01(u) - 0.5) * DAY_ARC,
    arch,
    isDay
  };
}
function sunState(hours, theme4 = {}) {
  const peakElevation = (theme4.sunElevation ?? 55) * Math.PI / 180;
  const warmth = theme4.sunWarmth ?? 0.45;
  const daySky = theme4.sky ?? 12375005;
  const bearing = (theme4.bearing ?? 0) * Math.PI / 180;
  const located = Number.isFinite(theme4.lat);
  const path = located ? solarPath(hours, {
    lat: theme4.lat,
    declination: declinationFor(theme4.sunTilt ?? 0, theme4.lat),
    bearing
  }) : authoredPath(hours, { peakElevation, bearing });
  const { arch, azimuth, isDay } = path;
  const elevation = isDay ? path.elevation : NIGHT_ELEVATION;
  const cx = ROOM.W * 0.5;
  const cz = ROOM.D * 0.5;
  const horizontal = Math.cos(elevation) * SUN_DISTANCE;
  const position = [
    cx + Math.sin(azimuth) * horizontal,
    Math.max(3, Math.sin(elevation) * SUN_DISTANCE),
    cz + Math.cos(azimuth) * horizontal
  ];
  const low = isDay ? 1 - arch : 1;
  let colour;
  let intensity;
  let skyColour;
  if (isDay) {
    const warmShift = clamp01(low * low * (0.55 + warmth * 0.45) + warmth * 0.25);
    colour = lerpRGB(SUN_NOON, SUN_LOW, warmShift);
    intensity = lerp(0.35, 1.45, arch);
    skyColour = lerpHex(daySky, SKY_TWILIGHT, clamp01((low - 0.55) / 0.45) * 0.85);
  } else {
    colour = SUN_NIGHT;
    intensity = NIGHT_SUN_INTENSITY;
    skyColour = SKY_NIGHT;
  }
  const darkness = isDay ? clamp01((low - 0.7) / 0.3) * 0.55 : 1;
  const lampOn = isDay ? clamp01((low - LAMP_ON_FROM) / (1 - LAMP_ON_FROM)) : 1;
  return { isDay, position, colour, intensity, skyColour, darkness, lampOn, elevation, azimuth };
}
function applyTimeOfDay(handles, hours, theme4, scene = null) {
  if (!handles) return null;
  const st = sunState(hours, theme4);
  handles.sun.position.set(...st.position);
  handles.sun.color.setRGB(st.colour.r, st.colour.g, st.colour.b);
  handles.sun.intensity = st.intensity;
  const base = handles.base;
  const night = st.darkness;
  handles.hemi.intensity = base.hemi.intensity * lerp(1, NIGHT_HEMI_SCALE, night);
  handles.hemi.color.set(lerpHex(base.hemi.sky, NIGHT_HEMI_SKY, night));
  handles.hemi.groundColor.set(lerpHex(base.hemi.ground, NIGHT_HEMI_GROUND, night));
  handles.fill.intensity = base.fill.intensity * lerp(1, 0.7, night);
  if (scene?.background?.set) scene.background.set(st.skyColour);
  if (scene?.environment) scene.environmentIntensity = lerp(0.18, 0.065, night);
  return st;
}

// dist/ui/roving/src/scene/night-lights.js
import * as THREE5 from "three";

// dist/ui/roving/src/scene/build.js
import * as THREE4 from "three";
var _mats = /* @__PURE__ */ new Map();
function mat(color, { rough = 0.85, metal = 0, flat = false, emissive = 0, emissiveIntensity = 0 } = {}) {
  const paletteKey = Object.hasOwn(COLORS, color) ? color : null;
  const key = `${color}-${rough}-${metal}-${flat}-${emissive}-${emissiveIntensity}`;
  if (_mats.has(key)) {
    const cached = _mats.get(key);
    if (paletteKey) cached.color.setHex(COLORS[paletteKey]);
    return cached;
  }
  const m = new THREE4.MeshStandardMaterial({
    color: paletteKey ? COLORS[paletteKey] : color,
    roughness: rough,
    metalness: metal,
    flatShading: flat,
    emissive,
    emissiveIntensity
  });
  if (paletteKey) m.userData.paletteKey = paletteKey;
  _mats.set(key, m);
  return m;
}
function box(w, h, d, color, opts = {}) {
  const m = new THREE4.Mesh(new THREE4.BoxGeometry(w, h, d), mat(color, opts));
  m.castShadow = opts.cast !== false;
  m.receiveShadow = opts.receive !== false;
  return m;
}
function cyl(rTop, rBot, h, color, opts = {}) {
  const seg = opts.segments || 12;
  const m = new THREE4.Mesh(new THREE4.CylinderGeometry(rTop, rBot, h, seg), mat(color, opts));
  m.castShadow = opts.cast !== false;
  m.receiveShadow = opts.receive !== false;
  return m;
}
function archRing(rInner, rOuter, color, opts = {}) {
  const seg = opts.segments || 16;
  const g = new THREE4.RingGeometry(rInner, rOuter, seg, 1, 0, Math.PI);
  const m = new THREE4.Mesh(g, mat(color, opts));
  m.castShadow = false;
  m.receiveShadow = opts.receive !== false;
  return m;
}
function archFill(r, color, opts = {}) {
  const seg = opts.segments || 16;
  const g = new THREE4.CircleGeometry(r, seg, 0, Math.PI);
  const m = new THREE4.Mesh(g, mat(color, opts));
  m.castShadow = false;
  m.receiveShadow = opts.receive !== false;
  return m;
}
function sphere(r, color, opts = {}) {
  const m = new THREE4.Mesh(new THREE4.SphereGeometry(r, opts.segments || 14, opts.segments || 12), mat(color, opts));
  m.castShadow = opts.cast !== false;
  m.receiveShadow = opts.receive !== false;
  return m;
}
function group(x = 0, y = 0, z = 0) {
  const g = new THREE4.Group();
  g.position.set(x, y, z);
  return g;
}
function put(parent2, obj, x = 0, y = 0, z = 0) {
  obj.position.set(x, y, z);
  parent2.add(obj);
  return obj;
}
var TEXTURE_SLOTS = [
  "map",
  "emissiveMap",
  "normalMap",
  "roughnessMap",
  "metalnessMap",
  "alphaMap",
  "aoMap",
  "bumpMap",
  "displacementMap",
  "envMap",
  "lightMap"
];
function resources(root) {
  const held = /* @__PURE__ */ new Set();
  root?.traverse((o) => {
    if (o.geometry) held.add(o.geometry);
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (!m) continue;
      held.add(m);
      for (const slot of TEXTURE_SLOTS) if (m[slot]) held.add(m[slot]);
    }
  });
  return held;
}
function disposeSubtree(root, { keep = null } = {}) {
  const held = resources(keep);
  for (const resource of resources(root)) {
    if (!held.has(resource)) resource.dispose?.();
  }
  root.traverse((o) => {
    o.shadow?.dispose?.();
    if (o.isInstancedMesh) o.dispose();
  });
}
function clearMaterialCache({ keep = null } = {}) {
  const held = resources(keep);
  for (const [key, m] of _mats) {
    if (held.has(m)) continue;
    m.dispose();
    _mats.delete(key);
  }
}
function applyMaterialPalette(root) {
  for (const resource of resources(root)) {
    const key = resource.userData?.paletteKey;
    if (key) resource.color.setHex(COLORS[key]);
  }
}
function footY(h) {
  return FLOOR_TOP - 0.02 + h / 2;
}

// dist/ui/roving/src/scene/night-lights.js
var LAMP_COLOUR = 16766624;
var FITTINGS_DEFAULT = {
  cols: 3,
  rows: 2,
  colour: 16770756,
  intensity: 55,
  poolRadius: 6.5,
  poolOpacity: 0.2
};
var CEILING_DROP = 0.6;
var CEILING_DISTANCE = 20;
var LAMP_POOL_R = 5.4;
var LAMP_POOL_OPACITY = 0.34;
var LAMP_HEAD_EMISSIVE = 1.15;
var FLOOR_TOP2 = 0.1;
var _poolTexture = null;
function poolTexture() {
  if (_poolTexture) return _poolTexture;
  const size = 128;
  const canvas2 = document.createElement("canvas");
  canvas2.width = canvas2.height = size;
  const ctx = canvas2.getContext("2d");
  const r = size / 2;
  const gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.62)");
  gradient.addColorStop(0.55, "rgba(255,255,255,0.24)");
  gradient.addColorStop(0.8, "rgba(255,255,255,0.06)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  _poolTexture = new THREE5.CanvasTexture(canvas2);
  _poolTexture.colorSpace = THREE5.SRGBColorSpace;
  return _poolTexture;
}
function buildLightPool(radius, colour, opacity) {
  const material = new THREE5.MeshBasicMaterial({
    map: poolTexture(),
    color: colour,
    transparent: true,
    opacity,
    blending: THREE5.AdditiveBlending,
    depthWrite: false,
    toneMapped: false
  });
  const pool = new THREE5.Mesh(new THREE5.PlaneGeometry(radius * 2, radius * 2), material);
  pool.rotation.x = -Math.PI / 2;
  pool.renderOrder = 2;
  pool.receiveShadow = false;
  pool.castShadow = false;
  return pool;
}
function markNightLight(carrier, spec) {
  carrier.userData.nightLight = {
    light: spec.light ?? null,
    pool: spec.pool ?? null,
    emissive: spec.emissive ?? [],
    // Captured now, so applyNightLights scales against the fitting's own design
    // brightness rather than whatever it last wrote.
    lightIntensity: spec.light?.intensity ?? 0,
    poolOpacity: spec.pool?.material.opacity ?? 0,
    emissiveIntensity: spec.emissiveIntensity ?? LAMP_HEAD_EMISSIVE
  };
  return carrier;
}
function buildCeilingLights(spec = {}) {
  const { cols, rows, colour, intensity, poolRadius, poolOpacity } = { ...FITTINGS_DEFAULT, ...spec };
  const g = new THREE5.Group();
  g.name = "ceiling-lights";
  const y = ROOM.H - CEILING_DROP;
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const x = ROOM.W * (col + 0.5) / cols;
      const z = ROOM.D * (row + 0.5) / rows;
      const fitting = new THREE5.Group();
      fitting.position.set(x, 0, z);
      const light = new THREE5.PointLight(colour, intensity, CEILING_DISTANCE, 2);
      light.position.y = y;
      light.castShadow = false;
      fitting.add(light);
      const pool = put(fitting, buildLightPool(poolRadius, colour, poolOpacity), 0, FLOOR_TOP2 + 0.015);
      markNightLight(fitting, { light, pool });
      g.add(fitting);
    }
  }
  return g;
}
function streetLampLighting(headX, groundY, headMaterial) {
  const pool = buildLightPool(LAMP_POOL_R, LAMP_COLOUR, LAMP_POOL_OPACITY);
  pool.position.set(headX + 1.4, groundY, 0);
  return { pool, emissive: [headMaterial] };
}
function markLitWindow(mesh2, intensity) {
  mesh2.material.emissiveIntensity = 0;
  return markNightLight(mesh2, { emissive: [mesh2.material], emissiveIntensity: intensity });
}
function collectNightLights(root) {
  const found = [];
  root.traverse((obj) => {
    if (obj.userData?.nightLight) found.push(obj.userData.nightLight);
  });
  return found;
}
function applyNightLights(handles, amount) {
  if (!handles?.length) return;
  const t = clamp01(amount);
  const off = t < 0.01;
  for (const h of handles) {
    if (h.light) {
      h.light.intensity = h.lightIntensity * t;
      h.light.visible = !off;
    }
    if (h.pool) {
      h.pool.material.opacity = h.poolOpacity * t;
      h.pool.visible = !off;
    }
    for (const m of h.emissive) {
      m.emissiveIntensity = h.emissiveIntensity * t;
    }
  }
}

// dist/ui/roving/src/scene/environment.js
import * as THREE21 from "three";

// dist/ui/roving/src/dice.js
var pick = (list) => list[Math.floor(Math.random() * list.length)];
var chance = (p) => Math.random() < p;
var whole = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
var spread = (base, span) => base + Math.random() * span;
var between = (lo, hi) => lo + Math.random() * (hi - lo);

// dist/ui/roving/src/scene/exterior.js
import * as THREE15 from "three";

// dist/ui/roving/src/office-styles/tide.js
var building = {
  label: "Tide Wharf",
  subtitle: "An airy studio on a working harbour",
  storeysBelow: 0,
  plinth: false,
  entrance: "stoop",
  lowerWalls: "solid",
  serviceYard: false,
  elevation: "ground",
  outside: "tide-harbour",
  palette: {}
};
var theme = {
  label: "Tide Wharf \xB7 ash and harbour blue",
  floor: { kind: "ash" },
  season: "summer",
  building: "tide",
  sky: 12179940,
  light: {
    hemi: { sky: 14217215, ground: 8952998, intensity: 0.66 },
    fill: { color: 15791346, intensity: 0.27, position: [20, 13, 17] }
  },
  fittings: { cols: 3, rows: 2, colour: 16768945, intensity: 48, poolRadius: 6.6, poolOpacity: 0.15 },
  palette: {
    wallSage: 8363434,
    wallWhite: 15066842,
    baseboard: 3427159,
    frame: 2572108,
    glass: 13034729,
    woodDark: 6643020,
    woodMid: 12892058,
    rugSage: 7575466,
    couch: 5865361,
    terracotta: 12351848,
    floorWood: 14275004,
    floorWoodAlt: 13288626
  }
};

// dist/ui/roving/src/office-styles/dune.js
var building2 = {
  label: "Dune Atelier",
  subtitle: "Earth walls, shaded alleys and desert light",
  storeysBelow: 0,
  plinth: false,
  entrance: "stoop",
  lowerWalls: "solid",
  serviceYard: false,
  elevation: "ground",
  outside: "dune-courtyard",
  palette: {}
};
var theme2 = {
  label: "Dune Atelier \xB7 clay and sunlight",
  floor: { kind: "terracotta" },
  season: "summer",
  building: "dune",
  sky: 15324342,
  light: {
    hemi: { sky: 16772560, ground: 11494722, intensity: 0.54 },
    fill: { color: 16768688, intensity: 0.24, position: [19, 13, 16] }
  },
  fittings: { cols: 3, rows: 2, colour: 16764039, intensity: 47, poolRadius: 6.5, poolOpacity: 0.2 },
  palette: {
    wallWhite: 14994853,
    wallSage: 14994853,
    baseboard: 12486236,
    frame: 7426620,
    glass: 13026210,
    woodDark: 7620143,
    woodMid: 11565123,
    floorWood: 12020294,
    floorWoodAlt: 11099965,
    rugSage: 12882022,
    couch: 11947573,
    terracotta: 12020808,
    houseLeaf: 7900244,
    houseLeafDark: 5400897,
    houseLeafLight: 10792565,
    leaf: 8688235,
    leafDark: 6255695,
    pot: 13145191,
    metalDark: 4799537,
    mailbox: 9987649
  }
};

// dist/ui/roving/src/office-styles/lantern.js
var building3 = {
  label: "Lantern Court",
  storeysBelow: 0,
  plinth: false,
  entrance: "stoop",
  subtitle: "Dark timber overlooking a Japanese garden",
  lowerWalls: "solid",
  serviceYard: false,
  elevation: "ground",
  outside: "lantern-garden",
  palette: {}
};
var theme3 = {
  label: "Lantern Court \xB7 paper and dark timber",
  floor: { kind: "tatami" },
  season: "summer",
  building: "lantern",
  fittings: { cols: 3, rows: 2, colour: 16766876, intensity: 42, poolRadius: 6.3, poolOpacity: 0.18 },
  sky: 13093840,
  light: {
    hemi: { sky: 15264225, ground: 7831153, intensity: 0.66 },
    fill: { color: 16115661, intensity: 0.25, position: [18, 12, 20] }
  },
  palette: {
    wallSage: 4866617,
    wallWhite: 14998726,
    baseboard: 3747883,
    frame: 3354154,
    glass: 12899277,
    woodDark: 3747366,
    woodMid: 7692363,
    floorWood: 13220749,
    floorWoodAlt: 12168580,
    rugSage: 12170387,
    couch: 4807527,
    terracotta: 8540228,
    pot: 5855565,
    houseLeaf: 6453341,
    houseLeafDark: 3955527,
    houseLeafLight: 9609592,
    metalDark: 3422781,
    mailbox: 5464939
  }
};

// dist/ui/roving/src/projects.js
var OUTSIDE_MODES = [
  "street-summer",
  "street-autumn",
  "street-winter",
  "street-spring",
  "skyline-high",
  // The prototype outlook, forced by the mansard.
  "paris-rooftops",
  "canopy-garden",
  "tide-harbour",
  "dune-courtyard",
  "lantern-garden"
];
var MID_SEASON = 0.71;
var SEASONS = {
  summer: {
    label: "Summer",
    street: "street-summer",
    sky: 12375005,
    sunElevation: 62,
    sunTilt: 1,
    sunWarmth: 0.45,
    light: {
      hemi: { sky: 14674415, ground: 11569754, intensity: 1.1 },
      fill: { color: 16773597, intensity: 0.65, position: [20, 12, 18] }
    },
    palette: {}
  },
  autumn: {
    label: "Autumn",
    street: "street-autumn",
    sky: 15254682,
    // Low sun and the warmest of the four — this is the golden-hour season.
    sunElevation: 34,
    sunTilt: -MID_SEASON,
    sunWarmth: 0.95,
    light: {
      hemi: { sky: 15981764, ground: 9071180, intensity: 1 },
      fill: { color: 16768180, intensity: 0.7, position: [18, 9, 16] }
    },
    palette: {
      grass: 10130007,
      leaf: 14254884,
      leafDark: 9190166,
      sky: 15254682
    }
  },
  winter: {
    label: "Winter",
    street: "street-winter",
    sky: 14345450,
    // Barely gets up: long shadows all day, and cold.
    sunElevation: 22,
    sunTilt: -1,
    sunWarmth: 0.1,
    light: {
      hemi: { sky: 15266037, ground: 10134443, intensity: 1.2 },
      fill: { color: 16772829, intensity: 0.6, position: [20, 12, 18] }
    },
    palette: {
      grass: 15660022,
      leaf: 4156239,
      leafDark: 3102016,
      road: 8225416,
      roadLine: 14210504,
      sidewalk: 14277856,
      curb: 12764874,
      buildingA: 9069396,
      buildingB: 8488589,
      buildingC: 10127480,
      buildingD: 6845820,
      windowLit: 16767124,
      sky: 14345450
    }
  },
  spring: {
    label: "Spring",
    // Spring reuses the summer street geometry: the difference is blossom on the
    // trees, petals on the ground and fresher grass — palette plus a scatter of
    // litter, so there is no second copy of the park to keep in step.
    street: "street-spring",
    sky: 13163754,
    sunElevation: 50,
    sunTilt: MID_SEASON,
    sunWarmth: 0.3,
    light: {
      hemi: { sky: 15003380, ground: 10466184, intensity: 1.1 },
      fill: { color: 16185322, intensity: 0.66, position: [20, 13, 18] }
    },
    palette: {
      grass: 8829796,
      // Blossom rather than foliage: the tree builder reads these two, so a pink
      // pair turns every summer tree into a cherry in flower.
      leaf: 15975125,
      leafDark: 14392502,
      autumnLitter: 15779030,
      // fallen petals reuse the litter scatter
      sky: 13163754
    }
  }
};
var SEASON_LIST = Object.keys(SEASONS);
var BUILDINGS = {
  tide: building,
  dune: building2,
  lantern: building3,
  canopy: {
    label: "Canopy House",
    subtitle: "A light-filled office among the trees",
    storeysBelow: 0,
    plinth: false,
    entrance: "stoop",
    lowerWalls: "solid",
    serviceYard: false,
    elevation: "ground",
    outside: "canopy-garden",
    palette: {}
  },
  simple: {
    label: "Alder Street",
    subtitle: "A brownstone beside a leafy city park",
    storeysBelow: 0,
    plinth: true,
    entrance: "stoop",
    lowerWalls: "solid",
    serviceYard: false,
    elevation: "ground",
    outside: null,
    palette: {}
  },
  warehouse: {
    label: "Foundry Loft",
    subtitle: "Brick, timber and industrial character",
    // Top floor of two: the storey below is the warehouse's ground level.
    storeysBelow: 1,
    plinth: false,
    entrance: "stairs",
    lowerWalls: "solid",
    serviceYard: true,
    elevation: "high",
    outside: null,
    palette: {
      // Warm red brick, after the San Francisco warehouse references: brick
      // arcades, corbelled cornice, painted ghost sign.
      facadeLower: 10641994,
      slabEdge: 10116162,
      brickPier: 9393472,
      brickShade: 8736054,
      baseCourse: 9277331,
      signPaint: 14604491,
      // Grey steel loading doors against the brick, with dark steel window
      // frames — the industrial read the ground floor needs.
      shutter: 9146518,
      shutterRib: 7633279,
      windowFrame: 4866104
    }
  },
  skyscraper: {
    label: "Kestrel Tower",
    subtitle: "Glass, sky and gardens above the city",
    // Enough levels to establish that this floor is a long way up.
    storeysBelow: 3,
    plinth: false,
    // A tower floor is reached by lift, not a front door.
    entrance: "elevator",
    lowerWalls: "glazed",
    serviceYard: false,
    elevation: "high",
    outside: "skyline-high",
    palette: {
      // Curtain wall after the tower references: blue-green solar glass, dark
      // spandrels at every floor line, bright anodised mullions between.
      windowDark: 2833742,
      spandrel: 2897730,
      mullion: 12831440,
      slabEdge: 9278618,
      facadeLower: 3818574,
      buildingA: 9278620,
      buildingB: 8291725,
      buildingC: 10068392,
      buildingD: 7107965
    }
  },
  // -------------------------------------------------------------------------
  // Prototype.
  //
  // Taken far enough to be *looked at* and no further, so we can find out
  // whether it is worth finishing: punched masonry, and a walk-up stair
  // behind a glazed landing at the top of a city block. It shares the floor
  // plan with everything else, because that is not negotiable — see "What is
  // deliberately not themeable" in the docs.
  mansard: {
    label: "Rue Dauphine",
    subtitle: "A Parisian studio above the rooftops",
    // Top floor of three, over the rooftops of a city that is nearly all this
    // height — which is why the outlook is roofs at eye level rather than a street
    // far below.
    storeysBelow: 2,
    plinth: false,
    // A walk-up, the same as the warehouse's own external flight — not a lobby
    // with a lift. The glazing that turns this into a stairwell rather than a
    // plain fire escape is built by buildEnvironment() itself, keyed off the
    // building name, because it means pushing part of the back wall back and
    // that is not expressible as a building/theme data field.
    entrance: "stairs",
    lowerWalls: "punched",
    serviceYard: false,
    elevation: "high",
    outside: "paris-rooftops",
    roof: "mansard",
    palette: {
      // Zinc over limestone, with the ironwork dark against it.
      roofPlane: 9278105,
      roofTrim: 7765123,
      facadeLower: 14076594,
      baseCourse: 14735040,
      slabEdge: 13221286,
      windowFrame: 3881526,
      windowDark: 3688020,
      metalDark: 3093048,
      chimneyPot: 11691071
    }
  }
};
var BUILDING_LIST = Object.keys(BUILDINGS);
var THEMES = {
  tide: theme,
  dune: theme2,
  lantern: theme3,
  canopy: {
    label: "Canopy House \xB7 timber and foliage",
    floor: { kind: "oak" },
    season: "summer",
    building: "canopy",
    fittings: { cols: 3, rows: 2, colour: 16768676, intensity: 53, poolRadius: 6.5, poolOpacity: 0.16 },
    sky: 13752507,
    light: {
      hemi: { sky: 15265756, ground: 9863772, intensity: 0.62 },
      fill: { color: 16772557, intensity: 0.3, position: [20, 13, 17] }
    },
    palette: {
      wallSage: 5990469,
      wallWhite: 5596227,
      baseboard: 8677184,
      frame: 4804669,
      glass: 12308401,
      woodDark: 6638385,
      woodMid: 11304264,
      rugSage: 10788733,
      couch: 7174480,
      terracotta: 12025170,
      floorWood: 13149043,
      floorWoodAlt: 12424807
    }
  },
  // The original: warm brownstone on a leafy street corner.
  brownstone: {
    label: "Alder Street \xB7 warm wood",
    floor: { kind: "plank", plankWidth: 1.6 },
    season: "summer",
    building: "simple",
    // Soft warm domestic fittings, evenly spread.
    fittings: { cols: 3, rows: 2, colour: 16770756, intensity: 55, poolRadius: 6.5, poolOpacity: 0.2 },
    palette: {}
  },
  // Same street, deep winter. The interior goes warmer and softer to contrast
  // with the cold outside.
  snowfall: {
    label: "Alder Street \xB7 winter",
    floor: { kind: "carpet", tileSize: 2.4 },
    season: "winter",
    building: "simple",
    // Dimmer and warmer than summer, and pooling wider: the point of the room in
    // winter is that it looks like somewhere you would rather be than outside.
    fittings: { cols: 3, rows: 2, colour: 16767400, intensity: 46, poolRadius: 7.2, poolOpacity: 0.24 },
    palette: {
      wallSage: 10135702,
      wallWhite: 15854817,
      baseboard: 16184042,
      floorCarpet: 9404270,
      floorCarpetAlt: 8878186,
      rugSage: 12167316,
      couch: 12875870
    }
  },
  // Level 34 of a glass tower: polished concrete, cool grey walls, and a sea of
  // rooftops below instead of a street.
  tower: {
    label: "Kestrel Tower \xB7 level 34",
    floor: { kind: "concrete", tileSize: 6 },
    season: "summer",
    building: "skyscraper",
    // Recessed office fluorescents: cool, flat, more of them, and tight pools —
    // commercial lighting that is trying to be even rather than atmospheric.
    fittings: { cols: 4, rows: 2, colour: 14872056, intensity: 60, poolRadius: 5.8, poolOpacity: 0.15 },
    sky: 11126493,
    light: {
      // Bright and neutral — nothing is shading this floor.
      hemi: { sky: 14149362, ground: 9409690, intensity: 0.65 },
      fill: { color: 15397626, intensity: 0.4, position: [20, 16, 18] }
    },
    palette: {
      wallSage: 9410462,
      wallWhite: 16053751,
      baseboard: 15001578,
      frame: 3817285,
      glass: 11061468,
      rugSage: 9413293,
      woodMid: 8218192
    }
  },
  // Dark stained boards, deep sage, long warm light.
  studio: {
    label: "Foundry Loft \xB7 top floor",
    floor: { kind: "plank", plankWidth: 1.1 },
    season: "autumn",
    building: "warehouse",
    // Industrial high bays: few, strong, warm, thrown wide. A warehouse is lit by
    // a handful of hard lamps a long way up, not a grid of soft ones.
    fittings: { cols: 2, rows: 2, colour: 16766106, intensity: 88, poolRadius: 8.4, poolOpacity: 0.26 },
    // Painted ghost sign across the brick, as on the reference warehouses.
    signText: "LOOM STUDIO",
    palette: {
      wallSage: 7306100,
      wallWhite: 14998729,
      baseboard: 15393490,
      floorWood: 9071430,
      floorWoodAlt: 8150845,
      woodDark: 5453610,
      woodMid: 7621936,
      rugSage: 9740428,
      couch: 12614236,
      terracotta: 12610629
    }
  },
  // -------------------------------------------------------------------------
  // Prototype interior, for the one prototype building. Cheap by design: a
  // floor finish, a palette and a lighting rig, which between them is most of
  // what makes a room feel like somewhere. Nothing here adds a prop or moves
  // a station.
  // Under the zinc: pale plaster, narrow boards and black steel — a studio at the
  // top of a city block.
  atelier: {
    label: "Rue Dauphine \xB7 pale plaster",
    floor: { kind: "plank", plankWidth: 0.9 },
    season: "autumn",
    building: "mansard",
    fittings: { cols: 3, rows: 2, colour: 16772299, intensity: 58, poolRadius: 6.8, poolOpacity: 0.2 },
    // A little more ambient than autumn gives by default. Limestone is only cream in
    // light; under the warehouse's raking golden hour a whole city of it reads brown.
    light: {
      hemi: { sky: 15920349, ground: 13221286, intensity: 0.74 },
      fill: { color: 16773852, intensity: 0.3, position: [20, 11, 17] }
    },
    palette: {
      wallSage: 12172724,
      wallWhite: 15789282,
      baseboard: 16184298,
      floorWood: 12161631,
      floorWoodAlt: 11372373,
      frame: 3881526,
      woodDark: 5129271,
      woodMid: 8152647,
      rugSage: 10134432,
      couch: 7176042,
      // velvet, in the green everything in Paris is
      terracotta: 12545868
    }
  }
};
var PROJECTS = [
  {
    id: "startup-ai",
    name: "Startup.AI",
    building: BUILDINGS.simple.label,
    floorName: "Ground floor \xB7 July",
    theme: "brownstone",
    look: { season: "summer", building: "simple" },
    agents: { startCount: 3 },
    sources: ["test-data"]
  },
  {
    id: "initech-llc",
    name: "Initech LLC",
    building: BUILDINGS.skyscraper.label,
    // No season in the name: a tower is never on a street, so its winter is
    // something you would have to take on trust. Same rule as createScene().
    floorName: "Level 34",
    theme: "tower",
    look: { season: "winter", building: "skyscraper" },
    agents: { startCount: 4 },
    sources: ["test-data"]
  },
  {
    id: "dotcom-bcorp",
    name: "Dot.com BCorp",
    building: BUILDINGS.warehouse.label,
    floorName: "Upper floor \xB7 October",
    theme: "studio",
    look: { season: "autumn", building: "warehouse" },
    agents: { startCount: 2 },
    sources: ["test-data"]
  },
  // ---- Prototype ----------------------------------------------------------
  // The experiment, in the demo office so it can be walked round and argued
  // about. It is a scene like any other; the only thing that marks it out is
  // that it is not finished yet.
  {
    id: "proto-atelier",
    name: "Atelier Marchand",
    building: BUILDINGS.mansard.label,
    floorName: "Top floor \xB7 October",
    theme: "atelier",
    look: { season: "autumn", building: "mansard" },
    agents: { maxAgents: 5, startCount: 3 },
    sources: ["test-data"]
  }
];
function createScene({
  // A timestamp alone is not unique: two scenes created in the same millisecond
  // would share an id, and the second would silently edit the first.
  id = `scene-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
  name = "New scene",
  season = pick(SEASON_LIST),
  building: building4 = pick(BUILDING_LIST),
  sources = []
} = {}) {
  const themeKey = NATIVE_THEME[building4] ?? "brownstone";
  const b = BUILDINGS[building4] ?? BUILDINGS.simple;
  const s = SEASONS[season] ?? SEASONS.summer;
  return {
    id,
    name,
    building: b.label,
    // Elevation gives the floor its name; the season is only worth mentioning if
    // you can actually see it. A building that forces its own outlook (the tower's
    // skyline) never shows a street, so naming its season there would be a lie —
    // but the warehouse is an upper floor that *does* look out onto one.
    floorName: b.outside ? floorWord(b) : `${floorWord(b)} \xB7 ${s.label}`,
    theme: themeKey,
    agents: { startCount: 2 },
    sources,
    look: { season, building: building4 },
    custom: true
  };
}
function floorWord(building4) {
  return building4.elevation === "high" ? "Upper floor" : "Ground floor";
}
var NATIVE_THEME = {
  tide: "tide",
  dune: "dune",
  lantern: "lantern",
  canopy: "canopy",
  simple: "brownstone",
  warehouse: "studio",
  skyscraper: "tower",
  mansard: "atelier"
};
function getTheme(project) {
  return THEMES[project?.theme] ?? THEMES.brownstone;
}
function resolveTheme(project, overrides = {}) {
  const theme4 = getTheme(project);
  const seasonKey = SEASONS[overrides.season] ? overrides.season : theme4.season;
  const buildingKey = BUILDINGS[overrides.building] ? overrides.building : theme4.building;
  const season = SEASONS[seasonKey];
  const building4 = BUILDINGS[buildingKey];
  const swapped = buildingKey !== theme4.building;
  const interior = swapped ? THEMES[NATIVE_THEME[buildingKey]] ?? theme4 : theme4;
  return {
    label: swapped ? `${interior.label} (in ${building4.label})` : theme4.label,
    floor: interior.floor,
    season: seasonKey,
    building: buildingKey,
    // A building may insist on its own outlook — a tower is never on a street —
    // otherwise the season decides which street we get.
    outside: building4.outside ?? season.street,
    elevation: building4.elevation,
    storeysBelow: building4.storeysBelow,
    plinth: building4.plinth,
    entrance: building4.entrance,
    lowerWalls: building4.lowerWalls,
    serviceYard: building4.serviceYard,
    // Only ever over the two standing walls, so it never becomes a lid on the room.
    roof: building4.roof ?? null,
    // Signage only makes sense on masonry, so it is dropped for a curtain wall
    // rather than quietly painting a ghost sign onto glass.
    signText: building4.lowerWalls === "solid" ? interior.signText ?? null : null,
    sky: interior.sky ?? season.sky,
    // The sun is deliberately absent: it is derived from the clock at runtime
    // (scene/lighting.js), with these two numbers shaping how high it climbs and
    // how warm it gets in this season.
    sunElevation: season.sunElevation,
    sunWarmth: season.sunWarmth,
    // Which way this room faces, in degrees, turning the sun's whole arc with it.
    // A season decides how high the sun climbs; this decides where it climbs, and
    // is the one part of the light a person picks rather than inherits.
    bearing: Number.isFinite(overrides.bearing) ? overrides.bearing : theme4.bearing ?? 0,
    // And where on earth it is standing, which is what turns the two numbers above
    // into a real sky. Null is the ordinary case — most rooms are never put
    // anywhere, and those keep the authored arc and `sunElevation` above. A
    // latitude replaces both with the sun that latitude actually gets, including
    // how long its day lasts. See scene/lighting.js.
    lat: Number.isFinite(overrides.lat) ? overrides.lat : theme4.lat ?? null,
    lon: Number.isFinite(overrides.lon) ? overrides.lon : theme4.lon ?? null,
    sunTilt: season.sunTilt ?? 0,
    light: {
      hemi: { ...season.light.hemi, ...interior.light?.hemi ?? {} },
      fill: { ...season.light.fill, ...interior.light?.fill ?? {} }
    },
    // Ceiling lighting after dark, falling back to the brownstone's soft warm grid
    // for any theme that does not specify its own.
    fittings: { ...THEMES.brownstone.fittings, ...interior.fittings ?? {} },
    palette: { ...season.palette, ...building4.palette, ...interior.palette }
  };
}

// dist/ui/roving/src/scene/outlooks/street.js
import * as THREE9 from "three";

// dist/ui/roving/src/scene/building.js
import * as THREE6 from "three";
var STOREY_H = 7;
var SLAB_H = 0.42;
var SLAB_PROUD = 0.12;
var GLASS_T = 0.1;
var LIT_EVERY = 5;
var D_SIGN = 0.03;
var D_GLASS = 0.05;
var D_BARS = 0.1;
var D_RING = 0.15;
var D_IMPOST = 0.2;
var D_SPANDREL = 0.185;
var D_MULLION = 0.31;
var D_PIER = 0.24;
var D_SILL = 0.29;
var D_LINTEL = 0.32;
var D_BASE = 0.35;
var D_CORNICE = [0.26, 0.38, 0.32];
var LIT_GLOW = 0.55;
var BAND_ROWS = 4;
var SPANDREL_H = 0.42;
var MULLION_PITCH = 1.45;
var MULLION_W = 0.13;
var MULLION_D = 0.18;
var LIT_PANE_CHANCE = 0.16;
var BASE_H = 0.8;
var OPENING_BOTTOM = -2.7;
var SILL_H = 0.2;
var SPRING_Y = -0.45;
var SIGN_BOTTOM = 1.95;
var SIGN_TOP = 2.65;
var CORNICE_H = 0.75;
var PILASTER_W = 0.75;
var ARCH_RING_W = 0.34;
var BAY_MARGIN = 0.6;
var MAX_OPEN_W = 4.4;
var ARCADE_BAYS_LONG = 5;
var ARCADE_BAYS_SHORT = 3;
var GARAGE_BAY_INDICES = [2, 3];
var ENTRANCE_BAY_INDEX = 4;
var PED_W = 1.4;
var PED_H = 1.9;
var DOOR_SLATS = 7;
var BAY_MULLIONS = 2;
var IMPOST_H = 0.16;
var STEEL_WIN_W = 2.5;
var STEEL_WIN_H = 1.9;
var STEEL_WIN_SPACING = 5;
var BAR_T = 0.08;
function glassOpts(isLit) {
  return isLit ? { rough: 0.25, metal: 0.1, emissive: COLORS.windowLit, emissiveIntensity: 0.55, cast: false } : { rough: 0.25, metal: 0.35, cast: false };
}
function zFor(wallT, d, t) {
  return wallT / 2 + d - t / 2;
}
function zFlat(wallT, d) {
  return wallT / 2 + d;
}
function buildPlainPanes(parent2, len, wallT, lit, paneW, paneH) {
  const cols = Math.max(2, Math.floor(len / 4.2));
  const stepX = len / (cols + 1);
  for (let row = 1; row <= 2; row++) {
    for (let col = 1; col <= cols; col++) {
      const isLit = lit.n++ % LIT_EVERY === 0;
      const pane = box(
        paneW,
        paneH,
        GLASS_T,
        isLit ? COLORS.windowLit : COLORS.windowDark,
        glassOpts(isLit)
      );
      pane.position.set(
        -len / 2 + col * stepX,
        -STOREY_H / 2 + row * (STOREY_H / 3),
        zFor(wallT, D_GLASS, GLASS_T)
      );
      if (isLit) markLitWindow(pane, LIT_GLOW);
      parent2.add(pane);
    }
  }
}
function buildStoreysBelow({ count, roomW, roomD, wallT, walls = "glazed", signText = null, baseTo = null }) {
  const g = group(0, 0, 0);
  if (count <= 0) return g;
  const half = wallT / 2;
  const lit = { n: 0 };
  const openW = arcadeOpeningWidth(roomW, roomD);
  for (let level = 0; level < count; level++) {
    const top = -level * STOREY_H;
    const midY = top - STOREY_H / 2;
    const storey = group(0, 0, 0);
    for (const [w, d, x, z] of [
      [roomW + SLAB_PROUD * 2, SLAB_H, roomW / 2, 0],
      [roomW + SLAB_PROUD * 2, SLAB_H, roomW / 2, roomD],
      [SLAB_H, roomD + SLAB_PROUD * 2, 0, roomD / 2],
      [SLAB_H, roomD + SLAB_PROUD * 2, roomW, roomD / 2]
    ]) {
      const isX = w > d;
      const band = box(
        isX ? w : SLAB_H,
        SLAB_H,
        isX ? SLAB_H : d,
        COLORS.slabEdge,
        { rough: 0.85, cast: false }
      );
      band.position.set(x, top - SLAB_H / 2, z);
      band.receiveShadow = true;
      storey.add(band);
    }
    const plate = box(
      roomW - 0.08,
      0.36,
      roomD - 0.08,
      COLORS.facadeLower,
      { rough: 0.9, cast: false }
    );
    plate.position.set(roomW / 2, top - STOREY_H + 0.18, roomD / 2);
    plate.receiveShadow = true;
    storey.add(plate);
    const wRole = roomW >= roomD ? "long" : "short";
    const dRole = roomW >= roomD ? "short" : "long";
    const atGround = level === count - 1;
    const faces = [
      { len: roomW, at: [roomW / 2, midY, 0], rotY: 0, seen: false, role: wRole },
      { len: roomW, at: [roomW / 2, midY, roomD - half], rotY: 0, seen: true, role: wRole },
      { len: roomD, at: [0, midY, roomD / 2], rotY: Math.PI / 2, seen: false, role: dRole },
      { len: roomD, at: [roomW - half, midY, roomD / 2], rotY: Math.PI / 2, seen: true, role: dRole }
    ];
    for (const face2 of faces) {
      const wall = group(...face2.at);
      wall.rotation.y = face2.rotY;
      const opts = { seen: face2.seen, atGround, role: face2.role, lit, signText, openW };
      if (walls === "solid") buildSolidWall(wall, face2.len, wallT, opts);
      else if (walls === "punched") buildPunchedWall(wall, face2.len, wallT, opts);
      else buildGlazedWall(wall, face2.len, wallT, opts);
      storey.add(wall);
    }
    if (atGround) {
      const floorLine = top - STOREY_H;
      const baseH = baseTo === null ? Math.abs(STREET_Y) + 0.5 : Math.max(0.5, floorLine - baseTo);
      const base = box(
        roomW + 0.5,
        baseH,
        roomD + 0.5,
        walls === "glazed" ? COLORS.spandrel : COLORS.baseCourse,
        { rough: 0.9, cast: false }
      );
      base.position.set(roomW / 2, floorLine - baseH / 2, roomD / 2);
      base.receiveShadow = true;
      storey.add(base);
    }
    g.add(storey);
  }
  return g;
}
function buildGlazedWall(parent2, len, wallT, { seen = false, lit }) {
  const BACKING_BLEED = 0.03;
  const backing = box(len, STOREY_H + BACKING_BLEED, wallT, COLORS.spandrel, { rough: 0.8 });
  backing.position.y = BACKING_BLEED / 2;
  backing.castShadow = true;
  backing.receiveShadow = true;
  parent2.add(backing);
  const bay = STOREY_H / BAND_ROWS;
  const glassH = bay - SPANDREL_H;
  const glassZ = zFor(wallT, D_GLASS, GLASS_T);
  const spandrelT = wallT * 0.5;
  const cols = Math.max(3, Math.round(len / MULLION_PITCH));
  const colW = len / cols;
  for (let row = 0; row < BAND_ROWS; row++) {
    const bottom = -STOREY_H / 2 + row * bay;
    const centreY = bottom + glassH / 2;
    put(parent2, box(len - 0.06, glassH, GLASS_T, COLORS.windowDark, glassOpts(false)), 0, centreY, glassZ);
    if (seen) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > LIT_PANE_CHANCE) continue;
        lit.n++;
        const pane = box(
          colW - MULLION_W - 0.06,
          glassH * 0.94,
          GLASS_T,
          COLORS.windowLit,
          glassOpts(true)
        );
        pane.position.set(-len / 2 + (c + 0.5) * colW, centreY, glassZ + 0.02);
        markLitWindow(pane, LIT_GLOW);
        parent2.add(pane);
      }
    }
    const SPANDREL_DROP = 0.02;
    const s = box(len, SPANDREL_H, spandrelT, COLORS.spandrel, { rough: 0.8, cast: false });
    s.position.set(
      0,
      bottom + glassH + SPANDREL_H / 2 - SPANDREL_DROP,
      zFor(wallT, D_SPANDREL, spandrelT)
    );
    parent2.add(s);
  }
  if (!seen) return;
  for (let c = 0; c <= cols; c++) {
    const fin = box(
      MULLION_W,
      STOREY_H,
      MULLION_D,
      COLORS.mullion,
      { rough: 0.45, metal: 0.55, cast: false }
    );
    fin.position.set(-len / 2 + c * colW, 0, zFor(wallT, D_MULLION, MULLION_D));
    parent2.add(fin);
  }
}
function buildSolidWall(parent2, len, wallT, { seen = false, atGround = false, role = "long", lit, signText, openW }) {
  const backing = box(len, STOREY_H, wallT, COLORS.facadeLower, { rough: 0.9 });
  backing.castShadow = true;
  backing.receiveShadow = true;
  parent2.add(backing);
  if (!seen) return buildPlainPanes(parent2, len, wallT, lit, 1.5, 1.3);
  if (atGround) {
    const long = role === "long";
    const bays = long ? ARCADE_BAYS_LONG : ARCADE_BAYS_SHORT;
    return buildArcadeElevation(parent2, len, wallT, {
      roles: arcadeRoles(bays, long),
      openW: openW ?? arcadeOpeningWidth(len, len),
      sign: long ? signText : null,
      lit
    });
  }
  const rows = Math.max(1, Math.floor(STOREY_H / (STEEL_WIN_H + 1.2)));
  const cols = Math.max(2, Math.floor(len / STEEL_WIN_SPACING));
  const stepX = len / (cols + 1);
  const stepY = STOREY_H / (rows + 1);
  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= cols; col++) {
      buildSteelWindow(
        parent2,
        -len / 2 + col * stepX,
        -STOREY_H / 2 + row * stepY,
        wallT,
        STEEL_WIN_W,
        STEEL_WIN_H,
        lit.n++ % LIT_EVERY === 0
      );
    }
  }
}
function buildArcadeElevation(parent2, len, wallT, { roles, openW, sign, lit }) {
  const bays = roles.length;
  const bayW = len / bays;
  const baseT = wallT * 0.55;
  const base = box(len, BASE_H, baseT, COLORS.baseCourse, { rough: 0.9, cast: false });
  base.position.set(0, -STOREY_H / 2 + BASE_H / 2, zFor(wallT, D_BASE, baseT));
  base.receiveShadow = true;
  parent2.add(base);
  const pierT = wallT * 0.5;
  const pierH = STOREY_H - BASE_H;
  for (let i = 0; i <= bays; i++) {
    const pier = box(PILASTER_W, pierH, pierT, COLORS.brickPier, { rough: 0.92, cast: false });
    pier.position.set(
      -len / 2 + i * bayW,
      -STOREY_H / 2 + BASE_H + pierH / 2,
      zFor(wallT, D_PIER, pierT)
    );
    pier.receiveShadow = true;
    parent2.add(pier);
  }
  for (let i = 0; i < bays; i++) {
    const x = -len / 2 + (i + 0.5) * bayW;
    if (roles[i] === "garage") buildLoadingBay(parent2, x, openW, wallT);
    else if (roles[i] === "pedestrian") buildEntranceBay(parent2, x, openW, wallT);
    else buildWindowBay(parent2, x, openW, wallT, lit.n++ % LIT_EVERY === 0);
  }
  let y = STOREY_H / 2 - CORNICE_H;
  const courses = [[0.24, D_CORNICE[0]], [0.3, D_CORNICE[1]], [0.21, D_CORNICE[2]]];
  for (const [h, d] of courses) {
    const bandT = wallT * 0.5;
    put(parent2, box(len, h, bandT, COLORS.slabEdge, { rough: 0.88, cast: false }), 0, y + h / 2, zFor(wallT, d, bandT));
    y += h;
  }
  if (sign) buildGhostSign(parent2, len, wallT, sign);
}
function arcadeOpeningWidth(roomW, roomD) {
  const bayLong = Math.max(roomW, roomD) / ARCADE_BAYS_LONG;
  const bayShort = Math.min(roomW, roomD) / ARCADE_BAYS_SHORT;
  const bayW = Math.min(bayLong, bayShort);
  return Math.max(1.6, Math.min(bayW - PILASTER_W - BAY_MARGIN, MAX_OPEN_W));
}
function arcadeRoles(bays, withDoors) {
  const roles = new Array(bays).fill("window");
  if (!withDoors || bays <= ENTRANCE_BAY_INDEX) return roles;
  for (const i of GARAGE_BAY_INDICES) roles[i] = "garage";
  roles[ENTRANCE_BAY_INDEX] = "pedestrian";
  return roles;
}
function addGlazingBars(parent2, x, openW, wallT, { bottom, top, transoms = 2, fanlight = true }) {
  const h = top - bottom;
  if (h <= 0) return;
  const barZ = zFor(wallT, D_BARS, BAR_T);
  const barOpts = { rough: 0.6, metal: 0.3, cast: false };
  const lights = BAY_MULLIONS + 1;
  const offsetOf = (m) => -openW / 2 + m * openW / lights;
  for (let m = 1; m <= BAY_MULLIONS; m++) {
    put(parent2, box(BAR_T, h, BAR_T, COLORS.windowFrame, barOpts), x + offsetOf(m), bottom + h / 2, barZ);
  }
  for (let t = 1; t <= transoms; t++) {
    put(parent2, box(openW, BAR_T, BAR_T, COLORS.windowFrame, barOpts), x, bottom + t * h / (transoms + 1), barZ);
  }
  const impostT = wallT * 0.4;
  const impost = box(
    openW + 0.3,
    IMPOST_H,
    impostT,
    COLORS.slabEdge,
    { rough: 0.85, cast: false }
  );
  impost.position.set(x, top + IMPOST_H / 2, zFor(wallT, D_IMPOST, impostT));
  parent2.add(impost);
  if (!fanlight) return;
  const r = openW / 2;
  const fanBottom = top + IMPOST_H;
  for (let m = 1; m <= BAY_MULLIONS; m++) {
    const dx = offsetOf(m);
    const barH = top + Math.sqrt(Math.max(0, r * r - dx * dx)) - fanBottom;
    if (barH <= 0.05) continue;
    put(parent2, box(BAR_T, barH, BAR_T, COLORS.windowFrame, barOpts), x + dx, fanBottom + barH / 2, barZ);
  }
}
function addArchRing(parent2, x, r, wallT) {
  put(parent2, archRing(r, r + ARCH_RING_W, COLORS.slabEdge, { rough: 0.88 }), x, SPRING_Y, zFlat(wallT, D_RING));
}
function buildWindowBay(parent2, x, openW, wallT, isLit) {
  const r = openW / 2;
  const colour = isLit ? COLORS.windowLit : COLORS.windowDark;
  const gOpts = glassOpts(isLit);
  const glassZ = zFor(wallT, D_GLASS, GLASS_T);
  const glassH = SPRING_Y - OPENING_BOTTOM - SILL_H;
  const midY = OPENING_BOTTOM + SILL_H + glassH / 2;
  put(parent2, box(openW, glassH, GLASS_T, colour, gOpts), x, midY, glassZ);
  put(parent2, archFill(r - 0.05, colour, gOpts), x, SPRING_Y, zFlat(wallT, D_GLASS));
  addArchRing(parent2, x, r, wallT);
  addGlazingBars(parent2, x, openW, wallT, {
    bottom: OPENING_BOTTOM + SILL_H,
    top: SPRING_Y,
    transoms: 2
  });
  const sillT = wallT * 0.5;
  put(parent2, box(openW + 0.4, SILL_H, sillT, COLORS.slabEdge, { rough: 0.85, cast: false }), x, OPENING_BOTTOM + SILL_H / 2, zFor(wallT, D_SILL, sillT));
}
function buildLoadingBay(parent2, x, openW, wallT) {
  const headY = SPRING_Y + openW / 2;
  const doorH = headY - OPENING_BOTTOM;
  const leaf = box(
    openW,
    doorH,
    GLASS_T,
    COLORS.shutter,
    { rough: 0.7, metal: 0.35, cast: false }
  );
  leaf.position.set(x, OPENING_BOTTOM + doorH / 2, zFor(wallT, D_GLASS, GLASS_T));
  parent2.add(leaf);
  const ribZ = zFor(wallT, D_BARS, BAR_T);
  for (let i = 1; i <= DOOR_SLATS; i++) {
    put(parent2, box(openW - 0.16, 0.1, BAR_T, COLORS.shutterRib, { rough: 0.75, cast: false }), x, OPENING_BOTTOM + i * doorH / (DOOR_SLATS + 1), ribZ);
  }
  const lintelT = wallT * 0.45;
  put(parent2, box(openW + 0.5, 0.3, lintelT, COLORS.slabEdge, { rough: 0.85, cast: false }), x, headY + 0.15, zFor(wallT, D_LINTEL, lintelT));
}
function buildEntranceBay(parent2, x, openW, wallT) {
  const r = openW / 2;
  const glassZ = zFor(wallT, D_GLASS, GLASS_T);
  const screenH = SPRING_Y - OPENING_BOTTOM;
  put(parent2, box(openW, screenH, GLASS_T, COLORS.windowLit, glassOpts(true)), x, OPENING_BOTTOM + screenH / 2, glassZ);
  put(parent2, archFill(r - 0.05, COLORS.windowLit, glassOpts(true)), x, SPRING_Y, zFlat(wallT, D_GLASS));
  addArchRing(parent2, x, r, wallT);
  addGlazingBars(parent2, x, openW, wallT, {
    bottom: OPENING_BOTTOM,
    top: SPRING_Y,
    transoms: 2
  });
  const leaf = box(
    PED_W,
    PED_H,
    BAR_T,
    COLORS.shutter,
    { rough: 0.7, metal: 0.3, cast: false }
  );
  leaf.position.set(x, OPENING_BOTTOM + PED_H / 2, zFor(wallT, D_RING, BAR_T));
  parent2.add(leaf);
  const sillT = wallT * 0.5;
  put(parent2, box(PED_W + 1, SILL_H, sillT, COLORS.baseCourse, { rough: 0.9, cast: false }), x, OPENING_BOTTOM + SILL_H / 2, zFor(wallT, D_SILL, sillT));
}
function buildSteelWindow(parent2, x, y, wallT, w, h, isLit) {
  const glass = box(
    w,
    h,
    GLASS_T,
    isLit ? COLORS.windowLit : COLORS.windowDark,
    glassOpts(isLit)
  );
  glass.position.set(x, y, zFor(wallT, D_GLASS, GLASS_T));
  parent2.add(glass);
  const barZ = zFor(wallT, D_BARS, BAR_T);
  const barOpts = { rough: 0.6, metal: 0.3, cast: false };
  for (let m = 1; m <= 2; m++) {
    put(parent2, box(BAR_T, h, BAR_T, COLORS.windowFrame, barOpts), x - w / 2 + m * w / 3, y, barZ);
  }
  put(parent2, box(w, BAR_T, BAR_T, COLORS.windowFrame, barOpts), x, y, barZ);
  const sillT = wallT * 0.5;
  put(parent2, box(w + 0.3, 0.16, sillT, COLORS.slabEdge, { rough: 0.85, cast: false }), x, y - h / 2 - 0.08, zFor(wallT, D_SILL, sillT));
}
function buildGhostSign(parent2, len, wallT, text) {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = `#${COLORS.signPaint.toString(16).padStart(6, "0")}`;
  g.font = 'bold 170px "Arial Black", Impact, sans-serif';
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text.split("").join(" "), c.width / 2, c.height / 2 + 6);
  g.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 900; i++) {
    g.globalAlpha = spread(0.3, 0.5);
    g.fillRect(
      Math.random() * c.width,
      Math.random() * c.height,
      spread(2, 14),
      spread(2, 10)
    );
  }
  for (let i = 0; i < 7; i++) {
    g.globalAlpha = 0.3;
    g.fillRect(Math.random() * c.width, 0, spread(30, 90), c.height);
  }
  const tex = new THREE6.CanvasTexture(c);
  tex.colorSpace = THREE6.SRGBColorSpace;
  const plane = new THREE6.Mesh(
    new THREE6.PlaneGeometry(len - PILASTER_W * 2.5, SIGN_TOP - SIGN_BOTTOM),
    new THREE6.MeshStandardMaterial({
      map: tex,
      transparent: true,
      opacity: 0.85,
      roughness: 0.95,
      depthWrite: false
    })
  );
  plane.position.set(0, (SIGN_BOTTOM + SIGN_TOP) / 2, zFlat(wallT, D_SIGN));
  parent2.add(plane);
}
function loadingBayFractions() {
  return GARAGE_BAY_INDICES.map((i) => -0.5 + (i + 0.5) / ARCADE_BAYS_LONG);
}
function loadingBayWidth(roomW, roomD) {
  return arcadeOpeningWidth(roomW, roomD);
}
var PUNCH_ROWS = 2;
var PUNCH_WIN_W = 1.5;
var PUNCH_WIN_H = 2.6;
var PUNCH_PITCH = 3.4;
var D_BALCONY = 0.44;
function buildPunchedWall(parent2, len, wallT, { seen = false, atGround = false, lit }) {
  const BACKING_BLEED = 0.03;
  const backing = box(len, STOREY_H + BACKING_BLEED, wallT, COLORS.facadeLower, { rough: 0.92 });
  backing.position.y = BACKING_BLEED / 2;
  backing.castShadow = true;
  backing.receiveShadow = true;
  parent2.add(backing);
  if (!seen) return buildPlainPanes(parent2, len, wallT, lit, 1.3, 2);
  for (const row of [0, 1]) {
    const y = -STOREY_H / 2 + row * (STOREY_H / PUNCH_ROWS);
    put(parent2, box(len, 0.34, 0.5, COLORS.baseCourse, { rough: 0.9, cast: false }), 0, y + 0.17, zFor(wallT, D_SILL, 0.5));
  }
  const cols = Math.max(2, Math.round(len / PUNCH_PITCH));
  const stepX = len / cols;
  const rowStep = STOREY_H / PUNCH_ROWS;
  for (let row = 0; row < PUNCH_ROWS; row++) {
    const sill = -STOREY_H / 2 + row * rowStep + 0.9;
    const centreY = sill + PUNCH_WIN_H / 2;
    const isShopfront = atGround && row === 0;
    const h = isShopfront ? PUNCH_WIN_H + 0.9 : PUNCH_WIN_H;
    const y = isShopfront ? sill + h / 2 - 0.5 : centreY;
    for (let col = 0; col < cols; col++) {
      const x = -len / 2 + (col + 0.5) * stepX;
      const isLit = lit.n++ % LIT_EVERY === 0;
      const OUT = 0.28;
      for (const side of [-1, 1]) {
        put(parent2, box(OUT, h + 0.5, 0.3, COLORS.baseCourse, { rough: 0.9, cast: false }), x + side * (PUNCH_WIN_W + OUT) / 2, y, zFor(wallT, D_PIER, 0.3));
      }
      const lintel = box(
        PUNCH_WIN_W + OUT * 2,
        0.3,
        0.3,
        COLORS.baseCourse,
        { rough: 0.9, cast: false }
      );
      lintel.position.set(x, y + h / 2 + 0.15, zFor(wallT, D_PIER, 0.3));
      parent2.add(lintel);
      const stool = box(
        PUNCH_WIN_W + OUT * 2 + 0.3,
        0.22,
        0.42,
        COLORS.baseCourse,
        { rough: 0.9, cast: false }
      );
      stool.position.set(x, y - h / 2 - 0.11, zFor(wallT, D_SILL, 0.42));
      parent2.add(stool);
      const pane = box(
        PUNCH_WIN_W,
        h,
        GLASS_T,
        isLit ? COLORS.windowLit : COLORS.windowDark,
        glassOpts(isLit)
      );
      pane.position.set(x, y, zFor(wallT, D_GLASS, GLASS_T));
      if (isLit) markLitWindow(pane, LIT_GLOW);
      parent2.add(pane);
      const mull = box(
        0.1,
        h,
        0.1,
        COLORS.windowFrame ?? COLORS.frame,
        { rough: 0.7, cast: false }
      );
      mull.position.set(x, y, zFor(wallT, D_BARS, 0.1));
      parent2.add(mull);
      const trans = box(
        PUNCH_WIN_W,
        0.1,
        0.1,
        COLORS.windowFrame ?? COLORS.frame,
        { rough: 0.7, cast: false }
      );
      trans.position.set(x, y + h * 0.18, zFor(wallT, D_BARS, 0.1));
      parent2.add(trans);
      if (row === 1) {
        const railY = y - h / 2 + 0.55;
        const rail = box(
          PUNCH_WIN_W + 0.6,
          0.08,
          0.1,
          COLORS.metalDark,
          { rough: 0.5, metal: 0.5, cast: false }
        );
        rail.position.set(x, railY + 0.5, zFlat(wallT, D_BALCONY));
        parent2.add(rail);
        for (let b = 0; b < 6; b++) {
          const baluster = box(
            0.06,
            1,
            0.06,
            COLORS.metalDark,
            { rough: 0.5, metal: 0.5, cast: false }
          );
          baluster.position.set(
            x - (PUNCH_WIN_W + 0.4) / 2 + (b + 0.5) * ((PUNCH_WIN_W + 0.4) / 6),
            railY + 0.02,
            zFlat(wallT, D_BALCONY)
          );
          parent2.add(baluster);
        }
      }
    }
  }
}
var ROOFS = {
  mansard: { pitch: 0.86, inner: 2.6, over: 1.4, rise: 3.4, drop: 0.7, deck: 0.4, chimneys: true }
};
function buildRoof(kind, room) {
  const spec = ROOFS[kind] ?? ROOFS.mansard;
  const g = group(0, 0, 0);
  g.add(buildRoofPlane(spec, room.W + spec.over * 2, room.H, { dir: 1 }));
  const left = buildRoofPlane(spec, room.D + spec.over - spec.inner, room.H, {
    dir: -1,
    // Started past the corner rather than run into it: the back plane already covers
    // that square, and two slabs crossing there is a join no cap can hide.
    from: spec.inner
  });
  left.rotation.y = -Math.PI / 2;
  g.add(left);
  if (spec.chimneys) {
    const deckY = room.H + spec.rise + 0.43;
    const inset = spec.inner * 0.72;
    for (const [x, z] of [[room.W * 0.34, inset], [inset, room.D * 0.42]]) {
      g.add(buildChimney(x, deckY, z));
    }
  }
  const cornerFill = box(
    spec.inner + spec.over + 0.4,
    spec.rise + spec.drop + 0.1,
    spec.inner + spec.over + 0.4,
    COLORS.roofPlane,
    { rough: 0.9, cast: false }
  );
  cornerFill.position.set(
    (spec.inner - spec.over) / 2 - 0.2,
    room.H + (spec.rise - spec.drop) / 2,
    (spec.inner - spec.over) / 2 - 0.2
  );
  g.add(cornerFill);
  return g;
}
function buildRoofPlane(spec, length, wallTop, { dir = 1, from = -spec.over } = {}) {
  const g = group(0, 0, 0);
  const T = 0.34;
  const run = spec.inner + spec.over;
  const slabLen = Math.hypot(run, spec.rise + spec.drop);
  const cx = from + length / 2;
  const cz = dir * (spec.inner - spec.over) / 2;
  const cy = wallTop + (spec.rise - spec.drop) / 2;
  const pitch = Math.atan2(spec.rise + spec.drop, run);
  const slab = box(length, T, slabLen, COLORS.roofPlane, { rough: 0.9 });
  slab.castShadow = true;
  slab.receiveShadow = true;
  slab.position.set(cx, cy, cz);
  slab.rotation.x = -dir * pitch;
  g.add(slab);
  put(g, box(length, 0.55, 0.26, COLORS.roofTrim, { rough: 0.85, cast: false }), cx, wallTop - spec.drop - 0.18, dir * (-spec.over - 0.1));
  put(g, box(length, 0.36, 0.7, COLORS.roofTrim, { rough: 0.85, cast: false }), cx, wallTop + spec.rise + 0.1, dir * (spec.inner - 0.2));
  if (spec.deck) {
    put(g, box(length, 0.3, spec.inner * spec.deck, COLORS.roofPlane, { rough: 0.8, cast: false }), cx, wallTop + spec.rise + 0.28, dir * spec.inner * 0.72);
  }
  return g;
}
function buildChimney(x, y, z) {
  const g = group(x, y, z);
  const H = 3.2;
  put(g, box(1.6, H, 1.2, COLORS.facadeLower, { rough: 0.95 }), 0, H / 2);
  put(g, box(1.9, 0.24, 1.5, COLORS.baseCourse, { rough: 0.9, cast: false }), 0, H - 0.05);
  for (let i = 0; i < 3; i++) {
    const pot = new THREE6.Mesh(
      new THREE6.CylinderGeometry(0.21, 0.24, 0.8, 9),
      mat(COLORS.chimneyPot, { rough: 0.9 })
    );
    pot.castShadow = true;
    pot.position.set(-0.5 + i * 0.5, H + 0.5, 0);
    g.add(pot);
  }
  return g;
}

// dist/ui/roving/src/scene/outlooks/alder.js
import * as THREE8 from "three";

// dist/ui/roving/src/scene/outlooks/streetscape.js
import * as THREE7 from "three";
var WALK_Y = -1.12;
function buildTree(x, z, y = WALK_Y, scale = 1, mode = "summer") {
  const g = group(x, y, z);
  g.scale.setScalar(scale);
  if (mode === "winter") {
    const trunkH = 4;
    put(g, cyl(0.11, 0.3, trunkH, COLORS.branchBare, { segments: 7 }), 0, trunkH / 2);
    const branch = (along, bearing, tilt, len, rBase, rTip) => {
      const joint = group(0, along, 0);
      joint.quaternion.setFromUnitVectors(
        new THREE7.Vector3(0, 1, 0),
        new THREE7.Vector3(
          Math.sin(bearing) * Math.sin(tilt),
          Math.cos(tilt),
          Math.cos(bearing) * Math.sin(tilt)
        ).normalize()
      );
      const shaft = cyl(rTip, rBase, len, COLORS.branchBare, { segments: 5 });
      shaft.position.y = len / 2;
      shaft.castShadow = true;
      joint.add(shaft);
      return joint;
    };
    const limbs = [
      [0.6, 2.35, 0.72, 1.9],
      [2.7, 2.95, 0.6, 1.7],
      [4.6, 2.6, 0.62, 1.8],
      // The leader. It leaves below the trunk's own top and no thicker than the
      // trunk is there, so it reads as the trunk carrying on rather than a graft.
      [3.5, 3.4, 0.16, 2.4]
    ];
    g.rotation.y = Math.random() * Math.PI * 2;
    for (const [bearing, along, tilt, len] of limbs) {
      const limb = branch(along, bearing, tilt, len, tilt < 0.3 ? 0.13 : 0.1, 0.05);
      limb.add(branch(len * 0.7, 1.1, 0.46, len * 0.6, 0.05, 0.018));
      limb.add(branch(len * 0.93, -0.9, 0.28, len * 0.5, 0.045, 0.014));
      g.add(limb);
    }
  } else if (mode === "autumn") {
    put(g, cyl(0.26, 0.34, 3, 8016435, { segments: 7 }), 0, 1.5);
    const autumnPalettes = [
      [COLORS.autumnLeaf, COLORS.autumnLeafAlt, COLORS.autumnLeafDeep],
      [COLORS.autumnLeafAlt, COLORS.autumnLeaf, COLORS.autumnLeafDeep],
      [COLORS.autumnLeafDeep, COLORS.autumnLeaf, COLORS.autumnLeafAlt]
    ];
    const treePalette = pick(autumnPalettes);
    const blobCount = Math.random() > 0.4 ? 4 : 3;
    for (let i = 0; i < blobCount; i++) {
      const r = 1.9 - i * 0.28;
      const color = treePalette[i % treePalette.length];
      const blob = new THREE7.Mesh(
        new THREE7.IcosahedronGeometry(r, 0),
        mat(color, { flat: true, rough: 0.95 })
      );
      blob.position.set(
        Math.cos(i * 2.1) * 0.7,
        3.4 + i * 0.85,
        Math.sin(i * 2.1) * 0.7
      );
      blob.castShadow = true;
      g.add(blob);
    }
    if (Math.random() > 0.6) {
      const visibleBranch = new THREE7.Mesh(
        new THREE7.SphereGeometry(0.12, 4, 4),
        mat(COLORS.branchBare, { flat: true, rough: 0.9 })
      );
      visibleBranch.position.set(0.4, 3.2, -0.3);
      g.add(visibleBranch);
    }
  } else {
    put(g, cyl(0.26, 0.34, 3, 8016435, { segments: 7 }), 0, 1.5);
    const colors = mode === "spring" ? [COLORS.leaf, COLORS.leafDark, 16440551] : [COLORS.leaf, COLORS.leafDark, 8366187];
    for (let i = 0; i < 4; i++) {
      const r = 1.9 - i * 0.28;
      const blob = new THREE7.Mesh(
        new THREE7.IcosahedronGeometry(r, 0),
        mat(colors[i % colors.length], { flat: true, rough: 0.95 })
      );
      blob.position.set(
        Math.cos(i * 2.1) * 0.7,
        3.4 + i * 0.85,
        Math.sin(i * 2.1) * 0.7
      );
      blob.castShadow = true;
      g.add(blob);
    }
  }
  return g;
}
function buildBush(x, z, y, mode = "summer") {
  const g = group(x, y, z);
  if (mode === "winter") {
    for (let i = 0; i < 3; i++) {
      const bush = new THREE7.Mesh(
        new THREE7.IcosahedronGeometry(spread(0.65, 0.25), 0),
        mat(i % 2 ? COLORS.evergreenDark : COLORS.evergreen, { flat: true, rough: 0.95 })
      );
      bush.position.set((i - 1) * 0.7, 0.45, i % 2 * 0.4);
      bush.castShadow = true;
      g.add(bush);
      const snowCap = new THREE7.Mesh(
        new THREE7.IcosahedronGeometry(0.3, 0),
        mat(COLORS.snow, { flat: true, rough: 1 })
      );
      snowCap.position.set((i - 1) * 0.7, 1.15, i % 2 * 0.4);
      g.add(snowCap);
    }
  } else if (mode === "autumn") {
    const autumnColors = [COLORS.autumnLeaf, COLORS.autumnLeafAlt, COLORS.autumnLeafDeep];
    for (let i = 0; i < 3; i++) {
      const b = new THREE7.Mesh(
        new THREE7.IcosahedronGeometry(spread(0.75, 0.35), 0),
        mat(autumnColors[i % autumnColors.length], { flat: true, rough: 0.95 })
      );
      b.position.set((i - 1) * 0.7, 0.55, i % 2 * 0.5);
      b.castShadow = true;
      g.add(b);
    }
  } else {
    for (let i = 0; i < 3; i++) {
      const b = new THREE7.Mesh(
        new THREE7.IcosahedronGeometry(spread(0.75, 0.35), 0),
        mat(i % 2 ? COLORS.leafDark : COLORS.leaf, { flat: true, rough: 0.95 })
      );
      b.position.set((i - 1) * 0.7, 0.55, i % 2 * 0.5);
      b.castShadow = true;
      g.add(b);
    }
  }
  return g;
}
function buildBench(x, z, y, rotationY = 0, mode = "summer") {
  const g = group(x, y, z);
  g.rotation.y = rotationY;
  const seat = box(3, 0.14, 0.9, 9067064, { rough: 0.85 });
  seat.position.y = 0.75;
  g.add(seat);
  const back = box(3, 0.8, 0.14, 9067064, { rough: 0.85 });
  back.position.set(0, 1.2, -0.42);
  g.add(back);
  for (const sx of [-1.25, 1.25]) {
    const leg = box(0.16, 0.75, 0.8, COLORS.metalDark, { metal: 0.4 });
    leg.position.set(sx, 0.38, 0);
    g.add(leg);
  }
  if (mode === "winter") {
    put(g, box(3.2, 0.12, 1, COLORS.snow, { rough: 1, cast: false }), 0, 0.88);
    put(g, box(3.2, 0.16, 0.2, COLORS.snow, { rough: 1, cast: false }), 0, 1.42, -0.32);
  }
  return g;
}
function mixHex(from, to, amount) {
  const a = Math.max(0, Math.min(1, amount));
  const channel = (shift2) => {
    const near = from >> shift2 & 255;
    const far = to >> shift2 & 255;
    return Math.round(near * (1 - a) + far * a) & 255;
  };
  return channel(16) << 16 | channel(8) << 8 | channel(0);
}
function hazed(hex, amount) {
  return mixHex(hex, COLORS.haze, amount);
}
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = s * 1664525 + 1013904223 >>> 0;
    return s / 4294967296;
  };
}
function buildStreetLamp(x, z, y, scale = 1, mode = "summer", rotationY = 0) {
  const g = group(x, y, z);
  g.scale.setScalar(scale);
  g.rotation.y = rotationY;
  const base = cyl(0.24, 0.3, 0.35, COLORS.metalDark, { segments: 10 });
  base.position.y = 0.17;
  g.add(base);
  const pole = cyl(0.11, 0.13, 5.4, 3817544, { segments: 8 });
  pole.position.y = 2.7;
  g.add(pole);
  const arm = box(1.1, 0.12, 0.12, 3817544);
  arm.position.set(0.5, 5.35, 0);
  g.add(arm);
  const headMaterial = new THREE7.MeshStandardMaterial({
    color: 16773842,
    emissive: 16770749,
    emissiveIntensity: 0,
    roughness: 0.5
  });
  const head = new THREE7.Mesh(new THREE7.SphereGeometry(0.3, 10, 8), headMaterial);
  head.position.set(1, 5.25, 0);
  g.add(head);
  const lighting = streetLampLighting(1, 0.06, headMaterial);
  g.add(lighting.pool);
  markNightLight(g, lighting);
  if (mode === "winter") {
    put(g, box(0.7, 0.15, 0.7, COLORS.snow, { rough: 1, cast: false }), 1, 5.65, 0);
  }
  return g;
}
function buildCar(x, z, color, rotationY = 0, mode = "summer") {
  const g = group(x, WALK_Y - 0.16, z);
  g.rotation.y = rotationY;
  const BODY_H = 0.75;
  const BODY_TOP = 0.75 + BODY_H / 2;
  const CABIN_W = 2.3, CABIN_D = 1.72, CABIN_H = 0.62;
  const CABIN_X = -0.15;
  const CABIN_TOP = 1.4 + CABIN_H / 2;
  const body = box(4.2, BODY_H, 1.9, color, { rough: 0.45, metal: 0.25 });
  body.position.y = 0.75;
  g.add(body);
  const cabin = box(CABIN_W, CABIN_H, CABIN_D, 2896440, { rough: 0.3, metal: 0.2 });
  cabin.position.set(CABIN_X, 1.4, 0);
  g.add(cabin);
  const GLASS_PROUD = 0.03;
  const glassSide = box(
    CABIN_W + GLASS_PROUD * 2,
    0.3,
    CABIN_D + GLASS_PROUD * 2,
    9418441,
    { rough: 0.15, cast: false }
  );
  glassSide.position.set(CABIN_X, 1.44, 0);
  g.add(glassSide);
  for (const sx of [-1.35, 1.35]) {
    for (const sz of [-0.98, 0.98]) {
      const wheel = cyl(0.42, 0.42, 0.3, 1777186, { segments: 12 });
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(sx, 0.42, sz);
      g.add(wheel);
    }
  }
  const hl = box(0.1, 0.18, 0.4, 16773327, { emissive: 16770749, emissiveIntensity: 0.5, cast: false });
  hl.position.set(2.1, 0.8, 0.55);
  g.add(hl);
  const tl = box(0.1, 0.18, 0.4, 12597547, { emissive: 10038562, emissiveIntensity: 0.4, cast: false });
  tl.position.set(-2.1, 0.8, 0.55);
  g.add(tl);
  if (mode === "winter") {
    const snowCap = (w, d, x2, surfaceY, h) => {
      const cap = box(w, h, d, COLORS.snow, { rough: 1, cast: false });
      cap.position.set(x2, surfaceY - 0.03 + h / 2, 0);
      return cap;
    };
    g.add(snowCap(CABIN_W - 0.1, CABIN_D - 0.1, CABIN_X, CABIN_TOP, 0.16));
    const cabinFront = CABIN_X + CABIN_W / 2;
    const cabinRear = CABIN_X - CABIN_W / 2;
    const NOSE = 2.1 - 0.04;
    for (const [from, to] of [[cabinFront + 0.02, NOSE], [-NOSE, cabinRear - 0.02]]) {
      g.add(snowCap(to - from, 1.78, (from + to) / 2, BODY_TOP, 0.1));
    }
  }
  return g;
}

// dist/ui/roving/src/scene/outlooks/alder-layout.js
var ALDER = {
  min: -108,
  max: 112,
  roadWidth: 8,
  walkWidth: 3.6,
  avenues: [-63, -7.6, 62],
  streets: [-61, -7.6, 55],
  park: { x0: -55.4, x1: -15.2, z0: 0, z1: 47.4 }
};
var crossings = [];
for (const x of ALDER.avenues) for (const z of ALDER.streets) {
  for (const offset of [-7.1, 7.1]) {
    crossings.push({ x: x + offset, z, axis: "x", width: 3.2 });
    crossings.push({ x, z: z + offset, axis: "z", width: 3.2 });
  }
}
crossings.push({ x: -7.6, z: 18, axis: "z", width: 3.2 });
function intervals(centres) {
  const edges = [ALDER.min, ...centres.flatMap((c) => [c - 4, c + 4]), ALDER.max];
  return edges.flatMap((v, i) => i % 2 === 0 ? [[v, edges[i + 1]]] : []);
}
var pavements = intervals(ALDER.avenues).flatMap(([x0, x1]) => intervals(ALDER.streets).map(([z0, z1]) => ({ x0, x1, z0, z1 })));
var buildings = [
  [7, -25, 16, 16, 12.8, 0, true],
  [27, -26, 18, 18, 16, 1, true],
  [47, -25, 15, 16, 12.8, 2, true],
  [6, -48, 14, 13, 19.2, 2, false],
  [29, -49, 17, 12, 12.8, 0, true],
  [48, -49, 12, 12, 22.4, 3, false],
  [-46, -24, 17, 15, 12.8, 1, true],
  [-25, -25, 16, 16, 9.6, 0, true],
  [-47, -47, 17, 13, 19.2, 2, true],
  [-25, -49, 17, 12, 16, 3, true],
  [-80, 7, 17, 18, 12.8, 0, true],
  [-80, 31, 17, 20, 16, 1, true],
  [-80, -25, 17, 17, 19.2, 2, true],
  [-81, -48, 18, 13, 16, 0, false],
  [81, -25, 20, 18, 19.2, 2, true],
  [81, -48, 19, 13, 25.6, 3, true],
  [-45, -80, 19, 20, 22.4, 0, true],
  [-22, -81, 18, 21, 28.8, 3, true],
  [7, -82, 18, 23, 22.4, 1, true],
  [33, -82, 21, 22, 32, 2, true],
  [-44, 76, 20, 23, 12.8, 2, true],
  [83, 77, 22, 22, 19.2, 3, true]
].map(([x, z, w, d, h, facade, terrace]) => ({ x, z, w, d, h, facade, terrace }));
var parking = [20, 37, 49].map((x) => ({ x, z: -12.95, w: 5.5, d: 2.7 }));
var ramps = crossings.flatMap((p) => [-1, 1].map((direction) => {
  const alongX = p.axis === "z";
  return {
    x: p.x + (alongX ? direction * 4.6 : 0),
    z: p.z + (alongX ? 0 : direction * 4.6),
    w: alongX ? 1.2 : p.width + 0.4,
    d: alongX ? p.width + 0.4 : 1.2,
    direction,
    alongX
  };
}));
var pavingCuts = [...parking, ...ramps].map((p) => ({
  x0: p.x - p.w / 2,
  x1: p.x + p.w / 2,
  z0: p.z - p.d / 2,
  z1: p.z + p.d / 2
}));
function subtractRectangle(rect, cut) {
  const x0 = Math.max(rect.x0, cut.x0), x1 = Math.min(rect.x1, cut.x1);
  const z0 = Math.max(rect.z0, cut.z0), z1 = Math.min(rect.z1, cut.z1);
  if (x1 <= x0 || z1 <= z0) return [rect];
  return [
    { ...rect, x1: x0 },
    { ...rect, x0: x1 },
    { x0, x1, z0: rect.z0, z1: z0 },
    { x0, x1, z0: z1, z1: rect.z1 }
  ].filter((p) => p.x1 - p.x0 > 1e-4 && p.z1 - p.z0 > 1e-4);
}

// dist/ui/roving/src/scene/outlooks/alder.js
var STONE = [13747627, 11764585, 14341830, 10136491];
function canvasTexture(canvas2) {
  const texture = new THREE8.CanvasTexture(canvas2);
  texture.colorSpace = THREE8.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
function facadeAtlas(style = "alder", palette = STONE) {
  const canvas2 = document.createElement("canvas");
  const glow2 = document.createElement("canvas");
  canvas2.width = canvas2.height = glow2.width = glow2.height = 1024;
  const c = canvas2.getContext("2d"), e = glow2.getContext("2d");
  const tones = palette.map((tone) => `#${tone.toString(16).padStart(6, "0")}`);
  const rand = seeded(2017);
  e.fillStyle = "#000";
  e.fillRect(0, 0, 1024, 1024);
  for (let tile = 0; tile < 4; tile++) for (let level = 0; level < 4; level++) {
    const tx = tile * 256, ty = level * 256, floors = level + 2;
    c.fillStyle = tones[tile];
    c.fillRect(tx, ty, 256, 256);
    if (style === "industrial") {
      c.fillStyle = "#526356";
      c.font = "bold 9px sans-serif";
      c.fillText(tile % 2 ? "COOPERATIVE WORKS" : "STUDIOS & WORKSHOPS", tx + 12, ty + 9);
    }
    for (let row = 0; row < floors; row++) {
      const y = ty + 12 + row * (232 / floors), height = 232 / floors;
      c.fillStyle = "rgba(66,62,52,.12)";
      c.fillRect(tx + 3, y + height - 6, 250, 2);
      for (let col = 0; col < 5; col++) {
        const x = tx + 12 + col * 48, w = style === "tower" ? 41 : style === "paris" ? 23 : 31;
        const h = height * (style === "tower" ? 0.87 : 0.69);
        c.fillStyle = "#465a5b";
        c.fillRect(x - 2, y - 1, w + 4, h + 4);
        const glass = c.createLinearGradient(x, y, x, y + h);
        glass.addColorStop(0, "#91b0b3");
        glass.addColorStop(0.4, "#63878e");
        glass.addColorStop(1, "#344f58");
        c.fillStyle = glass;
        c.fillRect(x, y, w, h);
        c.fillStyle = "rgba(230,238,220,.3)";
        c.fillRect(x + 2, y + 1, w * 0.35, h - 2);
        if (rand() < 0.28) {
          c.fillStyle = "#b5b9ad";
          c.fillRect(x, y, w, h * 0.32);
          e.fillStyle = rand() < 0.5 ? "#ead3a0" : "#dce4cc";
          e.fillRect(x, y, w, h);
        }
        c.fillStyle = tones[tile];
        c.fillRect(x + w * 0.5, y, 1.5, h);
        c.fillStyle = "#ede4cd";
        c.fillRect(x - 2, y + h + 2, w + 4, 2);
        if (style === "industrial") {
          c.fillStyle = "#87978b";
          for (const f of [0.25, 0.75]) c.fillRect(x + w * f, y, 1, h);
          for (const f of [0.33, 0.66]) c.fillRect(x, y + h * f, w, 1);
        } else if (style === "paris") {
          c.fillStyle = "#48554e";
          c.fillRect(x - 3, y + h - 7, w + 6, 1.5);
          for (let bar = 0; bar < w; bar += 4) c.fillRect(x + bar, y + h - 7, 1, 9);
        }
      }
    }
  }
  return { map: canvasTexture(canvas2), emissiveMap: canvasTexture(glow2) };
}
function roadTexture(season) {
  const canvas2 = document.createElement("canvas");
  canvas2.width = canvas2.height = 2048;
  const c = canvas2.getContext("2d"), scale = 2048 / (ALDER.max - ALDER.min);
  c.scale(scale, scale);
  c.translate(-ALDER.min, -ALDER.min);
  c.fillStyle = season === "winter" ? "#bdc7c9" : "#818f91";
  c.fillRect(ALDER.min, ALDER.min, 220, 220);
  c.fillStyle = season === "winter" ? "#7a878b" : "#707f83";
  for (const z of ALDER.streets) c.fillRect(ALDER.min, z - 3.5, 220, 7);
  for (const x of ALDER.avenues) c.fillRect(x - 3.5, ALDER.min, 7, 220);
  const nearCrossing = (x, z) => crossings.some((p) => p.axis === "x" ? Math.abs(z - p.z) < 4.1 && Math.abs(x - p.x) < p.width / 2 + 1.8 : Math.abs(x - p.x) < 4.1 && Math.abs(z - p.z) < p.width / 2 + 1.8);
  c.fillStyle = season === "winter" ? "#c7cdca" : "#e7e4cd";
  for (let t = ALDER.min + 2; t < ALDER.max - 2; t += 4.8) {
    for (const z of ALDER.streets) {
      if (!ALDER.avenues.some((x) => Math.abs(t - x) < 6) && !nearCrossing(t, z)) c.fillRect(t - 1, z - 0.09, 2, 0.18);
    }
    for (const x of ALDER.avenues) {
      if (!ALDER.streets.some((z) => Math.abs(t - z) < 6) && !nearCrossing(x, t)) c.fillRect(x - 0.09, t - 1, 0.18, 2);
    }
  }
  c.fillStyle = season === "winter" ? "#dce1dd" : "#f1efdf";
  for (const { x, z, axis, width } of crossings) {
    for (let i = -3.5; i < 3.7; i += 1) {
      if (axis === "x") c.fillRect(x - width / 2, z + i, width, 0.52);
      else c.fillRect(x + i, z - width / 2, 0.52, width);
    }
  }
  return canvasTexture(canvas2);
}
function buildAlderStreet(parent2, season = "summer", district = {}) {
  const style = district.style ?? "alder";
  const palette = style === "tower" ? [10859694, 10983553, 11057343, 8953759] : STONE;
  const root = new THREE8.Group();
  root.name = `${district.id ?? "alder"}-garden-city`;
  root.position.y = district.offsetY ?? 0;
  parent2.add(root);
  const rand = seeded(2019), winter = season === "winter";
  const batches2 = /* @__PURE__ */ new Map();
  const shapes = {
    box: new THREE8.BoxGeometry(1, 1, 1),
    crown: new THREE8.OctahedronGeometry(1, 1),
    trunk: new THREE8.CylinderGeometry(0.65, 1, 1, 6),
    ramp: new THREE8.BufferGeometry(),
    shed: new THREE8.BufferGeometry()
  };
  shapes.ramp.setAttribute("position", new THREE8.Float32BufferAttribute([
    -0.5,
    -0.5,
    -0.5,
    -0.5,
    -0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    -0.5,
    -0.5,
    -0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    -0.5
  ], 3));
  shapes.ramp.computeVertexNormals();
  shapes.shed.setAttribute("position", new THREE8.Float32BufferAttribute([
    -0.5,
    -0.5,
    -0.5,
    -0.5,
    -0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    -0.5,
    -0.5,
    -0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    -0.5,
    0.5,
    -0.5,
    0.5,
    0.5,
    -0.5,
    -0.5,
    0.5,
    0.5,
    -0.5,
    0.5,
    -0.5,
    0.5,
    0.5,
    0.5,
    -0.5,
    0.5,
    0.5,
    0.5,
    -0.5,
    -0.5,
    0.5,
    0.5,
    -0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    -0.5,
    -0.5,
    -0.5,
    -0.5,
    -0.5,
    0.5,
    0.5,
    -0.5
  ], 3));
  shapes.shed.computeVertexNormals();
  const plain = new THREE8.MeshLambertMaterial({ color: 16777215 });
  function part(shape, x, y, z, w, h, d, color, shadow = false, rotation = 0) {
    const key = `${shape}/${shadow}/${Math.floor(x / 48)}/${Math.floor(z / 48)}`;
    if (!batches2.has(key)) batches2.set(key, { shape, shadow, items: [] });
    batches2.get(key).items.push({ x, y, z, w, h, d, color, rotation });
  }
  const block = (x, y, z, w, h, d, color, shadow = false) => part("box", x, y, z, w, h, d, color, shadow);
  function bed(x, y, z, w, d) {
    block(x, y + 0.17, z, w, 0.34, d, 12894121);
    block(x, y + 0.39, z, w - 0.25, 0.18, d - 0.25, winter ? 14804959 : 6323799);
  }
  function tree(x, z, y = WALK_Y, scale2 = 1, shadow = false) {
    part("trunk", x, y + 1.65 * scale2, z, 0.23 * scale2, 3.3 * scale2, 0.23 * scale2, 7957585, shadow);
    const palette2 = winter ? [8559488, 11057058, 13030081] : season === "autumn" ? [10197847, 11644004, 7311695] : season === "spring" ? [9219185, 10139773, 8693866] : [7442273, 8560239, 7246180];
    for (let i = 0; i < 3; i++) {
      part(
        "crown",
        x + (i - 1) * 0.55 * scale2,
        y + (4.4 + i * 0.42) * scale2,
        z + (i % 2 ? 0.42 : -0.25) * scale2,
        (1.7 - i * 0.2) * scale2,
        (2.05 - i * 0.15) * scale2,
        1.55 * scale2,
        palette2[i],
        shadow,
        rand() * 2
      );
    }
  }
  function hedge(x, y, z, w, d) {
    block(x, y + 0.22, z, w, 0.44, d, winter ? 13096385 : 7836518);
  }
  const roadGeometry = new THREE8.PlaneGeometry(2e3, 2e3);
  const uv = roadGeometry.attributes.uv;
  const scale = 2e3 / (ALDER.max - ALDER.min);
  for (let i = 0; i < uv.count; i++) uv.setXY(
    i,
    (uv.getX(i) - 0.5) * scale + 0.5,
    (uv.getY(i) - 0.5) * scale + 0.5
  );
  const road = new THREE8.Mesh(
    roadGeometry,
    new THREE8.MeshLambertMaterial({ map: roadTexture(season) })
  );
  road.name = "district-ground";
  road.rotation.x = -Math.PI / 2;
  road.position.set(2, STREET_Y + 0.025, 2);
  road.receiveShadow = true;
  root.add(road);
  for (const p of pavements) {
    for (const cap of [false, true]) {
      const inset = cap ? 0.11 : 0;
      let pieces = [{ x0: p.x0 + inset, x1: p.x1 - inset, z0: p.z0 + inset, z1: p.z1 - inset }];
      for (const cut of [...pavingCuts, ...district.cuts ?? []]) pieces = pieces.flatMap((rect) => subtractRectangle(rect, cut));
      for (const s of pieces) block(
        (s.x0 + s.x1) / 2,
        WALK_Y + (cap ? 0.015 : -0.115),
        (s.z0 + s.z1) / 2,
        s.x1 - s.x0,
        cap ? 0.03 : 0.23,
        s.z1 - s.z0,
        cap ? winter ? 14870751 : 13948612 : 12041390
      );
    }
  }
  for (const r of ramps) {
    const top = WALK_Y + 0.03, bottom = STREET_Y + 0.027;
    const rotation = r.alongX ? r.direction > 0 ? 0 : Math.PI : -r.direction * Math.PI / 2;
    part(
      "ramp",
      r.x,
      (top + bottom) / 2,
      r.z,
      1.2,
      top - bottom,
      r.alongX ? r.d : r.w,
      winter ? 14081493 : 13948612,
      false,
      rotation
    );
  }
  for (const [i, p] of parking.entries()) {
    block(p.x, STREET_Y + 0.04, p.z, p.w, 0.02, p.d, 8951447);
    const car = buildCar(p.x, p.z, [7179144, 12760218, 11254199][i], 0, season);
    car.position.y = STREET_Y + 0.05;
    root.add(car);
  }
  if (district.serviceYard) {
    block(ROOM.W / 2, STREET_Y + 0.04, ROOM.D + 4.5, ROOM.W + 3, 0.08, 9, winter ? 13357771 : 11976371);
    block(-2.55, STREET_Y + 0.03, ROOM.D + 4.05, 2.1, 0.06, 5, 8951447);
    if (!winter) {
      const bayW = loadingBayWidth(ROOM.W, ROOM.D);
      for (const fraction of loadingBayFractions()) {
        const x = ROOM.W / 2 + fraction * ROOM.W;
        for (const dx of [-bayW / 2, bayW / 2]) block(x + dx, STREET_Y + 0.094, ROOM.D + 3.4, 0.12, 0.012, 5.4, 14801856);
      }
    }
  }
  const park = ALDER.park, parkX = (park.x0 + park.x1) / 2, parkZ = (park.z0 + park.z1) / 2;
  block(parkX, WALK_Y + 0.07, parkZ, park.x1 - park.x0, 0.06, park.z1 - park.z0, winter ? 14739161 : 10268544);
  const path = winter ? 13358539 : 14538170;
  for (const [x, z, w, d] of [
    [-19, 23.7, 3, 47.4],
    [-51.6, 23.7, 3, 47.4],
    [-35.3, 4, 29.6, 3],
    [-35.3, 43.4, 29.6, 3],
    [-35.3, 18, 29.6, 3],
    [-16.4, 18, 2.2, 3]
  ]) {
    block(x, WALK_Y + 0.12, z, w, 0.02, d, path);
  }
  const shore = new THREE8.Mesh(new THREE8.RingGeometry(0.97, 1.07, 40), new THREE8.MeshLambertMaterial({ color: winter ? 13358792 : 11973526 }));
  const pondWidth = style === "industrial" ? 11 : style === "paris" ? 6.5 : 9;
  shore.rotation.x = -Math.PI / 2;
  shore.scale.set(pondWidth, 5.3, 1);
  shore.position.set(-36, WALK_Y + 0.155, 31);
  root.add(shore);
  const pond = new THREE8.Mesh(new THREE8.CircleGeometry(1, 40), new THREE8.MeshLambertMaterial({ color: winter ? 11849937 : 7906977 }));
  pond.rotation.x = -Math.PI / 2;
  pond.scale.set(pondWidth, 5.3, 1);
  pond.position.set(-36, WALK_Y + 0.135, 31);
  root.add(pond);
  block(-35.8, WALK_Y + 0.2, 31, 2.2, 0.13, 12.1, 11575934);
  for (const [from, to] of [[19.5, 24.95], [37.05, 41.9]]) {
    block(-35.8, WALK_Y + 0.12, (from + to) / 2, 2.2, 0.02, to - from, path);
  }
  for (const [x, z] of [[-45, 32], [-40, 37.2], [-31, 36.5], [-25, 31]]) bed(x, WALK_Y + 0.11, z, 3.6, 1.2);
  for (const x of [-44.5, -40.5, -36.5]) {
    for (const z of [8, 13]) block(x, WALK_Y + 1.9, z, 0.12, 3.8, 0.12, 6847344);
    block(x, WALK_Y + 3.9, 10.5, 3.8, 0.14, 5.6, 4482668);
  }
  for (const z of [2, 11, 26, 40, 46]) {
    tree(-23.5, z, WALK_Y + 0.1, 0.9 + rand() * 0.15, true);
    tree(-47.5, z, WALK_Y + 0.1, 1 + rand() * 0.15, true);
  }
  for (const [x, z, rot] of [[-21, 23, 0], [-49.5, 23, 0], [-42, 6.2, Math.PI / 2], [-30, 41, Math.PI / 2]]) {
    part("box", x, WALK_Y + 0.52, z, 0.7, 0.15, 2.3, 10852470, false, rot);
    for (const offset of [-0.7, 0.7]) part("box", x + Math.sin(rot) * offset, WALK_Y + 0.25, z + Math.cos(rot) * offset, 0.45, 0.5, 0.15, 6585200, false, rot);
  }
  const { map, emissiveMap } = facadeAtlas(style, palette);
  const facadeMaterial = new THREE8.MeshLambertMaterial({ map, emissiveMap, emissive: 16777215 });
  const positions = [], normals = [], uvs = [];
  function facade(points, normal, style2, floors) {
    const col = style2, row = Math.max(0, Math.min(3, floors - 2));
    const uv2 = [
      [(col * 256 + 3) / 1024, 1 - (row * 256 + 253) / 1024],
      [(col * 256 + 253) / 1024, 1 - (row * 256 + 253) / 1024],
      [(col * 256 + 253) / 1024, 1 - (row * 256 + 3) / 1024],
      [(col * 256 + 3) / 1024, 1 - (row * 256 + 3) / 1024]
    ];
    for (const i of [0, 1, 2, 0, 2, 3]) {
      positions.push(...points[i]);
      normals.push(...normal);
      uvs.push(...uv2[i]);
    }
  }
  function volume(x, y, z, w, h, d, family, greenRoof = true) {
    const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2;
    block(x, y + h / 2, z, w, h, d, palette[family]);
    const count = style === "tower" ? Math.ceil(h / 16) : 1;
    for (let band = 0; band < count; band++) {
      const lo = y + 0.28 + band * (h - 0.54) / count;
      const hi = y + 0.28 + (band + 1) * (h - 0.54) / count;
      const f = Math.round(h / count / 3.2);
      facade([[x0, lo, z1 + 0.025], [x1, lo, z1 + 0.025], [x1, hi, z1 + 0.025], [x0, hi, z1 + 0.025]], [0, 0, 1], family, f);
      facade([[x1 + 0.025, lo, z1], [x1 + 0.025, lo, z0], [x1 + 0.025, hi, z0], [x1 + 0.025, hi, z1]], [1, 0, 0], family, f);
      facade([[x1, lo, z0 - 0.025], [x0, lo, z0 - 0.025], [x0, hi, z0 - 0.025], [x1, hi, z0 - 0.025]], [0, 0, -1], family, f);
      facade([[x0 - 0.025, lo, z0], [x0 - 0.025, lo, z1], [x0 - 0.025, hi, z1], [x0 - 0.025, hi, z0]], [-1, 0, 0], family, f);
    }
    if (!greenRoof) return;
    block(x, y + h + 0.12, z, w + 0.45, 0.24, d + 0.45, 14736587);
    block(x, y + h + 0.28, z, w - 0.45, 0.07, d - 0.45, winter ? 14147793 : 8954747);
  }
  const roofPositions = [], roofColours = [];
  function roofQuad(points, tint) {
    const a = new THREE8.Vector3(...points[0]), b = new THREE8.Vector3(...points[1]), c = new THREE8.Vector3(...points[2]);
    const order = b.sub(a).cross(c.sub(a)).y < 0 ? [0, 2, 1, 0, 3, 2] : [0, 1, 2, 0, 2, 3];
    const colour = new THREE8.Color(tint);
    for (const i of order) {
      roofPositions.push(...points[i]);
      roofColours.push(colour.r, colour.g, colour.b);
    }
  }
  function courtyard(b, y) {
    const wall = 4.8, innerW = b.w - wall * 2, innerD = b.d - wall * 2;
    for (const dz of [-1, 1]) volume(b.x, y, b.z + dz * (b.d - wall) / 2, b.w, b.h, wall, b.facade, false);
    for (const dx of [-1, 1]) volume(b.x + dx * (b.w - wall) / 2, y, b.z, wall, b.h, innerD, b.facade, false);
    const ring = (w, d, height) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([dx, dz]) => [b.x + dx * w / 2, height, b.z + dz * d / 2]);
    const bottom = y + b.h + 0.04, top = bottom + 2.8;
    const outer = ring(b.w + 0.4, b.d + 0.4, bottom), ridge = ring(b.w - 2.4, b.d - 2.4, top);
    const innerRidge = ring(innerW + 2.4, innerD + 2.4, top), inner = ring(innerW, innerD, bottom);
    const zinc = winter ? 12175561 : b.facade === 2 ? 8492699 : 7571599;
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      roofQuad([outer[i], outer[j], ridge[j], ridge[i]], zinc);
      roofQuad([ridge[i], ridge[j], innerRidge[j], innerRidge[i]], zinc);
      roofQuad([innerRidge[i], innerRidge[j], inner[j], inner[i]], zinc);
    }
    for (const dx of [-b.w * 0.29, 0, b.w * 0.29]) {
      block(b.x + dx, bottom + 1.22, b.z + b.d / 2 - 0.48, 1.2, 1.45, 1.25, zinc);
      block(b.x + dx, bottom + 1.31, b.z + b.d / 2 + 0.165, 0.68, 0.82, 0.025, 4020577);
    }
    for (const dz of [-b.d * 0.22, b.d * 0.22]) {
      block(b.x - b.w / 2 + 2.1, top + 0.44, b.z + dz, 1.35, 1.25, 0.85, 10914933);
      for (const dx of [-0.35, 0.35]) part(
        "trunk",
        b.x - b.w / 2 + 2.1 + dx,
        top + 1.38,
        b.z + dz,
        0.16,
        0.75,
        0.16,
        10383703
      );
    }
    bed(b.x, y + 0.04, b.z, Math.max(2, innerW - 2), Math.max(2, innerD - 3));
    for (const dz of [-innerD * 0.23, innerD * 0.23]) tree(b.x, b.z + dz, y + 0.46, 0.78);
  }
  for (const b of district.buildings ?? buildings) {
    const y = WALK_Y + 0.05;
    if (style === "paris") {
      courtyard(b, y);
      continue;
    }
    if (style === "industrial" && !b.terrace) {
      volume(b.x, y, b.z, b.w, b.h, b.d, b.facade, false);
      const teeth = Math.max(3, Math.round(b.w / 5)), pitch = b.w / teeth;
      for (let i = 0; i < teeth; i++) {
        const x = b.x - b.w / 2 + (i + 0.5) * pitch;
        part("shed", x, y + b.h + 0.9, b.z, pitch, 1.8, b.d + 0.25, winter ? 12964042 : 8558476);
        block(x + pitch / 2 + 0.026, y + b.h + 0.9, b.z, 0.025, 1.4, b.d - 0.2, 7640730);
      }
      bed(b.x, y, b.z + b.d / 2 + 1.1, b.w * 0.75, 1.1);
      continue;
    }
    volume(b.x, y, b.z, b.w, b.h, b.d, b.facade);
    if (b.terrace) {
      const h = b.towerHeight ?? 6.4, upperY = y + b.h + 0.34;
      volume(b.x - 0.6, upperY, b.z - 1.6, b.w - 5.2, h, b.d - 5.4, b.facade);
      hedge(b.x, upperY, b.z + b.d / 2 - 0.75, b.w - 1.5, 0.8);
      for (const dx of [-b.w / 2 + 1.5, b.w / 2 - 1.5]) tree(b.x + dx, b.z + b.d / 2 - 1.8, upperY, 0.45);
      for (const dx of [-b.w * 0.28, b.w * 0.28]) {
        bed(b.x + dx, y + b.h * 0.5, b.z + b.d / 2 + 0.33, 3.2, 1.05);
      }
      if (b.facade !== 1) {
        for (const dz of [-1.1, 1.1]) block(b.x - 0.6, upperY + h + 0.48, b.z - 1.6 + dz, b.w * 0.4, 0.16, 1.8, 4811635);
      }
      if (style === "tower") {
        for (const level of [0.34, 0.68]) {
          block(b.x - 0.6, upperY + h * level, b.z + (b.d - 5.4) / 2 - 1.2, b.w - 4.5, 0.22, 1.3, 12109493);
          hedge(b.x - 0.6, upperY + h * level + 0.13, b.z + (b.d - 5.4) / 2 - 1, b.w - 5, 0.7);
        }
      }
    }
    if (b.z > -35 && b.z < -15) {
      block(b.x, y + 3.2, b.z + b.d / 2 + 0.65, b.w * 0.78, 0.16, 1.8, b.facade === 1 ? 7704448 : 12432784);
      bed(b.x - b.w / 2 + 1, y, b.z + b.d / 2 + 1.4, 1.8, 1.2);
    }
  }
  if (style === "tower") {
    const deck = WALK_Y + 0.05 + 9.6 + 0.42;
    block(16.5, deck, -25, 3.5, 0.12, 2.5, 11977389);
    for (const z of [-26.2, -23.8]) block(16.5, deck + 0.61, z, 3.5, 1.1, 0.05, 9216405);
  }
  if (roofPositions.length) {
    const roofGeometry = new THREE8.BufferGeometry();
    roofGeometry.setAttribute("position", new THREE8.Float32BufferAttribute(roofPositions, 3));
    roofGeometry.setAttribute("color", new THREE8.Float32BufferAttribute(roofColours, 3));
    roofGeometry.computeVertexNormals();
    const roofs = new THREE8.Mesh(roofGeometry, new THREE8.MeshLambertMaterial({ vertexColors: true }));
    roofs.name = "courtyard-mansards";
    root.add(roofs);
  }
  const geometry = new THREE8.BufferGeometry();
  geometry.setAttribute("position", new THREE8.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE8.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE8.Float32BufferAttribute(uvs, 2));
  const facades = new THREE8.Mesh(geometry, facadeMaterial);
  facades.name = "alder-facades";
  markLitWindow(facades, 0.65);
  root.add(facades);
  for (const [x, z, w, d] of district.beds ?? [[25, -39, 48, 5], [-36, -37, 37, 4], [46, 10, 16, 23], [12, 39, 24, 12], [43, 38, 17, 12]]) {
    bed(x, WALK_Y + 0.04, z, w, d);
    for (let dx = -w / 2 + 2; dx < w / 2; dx += 7) tree(x + dx, z, WALK_Y + 0.46, 0.7);
  }
  for (const [x, z] of [[-1.7, 9], [-1.7, 30], [8, -14.3], [31, -14.3], [53, -14.3], [-58, 9], [-58, 34]]) {
    tree(x, z, WALK_Y + 0.03, 0.78, true);
  }
  for (const [x, z, angle] of [[4, -2.1, Math.PI / 2], [30, -2.1, Math.PI / 2], [-2.1, 24, Math.PI], [-13.1, 6, 0]]) {
    root.add(buildStreetLamp(x, z, WALK_Y, 0.82, season, angle));
  }
  for (const [key, batch] of batches2) {
    const mesh2 = new THREE8.InstancedMesh(shapes[batch.shape], plain, batch.items.length);
    mesh2.name = `alder-${key}`;
    mesh2.castShadow = batch.shadow;
    mesh2.receiveShadow = true;
    const transform = new THREE8.Object3D(), color = new THREE8.Color();
    batch.items.forEach((p, i) => {
      transform.position.set(p.x, p.y, p.z);
      transform.scale.set(p.w, p.h, p.d);
      transform.rotation.set(0, p.rotation, 0);
      transform.updateMatrix();
      mesh2.setMatrixAt(i, transform.matrix);
      mesh2.setColorAt(i, color.setHex(p.color));
    });
    mesh2.instanceMatrix.needsUpdate = true;
    mesh2.instanceColor.needsUpdate = true;
    mesh2.computeBoundingSphere();
    root.add(mesh2);
  }
  return root;
}

// dist/ui/roving/src/scene/outlooks/garden-districts.js
var plots = (rows) => rows.map(([x, z, w, d, h, facade, terrace = false]) => ({ x, z, w, d, h, facade, terrace }));
var GARDEN_DISTRICTS = {
  warehouse: {
    id: "warehouse",
    style: "industrial",
    offsetY: 0,
    serviceYard: true,
    buildings: plots([
      [10, -29, 22, 23, 9.6, 1],
      [39, -29, 24, 24, 12.8, 0],
      [11, -49, 22, 12, 6.4, 2, true],
      [39, -50, 24, 11, 9.6, 1],
      [-36, -26, 36, 20, 9.6, 1],
      [-36, -48, 36, 14, 12.8, 0],
      [-82, 15, 20, 35, 9.6, 0],
      [-82, -30, 20, 30, 12.8, 1],
      [82, -32, 23, 32, 9.6, 2],
      [82, 15, 23, 32, 12.8, 1],
      [-36, -81, 36, 24, 12.8, 1],
      [9, -82, 22, 26, 16, 2, true],
      [40, -82, 25, 26, 9.6, 0],
      [-42, 79, 26, 26, 6.4, 2],
      [82, 79, 23, 27, 9.6, 1],
      [-82, -82, 20, 26, 6.4, 0]
    ]),
    beds: [[25, -42, 49, 1.2], [-36, -38.5, 37, 2], [46, 10, 16, 23], [12, 40, 24, 10], [43, 38, 17, 12]],
    cuts: [
      { x0: -1.5, x1: 27.5, z0: 20, z1: 29 },
      { x0: -3.6, x1: -1.5, z0: 21.55, z1: 26.55 }
    ]
  },
  tower: {
    id: "tower",
    style: "tower",
    offsetY: -24.7,
    buildings: buildings.map((b, i) => ({
      ...b,
      h: i < 3 ? 9.6 : [12.8, 16, 9.6][i % 3],
      towerHeight: [25.6, 41.6, 32, 48, 35.2][i % 5],
      facade: [3, 0, 2, 3, 1][i % 5],
      terrace: true
    })),
    beds: [[25, -39, 48, 5], [-36, -37, 37, 4], [46, 10, 16, 23], [12, 39, 24, 12], [43, 38, 17, 12]]
  },
  paris: {
    id: "paris",
    style: "paris",
    offsetY: -14,
    buildings: plots([
      [9, -33, 20, 32, 12.8, 0],
      [38, -33, 24, 32, 16, 2],
      [-36, -35, 34, 36, 12.8, 2],
      [-82, -29, 20, 29, 16, 0],
      [-82, 17, 20, 30, 12.8, 2],
      [82, -34, 24, 35, 16, 0],
      [82, 17, 24, 30, 12.8, 2],
      [-36, -82, 34, 24, 16, 0],
      [10, -82, 24, 24, 12.8, 2],
      [39, -82, 24, 24, 19.2, 0],
      [-42, 78, 26, 28, 12.8, 2],
      [82, 78, 26, 28, 16, 0]
    ]),
    beds: [[22.5, -33, 3.2, 33], [46, 10, 16, 23], [12, 39, 24, 12], [43, 38, 17, 12]]
  }
};

// dist/ui/roving/src/scene/outlooks/street.js
var WALK_NEAR = 3.6;
var ROAD_W = 8;
var WALK_FAR = 3.4;
var YARD_DEPTH = 9;
var LANE_W = 5;
var YARD_BAY_FRACS = loadingBayFractions();
var YARD_BAY_W = loadingBayWidth(ROOM.W, ROOM.D);
var ROAD_START = WALK_NEAR;
var ROAD_END = WALK_NEAR + ROAD_W;
var FAR_WALK_END = ROAD_END + WALK_FAR;
function buildSidewalks(mode = "summer") {
  const g = group(0, 0, 0);
  const H = 0.18;
  const slabColor = mode === "winter" ? COLORS.snow : COLORS.sidewalk;
  const curbColor = mode === "winter" ? COLORS.snowShade : COLORS.curb;
  const slab = (x, z, w, d) => {
    const s = box(w, H, d, slabColor, { rough: 1, cast: false });
    s.position.set(x, WALK_Y - H / 2, z);
    s.receiveShadow = true;
    return s;
  };
  const CURB_PROUD = 0.04;
  const CURB_OVERHANG = 0.02;
  const curbEdge = (x, z, w, d, rx = 0, rz = 0) => {
    const h = 0.26;
    const c = box(
      w + Math.abs(rx) * CURB_OVERHANG,
      h,
      d + Math.abs(rz) * CURB_OVERHANG,
      curbColor,
      { rough: 1, cast: false }
    );
    c.position.set(
      x + rx * CURB_OVERHANG / 2,
      WALK_Y + CURB_PROUD - h / 2,
      z + rz * CURB_OVERHANG / 2
    );
    return c;
  };
  const xTo = ROOM.W / 2 + 4 + (ROOM.W + 40) / 2;
  const zTo = ROOM.D / 2 + 4 + (ROOM.D + 40) / 2;
  const slabBetween = (x0, x1, z0, z1) => slab((x0 + x1) / 2, (z0 + z1) / 2, x1 - x0, z1 - z0);
  const curbAlongX = (z, x0, x1, rz) => curbEdge((x0 + x1) / 2, z - rz * 0.13, x1 - x0, 0.26, 0, rz);
  const curbAlongZ = (x, z0, z1, rx) => curbEdge(x - rx * 0.13, (z0 + z1) / 2, 0.26, z1 - z0, rx, 0);
  g.add(slabBetween(-ROAD_START, xTo, -WALK_NEAR, 0));
  g.add(curbAlongX(-ROAD_START, -ROAD_START - CURB_OVERHANG, xTo, -1));
  g.add(slabBetween(-WALK_NEAR, 0, 0, zTo));
  g.add(curbAlongZ(-ROAD_START, -ROAD_START + 0.26, zTo, -1));
  g.add(slabBetween(-FAR_WALK_END, xTo, -FAR_WALK_END, -ROAD_END));
  g.add(curbAlongX(-ROAD_END, -FAR_WALK_END, xTo, 1));
  g.add(slabBetween(-FAR_WALK_END, -ROAD_END, -ROAD_END, zTo));
  g.add(curbAlongZ(-ROAD_END, -ROAD_END + CURB_OVERHANG, zTo, 1));
  if (mode === "winter") {
    const BANK_TOP = WALK_Y + 0.18;
    const BANK_BOTTOM = STREET_Y - 0.01;
    const BANK_W = 0.8;
    const snowBank = (x, z, w, d) => {
      const bank = box(w, BANK_TOP - BANK_BOTTOM, d, COLORS.snow, { rough: 1, cast: false });
      bank.position.set(x, (BANK_TOP + BANK_BOTTOM) / 2, z);
      return bank;
    };
    const bankAlongX = (z, x0, x1) => snowBank((x0 + x1) / 2, z, x1 - x0, BANK_W);
    const bankAlongZ = (x, z0, z1) => snowBank(x, (z0 + z1) / 2, BANK_W, z1 - z0);
    const NEAR_GUTTER = -ROAD_START - BANK_W / 2 + 0.1;
    const FAR_GUTTER = -ROAD_END + BANK_W / 2 - 0.1;
    g.add(bankAlongX(NEAR_GUTTER, NEAR_GUTTER - BANK_W / 2, xTo));
    g.add(bankAlongZ(NEAR_GUTTER, NEAR_GUTTER + BANK_W / 2, zTo));
    g.add(bankAlongX(FAR_GUTTER, -FAR_WALK_END, xTo));
    g.add(bankAlongZ(FAR_GUTTER, FAR_GUTTER + BANK_W / 2, zTo));
  }
  return g;
}
function buildRoads(mode = "summer") {
  const g = group(0, 0, 0);
  const road = (x, z, w, d) => {
    const roadColor = mode === "winter" ? COLORS.snowShade : COLORS.road;
    const r = box(w, 0.06, d, roadColor, { rough: 1, cast: false });
    r.position.set(x, STREET_Y, z);
    r.receiveShadow = true;
    return r;
  };
  const zFrom = ROOM.D / 2 + 4 - (ROOM.D + 40) / 2;
  const zTo = ROOM.D / 2 + 4 + (ROOM.D + 40) / 2;
  const leftX = -(ROAD_START + ROAD_W / 2);
  g.add(road(ROOM.W / 2 + 4, -(ROAD_START + ROAD_W / 2), ROOM.W + 40, ROAD_W));
  g.add(road(leftX, (zFrom - ROAD_END) / 2, ROAD_W, -ROAD_END - zFrom));
  g.add(road(leftX, (-ROAD_START + zTo) / 2, ROAD_W, zTo + ROAD_START));
  if (mode === "winter") {
    const tyre = (x, z, w, d) => {
      const t = box(w, 0.02, d, COLORS.road, { rough: 1, cast: false });
      t.position.set(x, STREET_Y + 0.04, z);
      return t;
    };
    g.add(tyre(ROOM.W / 2 + 4, -(ROAD_START + ROAD_W / 2) - 1.2, ROOM.W + 40, 0.6));
    g.add(tyre(ROOM.W / 2 + 4, -(ROAD_START + ROAD_W / 2) + 1.2, ROOM.W + 40, 0.6));
    g.add(tyre(-(ROAD_START + ROAD_W / 2) - 1.2, ROOM.D / 2 + 4, 0.6, ROOM.D + 40));
    g.add(tyre(-(ROAD_START + ROAD_W / 2) + 1.2, ROOM.D / 2 + 4, 0.6, ROOM.D + 40));
  }
  if (mode !== "winter") {
    const midBack = -(ROAD_START + ROAD_W / 2);
    for (let x = -26; x < ROOM.W + 22; x += 4.2) {
      if (x > -ROAD_END - 2 && x < -ROAD_START + 2) continue;
      put(g, box(2.2, 0.02, 0.28, COLORS.roadLine, { cast: false }), x, STREET_Y + 0.04, midBack);
    }
    const midLeft = -(ROAD_START + ROAD_W / 2);
    for (let z = -22; z < ROOM.D + 22; z += 4.2) {
      if (z > -ROAD_END - 2 && z < -ROAD_START + 2) continue;
      put(g, box(0.28, 0.02, 2.2, COLORS.roadLine, { cast: false }), midLeft, STREET_Y + 0.04, z);
    }
  }
  return g;
}
function buildServiceYard(mode = "summer") {
  const g = group(0, 0, 0);
  const apronColor = mode === "winter" ? COLORS.snowShade : COLORS.sidewalk;
  const laneColor = mode === "winter" ? COLORS.snowShade : COLORS.road;
  const apronZ = ROOM.D + YARD_DEPTH / 2;
  const APRON_H = 0.08;
  const apron = box(ROOM.W + 3, APRON_H, YARD_DEPTH, apronColor, { rough: 1, cast: false });
  apron.position.set(ROOM.W / 2, STREET_Y + 0.04, apronZ);
  apron.receiveShadow = true;
  g.add(apron);
  const APRON_TOP = STREET_Y + 0.04 + APRON_H / 2;
  const laneZ = ROOM.D + YARD_DEPTH * 0.45;
  const laneFromX = -ROAD_START - 0.4;
  const laneToX = 2;
  const LANE_H = 0.06;
  const LANE_TOP = APRON_TOP - 0.02;
  const apronEdgeX = ROOM.W / 2 - (ROOM.W + 3) / 2;
  const lane = box(laneToX - laneFromX, LANE_H, LANE_W, laneColor, { rough: 1, cast: false });
  lane.position.set((laneFromX + laneToX) / 2, LANE_TOP - LANE_H / 2, laneZ);
  lane.receiveShadow = true;
  g.add(lane);
  const drop2 = box(
    0.5,
    0.2,
    LANE_W,
    mode === "winter" ? COLORS.snowShade : COLORS.curb,
    { rough: 1, cast: false }
  );
  drop2.position.set(-ROAD_START + 0.13, STREET_Y + 0.1, laneZ);
  g.add(drop2);
  if (mode !== "winter") {
    for (const frac of YARD_BAY_FRACS) {
      const bayX = ROOM.W / 2 + frac * ROOM.W;
      for (const dx of [-YARD_BAY_W / 2, YARD_BAY_W / 2]) {
        put(g, box(0.18, 0.02, YARD_DEPTH * 0.6, COLORS.roadLine, { cast: false }), bayX + dx, STREET_Y + 0.09, ROOM.D + YARD_DEPTH * 0.36);
      }
      put(g, box(YARD_BAY_W, 0.02, 0.18, COLORS.roadLine, { cast: false }), bayX, STREET_Y + 0.09, ROOM.D + 0.7);
    }
    const DASH_L = 0.7;
    for (let x = laneFromX + 0.55; x < apronEdgeX - DASH_L / 2 - 0.2; x += 1.1) {
      put(g, box(DASH_L, 0.02, 0.2, COLORS.roadLine, { cast: false }), x, LANE_TOP + 0.01, laneZ);
    }
  }
  return g;
}
function buildCrosswalks(mode = "summer") {
  const g = group(0, 0, 0);
  if (mode === "summer") {
    const stripe = (x, z, w, d) => {
      const s = box(w, 0.02, d, COLORS.roadLine, { cast: false });
      s.position.set(x, STREET_Y + 0.05, z);
      return s;
    };
    for (let i = 0; i < 8; i++) {
      g.add(stripe(7.2 + i * 1.15, -(ROAD_START + ROAD_W / 2), 0.62, ROAD_W - 0.3));
    }
    for (let i = 0; i < 8; i++) {
      g.add(stripe(-(ROAD_START + ROAD_W / 2), 6 + i * 1.15, ROAD_W - 0.3, 0.62));
    }
  }
  return g;
}
function buildPark(mode = "summer") {
  const g = group(0, 0, 0);
  const parkX = -(FAR_WALK_END + 22);
  const parkW = 44;
  const parkD = ROOM.D + 60;
  const parkCz = ROOM.D / 2 + 6;
  const groundColor = mode === "winter" ? COLORS.snow : COLORS.grass;
  const grass = box(parkW, 0.22, parkD, groundColor, { rough: 1, cast: false });
  grass.position.set(parkX, WALK_Y - 0.03, parkCz);
  grass.receiveShadow = true;
  g.add(grass);
  if (mode === "summer" || mode === "spring") {
    put(g, box(parkW * 0.55, 0.02, parkD * 0.7, 9221494, { cast: false }), parkX + 4, WALK_Y + 0.09, parkCz);
  }
  const pathColor = mode === "winter" ? COLORS.snowShade : 13617074;
  put(g, box(3, 0.04, parkD * 0.86, pathColor, { cast: false }), -(FAR_WALK_END + 5.5), WALK_Y + 0.1, parkCz);
  put(g, box(18, 0.04, 2.4, pathColor, { cast: false }), parkX + 2, WALK_Y + 0.1, parkCz - 12);
  let pondColor = 7317695;
  let pondRimColor = 12170399;
  if (mode === "winter") {
    pondColor = 12113384;
  } else if (mode === "autumn") {
    pondColor = 5935014;
  }
  const POND_RIM_Y = WALK_Y + 0.14;
  const POND_WATER_Y = POND_RIM_Y - 0.01;
  const POND_R = 5;
  const pond = new THREE9.Mesh(
    new THREE9.CircleGeometry(POND_R + 0.08, 24),
    mat(pondColor, { rough: mode === "winter" ? 0.15 : 0.25 })
  );
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(parkX - 6, POND_WATER_Y, parkCz + 12);
  g.add(pond);
  if (mode === "autumn") {
    pondRimColor = 11047024;
  } else if (mode === "winter") {
    pondRimColor = COLORS.snowShade;
  }
  const pondRim = new THREE9.Mesh(
    new THREE9.RingGeometry(POND_R, POND_R + 0.7, 24),
    mat(pondRimColor, { rough: 1 })
  );
  pondRim.rotation.x = -Math.PI / 2;
  pondRim.position.set(parkX - 6, POND_RIM_Y, parkCz + 12);
  g.add(pondRim);
  if (mode === "autumn" || mode === "spring") {
    const floatingLeafSpots = [[0.5, 1.2], [-1.8, 0.3], [1.5, -1]];
    for (const [ox, oz] of floatingLeafSpots) {
      const leaf = box(0.35, 0.02, 0.25, COLORS.autumnLitter, { cast: false });
      leaf.rotation.z = Math.random() * Math.PI;
      leaf.position.set(parkX - 6 + ox, POND_WATER_Y + 0.02, parkCz + 12 + oz);
      g.add(leaf);
    }
  }
  const treeSpots = [
    [-(FAR_WALK_END + 2.5), 2],
    [-(FAR_WALK_END + 2.5), 10],
    [-(FAR_WALK_END + 2.5), 18],
    [-(FAR_WALK_END + 2.5), 26],
    [-(FAR_WALK_END + 2.5), -6],
    [parkX + 2, -8],
    [parkX - 8, -2],
    [parkX + 6, 6],
    [parkX - 12, 8],
    [parkX + 1, 22],
    [parkX - 14, 24],
    [parkX - 4, 30],
    [parkX + 8, 32],
    [parkX - 16, -10]
  ];
  for (const [x, z] of treeSpots) {
    g.add(buildTree(x, z, WALK_Y + 0.1, spread(0.9, 0.6), mode));
  }
  const bushSpots = [
    [-(FAR_WALK_END + 8), 6],
    [-(FAR_WALK_END + 9), 14],
    [parkX - 2, 2],
    [parkX + 5, 16],
    [parkX - 10, 18],
    [parkX + 3, -4],
    [parkX - 6, 26]
  ];
  for (const [x, z] of bushSpots) g.add(buildBush(x, z, WALK_Y + 0.1, mode));
  g.add(buildBench(-(FAR_WALK_END + 8.6), 8, WALK_Y + 0.1, Math.PI / 2, mode));
  g.add(buildBench(-(FAR_WALK_END + 8.6), 20, WALK_Y + 0.1, Math.PI / 2, mode));
  g.add(buildStreetLamp(-(FAR_WALK_END + 3.2), 6, WALK_Y + 0.1, 0.75, mode));
  g.add(buildStreetLamp(-(FAR_WALK_END + 3.2), 22, WALK_Y + 0.1, 0.75, mode));
  if (mode === "autumn" || mode === "spring") {
    const litterPiles = mode === "spring" ? [] : [
      [-(FAR_WALK_END + 8.6), 6, 1.2],
      // pile near bench 1
      [-(FAR_WALK_END + 8.6), 20, 1],
      // pile near bench 2
      [-(ROAD_END + 0.5), 8, 0.9]
      // pile against kerb
    ];
    for (const [px, pz, pScale] of litterPiles) {
      put(g, box(2 * pScale, 0.08, 1.8 * pScale, COLORS.autumnLitter, { cast: false }), px, WALK_Y + 0.05, pz);
    }
    const litterSpots = [
      [parkX + 8, parkCz - 8],
      [parkX - 12, parkCz + 2],
      [parkX + 3, parkCz + 15],
      [-(FAR_WALK_END + 5), parkCz - 4],
      [parkX - 2, parkCz - 12],
      [-(FAR_WALK_END + 10), parkCz + 8],
      [parkX + 12, parkCz + 20]
    ];
    for (const [lx, lz] of litterSpots) {
      const litter = box(0.5, 0.03, 0.4, COLORS.autumnLitter, { cast: false });
      litter.rotation.z = Math.random() * Math.PI;
      litter.position.set(lx, WALK_Y + 0.04, lz);
      g.add(litter);
    }
    const gutterLeaves = [
      [ROOM.W / 2 + 6, -ROAD_START - 0.8],
      [-ROAD_START - 0.8, ROOM.D / 2 + 6],
      [ROOM.W / 2 + 12, -ROAD_END + 1]
    ];
    for (const [gx, gz] of gutterLeaves) {
      const gutterLeaf = box(0.4, 0.02, 0.3, COLORS.autumnLitter, { cast: false });
      gutterLeaf.rotation.z = Math.random() * Math.PI;
      gutterLeaf.position.set(gx, STREET_Y + 0.04, gz);
      g.add(gutterLeaf);
    }
  }
  return g;
}
function buildSkyline() {
  const g = group(0, 0, 0);
  const specs = [
    // Directly across the street, mid ground.
    [-6, -20, 12, 10, 13, COLORS.buildingC],
    [6, -21, 11, 11, 17, COLORS.buildingA],
    [17, -20, 10, 10, 12, COLORS.buildingB],
    [27, -21, 12, 11, 20, COLORS.buildingA],
    [38, -20, 10, 10, 15, COLORS.buildingC],
    // Top-right cluster: taller towers stepping back.
    [30, -34, 14, 13, 30, COLORS.buildingD],
    [44, -30, 12, 12, 26, COLORS.buildingB],
    [46, -46, 16, 14, 38, COLORS.buildingD],
    [30, -50, 13, 13, 33, COLORS.buildingB],
    [58, -36, 12, 12, 22, COLORS.buildingA],
    [16, -38, 11, 11, 24, COLORS.buildingC],
    // A little depth on the far left of the back street.
    [-18, -22, 11, 10, 11, COLORS.buildingB],
    [-30, -26, 12, 12, 16, COLORS.buildingC]
  ];
  for (const [x, z, w, d, h, c] of specs) {
    g.add(buildBuilding(x, z, w, d, h, c));
  }
  return g;
}
function buildBuilding(x, z, w, d, h, color) {
  const g = group(x, WALK_Y, z);
  const SINK = 0.6;
  const body = box(w, h + SINK, d, color, { rough: 0.95 });
  body.position.y = h / 2 - SINK / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  g.add(body);
  put(g, box(w + 0.5, 0.6, d + 0.5, 7040884, { rough: 0.9 }), 0, h + 0.3);
  const cols = Math.max(2, Math.floor(w / 2.6));
  const rows = Math.max(2, Math.floor(h / 3.2));
  const litChance = 0.35;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = chance(litChance);
      const wc = lit ? COLORS.windowLit : COLORS.windowDark;
      const opts = lit ? { emissive: COLORS.windowLit, emissiveIntensity: 0.7, rough: 0.5, cast: false } : { rough: 0.5, cast: false };
      const y = 2.2 + r * (h - 3.2) / Math.max(1, rows - 1 || 1);
      if (y > h - 1.2) continue;
      const wz = box(w / cols * 0.55, 1.3, 0.12, wc, opts);
      wz.position.set(-w / 2 + (c + 0.5) * (w / cols), y, d / 2 + 0.02);
      if (lit) markLitWindow(wz, 0.7);
      g.add(wz);
      const wx = box(0.12, 1.3, d / cols * 0.55, wc, opts);
      wx.position.set(w / 2 + 0.02, y, -d / 2 + (c + 0.5) * (d / cols));
      if (lit) markLitWindow(wx, 0.7);
      g.add(wx);
    }
  }
  return g;
}
function buildStreetFurniture(mode = "summer") {
  const g = group(0, 0, 0);
  for (const x of [0, 12, 24, 36]) {
    g.add(buildStreetLamp(x, -ROAD_START + 0.9, WALK_Y, 1, mode, Math.PI / 2));
  }
  for (const z of [2, 14, 26]) {
    g.add(buildStreetLamp(-ROAD_START + 0.9, z, WALK_Y, 1, mode, Math.PI));
  }
  const hyd = group(-2, WALK_Y, -2);
  const hbody = cyl(0.22, 0.26, 0.8, 12597547, { segments: 10 });
  hbody.position.y = 0.4;
  hyd.add(hbody);
  const hcap = new THREE9.Mesh(new THREE9.SphereGeometry(0.24, 10, 8), mat(12597547, { rough: 0.6 }));
  hcap.position.y = 0.82;
  hyd.add(hcap);
  if (mode === "winter") {
    put(hyd, box(0.5, 0.15, 0.5, COLORS.snow, { rough: 1, cast: false }), 0, 1.05);
  }
  g.add(hyd);
  g.add(buildCar(4, -(ROAD_END - 1.6), 4878245, 0, mode));
  g.add(buildCar(13, -(ROAD_END - 1.6), 11883594, 0, mode));
  g.add(buildCar(30, -(ROAD_END - 1.6), 6056819, 0, mode));
  g.add(buildCar(-(ROAD_END - 1.6), 12, 7178842, Math.PI / 2, mode));
  const awning = group(-(ROAD_END + 1.8), WALK_Y, ROOM.D * 0.35);
  put(awning, box(1.6, 0.5, 9, 4151876, { rough: 0.9 }), 0, 4.2, 0);
  if (mode === "winter") {
    put(awning, box(1.7, 0.2, 9.2, COLORS.snow, { rough: 1, cast: false }), 0, 4.42, 0);
  } else if (mode === "autumn") {
    const awningLeaf1 = box(0.4, 0.02, 0.3, COLORS.autumnLitter, { cast: false });
    awningLeaf1.rotation.z = 0.5;
    awningLeaf1.position.set(-0.5, 4.38, -2);
    awning.add(awningLeaf1);
    const awningLeaf2 = box(0.35, 0.02, 0.28, COLORS.autumnLitter, { cast: false });
    awningLeaf2.rotation.z = -0.3;
    awningLeaf2.position.set(0.8, 4.38, 1.5);
    awning.add(awningLeaf2);
  }
  g.add(awning);
  return g;
}
var outlook = {
  id: "street",
  label: "Street",
  aerial: false,
  ground: (season) => ({
    y: STREET_Y - 0.02,
    color: season === "winter" ? COLORS.snow : COLORS.road
  }),
  build(g, { season, serviceYard, building: building4 }) {
    if (building4 === "simple" || building4 === "warehouse") {
      buildAlderStreet(g, season, building4 === "warehouse" ? GARDEN_DISTRICTS.warehouse : void 0);
      return;
    }
    g.add(buildSidewalks(season));
    g.add(buildRoads(season));
    g.add(buildCrosswalks(season));
    g.add(buildPark(season));
    g.add(buildSkyline());
    g.add(buildStreetFurniture(season));
    if (serviceYard) g.add(buildServiceYard(season));
  }
};

// dist/ui/roving/src/scene/outlooks/skyline.js
var SKYLINE_GROUND_Y = STREET_Y + GARDEN_DISTRICTS.tower.offsetY;
function buildSkylineHigh(season = "summer") {
  const g = group();
  buildAlderStreet(g, season, GARDEN_DISTRICTS.tower);
  return g;
}
var outlook2 = {
  id: "skyline-high",
  label: "Skyline",
  aerial: true,
  ground: () => ({ y: SKYLINE_GROUND_Y - 0.02 }),
  build(g, { season }) {
    g.add(buildSkylineHigh(season));
  }
};

// dist/ui/roving/src/scene/outlooks/paris.js
var PARIS_BASE_Y = -34;
var PARIS_STREET_Y = STREET_Y + GARDEN_DISTRICTS.paris.offsetY;
function buildParisRooftops(season = "summer") {
  const g = group();
  buildAlderStreet(g, season, GARDEN_DISTRICTS.paris);
  g.add(buildChurchTower(-82, PARIS_STREET_Y, -81, 0.32));
  g.add(buildIronTower(82, PARIS_STREET_Y, -81));
  return g;
}
function buildChurchTower(x, y, z, haze) {
  const g = group(x, y, z);
  const stone = hazed(13221539, haze);
  const dark = hazed(2500394, haze);
  const W = 6.5;
  const H = 20;
  put(g, box(W, H, W, stone, { rough: 0.95, cast: false }), 0, H / 2);
  for (const [bx, bz] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
    put(g, box(0.7, H * 0.62, 0.7, stone, { rough: 0.95, cast: false }), bx * (W / 2 - 0.1), H * 0.31, bz * (W / 2 - 0.1));
  }
  put(g, box(W - 2.6, 3.4, W + 0.3, dark, { cast: false }), 0, H - 3.2);
  put(g, box(W + 0.3, 3.4, W - 2.6, dark, { cast: false }), 0, H - 3.2);
  const rose = cyl(1.15, 1.15, 0.3, hazed(7311008, haze), { segments: 12, rough: 0.4, cast: false });
  rose.rotation.x = Math.PI / 2;
  rose.position.set(0, H * 0.4, W / 2 + 0.06);
  g.add(rose);
  const spireH = 13;
  const spireG = group(0, H, 0);
  spireG.scale.set(W / Math.SQRT2, 1, W / Math.SQRT2);
  const spire = cyl(0.02, 1, spireH, dark, { segments: 4, rough: 0.5, cast: false });
  spire.rotation.y = Math.PI / 4;
  spire.position.y = spireH / 2;
  spireG.add(spire);
  g.add(spireG);
  return g;
}
function buildIronTower(x, y, z) {
  const g = group(x, y, z);
  const iron = hazed(8022620, 0.55);
  const stages = [
    { rBot: 9, rTop: 5, h: 14 },
    { rBot: 4.6, rTop: 2.2, h: 16 },
    { rBot: 2, rTop: 0.7, h: 18 }
  ];
  let base = 0;
  for (const st of stages) {
    const stage = cyl(st.rTop, st.rBot, st.h, iron, { segments: 4, rough: 0.9, cast: false });
    stage.rotation.y = Math.PI / 4;
    stage.position.y = base + st.h / 2;
    g.add(stage);
    base += st.h;
  }
  put(g, cyl(0.12, 0.3, 6, iron, { segments: 4, cast: false }), 0, base + 3);
  put(g, archRing(5, 6.4, iron, { cast: false }), 0, 3, 0);
  return g;
}
var outlook3 = {
  id: "paris-rooftops",
  label: "Paris rooftops",
  aerial: true,
  ground: () => ({ y: PARIS_STREET_Y - 0.02, color: 11648693 }),
  build(g, { season }) {
    g.add(buildParisRooftops(season));
  }
};

// dist/ui/roving/src/scene/outlooks/canopy-garden.js
import * as THREE11 from "three";

// dist/ui/roving/src/scene/canopy-planting.js
import * as THREE10 from "three";
function leafGeometry() {
  const positions = [], indices = [];
  for (let row = 0; row <= 6; row++) {
    const t = row / 6, width = Math.sin(Math.PI * t) * 0.39;
    for (const side of [-1, 0, 1]) positions.push(side * width, t, Math.sin(Math.PI * t) * (side ? 0.05 : 0.19));
  }
  for (let row = 0; row < 6; row++) for (let col = 0; col < 2; col++) {
    const a = row * 3 + col;
    indices.push(a, a + 1, a + 3, a + 1, a + 4, a + 3);
  }
  const g = new THREE10.BufferGeometry();
  g.setAttribute("position", new THREE10.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}
function planting(parent2, { seed = 204, greens: greens2 = [2705963, 4548152, 6587210, 9544798], shadows = true } = {}) {
  const rand = seeded(seed), leaves = [], branches = [];
  const dummy = new THREE10.Object3D(), up = new THREE10.Vector3(0, 1, 0);
  const colour = new THREE10.Color();
  function leaf(x, y, z, size, azimuth, droop = 0.6, tone = null) {
    dummy.position.set(x, y, z);
    dummy.rotation.set(droop, azimuth, (rand() - 0.5) * 0.65);
    dummy.scale.set(size * (0.75 + rand() * 0.4), size, size);
    dummy.updateMatrix();
    leaves.push({ matrix: dummy.matrix.clone(), tone: tone ?? greens2[Math.floor(rand() * greens2.length)] });
  }
  function branch(from, to, radius, tone = 7823431) {
    const a = new THREE10.Vector3(...from), b = new THREE10.Vector3(...to), delta = b.clone().sub(a);
    dummy.position.copy(a).add(b).multiplyScalar(0.5);
    dummy.quaternion.setFromUnitVectors(up, delta.clone().normalize());
    dummy.scale.set(radius, delta.length(), radius);
    dummy.updateMatrix();
    branches.push({ matrix: dummy.matrix.clone(), tone });
  }
  function fern(x, y, z, size = 1, n = 7) {
    for (let f = 0; f < n; f++) {
      const angle = f / n * Math.PI * 2 + rand() * 0.3;
      let previous = [x, y, z];
      for (let j = 1; j <= 5; j++) {
        const t = j / 5, reach = size * t;
        const next = [x + Math.cos(angle) * reach, y + size * (0.18 + Math.sin(t * Math.PI) * 0.38), z + Math.sin(angle) * reach];
        branch(previous, next, 0.012 * size, 5072951);
        for (const side of [-1, 1]) leaf(...next, size * (0.34 - t * 0.14), -angle + side * 0.7, 1.05);
        previous = next;
      }
    }
  }
  function vine(x, y, z, length = 2, angle = 0) {
    const steps = Math.ceil(length / 0.23);
    let previous = [x, y, z];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const next = [x + Math.sin(i * 0.75 + angle) * 0.13, y - t * length, z + Math.sin(i * 0.44) * 0.12];
      if (i) branch(previous, next, 0.012, 4743481);
      leaf(...next, 0.3 + rand() * 0.2, angle + (i % 2 ? 1.25 : -1.25), 1.6 + rand() * 0.5);
      previous = next;
    }
  }
  function tree(x, y, z, height = 11, radius = 3.8, leafCount = 24) {
    const crown = [x + radius * 0.12, y + height * 0.7, z];
    branch([x, y, z], crown, height * 0.025);
    for (let arm = 0; arm < 8; arm++) {
      const a = arm * 2.399, r = radius * (0.55 + rand() * 0.45);
      const end = [crown[0] + Math.cos(a) * r, y + height * (0.7 + rand() * 0.24), z + Math.sin(a) * r];
      branch([x, y + height * (0.38 + rand() * 0.2), z], end, height * 9e-3);
      for (let k = 0; k < leafCount; k++) {
        const theta = rand() * Math.PI * 2, spread2 = Math.sqrt(rand()) * radius * 0.48;
        leaf(
          end[0] + Math.cos(theta) * spread2,
          end[1] + (rand() - 0.5) * radius * 0.45,
          end[2] + Math.sin(theta) * spread2,
          0.65 + rand() * 0.7,
          rand() * Math.PI * 2,
          0.8 + rand() * 1.25
        );
      }
    }
  }
  function finish() {
    for (const [name, items, geometry, material] of [
      ["canopy-leaves", leaves, leafGeometry(), new THREE10.MeshLambertMaterial({ side: THREE10.DoubleSide })],
      ["canopy-branches", branches, new THREE10.CylinderGeometry(0.65, 1, 1, 5), new THREE10.MeshLambertMaterial()]
    ]) {
      if (!items.length) {
        geometry.dispose();
        material.dispose();
        continue;
      }
      const mesh2 = new THREE10.InstancedMesh(geometry, material, items.length);
      mesh2.name = name;
      mesh2.castShadow = shadows;
      mesh2.receiveShadow = true;
      items.forEach((item, i) => {
        mesh2.setMatrixAt(i, item.matrix);
        mesh2.setColorAt(i, colour.setHex(item.tone));
      });
      mesh2.computeBoundingBox();
      mesh2.computeBoundingSphere();
      parent2.add(mesh2);
    }
  }
  return { leaf, branch, fern, vine, tree, finish, rand };
}

// dist/ui/roving/src/scene/outlooks/canopy-garden.js
var GREENS = {
  summer: [3232052, 4943936, 7967567, 10268524],
  spring: [4878912, 7115085, 10598768, 9479777],
  autumn: [5530172, 9143615, 12230744, 9990461],
  winter: [3953991, 6583651, 9544588, 11713959]
};
var GARDEN_SPAN = 160;
var GROUND_SPAN = 2e3;
function gardenTexture(season) {
  const canvas2 = document.createElement("canvas");
  canvas2.width = canvas2.height = 1024;
  const c = canvas2.getContext("2d"), rand = seeded(2048);
  c.fillStyle = season === "winter" ? "#d2d6c5" : "#849066";
  c.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 7e3; i++) {
    const x = rand() * 1024, y = rand() * 1024;
    c.globalAlpha = Math.min(1, Math.max(0, (Math.min(x, y, 1024 - x, 1024 - y) - 16) / 112));
    c.fillStyle = i % 2 ? "rgba(232,220,169,.065)" : "rgba(39,63,36,.045)";
    c.fillRect(x, y, 2 + rand() * 5, 2 + rand() * 5);
  }
  c.globalAlpha = 1;
  c.translate(512, 512);
  c.scale(1024 / GARDEN_SPAN, 1024 / GARDEN_SPAN);
  c.lineCap = "round";
  c.lineJoin = "round";
  for (const [colour, width] of [["#b7b99a", 3.7], ["#d6c9a8", 3.2]]) {
    c.strokeStyle = colour;
    c.lineWidth = width;
    c.beginPath();
    c.moveTo(DOOR.x, -3.2);
    c.lineTo(DOOR.x, -9);
    c.bezierCurveTo(3.4, -19, -23, -16, -30, -31);
    c.bezierCurveTo(-37, -46, -7, -52, 14, -47);
    c.bezierCurveTo(49, -39, 45, 18, 35, 31);
    c.bezierCurveTo(25, 42, -7, 39, -19, 30);
    c.stroke();
  }
  const t = new THREE11.CanvasTexture(canvas2);
  t.colorSpace = THREE11.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function buildCanopyGarden(parent2, season = "summer") {
  const g = group();
  g.name = "canopy-woodland";
  parent2.add(g);
  const geometry = new THREE11.PlaneGeometry(GROUND_SPAN, GROUND_SPAN);
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(
    i,
    (uv.getX(i) - 0.5) * GROUND_SPAN / GARDEN_SPAN + 0.5,
    (uv.getY(i) - 0.5) * GROUND_SPAN / GARDEN_SPAN + 0.5
  );
  const ground = new THREE11.Mesh(
    geometry,
    new THREE11.MeshLambertMaterial({ map: gardenTexture(season) })
  );
  ground.name = "canopy-garden-ground";
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = STREET_Y + 0.025;
  ground.receiveShadow = true;
  g.add(ground);
  const near = planting(g, { seed: 2049, greens: GREENS[season], shadows: true });
  for (const [x, z, h, r] of [
    [-7, 3, 13, 4],
    [-7, 14, 15, 4.5],
    [12, -8, 14, 4],
    [24, -8, 12, 3.5],
    [-15, -9, 15, 4.8],
    [33, 1, 13, 4],
    [35, 19, 10, 3.8]
  ]) {
    near.tree(x, STREET_Y, z, h, r, 64);
    near.fern(x + 0.7, STREET_Y + 0.04, z + 0.5, 1.1, 6);
  }
  near.finish();
  const distant = planting(g, { seed: 2050, greens: GREENS[season], shadows: false });
  for (let i = 0; i < 20; i++) {
    const a = i * 2.399, radius = 40 + distant.rand() * 21;
    distant.tree(
      10 + Math.cos(a) * radius,
      STREET_Y,
      7 + Math.sin(a) * radius,
      10 + distant.rand() * 10,
      4 + distant.rand() * 3,
      32
    );
  }
  for (const [x, z, w, d, h] of [[-34, -23, 12, 9, 9], [32, -33, 15, 11, 12], [-33, 35, 13, 10, 8]]) {
    put(g, box(w, h, d, 9344640, { rough: 0.85, cast: false }), x, STREET_Y + h / 2, z);
    for (const y of [h * 0.35, h * 0.72]) {
      put(g, box(w + 0.4, 0.28, d + 0.4, 12298886, { cast: false }), x, STREET_Y + y - 1.2, z);
      put(g, box(w - 0.7, 1.85, 0.035, 5467236, { rough: 0.3, cast: false }), x, STREET_Y + y, z + d / 2 + 0.025);
    }
    put(g, box(w + 0.7, 0.36, d + 0.7, 12761243, { cast: false }), x, STREET_Y + h + 0.2, z);
    for (let k = 0; k < 5; k++) distant.fern(
      x - w / 2 + 1.2 + k * (w - 2.4) / 4,
      STREET_Y + h + 0.4,
      z + d / 2 - 0.5,
      0.9,
      5
    );
  }
  distant.finish();
  return g;
}
var outlook4 = {
  id: "canopy-garden",
  label: "Woodland garden",
  aerial: false,
  ground: (season) => ({ y: STREET_Y - 0.02, color: season === "winter" ? 13160640 : 9345401 }),
  build(g, { season }) {
    buildCanopyGarden(g, season);
  }
};

// dist/ui/roving/src/scene/outlooks/tide-harbour.js
import * as THREE12 from "three";
var WATER_Y = STREET_Y - 0.31;
var QUAY_Y = STREET_Y + 0.025;
var MAINLAND_Y = QUAY_Y + 0.08;
var PROMENADE_Y = MAINLAND_Y + 0.06;
var SEA = { summer: 6659759, spring: 7448757, autumn: 7904424, winter: 9086641 };
var INK = 3165787;
function waterTexture(season) {
  const canvas2 = document.createElement("canvas");
  canvas2.width = canvas2.height = 1024;
  const c = canvas2.getContext("2d"), rand = seeded(20510);
  c.fillStyle = `#${SEA[season].toString(16)}`;
  c.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 160; i++) {
    c.fillStyle = `rgba(220,243,247,${0.01 + rand() * 0.04})`;
    c.fillRect(0, rand() * 1024, 1024, 2 + rand() * 5);
  }
  for (let i = 0; i < 3200; i++) {
    c.strokeStyle = i % 4 ? `rgba(218,241,243,${0.05 + rand() * 0.11})` : "rgba(47,99,119,.09)";
    c.lineWidth = 0.6 + rand() * 1.2;
    c.beginPath();
    const x = rand() * 1024, y = rand() * 1024, w = 2 + rand() * 16;
    c.moveTo(x, y);
    c.quadraticCurveTo(x + w / 2, y - 1.6, x + w, y);
    c.stroke();
  }
  const texture = new THREE12.CanvasTexture(canvas2);
  texture.colorSpace = THREE12.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE12.RepeatWrapping;
  texture.repeat.set(2.8, 2.8);
  texture.anisotropy = 4;
  return texture;
}
function batches(parent2) {
  const types = /* @__PURE__ */ new Map(), dummy = new THREE12.Object3D();
  function define(name, geometry, material = new THREE12.MeshStandardMaterial({ color: 16777215, roughness: 0.88 })) {
    types.set(name, { geometry, material, entries: [] });
  }
  define("details", new THREE12.BoxGeometry(1, 1, 1));
  define("buildings", new THREE12.BoxGeometry(1, 1, 1));
  define("walkways", new THREE12.BoxGeometry(1, 1, 1));
  define("seawall", new THREE12.BoxGeometry(1, 1, 1));
  define("spars", new THREE12.CylinderGeometry(1, 1, 1, 6));
  const roofShape = new THREE12.Shape();
  roofShape.moveTo(-0.5, 0);
  roofShape.lineTo(0, 1);
  roofShape.lineTo(0.5, 0);
  roofShape.closePath();
  const roof = new THREE12.ExtrudeGeometry(roofShape, { depth: 1, bevelEnabled: false });
  roof.translate(0, 0, -0.5);
  define("roofs", roof);
  const glass = new THREE12.MeshStandardMaterial({ color: 11914704, roughness: 0.45, emissive: 16766369 });
  define("windows", new THREE12.BoxGeometry(1, 1, 1), glass);
  const outline = new THREE12.Shape();
  outline.moveTo(-1.2, -3);
  outline.lineTo(-1.62, -0.9);
  outline.lineTo(-1.44, 1.8);
  outline.quadraticCurveTo(-1, 3.3, 0, 4.35);
  outline.quadraticCurveTo(1, 3.3, 1.44, 1.8);
  outline.lineTo(1.62, -0.9);
  outline.lineTo(1.2, -3);
  outline.closePath();
  define("hulls", new THREE12.ExtrudeGeometry(outline, {
    depth: 0.74,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 1,
    steps: 1,
    curveSegments: 5
  }));
  define("decks", new THREE12.ShapeGeometry(outline, 5), new THREE12.MeshStandardMaterial({ color: 16777215, roughness: 0.9, side: THREE12.DoubleSide }));
  const sail = new THREE12.BufferGeometry();
  sail.setAttribute("position", new THREE12.Float32BufferAttribute([0, 9.5, 0.63, 0, 2.35, 0.63, 0.18, 2.35, -2.65], 3));
  sail.computeVertexNormals();
  define("sails", sail, new THREE12.MeshStandardMaterial({ color: 16777215, roughness: 0.95, side: THREE12.DoubleSide }));
  define("rocks", new THREE12.IcosahedronGeometry(1, 0));
  define("pine-crowns", new THREE12.ConeGeometry(1, 1, 7));
  define("shrubs", new THREE12.IcosahedronGeometry(1, 1));
  function add(name, position, scale, colour, rotation = [0, 0, 0], frame) {
    dummy.position.set(...position);
    dummy.rotation.set(...rotation);
    dummy.scale.set(...scale);
    dummy.updateMatrix();
    const matrix = dummy.matrix.clone();
    if (frame) matrix.premultiply(frame);
    types.get(name).entries.push({ matrix, colour });
  }
  function line(from, to, radius, colour, frame) {
    const a = new THREE12.Vector3(...from), b = new THREE12.Vector3(...to), delta = b.clone().sub(a);
    dummy.position.copy(a.add(b).multiplyScalar(0.5));
    dummy.quaternion.setFromUnitVectors(new THREE12.Vector3(0, 1, 0), delta.clone().normalize());
    dummy.scale.set(radius, delta.length(), radius);
    dummy.updateMatrix();
    const matrix = dummy.matrix.clone();
    if (frame) matrix.premultiply(frame);
    types.get("spars").entries.push({ matrix, colour });
  }
  function flush() {
    for (const [name, { geometry, material, entries }] of types) {
      if (!entries.length) {
        geometry.dispose();
        material.dispose();
        continue;
      }
      const mesh2 = new THREE12.InstancedMesh(geometry, material, entries.length);
      mesh2.name = `harbour-${name}`;
      entries.forEach(({ matrix, colour }, i) => {
        mesh2.setMatrixAt(i, matrix);
        mesh2.setColorAt(i, new THREE12.Color(colour));
      });
      mesh2.receiveShadow = name !== "windows";
      mesh2.castShadow = ["buildings", "roofs", "hulls", "sails"].includes(name);
      mesh2.computeBoundingBox();
      mesh2.computeBoundingSphere();
      parent2.add(mesh2);
      if (name === "windows") markNightLight(mesh2, { emissive: [material], emissiveIntensity: 0.55 });
    }
  }
  return { add, line, flush };
}
var COAST = [
  [-1e3, 120],
  [-360, 70],
  [-245, 28],
  [-205, 4],
  [-170, 7],
  [-142, 15],
  [-119, -3],
  [-96, -15],
  [-76, -21],
  [-59, -29],
  [62, -29],
  [79, -22],
  [94, -11],
  [112, -8],
  [133, -18],
  [153, -31],
  [180, -27],
  [207, -3],
  [246, 27],
  [335, 65],
  [1e3, 160]
];
function shoreAt(x) {
  for (let i = 1; i < COAST.length; i++) {
    const [ax, az] = COAST[i - 1], [bx, bz] = COAST[i];
    if (x <= bx) {
      const t = Math.max(0, (x - ax) / (bx - ax));
      const u = t * t * (3 - 2 * t);
      return az + (bz - az) * u;
    }
  }
  return COAST.at(-1)[1];
}
function coastline() {
  const points = [];
  for (let i = 1; i < COAST.length; i++) {
    const a = COAST[i - 1], b = COAST[i];
    const count = Math.max(2, Math.ceil((b[0] - a[0]) / 5));
    for (let j = 0; j < count; j++) {
      const x = a[0] + (b[0] - a[0]) * j / count;
      points.push([x, shoreAt(x)]);
    }
  }
  points.push(COAST.at(-1));
  return points;
}
function surface(parent2, name, points, y, colour) {
  const shape = new THREE12.Shape();
  points.forEach(([x, z], i) => {
    if (i) shape.lineTo(x, -z);
    else shape.moveTo(x, -z);
  });
  shape.closePath();
  const mesh2 = new THREE12.Mesh(new THREE12.ShapeGeometry(shape), new THREE12.MeshStandardMaterial({ color: colour, roughness: 0.98 }));
  mesh2.name = name;
  mesh2.rotation.x = -Math.PI / 2;
  mesh2.position.y = y;
  mesh2.receiveShadow = true;
  parent2.add(mesh2);
  return mesh2;
}
function shoreRibbon(parent2, name, points, offset, width, y, colour) {
  return surface(parent2, name, [
    ...points.map(([x, z]) => [x, z - offset]),
    ...points.toReversed().map(([x, z]) => [x, z - offset - width])
  ], y, colour);
}
function timberDeck(b, x, z, w, d) {
  b.add("walkways", [x, QUAY_Y + 0.085, z], [w, 0.17, d], 11049856);
  const count = Math.floor(d / 0.4);
  for (let i = 0; i < count; i++) {
    b.add("details", [x, QUAY_Y + 0.18, z - d / 2 + (i + 0.5) * d / count], [w - 0.04, 0.016, 0.018], 8485740);
  }
}
function boat(b, x, z, scale = 1, angle = 0, kind = "sail", colour = 15263191) {
  const frame = new THREE12.Object3D();
  frame.position.set(x, WATER_Y + 0.04, z);
  frame.rotation.y = angle;
  frame.scale.setScalar(scale);
  frame.updateMatrix();
  const add = (name, position, size, tint, rotation) => b.add(name, position, size, tint, rotation, frame.matrix);
  const line = (a, c, r, tint) => b.line(a, c, r, tint, frame.matrix);
  add("hulls", [0, 0.62, 0], [1, 1, 1], colour, [Math.PI / 2, 0, 0]);
  add("decks", [0, 0.75, 0], [0.89, 0.89, 0.89], 12826522, [Math.PI / 2, 0, 0]);
  if (kind === "dinghy") {
    for (const benchZ of [-1.2, 0.6, 2]) add("details", [0, 0.82, benchZ], [benchZ > 1 ? 1.8 : 2.2, 0.14, 0.38], 9139808);
    line([-1.2, 0.9, -1.7], [1.6, 0.9, 2.2], 0.05, 10847328);
    return;
  }
  const fishing = kind === "fishing";
  add("details", [0, fishing ? 1.35 : 1.02, -0.38], [1.75, fishing ? 1.35 : 0.66, 2.1], colour);
  add("details", [0, fishing ? 1.97 : 1.39, -0.32], [1.78, 0.28, 1.75], INK);
  add("details", [0, fishing ? 2.18 : 1.6, -0.32], [1.91, 0.13, 2], 15263705);
  if (kind === "sail") {
    line([0, 0.7, 0.6], [0, 9.8, 0.6], 0.046, INK);
    line([0, 2.2, 0.6], [0, 2.2, -2.7], 0.04, INK);
    add("sails", [0, 0, 0], [1, 1, 1], 15328463);
  } else {
    line([0, 1.5, -0.8], [0, fishing ? 5.2 : 3, -0.8], 0.035, INK);
    if (fishing) {
      line([-1.2, 1, 1.3], [-1.2, 3.4, 1.3], 0.055, INK);
      line([1.2, 1, 1.3], [1.2, 3.4, 1.3], 0.055, INK);
      line([-1.2, 3.4, 1.3], [1.2, 3.4, 1.3], 0.055, INK);
      add("details", [0, 1.1, 1.6], [1.4, 0.5, 1.2], 7899766);
    }
  }
}
function harbourBuilding(b, x, z, w, d, h, colour, angle = 0) {
  const frame = new THREE12.Object3D();
  frame.position.set(x, MAINLAND_Y - 0.01, z);
  frame.rotation.y = angle;
  frame.updateMatrix();
  const add = (name, position, size, tint, rotation) => b.add(name, position, size, tint, rotation, frame.matrix);
  add("buildings", [0, h / 2, 0], [w, h, d], colour);
  add("roofs", [0, h, 0], [w + 0.6, w * 0.25, d + 0.6], 5399922);
  add("details", [0, h - 0.08, 0], [w + 0.14, 0.18, d + 0.14], 14341829);
  add("details", [w * 0.24, h + w * 0.19, -d * 0.2], [0.6, 1.65, 0.65], 7168602);
  const rows = h > 6 ? 2 : 1;
  for (let row = 0; row < rows; row++) for (let col = 0; col < 4; col++) {
    if (!row && (col === 1 || col === 2)) continue;
    add("windows", [(col - 1.5) * (w - 2.4) / 4, rows === 1 ? h * 0.57 : h * (0.3 + row * 0.4), d / 2 + 0.04], [1.22, 1.4, 0.06], 16777215);
  }
  for (const side of [-1, 1]) for (let col = 0; col < 3; col++) {
    add("windows", [side * (w / 2 + 0.04), h * 0.6, (col - 1) * d * 0.27], [0.06, 1.3, 1.1], 16777215);
  }
  add("details", [0, 1.33, d / 2 + 0.035], [2.1, 2.65, 0.09], INK);
}
function buildTideHarbour(parent2, season = "summer") {
  const g = group();
  g.name = "tide-harbour";
  parent2.add(g);
  const b = batches(g), rand = seeded(20511);
  const water = new THREE12.Mesh(
    new THREE12.PlaneGeometry(2400, 2400),
    new THREE12.MeshStandardMaterial({ map: waterTexture(season), roughness: 0.3, metalness: 0.12 })
  );
  water.material.map.repeat.set(28, 28);
  water.rotation.x = -Math.PI / 2;
  water.position.y = WATER_Y;
  water.name = "harbour-water";
  water.receiveShadow = true;
  g.add(water);
  const stone = season === "winter" ? 12700879 : 12172723;
  put(g, box(35, 0.68, 32, 9280671, { cast: false }), 13.5, QUAY_Y - 0.34, 9).name = "harbour-office-quay";
  put(g, box(34.9, 0.06, 31.9, stone, { cast: false }), 13.5, QUAY_Y + 0.03, 9);
  const coast = coastline();
  surface(g, "harbour-mainland", [...coast, [1e3, -1200], [-1e3, -1200]], MAINLAND_Y, season === "winter" ? 11780281 : 8886667);
  shoreRibbon(g, "harbour-promenade", coast, 0, 5.8, PROMENADE_Y, 13487036);
  shoreRibbon(g, "harbour-coastal-lane", coast, 6.8, 5.8, MAINLAND_Y + 0.015, 9016986);
  shoreRibbon(g, "harbour-inland-lane", coast, 31, 4.8, MAINLAND_Y + 0.025, 10989728);
  const wallBottom = WATER_Y - 0.2, wallTop = PROMENADE_Y - 0.012;
  for (let i = 1; i < coast.length; i++) {
    const [ax, az] = coast[i - 1], [bx, bz] = coast[i];
    const dx = bx - ax, dz = bz - az;
    b.add(
      "seawall",
      [(ax + bx) / 2, (wallTop + wallBottom) / 2, (az + bz) / 2],
      [Math.hypot(dx, dz), wallTop - wallBottom, 0.28],
      8558231,
      [0, -Math.atan2(dz, dx), 0]
    );
  }
  timberDeck(b, DOOR.x, -18, 4.3, 22);
  timberDeck(b, 32.6, 8, 3.2, 16);
  timberDeck(b, 13.3, 22.2, 31.4, 3);
  timberDeck(b, 28.6, 9.8, 2.25, 21.2);
  for (const x of [-45, -28, 34, 55]) {
    timberDeck(b, x, -23, 1.7, 12);
    for (const z of [-27, -22, -17.4]) {
      b.line([x - 0.7, WATER_Y - 0.2, z], [x - 0.7, QUAY_Y + 0.55, z], 0.09, INK);
      b.line([x + 0.7, WATER_Y - 0.2, z], [x + 0.7, QUAY_Y + 0.55, z], 0.09, INK);
    }
  }
  for (let z = -27.4; z <= -8; z += 3.8) for (const x of [DOOR.x - 2.03, DOOR.x + 2.03]) {
    b.line([x, QUAY_Y + 0.05, z], [x, QUAY_Y + 1.25, z], 0.1, INK);
    if (z + 3.8 <= -8) b.line([x, QUAY_Y + 1.03, z], [x, QUAY_Y + 1.03, z + 3.8], 0.026, 6977403);
  }
  for (const [x, z] of [[-3.5, 0], [-3.5, 14], [30.5, -5], [30.5, 23.8], [-3.5, 23.8]]) {
    b.line([x, QUAY_Y - 0.18, z], [x, QUAY_Y + 1.02, z], 0.1, INK);
  }
  for (const spec of [
    [-7.1, 10, 0.9, 0.12, "sail", 15066847],
    [37.4, 10, 0.95, 0.03, "fishing", 13402214],
    [18, -18.1, 0.7, Math.PI / 2, "sail", 15132379],
    [-40.7, -23, 0.8, 0.08, "fishing", 9600612],
    [-23.7, -22.5, 0.78, -0.12, "sail", 15328467],
    [29.6, -22.6, 0.69, 0.04, "motor", 8495011],
    [59.2, -22, 0.72, -0.06, "sail", 13817807],
    [-25, 7, 0.58, 1.1, "dinghy", 11630944],
    [50, 28, 0.74, -0.4, "motor", 14866620],
    [21, 43, 0.66, -0.9, "dinghy", 10268330],
    [78, 10, 1.1, 0.7, "fishing", 11631451],
    [-56, 25, 0.78, -0.35, "motor", 14344409],
    [100, 58, 1.1, -1, "sail", 15458246],
    [-91, 19, 0.9, 0.35, "sail", 15066847],
    [-20, 75, 0.78, -0.8, "sail", 14475736],
    [60, 85, 0.75, 0.6, "fishing", 9282981],
    [143, 22, 0.85, -0.5, "sail", 14735812],
    [-141, 40, 0.9, 0.8, "motor", 11123128]
  ]) boat(b, ...spec);
  b.line([-3.5, QUAY_Y + 0.75, 14], [-6.3, WATER_Y + 0.95, 13], 0.025, 9210487);
  b.line([34.1, QUAY_Y + 0.15, 11], [36.1, WATER_Y + 1, 11], 0.025, 9210487);
  const colours = [11759189, 13223346, 8296607, 13682347, 11034445, 12699841, 8491414];
  for (let row = 0; row < 3; row++) for (let i = 0; i < 13; i++) {
    const x = -111 + i * 18.5 + (row % 2 ? 8 : 0), w = row === 2 ? 8 + rand() * 3 : 10 + rand() * 3;
    const d = row === 0 ? 8 : row === 2 ? 9 : 11 + rand() * 2;
    const h = row === 2 ? 4 + rand() * 2.5 : 5.8 + rand() * 3;
    const shore = Math.min(shoreAt(x - w / 2), shoreAt(x), shoreAt(x + w / 2));
    const z = shore - 20 - row * 24;
    harbourBuilding(b, x, z, w, d, h, colours[(i + row * 3) % colours.length]);
    if (row === 0 && i % 2 === 0) {
      b.add("details", [x, QUAY_Y + 2.75, z + d / 2 + 0.85], [w * 0.7, 0.15, 1.8], i % 4 ? 9149841 : 14273456);
      b.add("details", [x + w / 2 + 2, QUAY_Y + 0.04, z - 5], [2.2, 0.05, 26], 12961204);
    }
  }
  for (let x = -120; x <= 128; x += 12) {
    const z = shoreAt(x) - 2.7;
    b.line([x, QUAY_Y, z + 1.7], [x, QUAY_Y + 0.8, z + 1.7], 0.16, INK);
    if (Math.abs(x - DOOR.x) < 6) continue;
    b.add("details", [x, QUAY_Y + 0.55, z], [2.4, 0.16, 0.75], 10326649);
    for (const dx of [-0.8, 0.8]) b.add("details", [x + dx, QUAY_Y + 0.27, z], [0.16, 0.5, 0.6], INK);
  }
  for (const [x, z] of [[-48, -32], [-30, -32], [48, -33], [58, -32]]) {
    for (let i = 0; i < 3; i++) b.add("details", [x + i * 0.85, QUAY_Y + 0.32, z], [0.68, 0.64, 0.68], i % 2 ? 11111013 : 8886403);
  }
  for (let i = 0; i < 105; i++) {
    const x = -225 + rand() * 465;
    if (x > -61 && x < 64) continue;
    const z = shoreAt(x) + 0.2 + rand() * 2.3, size = 0.45 + rand() * 1.1;
    b.add("rocks", [x, WATER_Y + size * 0.25, z], [size * 1.5, size * 0.65, size], 10201507, [0, rand() * 6.28, 0]);
  }
  for (let i = 0; i < 135; i++) {
    const x = -230 + rand() * 470, z = shoreAt(x) - 79 - rand() * 54;
    const h = 4 + rand() * 6;
    b.line([x, MAINLAND_Y - 0.01, z], [x, MAINLAND_Y + h * 0.8, z], 0.13, 7501415);
    const tint = season === "winter" ? 7966858 : [6192752, 7178870, 7836801][i % 3];
    b.add("pine-crowns", [x, MAINLAND_Y + h * 0.63, z], [h * 0.33, h * 0.84, h * 0.33], tint);
    b.add("pine-crowns", [x, MAINLAND_Y + h * 0.43, z], [h * 0.4, h * 0.62, h * 0.4], tint);
  }
  for (let i = 0; i < 65; i++) {
    const x = -210 + rand() * 430, z = shoreAt(x) - 58 - rand() * 60;
    b.add("shrubs", [x, MAINLAND_Y + 0.6, z], [1.2 + rand(), 0.9, 1.2 + rand()], season === "winter" ? 10925997 : 8492926);
  }
  const stalks = [];
  for (const [x, z, w, d] of [[-2.3, 5.8, 1.4, 7], [21, -5.4, 9, 1.1]]) {
    b.add("details", [x, QUAY_Y + 0.27, z], [w, 0.49, d], 8689563);
    for (let i = 0; i < 58; i++) stalks.push([x + (rand() - 0.5) * (w - 0.18), z + (rand() - 0.5) * (d - 0.18), 0.6 + rand()]);
  }
  for (const [x, z, h] of stalks) b.line(
    [x, QUAY_Y + 0.51, z],
    [x + (rand() - 0.5) * 0.2, QUAY_Y + 0.51 + h, z],
    0.018,
    season === "spring" || season === "summer" ? 7900012 : 11247224
  );
  b.flush();
  return g;
}
var outlook5 = {
  id: "tide-harbour",
  label: "Nordic harbour",
  aerial: false,
  ground: (season) => ({ y: WATER_Y - 0.08, color: SEA[season] ?? SEA.summer }),
  build(g, { season }) {
    buildTideHarbour(g, season);
  }
};

// dist/ui/roving/src/scene/outlooks/dune-courtyard.js
import * as THREE13 from "three";
var LANES = [
  [[DOOR.x, -3], [DOOR.x, -67]],
  [[-52, -35.5], [59, -35.5]],
  [[-48, -49.5], [59, -49.5]],
  [[-33.5, -63], [-33.5, 46]],
  [[-49, 12], [-18, 12]],
  [[-49, 29], [-18, 29]]
];
function groundTexture(season) {
  const canvas2 = document.createElement("canvas");
  canvas2.width = canvas2.height = 2048;
  const c = canvas2.getContext("2d"), rand = seeded(20523);
  c.fillStyle = season === "winter" ? "#cbbd9e" : "#d0b081";
  c.fillRect(0, 0, 2048, 2048);
  for (let i = 0; i < 23e3; i++) {
    c.fillStyle = i % 2 ? "rgba(142,102,57,.06)" : "rgba(255,243,207,.09)";
    c.fillRect(rand() * 2048, rand() * 2048, 1 + rand() * 3, 1 + rand() * 3);
  }
  c.translate(1024, 1024);
  c.scale(2048 / 440, 2048 / 440);
  c.fillStyle = season === "winter" ? "#dcd1b9" : "#e4cfaa";
  c.fillRect(-15, -18, 45, 43);
  c.fillStyle = season === "winter" ? "#ccbb9d" : "#c9a474";
  c.beginPath();
  c.roundRect(-53, -68, 115, 48, 11);
  c.fill();
  c.beginPath();
  c.roundRect(-52, -45, 34, 90, 9);
  c.fill();
  c.lineJoin = c.lineCap = "round";
  for (const [width, colour] of [[4.1, "#b99163"], [3.6, season === "winter" ? "#d9c7a6" : "#ddbd8d"]]) {
    c.strokeStyle = colour;
    c.lineWidth = width;
    for (const [index, points] of LANES.entries()) {
      c.lineWidth = index === 0 ? width - 0.8 : width;
      c.beginPath();
      points.forEach(([x, z], i) => i ? c.lineTo(x, z) : c.moveTo(x, z));
      c.stroke();
    }
  }
  c.fillStyle = season === "winter" ? "#d9c7a6" : "#ddbd8d";
  c.beginPath();
  c.ellipse(-33.5, -17, 6, 7.2, 0, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = "#c7a67b";
  c.lineWidth = 0.065;
  for (let z = -23; z < -11; z += 1.2) {
    c.beginPath();
    c.moveTo(-38.5, z);
    c.lineTo(-28.5, z);
    c.stroke();
  }
  c.lineWidth = 1.8;
  c.strokeStyle = "#bd895f";
  c.beginPath();
  c.moveTo(DOOR.x, -12);
  c.lineTo(-8, -12);
  c.lineTo(-8, 23);
  c.stroke();
  const map = new THREE13.CanvasTexture(canvas2);
  map.colorSpace = THREE13.SRGBColorSpace;
  map.anisotropy = 4;
  return map;
}
function succulent(parent2, x, z, size, seed) {
  const p = planting(parent2, { seed, greens: [8426113, 10398351, 6585705], shadows: true });
  for (let ring = 0; ring < 3; ring++) for (let leaf = 0; leaf < 8; leaf++) {
    p.leaf(
      x,
      STREET_Y + 0.07,
      z,
      size * (1.15 - ring * 0.22),
      leaf * Math.PI / 4 + ring * 0.33,
      1.25 - ring * 0.38
    );
  }
  p.finish();
}
function desertTerrain(season) {
  const axis = [-650, -360];
  for (let n = -204; n <= 204; n += 3) axis.push(n);
  axis.push(360, 650);
  const vertices = [], colours = [], uvs = [], indices = [], colour = new THREE13.Color();
  const smooth = (value) => {
    const t = THREE13.MathUtils.clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  };
  for (const z of axis) for (const x of axis) {
    let height = 0;
    for (const [distance, rise, breadth] of [[84, 10.5, 14], [121, 16, 21], [168, 20, 27]]) {
      const north = -z - distance - Math.sin(x * 0.035 + distance * 0.07) * 8 - Math.sin(x * 0.071) * 3;
      const west = -x - distance + 9 - Math.sin(z * 0.029 + distance * 0.05) * 11;
      const east = x - distance - 26 - Math.sin(z * 0.032 + distance * 0.02) * 9;
      const south = z - distance - 14 - Math.sin(x * 0.024 + distance * 0.05) * 12;
      const crest = (value) => Math.exp(-Math.pow(value / (value < 0 ? breadth * 0.55 : breadth), 2));
      height += rise * (crest(north) * (0.76 + 0.14 * Math.sin(x * 0.042)) + crest(west) * 0.68 + crest(east) * 0.44 + crest(south) * 0.37);
    }
    const beyondTown = Math.hypot(Math.max(-58 - x, x - 66, 0), Math.max(-72 - z, z - 50, 0));
    height *= smooth(beyondTown / 14) * (1 - smooth((Math.max(Math.abs(x), Math.abs(z)) - 220) / 90));
    vertices.push(x, STREET_Y + 0.025 + height, z);
    colour.setRGB(1, 1, 1).multiplyScalar(1 + height * 25e-4);
    colours.push(colour.r, colour.g, colour.b);
    uvs.push((x + 220) / 440, 1 - (z + 220) / 440);
  }
  for (let z = 0; z < axis.length - 1; z++) for (let x = 0; x < axis.length - 1; x++) {
    const i = z * axis.length + x;
    indices.push(i, i + axis.length, i + 1, i + 1, i + axis.length, i + axis.length + 1);
  }
  const geometry = new THREE13.BufferGeometry();
  geometry.setAttribute("position", new THREE13.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE13.Float32BufferAttribute(colours, 3));
  geometry.setAttribute("uv", new THREE13.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh2 = new THREE13.Mesh(
    geometry,
    new THREE13.MeshLambertMaterial({ map: groundTexture(season), vertexColors: true })
  );
  mesh2.name = "dune-continuous-terrain";
  mesh2.receiveShadow = true;
  return mesh2;
}
function villageBatch(parent2, name, { geometry = new THREE13.BoxGeometry(1, 1, 1), shadows = false } = {}) {
  const entries = [], dummy = new THREE13.Object3D(), colour = new THREE13.Color();
  return {
    add(x, y, z, w, h, d, tone, tilt = 0) {
      dummy.position.set(x, y, z);
      dummy.scale.set(w, h, d);
      dummy.rotation.set(tilt, 0, 0);
      dummy.updateMatrix();
      entries.push({ matrix: dummy.matrix.clone(), tone });
    },
    finish() {
      const mesh2 = new THREE13.InstancedMesh(geometry, new THREE13.MeshLambertMaterial(), entries.length);
      mesh2.name = name;
      entries.forEach(({ matrix, tone }, i) => {
        mesh2.setMatrixAt(i, matrix);
        mesh2.setColorAt(i, colour.setHex(tone));
      });
      mesh2.castShadow = shadows;
      mesh2.receiveShadow = true;
      mesh2.computeBoundingBox();
      mesh2.computeBoundingSphere();
      parent2.add(mesh2);
      return mesh2;
    }
  };
}
function buildTown(parent2, season) {
  const walls = villageBatch(parent2, "dune-town-walls", { shadows: true });
  const parapets = villageBatch(parent2, "dune-town-parapets", { shadows: true });
  const joinery2 = villageBatch(parent2, "dune-town-doors-and-shutters");
  const shade = villageBatch(parent2, "dune-town-awnings", { shadows: true });
  const supports = villageBatch(parent2, "dune-town-shade-supports", { shadows: true });
  const terraces = villageBatch(parent2, "dune-town-roof-stairs");
  const pots = villageBatch(parent2, "dune-town-terracotta-pots", { geometry: new THREE13.CylinderGeometry(0.65, 1, 1, 8) });
  const tones = season === "winter" ? [13351323, 12429192, 13747372, 12164480] : [13477752, 12027744, 14336154, 12622450];
  const plots2 = [
    [-44, -27, 8, 8, 5.1],
    [-24, -27, 10, 8, 6],
    [-12, -27, 8, 7.5, 4.7],
    [-3.2, -27, 5.5, 8, 5.6],
    [13, -27, 8, 8, 4.2],
    [23.5, -27, 9, 8.5, 6.7],
    [35, -27.8, 9, 8, 5.2],
    [47, -28, 10, 8, 4.7],
    [-43, -42.5, 9, 8, 6.8],
    [-24, -42.5, 10, 8, 5.6],
    [-12, -42.5, 8, 8, 7.5],
    [-3, -42.5, 5, 8, 4.7],
    [13, -43, 8, 8.5, 6.4],
    [24, -43, 9, 8.5, 5],
    [36, -43, 10, 8, 8.6],
    [49, -43, 10, 8, 5.8],
    [-43, -59, 9, 10, 4.8],
    [-23.5, -58.5, 10, 10, 6.1],
    [-11, -58, 9, 9, 4.6],
    [-2.5, -58.5, 4, 10, 6.6],
    [12.5, -58.5, 8, 10, 4.9],
    [24, -58, 9, 9, 6],
    [36, -58.5, 10, 10, 5.2],
    [49.5, -58, 9, 9, 9.5],
    [-24, -8, 10, 10, 5.7],
    [-24, 5, 10, 8, 4.7],
    [-24, 20.5, 10, 10, 6.7],
    [-24, 38, 10, 10, 5.2],
    [-43.5, -5, 10, 11, 6.2],
    [-43.5, 20.5, 10, 10, 4.5],
    [-43.5, 38, 10, 10, 5.9]
  ];
  plots2.forEach(([x, z, w, d, h], i) => {
    const tone = tones[i % tones.length], roof = season === "winter" ? 13878441 : 14532238;
    walls.add(x, STREET_Y + (h - 0.035) / 2, z, w, h + 0.035, d, tone);
    parapets.add(x, STREET_Y + h + 0.26, z - (d - 0.3) / 2, w - 0.6, 0.52, 0.3, roof);
    parapets.add(x, STREET_Y + h + 0.26, z + (d - 0.3) / 2, w - 0.6, 0.52, 0.3, roof);
    for (const side of [-1, 1]) parapets.add(x + side * (w - 0.3) / 2, STREET_Y + h + 0.26, z, 0.3, 0.52, d, roof);
    const face2 = z + d / 2;
    joinery2.add(x - w * 0.19, STREET_Y + 1.27, face2 + 0.018, 1.13, 2.48, 0.1, i % 4 ? 6640962 : 6781041);
    for (const side of [-1, 1]) {
      joinery2.add(x + side * w * 0.26, STREET_Y + Math.max(3.35, h * 0.64), face2 + 0.018, 0.9, 1.2, 0.1, 7693648);
      joinery2.add(x + w / 2 + 0.018, STREET_Y + h * 0.58, z + side * d * 0.24, 0.1, 1.18, 0.88, 8285009);
    }
    if (i % 3 === 1 && w > 7) {
      shade.add(x, STREET_Y + 2.9, face2 + 0.58, w * 0.65, 0.12, 1.4, i % 2 ? 11430220 : 14927764, -0.1);
      for (const side of [-1, 1]) supports.add(
        x + side * w * 0.28,
        STREET_Y + 1.435,
        face2 + 0.99,
        0.11,
        2.9,
        0.11,
        8414796
      );
    }
    if (i % 5 === 0 && w >= 8) {
      for (let step = 0; step < 6; step++) terraces.add(
        x - w * 0.28,
        STREET_Y + h + step * 0.14 + 0.13,
        z + d * 0.28 - step * 0.43,
        1.25,
        0.28 + step * 0.28,
        0.44,
        tone
      );
      terraces.add(x - w * 0.13, STREET_Y + h + 0.83, z - d * 0.17, w * 0.4, 1.73, d * 0.42, tone);
      parapets.add(x - w * 0.13, STREET_Y + h + 1.73, z - d * 0.17, w * 0.43, 0.22, d * 0.45, roof);
    }
    if (i % 3 === 0) pots.add(x + w * 0.26, STREET_Y + h + 0.29, z + d * 0.2, 0.42, 0.62, 0.42, 11104591);
  });
  for (const [x, z, tone] of [[-38, -17.2, 12021067], [-28.7, -18, 15124378]]) {
    shade.add(x, STREET_Y + 3.25, z, 3.2, 0.13, 3.9, tone, 0.08);
    terraces.add(x, STREET_Y + 0.8, z + 0.15, 2.7, 0.35, 1.1, 10189144);
    for (const dx of [-1.4, 1.4]) for (const dz of [-1.65, 1.65]) {
      const height = 3.22 - Math.sin(0.08) * dz;
      supports.add(x + dx, STREET_Y + height / 2 - 0.015, z + dz, 0.1, height, 0.1, 8414796);
    }
    for (const dx of [-1, 1]) supports.add(x + dx, STREET_Y + 0.32, z + 0.15, 0.13, 0.67, 0.7, 8414796);
    for (let k = 0; k < 4; k++) pots.add(x + (k - 1.5) * 0.5, STREET_Y + 1.21, z + 0.15, 0.19, 0.47, 0.19, 12158037);
  }
  walls.finish();
  parapets.finish();
  joinery2.finish();
  shade.finish();
  supports.finish();
  terraces.finish();
  pots.finish();
}
function buildDuneCourtyard(parent2, season = "summer") {
  const g = group();
  g.name = "dune-courtyard";
  parent2.add(g);
  g.add(desertTerrain(season));
  const sand = season === "winter" ? 13944234 : 14203789;
  for (const [x, z, w, d] of [
    [-6.65, -18.3, 16.7, 0.65],
    [18.2, -18.3, 23.6, 0.65],
    [-15.3, 3.2, 0.65, 42.4],
    [30.3, -6.2, 0.65, 24]
  ]) {
    put(g, box(w, 1.45, d, sand, { rough: 1 }), x, STREET_Y + 0.71, z);
  }
  put(g, box(1.68, 0.4, 13.5, 12097903, { rough: 0.96 }), -4.7, STREET_Y + 0.19, 8);
  const water = new THREE13.Mesh(
    new THREE13.PlaneGeometry(1.4, 13.2),
    new THREE13.MeshStandardMaterial({ color: 5602416, roughness: 0.25, metalness: 0.12 })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(-4.7, STREET_Y + 0.405, 8);
  g.add(water);
  for (const z of [2, 5, 8, 11, 14]) {
    put(g, box(0.9, 0.035, 0.024, 10729120, { cast: false }), -4.7, STREET_Y + 0.43, z);
  }
  const olive = planting(g, {
    seed: 20524,
    greens: season === "spring" ? [7241548, 9280360, 10989703] : [6912078, 9016689, 10726282],
    shadows: true
  });
  olive.tree(13, STREET_Y, -8, 8.7, 3.1, 42);
  olive.finish();
  put(g, cyl(2.65, 2.85, 0.2, 12099704, { segments: 36, rough: 1 }), 13, STREET_Y + 0.09, -8);
  for (const [i, x, z, size] of [
    [0, -11.8, 15.7, 1.6],
    [1, -11.2, 18.2, 0.9],
    [2, 25.6, -12.9, 1.5],
    [3, 27.3, -12, 0.85],
    [4, -10.3, -14.8, 1]
  ]) {
    succulent(g, x, z, size, 20525 + i);
  }
  put(g, box(4.8, 0.48, 1.4, 13480330), -12.2, STREET_Y + 0.72, 7.5);
  for (const x of [-14.1, -10.3]) put(g, box(0.75, 0.5, 1.25, sand), x, STREET_Y + 0.25, 7.5);
  for (const [x, z, height] of [[23.2, -5.2, 1.5], [24.4, -5.4, 0.95]]) {
    put(g, cyl(0.31, 0.53, height, 11694923, { segments: 18, rough: 1 }), x, STREET_Y + height / 2, z);
    put(g, cyl(0.25, 0.25, 0.025, 6771002, { segments: 18, cast: false }), x, STREET_Y + height + 0.017, z);
  }
  buildTown(g, season);
  return g;
}
var outlook6 = {
  id: "dune-courtyard",
  label: "Desert courtyard",
  aerial: false,
  ground: (season) => ({ y: STREET_Y - 0.02, color: season === "winter" ? 13352350 : 13676673 }),
  build(g, { season }) {
    buildDuneCourtyard(g, season);
  }
};

// dist/ui/roving/src/scene/outlooks/lantern-garden.js
import * as THREE14 from "three";
var SEASONS2 = {
  summer: { moss: "#607254", far: "#7e8b77", leaves: [8665665, 10701635, 7223618, 11557705] },
  autumn: { moss: "#74774f", far: "#929078", leaves: [11880491, 13855022, 11090472, 14981441] },
  winter: { moss: "#9da99b", far: "#bbc4bb", leaves: [9204318, 9799288] },
  spring: { moss: "#749266", far: "#94a18a", leaves: [11293280, 12806769, 9716556, 11951192] }
};
var PATHS = [
  { width: 3.2, points: [[DOOR.x, -3], [DOOR.x, -16.8], [-23, -16.8]] },
  { width: 2, smooth: true, points: [[-23, -16.8], [-29, -17], [-32, -24], [-43, -29], [-57, -40]] },
  { width: 1.9, smooth: true, points: [[-12, -16.8], [-17, -7], [-16, 10], [-9, 24], [5, 31], [19, 33], [29, 30]] },
  { width: 1.9, smooth: true, points: [[43, 30], [48, 21], [45, 6], [39, -9], [27, -16.8], [DOOR.x, -16.8]] },
  { width: 1.5, smooth: true, points: [[-16, 10], [-11, 15], [-6, 18]] },
  { width: 1.6, smooth: true, points: [[5, 31], [4, 40], [-6, 47], [-22, 50], [-39, 58]] },
  { width: 1.8, points: [[29, 30], [43, 30]] }
].map((path) => ({ ...path, samples: path.smooth ? new THREE14.CatmullRomCurve3(path.points.map(([x, z]) => new THREE14.Vector3(x, 0, z))).getPoints(140).map((p) => [p.x, p.z]) : path.points }));
var ISLANDS = [
  [-8, 7, 7, 11],
  [19, -9, 10, 5],
  [-9, 28, 9, 4],
  [9, 25.4, 11, 3.2],
  [24, 27, 4, 4],
  [38, 5, 5, 10],
  [36, 40, 13, 6],
  [-7, 40, 9, 5],
  [-22, 35, 9, 7],
  [51, -3, 9, 17],
  [-35, 19, 9, 18],
  [12, -29, 20, 7]
];
function distanceToRoute(x, z, path) {
  let nearest = Infinity;
  for (let i = 1; i < path.samples.length; i++) {
    const [ax, az] = path.samples[i - 1], [bx, bz] = path.samples[i];
    const dx = bx - ax, dz = bz - az;
    const t = THREE14.MathUtils.clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz), 0, 1);
    nearest = Math.min(nearest, Math.hypot(x - ax - dx * t, z - az - dz * t));
  }
  return nearest;
}
function clearPlanting(x, z, radius = 1) {
  if (x > -2 - radius && x < 28 + radius && z > -2.3 - radius && z < 22.2 + radius) return false;
  if (Math.pow((x - 36) / (6.7 + radius), 2) + Math.pow((z - 27) / (10 + radius), 2) < 1) return false;
  return PATHS.every((path) => distanceToRoute(x, z, path) > path.width / 2 + radius + 0.25);
}
function islandOutline(x, z, rx, rz, phase = 0) {
  const points = [];
  for (let i = 0; i < 64; i++) {
    const a = i / 64 * Math.PI * 2, ripple = 1 + 0.07 * Math.sin(a * 3 + phase) + 0.04 * Math.cos(a * 7 - phase);
    points.push([x + Math.cos(a) * rx * ripple, z + Math.sin(a) * rz * ripple]);
  }
  return points;
}
var POND = islandOutline(36, 27, 6.1, 9.5, 1.4);
function gardenTexture2(season) {
  const colors = SEASONS2[season] || SEASONS2.summer;
  const canvas2 = document.createElement("canvas");
  canvas2.width = canvas2.height = 2048;
  const c = canvas2.getContext("2d"), rand = seeded(20533);
  c.fillStyle = colors.far;
  c.fillRect(0, 0, 2048, 2048);
  c.translate(1024, 1024);
  c.scale(2048 / 360, 2048 / 360);
  function trace(points) {
    c.beginPath();
    points.forEach(([x, z], i) => i ? c.lineTo(x, z) : c.moveTo(x, z));
    c.closePath();
  }
  trace(islandOutline(10, 8, 72, 65, 0.7));
  c.fillStyle = colors.moss;
  c.fill();
  for (let i = 0; i < 9500; i++) {
    const x = rand() * 146 - 65, z = rand() * 140 - 62;
    c.fillStyle = i % 2 ? "rgba(201,211,166,.075)" : "rgba(30,54,32,.055)";
    c.beginPath();
    c.ellipse(x, z, 0.3 + rand() * 1.6, 0.3 + rand(), 0, 0, Math.PI * 2);
    c.fill();
  }
  for (const [x, z, rx, rz] of [[-10, 8, 7, 12], [17, -9, 12, 6], [13, 28, 13, 5], [39, 1, 8, 9]]) {
    c.save();
    trace(islandOutline(x, z, rx, rz, x * 0.3));
    c.clip();
    c.fillStyle = season === "winter" ? "#d1d5c9" : "#bfc1ae";
    c.fillRect(x - rx * 1.2, z - rz * 1.2, rx * 2.4, rz * 2.4);
    c.strokeStyle = season === "winter" ? "#bfc8b9" : "#a6af94";
    c.lineWidth = 0.07;
    for (let r = 0.8; r < Math.max(rx, rz) * 2; r += 0.58) {
      c.beginPath();
      c.ellipse(x, z, r, r * 0.66, -0.28, 0, Math.PI * 2);
      c.stroke();
    }
    c.restore();
  }
  for (const [i, [x, z, rx, rz]] of ISLANDS.entries()) {
    trace(islandOutline(x, z, rx, rz, i));
    c.fillStyle = colors.moss;
    c.fill();
    for (let j = 0; j < 100; j++) {
      const a = rand() * Math.PI * 2, r = Math.sqrt(rand());
      c.fillStyle = j % 2 ? "rgba(171,188,126,.2)" : "rgba(40,72,38,.16)";
      c.beginPath();
      c.ellipse(x + Math.cos(a) * rx * r, z + Math.sin(a) * rz * r, 0.2 + rand() * 0.5, 0.2, a, 0, Math.PI * 2);
      c.fill();
    }
  }
  c.lineJoin = c.lineCap = "round";
  for (const path of PATHS) {
    c.strokeStyle = season === "winter" ? "#c8cdc0" : "#c7bda5";
    c.lineWidth = path.width;
    c.beginPath();
    path.samples.forEach(([x, z], i) => i ? c.lineTo(x, z) : c.moveTo(x, z));
    c.stroke();
    for (let segment = 1; segment < path.samples.length; segment++) {
      const [ax, az] = path.samples[segment - 1], [bx, bz] = path.samples[segment];
      const length = Math.hypot(bx - ax, bz - az), nx = -(bz - az) / length, nz = (bx - ax) / length;
      for (let d = 0; d < length; d += 0.18) {
        const t = d / length, across = (rand() - 0.5) * path.width;
        c.fillStyle = rand() < 0.5 ? "rgba(87,86,64,.18)" : "rgba(250,242,212,.25)";
        c.beginPath();
        c.ellipse(
          ax + (bx - ax) * t + nx * across,
          az + (bz - az) * t + nz * across,
          0.025 + rand() * 0.1,
          0.025 + rand() * 0.065,
          rand() * Math.PI,
          0,
          Math.PI * 2
        );
        c.fill();
      }
      if (segment % 3 === 0 || length > 2) for (const side of [-1, 1]) {
        c.fillStyle = colors.moss;
        c.beginPath();
        c.ellipse(
          ax + nx * path.width * 0.53 * side,
          az + nz * path.width * 0.53 * side,
          0.13 + rand() * 0.2,
          0.09 + rand() * 0.13,
          rand() * Math.PI,
          0,
          Math.PI * 2
        );
        c.fill();
      }
    }
  }
  trace(POND);
  c.fillStyle = "#344f49";
  c.fill();
  const texture = new THREE14.CanvasTexture(canvas2);
  texture.colorSpace = THREE14.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
function mapleLeafGeometry() {
  const outline = [
    [0, 0],
    [-0.08, 0.13],
    [-0.32, 0.24],
    [-0.2, 0.34],
    [-0.47, 0.57],
    [-0.27, 0.55],
    [-0.31, 0.8],
    [-0.09, 0.66],
    [0, 1],
    [0.09, 0.66],
    [0.31, 0.8],
    [0.27, 0.55],
    [0.47, 0.57],
    [0.2, 0.34],
    [0.32, 0.24],
    [0.08, 0.13]
  ];
  const shape = new THREE14.Shape(outline.map(([x, y]) => new THREE14.Vector2(x, y)));
  const geo = new THREE14.ShapeGeometry(shape), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getY(i) * Math.PI) * 0.13);
  geo.computeVertexNormals();
  return geo;
}
function instanceBatch(parent2, geometry, { shadows = true, side = THREE14.FrontSide } = {}) {
  const records = [], dummy = new THREE14.Object3D(), colour = new THREE14.Color();
  return {
    add(position, scale, rotation, tone) {
      dummy.position.set(...position);
      dummy.scale.set(...scale);
      dummy.rotation.set(...rotation);
      dummy.updateMatrix();
      records.push({ matrix: dummy.matrix.clone(), tone });
    },
    branch(from, to, radius, tone) {
      const a = new THREE14.Vector3(...from), b = new THREE14.Vector3(...to), d = b.clone().sub(a);
      dummy.position.copy(a).add(b).multiplyScalar(0.5);
      dummy.scale.set(radius, d.length(), radius);
      dummy.quaternion.setFromUnitVectors(new THREE14.Vector3(0, 1, 0), d.normalize());
      dummy.updateMatrix();
      records.push({ matrix: dummy.matrix.clone(), tone });
    },
    finish(name) {
      if (!records.length) {
        geometry.dispose();
        return;
      }
      const mesh2 = new THREE14.InstancedMesh(geometry, new THREE14.MeshLambertMaterial({ side }), records.length);
      mesh2.name = name;
      records.forEach((r, i) => {
        mesh2.setMatrixAt(i, r.matrix);
        mesh2.setColorAt(i, colour.setHex(r.tone));
      });
      mesh2.castShadow = shadows;
      mesh2.receiveShadow = true;
      mesh2.computeBoundingBox();
      mesh2.computeBoundingSphere();
      parent2.add(mesh2);
    }
  };
}
function gardenPlants(parent2, season) {
  const colors = SEASONS2[season] || SEASONS2.summer, rand = seeded(20534);
  const leafRand = seeded(20535);
  const branches = instanceBatch(parent2, new THREE14.CylinderGeometry(0.7, 1, 1, 6));
  const leaves = instanceBatch(parent2, mapleLeafGeometry(), { side: THREE14.DoubleSide });
  function maple(x, z, h, radius, sparse = false) {
    const y = STREET_Y;
    const root = [x, y, z], fork = [x + 0.45, y + h * 0.44, z - 0.28];
    branches.branch(root, fork, 0.25 * h / 8, 6972244);
    for (let arm = 0; arm < 10; arm++) {
      const angle = arm * 2.399 + 0.3, reach = radius * (0.65 + rand() * 0.35);
      const joint = [fork[0] + Math.cos(angle) * reach * 0.48, y + h * (0.62 + rand() * 0.17), fork[2] + Math.sin(angle) * reach * 0.48];
      const end = [x + Math.cos(angle) * reach, y + h * (0.79 + rand() * 0.15), z + Math.sin(angle) * reach];
      branches.branch(fork, joint, 0.12 * h / 8, 7826267);
      branches.branch(joint, end, 0.061 * h / 8, 7628120);
      for (let twig = 0; twig < 3; twig++) {
        const a = angle + (twig - 1) * 0.95;
        const tip = [end[0] + Math.cos(a) * 0.7, end[1] + (twig % 2 ? 0.3 : -0.18), end[2] + Math.sin(a) * 0.7];
        branches.branch(end, tip, 0.022 * h / 8, 6774097);
      }
      const count = season === "winter" ? arm % 3 ? 0 : 2 : sparse ? 38 : 95;
      for (let k = 0; k < count; k++) {
        const a = leafRand() * Math.PI * 2, r = Math.sqrt(leafRand()) * radius * 0.42;
        const size = 0.48 + leafRand() * 0.4;
        leaves.add(
          [end[0] + Math.cos(a) * r, end[1] + (leafRand() - 0.5) * 0.66, end[2] + Math.sin(a) * r],
          [size, size, size],
          [1 + leafRand() * 1.5, a, leafRand() * 0.9],
          colors.leaves[Math.floor(leafRand() * colors.leaves.length)]
        );
      }
    }
  }
  maple(-8.2, 7.9, 9.4, 5);
  maple(18.6, -10.5, 7.4, 4.3);
  maple(-16, 28, 6.1, 3.8, true);
  branches.finish("lantern-maple-branches");
  leaves.finish("lantern-maple-leaves");
  const stems = instanceBatch(parent2, new THREE14.CylinderGeometry(0.07, 0.085, 1, 5), { shadows: false });
  const blade = new THREE14.Shape([[0, 0], [0.13, 0.3], [0.09, 0.65], [0, 1], [-0.08, 0.65], [-0.1, 0.3]].map(([x, y]) => new THREE14.Vector2(x, y)));
  const blades = instanceBatch(parent2, new THREE14.ShapeGeometry(blade), { shadows: false, side: THREE14.DoubleSide });
  for (let i = 0; i < 46; i++) {
    const x = -24 - rand() * 3.5, z = -18 + i * 1.06, h = 6.3 + rand() * 3.2;
    if (PATHS.some((path) => distanceToRoute(x, z, path) < path.width / 2 + 0.75)) continue;
    stems.add([x, STREET_Y + h / 2, z], [1, h, 1], [0, 0, (rand() - 0.5) * 0.07], 6911575);
    for (let j = 0; j < 30; j++) {
      const y = STREET_Y + h * (0.44 + rand() * 0.55), a = rand() * Math.PI * 2;
      blades.add(
        [x + Math.cos(a) * 0.4, y, z + Math.sin(a) * 0.4],
        [1, 1.1 + rand() * 0.85, 1],
        [1.1, a, (rand() - 0.5) * 1.4],
        season === "winter" ? 7900534 : 5994068
      );
    }
  }
  stems.finish("lantern-bamboo-stems");
  blades.finish("lantern-bamboo-leaves");
}
function fernGeometry() {
  const vertices = [], indices = [];
  for (let i = 0; i < 7; i++) {
    const t = i / 7, y = 0.1 + t * 0.66, z = t * 0.9;
    const width = Math.sin((t * 0.8 + 0.12) * Math.PI) * 0.24;
    for (const side of [-1, 1]) {
      const start = vertices.length / 3;
      vertices.push(0, y, z, side * width, y + 0.12, z + 0.14, 0, y + 0.065, z + 0.12);
      indices.push(start, start + 1, start + 2);
    }
  }
  const geometry = new THREE14.BufferGeometry();
  geometry.setAttribute("position", new THREE14.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
function layeredPlanting(parent2, season) {
  const rand = seeded(20536), winter = season === "winter";
  const shrubs = instanceBatch(parent2, new THREE14.IcosahedronGeometry(1, 1));
  const ferns = instanceBatch(parent2, fernGeometry(), { side: THREE14.DoubleSide });
  const stones = instanceBatch(parent2, new THREE14.IcosahedronGeometry(1, 0));
  const green = winter ? [7307885, 8491386, 5860440] : [5401926, 7178063, 4218174, 8623192];
  for (const [island, [x, z, rx, rz]] of ISLANDS.entries()) {
    for (let plant = 0; plant < 16; plant++) {
      const angle = rand() * Math.PI * 2, r = Math.sqrt(rand()) * 0.87;
      const px = x + Math.cos(angle) * rx * r, pz = z + Math.sin(angle) * rz * r;
      const size = 0.55 + rand() * 1.05;
      if (!clearPlanting(px, pz, size * 1.15)) continue;
      const height = size * (0.58 + rand() * 0.28);
      for (let lobe = 0; lobe < 3; lobe++) {
        const a = lobe * 2.4 + rand();
        const tone = season === "spring" && island % 3 === 0 && lobe === 2 ? 11898004 : green[(plant + lobe) % green.length];
        shrubs.add(
          [px + Math.cos(a) * size * 0.36, STREET_Y + height * (0.62 + lobe * 0.08), pz + Math.sin(a) * size * 0.33],
          [size * 0.72, height, size * 0.66],
          [0, a, 0.08],
          tone
        );
      }
      if (plant % 3 === 0) {
        const fx = px + size * 1.1, fz = pz - size * 0.3;
        if (clearPlanting(fx, fz, 0.65)) for (let frond = 0; frond < 8; frond++) {
          ferns.add([fx, STREET_Y + 0.09, fz], [1.1, 1.1, 1.1], [0, frond * Math.PI / 4 + rand() * 0.2, 0], green[frond % green.length]);
        }
      }
    }
  }
  for (let i = 0; i < POND.length; i += 3) {
    const [x, z] = POND[i], size = 0.45 + rand() * 0.65;
    if (!clearPlanting(x, z, 0.35) && Math.abs(z - 30) < 1.8) continue;
    stones.add([x, STREET_Y + 0.24, z], [size, 0.35 + rand() * 0.25, size * 0.72], [0.12, rand() * Math.PI, 0.13], green[i % green.length]);
  }
  shrubs.finish("lantern-layered-shrubs");
  ferns.finish("lantern-understory-ferns");
  stones.finish("lantern-pond-stones");
  const trunks = instanceBatch(parent2, new THREE14.CylinderGeometry(0.7, 1, 1, 6));
  const clouds = instanceBatch(parent2, new THREE14.IcosahedronGeometry(1, 1));
  function pine(x, z, h, size) {
    const fork = [x + 0.55, STREET_Y + h * 0.88, z - 0.3];
    trunks.branch([x, STREET_Y, z], fork, 0.22 * size, 7103829);
    for (let tier = 0; tier < 3; tier++) for (let arm = 0; arm < 3; arm++) {
      const a = arm * 2.1 + tier * 0.7, reach = size * (2 - tier * 0.42);
      const end = [x + Math.cos(a) * reach, STREET_Y + h * (0.48 + tier * 0.2), z + Math.sin(a) * reach];
      const branchY = end[1] - 0.7, trunkFraction = (branchY - STREET_Y) / (fork[1] - STREET_Y);
      trunks.branch([x + (fork[0] - x) * trunkFraction, branchY, z + (fork[2] - z) * trunkFraction], end, 0.072 * size, 7629913);
      clouds.add(end, [size * 1.35, size * 0.47, size * 1.13], [0, a, 0], green[(arm + tier) % green.length]);
    }
  }
  for (const [x, z, h, size] of [
    [-11, -7, 6.4, 1.3],
    [33, -8, 7.7, 1.65],
    [-23, 28, 7.8, 1.6],
    [25, 40, 5.6, 1.1],
    [49, 8, 8.3, 1.7],
    [-10, 40, 5.4, 1.1],
    [49, 36, 6.8, 1.5]
  ]) pine(x, z, h, size);
  trunks.finish("lantern-cloud-pine-branches");
  clouds.finish("lantern-cloud-pine-canopies");
  const farTrunks = instanceBatch(parent2, new THREE14.CylinderGeometry(0.15, 0.24, 1, 5), { shadows: false });
  const farLeaves = instanceBatch(parent2, new THREE14.IcosahedronGeometry(1, 1), { shadows: false });
  for (let ring = 0; ring < 4; ring++) for (let i = 0; i < 28 + ring * 14; i++) {
    const a = (i + ring * 0.37) / (28 + ring * 14) * Math.PI * 2, radius = 52 + ring * 15 + rand() * 9;
    const x = 10 + Math.cos(a) * radius, z = 8 + Math.sin(a) * radius;
    if (!clearPlanting(x, z, 3.2)) continue;
    const h = 5.2 + rand() * 5.8, crown = 2.6 + rand() * 1.8 + ring * 0.45;
    farTrunks.add([x, STREET_Y + h / 2, z], [1, h, 1], [0, a, 0.025], 7960682);
    for (let lobe = 0; lobe < 3; lobe++) {
      farLeaves.add(
        [x + Math.cos(lobe * 2.2) * crown * 0.5, STREET_Y + h * (0.63 + lobe * 0.1), z + Math.sin(lobe * 2.2) * crown * 0.5],
        [crown, crown * 0.7, crown * 0.95],
        [0, a + lobe, 0],
        winter ? [8491391, 9281161, 7571056][lobe] : [6652508, 8228964, 5270864][lobe]
      );
    }
  }
  farTrunks.finish("lantern-woodland-trunks");
  farLeaves.finish("lantern-woodland-canopies");
}
function pondAndBridge(parent2, season) {
  const shape = new THREE14.Shape(POND.map(([x, z]) => new THREE14.Vector2(x, -z)));
  const pond = new THREE14.Mesh(new THREE14.ShapeGeometry(shape), new THREE14.MeshStandardMaterial({
    color: season === "winter" ? 7639434 : 4418916,
    roughness: 0.32,
    metalness: 0.12
  }));
  pond.name = "lantern-garden-pond";
  pond.rotation.x = -Math.PI / 2;
  pond.position.y = STREET_Y + 0.07;
  pond.receiveShadow = true;
  parent2.add(pond);
  const timber = instanceBatch(parent2, new THREE14.BoxGeometry(1, 1, 1));
  const rail = instanceBatch(parent2, new THREE14.CylinderGeometry(1, 1, 1, 6));
  const deckY = (x) => STREET_Y + 0.21 + Math.sin((x - 29) / 14 * Math.PI) * 0.72;
  for (let i = 0; i < 28; i++) {
    const x = 29.25 + i * 0.5;
    timber.add([x, deckY(x), 30], [0.475, 0.13, 1.85], [0, 0, Math.cos((x - 29) / 14 * Math.PI) * 0.16], 8548442);
  }
  for (const z of [28.94, 31.06]) {
    for (let i = 0; i < 7; i++) {
      const x = 29 + i * 14 / 6;
      timber.add([x, deckY(x) + 0.53, z], [0.105, 1.15, 0.105], [0, 0, 0], 6116680);
      if (i < 6) {
        const nextX = 29 + (i + 1) * 14 / 6;
        rail.branch([x, deckY(x) + 1.03, z], [nextX, deckY(nextX) + 1.03, z], 0.052, 6116680);
      }
    }
  }
  timber.finish("lantern-footbridge-timber");
  rail.finish("lantern-footbridge-rails");
  const pads = instanceBatch(parent2, new THREE14.CircleGeometry(1, 9), { shadows: false, side: THREE14.DoubleSide });
  for (const [x, z, r] of [[34, 21, 0.38], [34.8, 21.6, 0.48], [35.9, 21.4, 0.32], [39, 25, 0.47], [39.7, 25.7, 0.3]]) {
    pads.add([x, STREET_Y + 0.1, z], [r, r, r], [-Math.PI / 2, 0, x], season === "winter" ? 9016695 : 8557135);
  }
  pads.finish("lantern-water-lilies");
}
function buildLanternGarden(parent2, season = "summer") {
  const g = group();
  g.name = "lantern-garden";
  parent2.add(g);
  const horizon = new THREE14.Mesh(
    new THREE14.PlaneGeometry(2e3, 2e3),
    new THREE14.MeshLambertMaterial({ color: (SEASONS2[season] || SEASONS2.summer).far })
  );
  horizon.name = "lantern-landscape-horizon";
  horizon.rotation.x = -Math.PI / 2;
  horizon.position.y = STREET_Y - 0.04;
  horizon.receiveShadow = true;
  g.add(horizon);
  const ground = new THREE14.Mesh(new THREE14.PlaneGeometry(360, 360), new THREE14.MeshLambertMaterial({ map: gardenTexture2(season) }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = STREET_Y + 0.025;
  ground.receiveShadow = true;
  g.add(ground);
  gardenPlants(g, season);
  layeredPlanting(g, season);
  pondAndBridge(g, season);
  const rocks = instanceBatch(g, new THREE14.IcosahedronGeometry(1, 1));
  for (const [x, z, w, h, d] of [
    [-8, 3.9, 1.8, 1.1, 1.15],
    [-9.7, 4.9, 1.1, 0.55, 0.9],
    [-6.6, 5, 0.74, 0.46, 0.8],
    [23.5, -9.2, 1.7, 1.3, 1.4],
    [25.2, -10.1, 0.85, 0.55, 1.1]
  ]) {
    rocks.add([x, STREET_Y + h * 0.46, z], [w, h, d], [0.1, x * 0.3, 0.12], 7699573);
  }
  for (const path of [PATHS[2], PATHS[4], PATHS[5]]) {
    let walked = 0;
    for (let i = 1; i < path.samples.length; i++) {
      const [x, z] = path.samples[i], [px, pz] = path.samples[i - 1];
      walked += Math.hypot(x - px, z - pz);
      if (walked < 1.7) continue;
      walked = 0;
      rocks.add([x, STREET_Y + 0.07, z], [0.56, 0.14, 0.7], [0, Math.atan2(x - px, z - pz), 0], 10133388);
    }
  }
  rocks.finish("lantern-garden-stones");
  for (const [from, to] of [[-20, -19], [-14.6, 32]]) {
    put(g, box(0.35, 2.75, to - from, 11644832, { rough: 1 }), -22, STREET_Y + 1.36, (from + to) / 2);
    put(g, box(0.58, 0.15, to - from + 0.15, 5264975), -22, STREET_Y + 2.83, (from + to) / 2);
  }
  put(g, box(61, 2.75, 0.35, 11644832, { rough: 1 }), 8.3, STREET_Y + 1.36, -21.5);
  put(g, box(61.3, 0.15, 0.58, 5264975), 8.3, STREET_Y + 2.83, -21.5);
  for (const [x, z, w, d, h] of [[-36, -7, 12, 15, 5.3], [13, -36, 17, 9, 4.5], [39, -27, 10, 11, 6]]) {
    put(g, box(w, h, d, 11842468, { cast: false, rough: 1 }), x, STREET_Y + h / 2, z);
    put(g, box(w - 0.9, 1.9, 0.08, 5859425, { cast: false }), x, STREET_Y + h * 0.57, z + d / 2 + 0.06);
    const roofGeo = new THREE14.CylinderGeometry(0, 1, 1, 4, 1);
    roofGeo.rotateY(Math.PI / 4);
    const roof = new THREE14.Mesh(roofGeo, new THREE14.MeshLambertMaterial({ color: 5857628 }));
    roof.scale.set((w + 2.1) / Math.SQRT2, 2, (d + 2.1) / Math.SQRT2);
    roof.position.set(x, STREET_Y + h + 0.9, z);
    g.add(roof);
  }
  for (const [x, z] of [[-0.5, -9], [-5.3, 15.5]]) {
    put(g, cyl(0.38, 0.49, 0.24, 7765106, { segments: 8 }), x, STREET_Y + 0.12, z);
    put(g, box(0.22, 1.3, 0.22, 5725269), x, STREET_Y + 0.8, z);
    const light = new THREE14.Mesh(
      new THREE14.BoxGeometry(0.64, 0.74, 0.64),
      new THREE14.MeshStandardMaterial({ color: 14998722, emissive: 16763780, emissiveIntensity: 0 })
    );
    light.position.set(x, STREET_Y + 1.62, z);
    g.add(light);
    put(g, box(0.93, 0.16, 0.93, 5068110), x, STREET_Y + 2.08, z);
    markNightLight(light, { emissive: [light.material], emissiveIntensity: 1.2 });
  }
  return g;
}
var outlook7 = {
  id: "lantern-garden",
  label: "Maple courtyard",
  aerial: false,
  ground: (season) => ({ y: STREET_Y - 0.02, color: season === "winter" ? 12437183 : 8293239 }),
  build(g, { season }) {
    buildLanternGarden(g, season);
  }
};

// dist/ui/roving/src/scene/outlooks/index.js
var OUTLOOKS = {
  [outlook.id]: outlook,
  [outlook2.id]: outlook2,
  [outlook3.id]: outlook3,
  [outlook4.id]: outlook4,
  [outlook5.id]: outlook5,
  [outlook6.id]: outlook6,
  [outlook7.id]: outlook7
};
function outlookOf(mode) {
  return mode.startsWith("street-") ? "street" : mode;
}
function seasonOf(mode) {
  return mode.startsWith("street-") ? mode.slice("street-".length) : "summer";
}
for (const mode of OUTSIDE_MODES) {
  if (!OUTLOOKS[outlookOf(mode)]) {
    throw new Error(`outlook registry: no outlook behind mode '${mode}'`);
  }
}
for (const id of Object.keys(OUTLOOKS)) {
  if (!OUTSIDE_MODES.some((m) => outlookOf(m) === id)) {
    throw new Error(`outlook registry: '${id}' is reachable by no mode in projects.js`);
  }
}

// dist/ui/roving/src/scene/exterior.js
var STOREY_H2 = 7;
function buildExterior(parent2, { mode = "street-summer", season: seasonIn = null, storeysBelow = 0, serviceYard = false, building: building4 = null } = {}) {
  const g = group(0, 0, 0);
  const season = seasonIn ?? seasonOf(mode);
  const outlook8 = OUTLOOKS[outlookOf(mode)] ?? OUTLOOKS.street;
  g.add(buildGroundPlane(outlook8.ground(season)));
  outlook8.build(g, { season, serviceYard, building: building4 });
  if (!outlook8.aerial && storeysBelow > 0) g.position.y = -storeysBelow * STOREY_H2;
  parent2.add(g);
  return g;
}
function buildGroundPlane({ y, color = COLORS.road }) {
  const plane = new THREE15.Mesh(
    new THREE15.PlaneGeometry(220, 220),
    mat(color, { rough: 1 })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(ROOM.W / 2, y, ROOM.D / 2);
  plane.receiveShadow = true;
  return plane;
}

// dist/ui/roving/src/scene/approach.js
var RISER_TARGET = 0.46;
var STAIR_TREAD = 0.62;
var STAIR_WIDTH = 2.3;
var STAIR_Z = -1.15;
var STAIR_RAIL_H = 1;
var STAIR_POST_EVERY = 4;
function stairFlight(dropHeight) {
  const groundY = -(dropHeight + Math.abs(WALK_Y));
  const steps = Math.max(3, Math.round(Math.abs(groundY) / RISER_TARGET));
  const riser = Math.abs(groundY) / steps;
  const run = steps * STAIR_TREAD;
  const xTop = DOOR.x + (DOOR.width + 2.6) / 2;
  const flight = {
    groundY,
    steps,
    riser,
    run,
    xTop,
    // Middle of the pad at the foot, where the flight meets the pavement.
    xPad: xTop + run + STAIR_TREAD,
    tread: STAIR_TREAD,
    width: STAIR_WIDTH,
    z: STAIR_Z,
    pitch: Math.atan2(riser, STAIR_TREAD)
  };
  flight.route = stairRoute(flight);
  flight.descent = [...flight.route].reverse();
  return flight;
}
function stairRoute({ xTop, run, tread, riser, steps, groundY, z }) {
  return [
    // On the pad at the foot of the flight, which stands a little proud of the
    // pavement it is bedded into.
    { x: xTop + run + tread, y: groundY + 0.2, z },
    // The bottom tread...
    { x: xTop + (steps - 0.5) * tread, y: -riser * (steps - 1), z },
    // ...and the top one, level with the landing.
    { x: xTop + 0.5 * tread, y: 0, z },
    // Off the flight and across the landing, to the spot outside the door that
    // every entrance shares.
    { x: DOOR.outside.x, y: 0, z: DOOR.outside.z }
  ];
}
var STOOP_STEP_H = 0.42;
var STOOP_STEP_D = 0.7;
var STOOP_STEPS = 2;
function stoopSteps() {
  const steps = [];
  for (let i = 0; i < STOOP_STEPS; i++) {
    steps.push({
      i,
      // Matching the boxes: each is `STOOP_STEP_H` tall, centred on this y.
      y: -0.2 - i * STOOP_STEP_H,
      z: -DOOR.stoopDepth - 0.35 - i * STOOP_STEP_D,
      width: DOOR.width + 2.6 - i * 0.5
    });
  }
  return steps;
}
function stoopApproach(raised = false) {
  const groundY = raised ? 0 : WALK_Y;
  return {
    route: [
      // Tucked behind the corner. Both walls stand between here and the camera.
      { x: -3.2, y: groundY, z: -1.5 },
      // Out along the face of the wall, to the edge of the landing.
      { x: -0.1, y: groundY, z: -1.5 },
      // And up onto it. A single step off the pavement, taken deliberately, because
      // the stoop's own steps are round at the front and this is the side of it.
      { x: 1.5, y: 0, z: -1.5 },
      // The spot outside the door that every entrance shares.
      { x: DOOR.outside.x, y: 0, z: DOOR.outside.z }
    ]
  };
}

// dist/ui/roving/src/scene/plants.js
import * as THREE16 from "three";
function greens(seasonal = false) {
  return seasonal ? { leaf: "leaf", dark: "leafDark", light: "leaf" } : { leaf: "houseLeaf", dark: "houseLeafDark", light: "houseLeafLight" };
}
var SILL_SEASONS = {
  spring: {
    // Blossom, matching the cherries the street has come into flower.
    mound: 15316941,
    moundAlt: 14130358,
    foliage: 0.9,
    blooms: 9,
    bloom: 16773878,
    bloomAlt: 16173532,
    berries: 0,
    twigs: 1
  },
  summer: {
    // High summer: full, and flowering white and yellow.
    mound: 7250788,
    moundAlt: 5540430,
    foliage: 1,
    blooms: 8,
    bloom: 16643808,
    bloomAlt: 15779418,
    berries: 0,
    twigs: 0
  },
  autumn: {
    // Turning, and going over: fewer flowers, more seedhead.
    mound: 12745523,
    moundAlt: 10244900,
    foliage: 0.75,
    blooms: 5,
    bloom: 14254884,
    bloomAlt: 9190166,
    berries: 3,
    twigs: 3
  },
  winter: {
    // Cut back to evergreen sprigs, with berries and bare stems above them, and
    // nothing at all in flower — so the bloom colours go unread.
    mound: 4156239,
    moundAlt: 3102016,
    foliage: 0.5,
    blooms: 0,
    bloom: null,
    bloomAlt: null,
    berries: 7,
    twigs: 6
  }
};
var BERRY = 11681839;
function seeded2(seed) {
  let s = seed >>> 0;
  return () => {
    s = s * 1664525 + 1013904223 >>> 0;
    return s / 4294967296;
  };
}
function addPot(g, { r = 0.4, h = 0.7, color = null, rim = true }) {
  const c = color ?? "pot";
  put(g, cyl(r, r * 0.78, h, c, { segments: 14, rough: 0.8 }), 0, h / 2);
  if (rim) {
    put(g, cyl(r * 1.08, r * 1.02, h * 0.13, c, { segments: 14, rough: 0.75 }), 0, h - h * 0.05);
  }
  put(g, cyl(r * 0.93, r * 0.93, 0.07, "soil", { segments: 14, cast: false }), 0, h - 0.06);
  return h;
}
function stemTo(from, to, radius, color) {
  const dir = new THREE16.Vector3().subVectors(to, from);
  const stem = cyl(radius, radius * 1.15, dir.length(), color, { segments: 5, cast: false });
  stem.position.copy(from).addScaledVector(dir, 0.5);
  stem.quaternion.setFromUnitVectors(new THREE16.Vector3(0, 1, 0), dir.clone().normalize());
  return stem;
}
function leafBlob(radius, color, { spread: spread2 = 1, lift = 1, thin = 0.42 } = {}) {
  const leaf = new THREE16.Mesh(
    new THREE16.IcosahedronGeometry(radius, 0),
    mat(color, { flat: true, rough: 0.9 })
  );
  leaf.scale.set(spread2, lift, thin);
  leaf.castShadow = true;
  return leaf;
}
function buildFig(scale = 1, opts = {}) {
  const g = group(0, 0, 0);
  const F = greens(opts.seasonal);
  const potH = addPot(g, { r: 0.36 * scale, h: 0.62 * scale });
  const rnd = seeded2(497);
  const stems = [
    { lean: 0.1, dir: 0.4, h: 1.02 },
    { lean: -0.13, dir: 2.4, h: 0.78 }
  ];
  for (const s of stems) {
    const stemH = s.h * scale;
    const stem = cyl(0.055 * scale, 0.085 * scale, stemH, "woodDark", { segments: 8 });
    stem.position.set(
      Math.cos(s.dir) * 0.1 * scale,
      potH + stemH / 2 - 0.05 * scale,
      Math.sin(s.dir) * 0.1 * scale
    );
    stem.rotation.z = s.lean;
    g.add(stem);
    const top = potH + stemH;
    for (let i = 0; i < 7; i++) {
      const t = i / 6;
      const a = i * 2.3 + s.dir;
      const y = top - stemH * 0.62 * (1 - t) - 0.1 * scale;
      const r = (0.19 + rnd() * 0.08) * scale;
      const leaf = leafBlob(r, i % 3 === 0 ? F.dark : F.leaf, {
        spread: 1.15,
        lift: 0.55,
        thin: 0.8
      });
      leaf.position.set(
        Math.cos(a) * (0.24 + t * 0.12) * scale + Math.sin(s.lean) * -y * 0.5,
        y,
        Math.sin(a) * (0.24 + t * 0.12) * scale
      );
      leaf.rotation.set(0.25 - t * 0.4, a, 0.2);
      g.add(leaf);
    }
    put(g, leafBlob(0.17 * scale, F.light, { spread: 1, lift: 0.7, thin: 0.85 }), Math.sin(s.lean) * -top * 0.5, top + 0.1 * scale, 0);
  }
  return g;
}
function buildMonstera(scale = 1, opts = {}) {
  const g = group(0, 0, 0);
  const F = greens(opts.seasonal);
  const potH = addPot(g, { r: 0.32 * scale, h: 0.46 * scale, color: "terracotta" });
  const LEAVES = 7;
  for (let i = 0; i < LEAVES; i++) {
    const a = i / LEAVES * Math.PI * 2 + 0.4;
    const reach = (0.26 + i % 3 * 0.06) * scale;
    const h = (0.3 + i % 4 * 0.13) * scale;
    const stalk = cyl(0.025 * scale, 0.035 * scale, h, F.dark, { segments: 6 });
    stalk.position.set(Math.cos(a) * reach * 0.45, potH + h / 2, Math.sin(a) * reach * 0.45);
    stalk.rotation.z = -Math.cos(a) * 0.5;
    stalk.rotation.x = Math.sin(a) * 0.5;
    g.add(stalk);
    const leaf = leafBlob(
      (0.24 + i % 2 * 0.05) * scale,
      i % 2 ? F.leaf : F.dark,
      { spread: 1.3, lift: 0.3, thin: 1.1 }
    );
    leaf.position.set(Math.cos(a) * reach, potH + h, Math.sin(a) * reach);
    leaf.rotation.set(0.5, -a, 0.35);
    g.add(leaf);
  }
  return g;
}
function buildSnakePlant(scale = 1, opts = {}) {
  const g = group(0, 0, 0);
  const F = greens(opts.seasonal);
  const potH = addPot(g, { r: 0.26 * scale, h: 0.44 * scale, color: "coolerBody", rim: false });
  const rnd = seeded2(709);
  const BLADES = 9;
  for (let i = 0; i < BLADES; i++) {
    const a = i / BLADES * Math.PI * 2;
    const h = (0.6 + rnd() * 0.42) * scale;
    const blade = box(
      0.12 * scale,
      h,
      0.045 * scale,
      i % 3 === 0 ? F.light : F.dark,
      { rough: 0.85 }
    );
    blade.position.set(Math.cos(a) * 0.1 * scale, potH + h / 2 - 0.04, Math.sin(a) * 0.1 * scale);
    blade.rotation.y = -a;
    blade.rotation.z = Math.cos(a) * 0.16;
    blade.rotation.x = -Math.sin(a) * 0.16;
    g.add(blade);
  }
  return g;
}
function buildFern(scale = 1, opts = {}) {
  const g = group(0, 0, 0);
  const F = greens(opts.seasonal);
  const potH = addPot(g, { r: 0.17 * scale, h: 0.2 * scale, color: "pot" });
  const FRONDS = 9;
  for (let i = 0; i < FRONDS; i++) {
    const a = i / FRONDS * Math.PI * 2 + 0.3;
    const frond = leafBlob(
      (0.1 + i % 3 * 0.025) * scale,
      i % 2 ? F.light : F.leaf,
      { spread: 1.6, lift: 0.28, thin: 0.5 }
    );
    frond.position.set(
      Math.cos(a) * 0.15 * scale,
      potH + (0.07 + i % 3 * 0.05) * scale,
      Math.sin(a) * 0.15 * scale
    );
    frond.rotation.set(0.2, -a, 0.55);
    g.add(frond);
  }
  return g;
}
function buildPothos(scale = 1, opts = {}) {
  const g = group(0, 0, 0);
  const F = greens(opts.seasonal);
  const potH = addPot(g, { r: 0.19 * scale, h: 0.22 * scale, color: "mailbox", rim: false });
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2;
    const leaf = leafBlob(
      0.12 * scale,
      i % 2 ? F.leaf : F.light,
      { spread: 1.2, lift: 0.45, thin: 0.9 }
    );
    leaf.position.set(Math.cos(a) * 0.11 * scale, potH + 0.07 * scale, Math.sin(a) * 0.11 * scale);
    leaf.rotation.set(0.3, a, 0.2);
    g.add(leaf);
  }
  const REACH = 0.42;
  const strands = [
    { a: 0.05, links: opts.sideDrop ?? 9 },
    { a: 0.8, links: 5 },
    { a: 1.5, links: 7 },
    { a: 2.15, links: 4 }
  ];
  for (const strand of strands) {
    const first = new THREE16.Vector3(
      Math.cos(strand.a) * REACH * scale,
      potH * 0.75 - 0.08 * scale,
      Math.sin(strand.a) * REACH * scale
    );
    g.add(stemTo(new THREE16.Vector3(0, potH * 0.85, 0), first, 0.016 * scale, F.dark));
    for (let i = 0; i < strand.links; i++) {
      const drop2 = i * 0.2 * scale;
      const out = (REACH + i * 0.05) * scale;
      const leaf = leafBlob(
        (0.115 - i * 6e-3) * scale,
        i % 2 ? F.dark : F.leaf,
        { spread: 1.15, lift: 0.5, thin: 0.95 }
      );
      leaf.position.set(Math.cos(strand.a) * out, first.y - drop2, Math.sin(strand.a) * out);
      leaf.rotation.set(0.2, strand.a, 0.35 + i * 0.08);
      g.add(leaf);
      if (i < strand.links - 1) {
        const next = new THREE16.Vector3(
          Math.cos(strand.a) * (REACH + (i + 1) * 0.05) * scale,
          first.y - (i + 1) * 0.2 * scale,
          Math.sin(strand.a) * (REACH + (i + 1) * 0.05) * scale
        );
        g.add(stemTo(leaf.position.clone(), next, 0.012 * scale, F.dark));
      }
    }
  }
  return g;
}
function buildLeafyBush(scale = 1, opts = {}) {
  const g = group(0, 0, 0);
  const F = greens(opts.seasonal);
  const potH = addPot(g, { r: 0.4 * scale, h: 0.7 * scale });
  const rnd = seeded2(1457);
  const LEAVES = 8;
  for (let i = 0; i < LEAVES; i++) {
    const a = i / LEAVES * Math.PI * 2;
    const leaf = leafBlob(
      (0.5 + rnd() * 0.06) * scale,
      i % 2 ? F.leaf : F.dark,
      { spread: 0.7, lift: 1.4, thin: 0.4 }
    );
    leaf.position.set(
      Math.cos(a) * (0.34 + rnd() * 0.05) * scale,
      potH + (0.4 + i % 3 * 0.35 + rnd() * 0.09) * scale,
      Math.sin(a) * (0.34 + rnd() * 0.05) * scale
    );
    leaf.rotation.y = a;
    g.add(leaf);
  }
  for (let i = 0; i < 3; i++) {
    const a = i * 2.1 + 0.5;
    const leaf = leafBlob(
      (0.36 + rnd() * 0.05) * scale,
      F.light,
      { spread: 0.7, lift: 1.2, thin: 0.4 }
    );
    leaf.position.set(
      Math.cos(a) * 0.16 * scale,
      potH + (0.75 + i * 0.3 + rnd() * 0.08) * scale,
      Math.sin(a) * 0.16 * scale
    );
    leaf.rotation.y = a;
    g.add(leaf);
  }
  return g;
}
function buildCactus(scale = 1) {
  const g = group(0, 0, 0);
  const potH = addPot(g, { r: 0.17 * scale, h: 0.14 * scale, color: "terracotta", rim: false });
  const barrels = [
    { a: 0.4, out: 0.07, r: 0.085, h: 0.16, flower: true },
    { a: 2.6, out: 0.08, r: 0.07, h: 0.11, flower: false },
    { a: 4.6, out: 0.06, r: 0.055, h: 0.07, flower: false }
  ];
  for (const b of barrels) {
    const x = Math.cos(b.a) * b.out * scale;
    const z = Math.sin(b.a) * b.out * scale;
    const h = b.h * scale;
    const body = cyl(
      b.r * 0.92 * scale,
      b.r * scale,
      h,
      "cactusGreen",
      { segments: 8, rough: 0.85 }
    );
    body.position.set(x, potH + h / 2 - 0.02, z);
    g.add(body);
    const cap = sphere(b.r * 0.9 * scale, "cactusDark", { segments: 8, rough: 0.85 });
    cap.scale.y = 0.55;
    cap.position.set(x, potH + h - 0.03, z);
    g.add(cap);
    if (b.flower) {
      put(g, sphere(0.028 * scale, "bloomCool", { segments: 7, rough: 0.7 }), x, potH + h + 0.025 * scale, z);
    }
  }
  return g;
}
function buildSucculent(scale = 1, opts = {}) {
  const g = group(0, 0, 0);
  const F = greens(opts.seasonal);
  const bowlH = 0.11 * scale;
  put(g, cyl(0.2 * scale, 0.15 * scale, bowlH, "paper", { segments: 14, rough: 0.7 }), 0, bowlH / 2);
  put(g, cyl(0.185 * scale, 0.185 * scale, 0.05, 9274743, { segments: 14, cast: false }), 0, bowlH - 0.035);
  for (const [tier, count, r, y] of [[0, 7, 0.13, 0.05], [1, 5, 0.085, 0.11]]) {
    for (let i = 0; i < count; i++) {
      const a = i / count * Math.PI * 2 + tier * 0.45;
      const leaf = leafBlob(
        r * scale,
        tier ? F.light : F.leaf,
        { spread: 0.9, lift: 0.55, thin: 0.7 }
      );
      leaf.position.set(
        Math.cos(a) * r * 0.75 * scale,
        bowlH + y * scale,
        Math.sin(a) * r * 0.75 * scale
      );
      leaf.rotation.set(0.75 - tier * 0.3, -a, 0);
      g.add(leaf);
    }
  }
  return g;
}
function buildDeskBloom(scale = 1, opts = {}) {
  const g = group(0, 0, 0);
  const F = greens(opts.seasonal);
  const potH = addPot(g, { r: 0.17 * scale, h: 0.15 * scale, color: "couch", rim: false });
  const rnd = seeded2(2530);
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * Math.PI * 2;
    const leaf = leafBlob(
      (0.125 + rnd() * 0.02) * scale,
      i % 2 ? F.leaf : F.dark,
      { spread: 1.4, lift: 0.3, thin: 1 }
    );
    leaf.position.set(
      Math.cos(a) * 0.11 * scale,
      potH + (0.01 + rnd() * 0.03) * scale,
      Math.sin(a) * 0.11 * scale
    );
    leaf.rotation.set(0.85, -a, 0);
    g.add(leaf);
  }
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2 + 0.6;
    const out = (0.05 + i % 2 * 0.05) * scale;
    put(g, sphere(0.035 * scale, i % 2 ? "bloomCool" : "bloomWarm", { segments: 7, rough: 0.75 }), Math.cos(a) * out, potH + (0.05 + i % 2 * 0.015) * scale, Math.sin(a) * out);
  }
  return g;
}
function buildWindowTrough({ width = 2.4, season = "summer" } = {}) {
  const spec = SILL_SEASONS[season] ?? SILL_SEASONS.summer;
  const g = group(0, 0, 0);
  const rnd = seeded2(935 + Math.round(width * 31));
  const BOARD_H = 0.1;
  put(g, box(width + 0.7, BOARD_H, 0.46, "woodMid", { rough: 0.8 }), 0, BOARD_H / 2 - 0.02, 0.13);
  const TROUGH_H = 0.24;
  const troughY = BOARD_H + TROUGH_H / 2 - 0.02;
  put(g, box(width, TROUGH_H, 0.3, "pot", { rough: 0.8 }), 0, troughY, 0.14);
  put(g, box(width + 0.06, 0.05, 0.34, "terracotta", { rough: 0.75 }), 0, BOARD_H + TROUGH_H - 0.035, 0.14);
  const soilY = BOARD_H + TROUGH_H - 0.06;
  put(g, box(width - 0.08, 0.06, 0.24, "soil", { cast: false }), 0, soilY, 0.14);
  const slots = Math.max(3, Math.round(width / 0.42));
  const planted = Math.max(2, Math.round(slots * spec.foliage));
  for (let i = 0; i < planted; i++) {
    const x = -width / 2 + width / (planted + 1) * (i + 1);
    const r = 0.15 + rnd() * 0.08;
    const mound = leafBlob(
      r,
      i % 2 ? spec.mound : spec.moundAlt,
      { spread: 1.25, lift: 0.85, thin: 1.2 }
    );
    mound.position.set(x, soilY + r * 0.55, 0.14 + (rnd() - 0.5) * 0.06);
    mound.rotation.y = rnd() * Math.PI;
    g.add(mound);
  }
  for (let i = 0; i < spec.blooms; i++) {
    const x = -width / 2 + 0.2 + rnd() * (width - 0.4);
    const head = sphere(
      0.05 + rnd() * 0.02,
      i % 2 ? spec.bloom : spec.bloomAlt,
      { segments: 7, rough: 0.75 }
    );
    head.position.set(x, soilY + 0.22 + rnd() * 0.14, 0.1 + rnd() * 0.1);
    g.add(head);
  }
  for (let i = 0; i < spec.berries; i++) {
    const x = -width / 2 + 0.25 + rnd() * (width - 0.5);
    const cluster = group(x, soilY + 0.2 + rnd() * 0.12, 0.1 + rnd() * 0.1);
    for (let j = 0; j < 3; j++) {
      put(cluster, sphere(0.035, BERRY, { segments: 6, rough: 0.5 }), (j - 1) * 0.05, j % 2 * 0.045, j % 2 * 0.04);
    }
    g.add(cluster);
  }
  for (let i = 0; i < spec.twigs; i++) {
    const x = -width / 2 + 0.18 + i / Math.max(1, spec.twigs - 1) * (width - 0.36);
    const h = 0.34 + rnd() * 0.3;
    const twig = cyl(0.022, 0.032, h, "branchBare", { segments: 5 });
    twig.position.set(x, soilY + h / 2, 0.13 + (rnd() - 0.5) * 0.1);
    twig.rotation.z = (rnd() - 0.5) * 0.5;
    twig.rotation.x = (rnd() - 0.5) * 0.4;
    g.add(twig);
  }
  return g;
}
var SPECIES = {
  fig: buildFig,
  bush: buildLeafyBush,
  monstera: buildMonstera,
  snake: buildSnakePlant,
  fern: buildFern,
  pothos: buildPothos,
  cactus: buildCactus,
  succulent: buildSucculent,
  bloom: buildDeskBloom
};
function buildPlantKind(kind, scale = 1, opts = {}) {
  return (SPECIES[kind] ?? buildFig)(scale, opts);
}
var DESK_SPECIES = [
  { kind: "cactus", scale: 1.7 },
  { kind: "succulent", scale: 1.75 },
  { kind: "bloom", scale: 1.65 }
];
function buildDeskPlant(index = 0) {
  const spec = DESK_SPECIES[index % DESK_SPECIES.length];
  return buildPlantKind(spec.kind, spec.scale);
}

// dist/ui/roving/src/scene/canopy.js
import * as THREE17 from "three";

// dist/ui/roving/src/layout.js
var DESKS = [
  { id: "desk-1", x: 12, z: 8, facing: Math.PI },
  { id: "desk-2", x: 20.5, z: 7, facing: Math.PI },
  { id: "desk-3", x: 6.5, z: 13, facing: 0 },
  // The sit-stand desk, and it is one of the five rather than a sixth: an office does not
  // grow a desk because somebody wants to stand at it, and the headcount is this list's
  // length, so adding one would have hired somebody to justify the furniture.
  //
  // This one, of the five, for two reasons. It is the nearest desk to the camera and the
  // best lit, so the thing worth seeing is where it can be seen — a raised top only reads
  // as raised beside desk-3 at ordinary height, a few metres away in the same glance. And
  // it is not desk-1, which stands on the rug: the mat would have landed on the rug and
  // made a coplanar pair the probe fails the build over.
  { id: "desk-4", x: 13.5, z: 13, facing: 0, standing: true },
  // Turned side-on so its occupant sits clear of desk-2's approach lane.
  { id: "desk-5", x: 21.5, z: 11.5, facing: -Math.PI / 2 }
];
function station(kind, id, x, z, approach) {
  const dx = approach.x - x;
  const dz = approach.z - z;
  return {
    kind,
    id,
    x,
    z,
    // Which way the prop looks: at its own approach point, by definition.
    facing: Math.atan2(dx, dz),
    approachDist: Math.hypot(dx, dz),
    // Both derived by reviseLayout(). Seeded here so the shape is complete from the
    // moment the object exists.
    approach: { x: approach.x, z: approach.z },
    lookRotation: 0
  };
}
var STATION_KINDS = {
  // `serves` earns its keep here for the second time. A lookup already knew
  // which *sort* it was — `_research` has taken a `scope` of 'graph' or 'web' since
  // long before stations had roles — and the shelf has always answered for both, the
  // books for what the company knows and the globe on top for what it does not. Now
  // that a telescope can answer for the outside too, the scope is a preference over
  // two stations rather than a branch inside one, and `stationForRole` already knows
  // how to express that. No new vocabulary: the values are the scopes the feed sends.
  bookshelf: {
    label: "Bookshelf",
    max: Infinity,
    roles: ["research"],
    serves: ["graph"],
    hw: 1.28,
    hd: 0.5,
    approachDist: 2,
    note: "Where things get looked up. Several is fine \u2014 an agent walks to the nearest."
  },
  // The other end of the same job: a question whose answer is outside the building
  // gets looked for outside the building. `research` too, so a room with a telescope
  // and no bookshelf is a working room and either one may be taken out — which is the
  // whole point of the roles, tested here for real rather than with a fixture.
  //
  // The footprint is the tripod's, not the tube's, and that is a correction: the first
  // version set `hd` to 1.16 to cover the objective's overhang at −z, on the grounds
  // that a deck overhead an agent walks through is what the printer's note above says
  // this table exists to prevent. That argument does not survive the arithmetic. The
  // tube's underside clears a 2.51-tall head beyond 0.51 of the centre line, and the
  // feet already reach 0.92 — so every part of the overhang low enough to matter is
  // *inside* the tripod's own footprint, and the rest is genuine headroom.
  //
  // What the over-deep rectangle actually did was steal the floor on the room side,
  // because the footprint is symmetric about the centre. That pushed the standing room
  // back to 1.9 and left an agent stooping at an eyepiece three quarters of a metre in
  // front of them. Both numbers come from `telescopeMetrics()` rather than a ruler.
  //
  // So `approachDist` is 1.52, and it is derived from the pose rather than picked: the
  // eyepiece cup stands 0.65 in front of the centre, a stoop carries an eye 0.50
  // forward (see `STOOP_BEND`), and the remaining 0.37 is half a head plus air.
  //
  // That last term is the one worth naming, because leaving it out is what the first
  // two attempts at this both did. `STOOP_BEND` is derived from where an *eye* goes,
  // and an eye here is the head's centre — but a head is a 0.62 box, so its face is
  // 0.31 further on. Standing them at the distance that puts the eye-point on the cup
  // therefore buries a third of the face in the eyepiece. Checked by looking at it from
  // the side, which is the only angle that shows the difference: face-on, touching and
  // half a metre apart are the same few pixels.
  telescope: {
    label: "Telescope",
    max: Infinity,
    roles: ["research"],
    serves: ["web"],
    hw: 0.89,
    hd: 0.77,
    offX: 0,
    offZ: 0.22,
    approachDist: 1.52,
    note: "For looking something up outside the building. Stands at a window; agents stoop to the eyepiece."
  },
  waterCooler: {
    label: "Water cooler",
    max: 1,
    roles: ["refresh"],
    serves: ["water"],
    hw: 0.46,
    hd: 0.36,
    approachDist: 1.7
  },
  coffee: {
    label: "Coffee machine",
    max: 1,
    roles: ["refresh"],
    serves: ["tea", "coffee"],
    hw: 1.43,
    hd: 0.82,
    offX: 0,
    offZ: 0.22,
    approachDist: 1.7
  },
  // Both, and the only kind that is: the post is where finished work leaves the room
  // and where new work arrives in it. A room may drop to one outbox or one inbox, but
  // not to neither, and while the mailbox is the only one of each it is the reason.
  //
  // `max: Infinity` since the post learned which box it is in. It was 1 for exactly one
  // reason — `Post` was a single queue with no notion of *which box* an envelope was in,
  // so two boxes would both have shown the same three letters — and the answer was to
  // give every envelope a box rather than to forbid the second box. `postBoxFor` above
  // says which one a delivery goes to, and each prop reads only its own tally.
  mailbox: {
    label: "Mailbox",
    max: Infinity,
    roles: ["intake", "dispatch"],
    serves: ["post"],
    note: "Work arrives here and finished work leaves here. Several is fine \u2014 each delivery goes to one of them at random, and an agent collects from the nearest box holding something for them.",
    hw: 0.98,
    hd: 0.49,
    offX: -0.86,
    offZ: 0.35,
    approachDist: 1.7
  },
  // `discard` is deliberately not a role the room must have. Failed work can be closed
  // where it stands — the pilot's own Close button already does exactly that, without a
  // walk to the bin — so a room with no bin is a duller room and a working one.
  bin: {
    label: "Bin",
    max: 1,
    roles: ["discard"],
    hw: 0.33,
    hd: 0.34,
    approachDist: 1.55,
    note: "Failed work gets crumpled into it. Optional: without one, work closes at the desk."
  },
  // Also `intake`, and the difference from the post is what `serves` is for: post is
  // addressed and arrives from outside, stock is the pile an agent takes from when
  // nothing has been sent. Same job, two supplies.
  inbox: {
    label: "Inbox",
    max: Infinity,
    roles: ["intake"],
    serves: ["stock"],
    note: "A stack of boxes to take work from when no post is waiting. Have as many as you like.",
    hw: 1.25,
    hd: 0.72,
    offX: 0.02,
    offZ: 0.09,
    approachDist: 1.8
  },
  // The office's own paper. Post comes from outside the building; a printout
  // is work the office made for itself, and that difference is the whole reason this is
  // a third channel rather than a second mailbox.
  //
  // **Both roles, and the two are different events.** The ticket asked whether a print
  // is an arrival or a product and said to decide rather than let the animation decide,
  // so:
  //
  //   * `dispatch` — a fax outward. Finished work is fed into the document feeder and
  //     leaves the building. `_deliver` asks for the nearest dispatch station, so which
  //     of the printer and the post gets used is a fact about where somebody sits, and
  //     no new rule was needed to make that true.
  //   * `intake` — and this is the half that makes it a *loop* rather than two
  //     unrelated jobs. Faxing is not silent: the machine prints its own copy of what it
  //     sent, and that sheet waits in the output tray as material for whoever needs some
  //     next. So the tray fills because the office has been working, which is exactly
  //     what "work the office produced for itself" means, and it gives the tray real
  //     state to fill and empty instead of the inbox's bottomless pile.
  //
  // `serves: ['print']` keeps it out of the post's business without a rule saying so:
  // `postBoxes()` filters intake stations down to the ones serving `post`, so no paper
  // plane will ever be aimed at a printer and no courier will throw a parcel at one.
  // Measured off the built prop rather than by eye, and the prop is authored at life
  // size and then stretched — twice up in height, three quarters in plan (see
  // `SCALE` and `PLAN` in scene/props/printer.js, which say why). That leaves 1.86
  // across the scanner deck, which overhangs the body, and 1.70 front to back once
  // the touchscreen and the output tray are counted. Both measured past the *body*,
  // not to it — a deck overhead and a catch tray at chest height that agents walk
  // through are the sort of thing this table exists to prevent. The rectangle is
  // symmetric, so the depth reaches the wall behind; that floor was never walkable,
  // so it costs nothing.
  //
  // The approach is 2.0 rather than the 1.7 a life-size machine wanted. Standing
  // room is measured from the station's centre, and the centre of something this
  // deep is most of a metre behind its own front — at 1.7 an agent stood with their
  // shoulders in the touchscreen.
  //
  // It was `roles: []` until now, with a note saying that giving it a job and giving it
  // the role had to be the same change so the two could not disagree. This is that
  // change, and the consequence lands on the mailbox rather than here: the post is no
  // longer the only thing that can dispatch, so it stops being load-bearing. Which is
  // the by-job model working — `canRemoveObject` needed no edit to notice.
  // `max` was 1 while the printer was furniture with no work: "physically singular, and
  // nothing is gained by a second". Both halves of that stopped being true when it got a
  // job. A second machine is worth having for the same reason a second post box is — it
  // is somewhere else work can arrive and leave, at the other end of a big room — and
  // nothing stands in the way of one: a fax is post, so its queue is per box,
  // its prop is registered per station id, and the frame loop ticks each one
  // by id rather than by kind. The cap was the only thing left saying no.
  printer: {
    label: "Printer",
    max: Infinity,
    roles: ["intake", "dispatch"],
    serves: ["print"],
    hw: 0.9,
    hd: 0.62,
    approachDist: 2,
    note: "The office's own paper. Work faxes in and out of here, and the tray holds what is waiting. Several is fine \u2014 each machine has its own tray."
  },
  // Dressing rather than a destination: nowhere to queue, so no standing room to
  // derive. It still carries a `facing`, because it can still be turned round.
  //
  // Dressing to look at, load-bearing to reason about. One coat per agent in the
  // building, so the stand is a picture of the population — and a room ought always to
  // be able to say who is in, which is why `census` is required even though nothing
  // would break without it. The one role kept for what it *tells* you rather than for
  // a behaviour that would fall over; if that ever stops being worth it, take it out of
  // `JOB_ROLES` and nothing else has to change.
  coatStand: {
    label: "Coat stand",
    max: 1,
    roles: ["census"],
    hw: 0.4,
    hd: 0.4,
    approachDist: null,
    note: "One coat per agent in the building, so the room can always say who is here."
  }
};
var JOB_ROLES = ["census", "intake", "research", "dispatch"];
var ROLE_VERBS = {
  census: "hang a coat",
  intake: "collect work from",
  research: "look things up",
  dispatch: "deliver finished work",
  refresh: "get a drink",
  discard: "throw work away"
};
function stationsForRole(role) {
  return Object.values(STATIONS).filter((s) => STATION_KINDS[s.kind]?.roles?.includes(role));
}
function rolesOf(station2) {
  return STATION_KINDS[station2?.kind]?.roles ?? [];
}
function stationForRole(role, { from = null, serves = null } = {}) {
  const all = stationsForRole(role);
  if (!all.length) return null;
  const wanted = serves ? all.filter((s) => STATION_KINDS[s.kind]?.serves?.includes(serves)) : all;
  const pool = wanted.length ? wanted : all;
  if (!from) return pool[0];
  let best = pool[0];
  let bestDist = Infinity;
  for (const s of pool) {
    const at = s.approach ?? s;
    const d = (at.x - from.x) ** 2 + (at.z - from.z) ** 2;
    if (d >= bestDist) continue;
    bestDist = d;
    best = s;
  }
  return best;
}
var CHANNELS = {
  courier: true,
  // The letter channel's other vehicle: sometimes the window admits a bird
  // instead of a paper plane (scene/birds.js). Off, every letter is a plane —
  // the same one-sided coin the courier switch already mints.
  birds: true,
  // Which bird flies the post. 'roster' is the mixed shift — the weighted day
  // draw with the owl on nights — and any single species pins every flight to
  // that bird. A room's choice, saved with the room like the switches above.
  birdKind: "roster"
};
var BIRD_KIND_OPTIONS = ["roster", "owl", "pigeon", "kookaburra", "raven"];
var ARRIVAL_SUPPLY = { letter: "post", package: "post", fax: "print" };
var PARCEL_PREFERENCE = ["mailbox", "printer", "inbox"];
function landingsFor(arrival) {
  if (arrival === "package") {
    const here = stationsForRole("intake");
    for (const kind of PARCEL_PREFERENCE) {
      const mine = here.filter((st) => st.kind === kind);
      if (mine.length) return mine;
    }
    return here;
  }
  const wants = ARRIVAL_SUPPLY[arrival];
  if (!wants) return [];
  return stationsForRole("intake").filter((st) => STATION_KINDS[st.kind]?.serves?.includes(wants));
}
function enabledArrivals(all) {
  return all.filter((a) => {
    if (a === "package" && !CHANNELS.courier) return false;
    return landingsFor(a).length > 0;
  });
}
function postBoxFor(rng = Math.random, arrival = "letter") {
  const boxes = landingsFor(arrival);
  if (!boxes.length) return null;
  return boxes[Math.min(boxes.length - 1, Math.floor(rng() * boxes.length))];
}
var STATIONS = {
  bookshelf: station("bookshelf", "bookshelf", 13.1, 1, { x: 13.1, z: 3 }),
  waterCooler: station("waterCooler", "waterCooler", 1.5, 8.6, { x: 3.2, z: 8.6 }),
  coffee: station("coffee", "coffee", 1.6, 16.8, { x: 3.3, z: 16.8 }),
  mailbox: station("mailbox", "mailbox", 1.4, 4.2, { x: 3.1, z: 4.2 }),
  // Out of the doorway corner and onto the back wall.
  //
  // It stood at (1.2, 1.5) with its standing room at (2.6, 2.2), and that spot was
  // wrong three times over. The door's leaf hinges on the left jamb at x 2.06 and
  // swings inward to 0.46π, so open it runs from (2.06, 0.0) to (2.40, 2.66) — and
  // the bin's standing room sat 0.26 off the centre plane of it, less than half a
  // body. The leaf swung through whoever was binning something and stayed in them
  // for the whole discard. Worse, their own arrival is what opened it: the proxy in
  // `AgentManager.update` reads anybody within 2.6 in x of the opening as somebody
  // coming or going, and the bin's spot is 0.8. And the room had already written
  // down that nobody should be standing there: `randomInteriorPoint` refuses to let
  // a wanderer stop inside DOORWAY_DEPTH of the opening, ±(DOOR_HALF + 0.8), on the
  // grounds that anybody idling on the way in is somebody every later arrival has to
  // get past. (2.6, 2.2) is inside that rectangle, so the bin's standing room
  // contradicted a rule the room had already made about its own doorway.
  //
  // Here instead: past the printer, tucked into the corner where the back wall runs
  // out at the room's open edge. It went first to the stretch *between* the bookshelf
  // and the printer, at 19.0, which was right about the wall and wrong about the room —
  // paper is at that end (reference one side, print the other), but 19.0 is the middle
  // of a window, and a bin under a window is a bin somebody put down rather than a bin
  // that lives somewhere. The corner is where a bin goes.
  //
  // The corner was not free until now: the monstera stood in it, and moving that plant
  // down the east edge to join the bush is what opened it (see DECOR.plants). Still the
  // printer's neighbour, so failed work crumpled beside the machine that prints it is
  // still the same errand — 2.2 off the printer's footprint rather than the 0.97 it had,
  // which is the cost of being in the corner and worth it.
  //
  // Quieter still, which was the point of moving it out of the doorway in the first
  // place: it is now the furthest station in the room from the door, in the one pocket
  // of floor no route to anywhere else crosses. `z` is unchanged, so the lip keeps the
  // same 0.2 off the plaster the printer was measured to; `x` leaves 0.6 of floor
  // beyond the bin's own footprint, so it reads as *in* the corner and not falling off
  // the edge of the cutaway.
  bin: station("bin", "bin", 24.9, 0.76, { x: 24.9, z: 2.31 }),
  // Nudged clear of desk-3's approach lane at (6.5, 16.5).
  // 17.9 rather than 17.8, to clear desk-3's standing room by a hair rather than
  // graze it by one. Measuring the footprints put the inbox's body edge at
  // z 16.99 and desk-3's standing room ends at z 17.00, so the shipped room carried
  // a 0.20 x 0.01 overlap — nobody competing for floor, but a fault by the room's
  // own rules, and one the editor now refuses anybody to recreate.
  inbox: station("inbox", "inbox", 9.6, 17.9, { x: 9.6, z: 16 }),
  // The last clear pocket of the back wall: desk-6 runs out to x 19.5 and the
  // monstera's spread starts at 23.45, so this is the one stretch left. (Written when
  // the room had a sixth desk and the monstera stood in the corner, neither of which is
  // true now — the desk went, and the plant moved down the east edge to make room for
  // the bin. So nothing pins this end of the run any more, and the printer stays at 21.4
  // because it is where it looks right rather than because it is the only place left:
  // the telescope is a pane away on one side and the bin is in the corner on the other,
  // which is the arrangement the wall now has.)
  // Set closer to the wall than the bookshelf is, because it is deeper: measured
  // so its back stands 0.2 off the plaster, which is the gap the machine's cables and
  // its castors want and as near flush as a prop on wheels should ever look.
  printer: station("printer", "printer", 21.4, 0.85, { x: 21.4, z: 2.85 }),
  // At the window, along from the printer.
  //
  // "At the window" is the whole placement, and only two spots in the room are at one.
  // The back wall carries two openings — `WINDOWS.back` in config.js, at x 5.58..11.58
  // and x 14.95..21.45 — and the printer at 21.4 stands at the right-hand end of the
  // second. So this is that window: same glass, a few paces along.
  //
  // And this is the pane. An opening is three lights across (`cols` in `buildWindow`),
  // so the second one runs 17.12..19.28 and its centre is 18.20 — which is the window's
  // own centre, since three panes put the middle one in the middle. A telescope aimed
  // through the join between two panes is aimed at a mullion; this one looks out of
  // the middle of a light.
  //
  // It sat at 16.9 first, which was the centre of the *free frontage* rather than of
  // anything you can see: the bin was at 19.0 then and the space between it and the
  // bookshelf was all there was. The bin has since gone to the corner past the printer,
  // which is what made the pane available. Derived from `windowSpan` rather than
  // written out, so a window that moves takes the telescope with it.
  //
  // The neighbours: the bookshelf runs out to 14.5, the ace standee stands on the sill
  // at 16.03 — the centre of the *first* pane, by the same arithmetic — and the planted
  // trough's sill board starts at 18.40. All three clear, and the standee and this now
  // have a pane each, which is tidier than the pair of them crowding one.
  //
  // `z` is derived, not chosen: the objective overhangs the tripod by 1.16 at −z (see
  // `telescopeMetrics` in scene/props/telescope.js), and the wall's inner face is at
  // `wallT / 2` = 0.2, so 1.40 puts the lens 0.04 inside the plaster line — right at
  // the glass, looking out of it, without the tube buried in the wall.
  telescope: station("telescope", "telescope", 18.2, 1.4, { x: 18.2, z: 2.92 }),
  coatStand: { kind: "coatStand", id: "coatStand", x: 5.8, z: 1.4, facing: 0 }
};
function stationsOfKind(kind) {
  return Object.values(STATIONS).filter((s) => s.kind === kind);
}
var FURNITURE_KINDS = {
  couch: {
    label: "Couch",
    // Half-extents of the floor a couch blocks off. Named here because the seats sit
    // inside it — the couch is the one piece of furniture big enough to swallow its own
    // seats — and the way in has to be measured against it.
    hw: 2.1,
    hd: 0.57,
    offX: 0,
    offZ: -0.33,
    turns: true,
    // Upholstery. The seat cushions follow the body colour and the one at your back
    // contrasts with it; both are worked out in scene/props/couch.js, which is where
    // the couch is drawn — this table says only what may be chosen.
    palette: SOFA_COLORS,
    // How far out in front the standing room is, measured from the couch's own heading
    // for the same reason a station's is (see `station` above).
    approachDist: 2.5,
    // Where the cushions are, in couch-local space: across the seat and a touch forward
    // of centre. Each couch's world-space `seats` are derived from these.
    // Back against the cushions rather than perched on the lip: far enough forward
    // that a seated agent's knees clear the couch's front panel, and no further. The
    // couch's own geometry is measured to agree with this (see props/couch.js).
    seatOffsets: [
      { x: -1.1, z: -0.05 },
      { x: 1.1, z: -0.05 }
    ]
  },
  armchair: {
    label: "Armchair",
    hw: 1.1,
    hd: 0.57,
    offX: 0,
    offZ: -0.33,
    turns: true,
    palette: SOFA_COLORS,
    approachDist: 2.5,
    seatOffsets: [{ x: 0, z: -0.05 }]
  },
  sideTable: { label: "Side table", hw: 0.71, hd: 0.41, turns: true },
  /**
   * The rug, which is furniture that happens to be flat.
   *
   * It used to be a fixture in `DECOR`, one per floor by construction, on the reasoning
   * that a room has *a* rug the way it has *a* floor. That was the shape making the rule
   * again — the same mistake a top-level `COUCH` made before it — and it is not a
   * decision anybody took about offices. A reading corner and a meeting area want one
   * each, and a room may want none.
   *
   * `walkable` is what makes it a rug rather than a low table: its rectangle is measured
   * and bounded like any other, so it cannot hang off the floor, but nothing walks
   * around it and nothing is refused for overlapping it. See `obstacleFootprints`.
   *
   * `palette` is the set of colours the editor may paint it. It is the only kind with
   * one so far, and it is declared here rather than looked up elsewhere so that asking
   * "what colours does this come in" is one question about the kind.
   */
  rug: {
    label: "Rug",
    hw: 4.5,
    hd: 3.5,
    turns: true,
    walkable: true,
    palette: RUG_COLORS
  },
  // Blocked wider than the pole it is: see `bodyBerth` in `obstacleFootprints()`.
  floorLamp: { label: "Floor lamp", hw: 0.4, hd: 0.4, turns: false }
};
var FURNITURE_LIMITS = { min: 0, max: 24 };
var FURNITURE = [
  // Under the desks in the middle of the room, which is where it has always been — it
  // was a fixture in `DECOR` until it became a kind like any other.
  { id: "rug", kind: "rug", x: 12, z: 8, facing: 0, color: null },
  // Reading corner on the open edge: couch, a table at the end of it, and a lamp to
  // read by. The couch's back is at -z, so its occupants look toward +z.
  {
    id: "couch",
    kind: "couch",
    x: 20.5,
    z: 15.5,
    facing: 0,
    color: null,
    approach: { x: 20.5, z: 18 },
    seats: []
  },
  { id: "sideTable", kind: "sideTable", x: 23.4, z: 15.2, facing: 0 },
  { id: "floorLamp", kind: "floorLamp", x: 17.8, z: 16.8 }
];
function furnitureOfKind(kind) {
  return FURNITURE.filter((f) => f.kind === kind);
}
function couches() {
  return FURNITURE.filter((f) => FURNITURE_KINDS[f.kind]?.seatOffsets);
}
var SEAT_STEP_OUT = 0.4;
function reviseLayout() {
  for (const s of Object.values(STATIONS)) {
    if (s.approachDist == null) continue;
    const dir = heading(s.facing);
    s.approach.x = s.x + dir.x * s.approachDist;
    s.approach.z = s.z + dir.z * s.approachDist;
    s.lookRotation = Math.atan2(s.x - s.approach.x, s.z - s.approach.z);
  }
  for (const f of FURNITURE) {
    const kind = FURNITURE_KINDS[f.kind];
    if (!kind?.seatOffsets) continue;
    const dir = heading(f.facing);
    f.approach.x = f.x + dir.x * kind.approachDist;
    f.approach.z = f.z + dir.z * kind.approachDist;
    f.seats = kind.seatOffsets.map((off) => {
      const seat = local(f, off.x, off.z);
      return {
        x: seat.x,
        z: seat.z,
        // Occupants look the way the couch does.
        rotation: f.facing,
        // The floor in front of this seat: out past the blocked footprint, on the
        // couch's own axis rather than the world's, so a couch turned to face the
        // window still has its standing room in front of the cushions.
        front: local(f, off.x, kind.hd + SEAT_STEP_OUT)
      };
    });
  }
}
function heading(facing) {
  return { x: Math.sin(facing), z: Math.cos(facing) };
}
function local(prop, dx, dz) {
  const s = Math.sin(prop.facing), c = Math.cos(prop.facing);
  return { x: prop.x + dx * c + dz * s, z: prop.z - dx * s + dz * c };
}
reviseLayout();
var insideCouch = (x, z) => couches().some((c) => {
  const kind = FURNITURE_KINDS[c.kind];
  const s = Math.sin(c.facing), t = Math.cos(c.facing);
  const dx = x - c.x, dz = z - c.z;
  return Math.abs(dx * t - dz * s) < kind.hw && Math.abs(dx * s + dz * t) < kind.hd;
});
var DECOR = {
  // Digital wall clock: mounted on the beige (left, x=0) wall, 4.7 up. `x` sits just
  // proud of the wall's inner face (wallT / 2).
  //
  // `z` is written out rather than taken from `STATIONS.coffee.z`, which is where it
  // used to come from. The clock *happens* to hang above the coffee machine and was
  // placed by eye to do so — but sharing the machine's number said something
  // stronger, that the clock is defined by the machine, and once the machine could be
  // dragged that became a lie: moving the coffee would have slid a clock along a wall
  // it is screwed to. It is on the wall, so it stays where it is put, and it is not
  // draggable in the editor for the same reason.
  wallClock: {
    x: ROOM.wallT / 2 + 0.02,
    y: 4.7,
    z: 16.8,
    w: 3.4,
    h: 1.5,
    facing: Math.PI / 2
    // rotates the face from +z to +x, i.e. into the room
  },
  // The brand-mark standees are not here but in logoPlacements() below: where
  // the ace stands depends on which walls its building cut windows into, and
  // DECOR is a constant, read before any theme is known.
  //
  // Floor planting. `kind` names a species in scene/plants.js, and `seasonal` asks
  // for the palette greens the seasons repaint rather than the evergreen set. The
  // ground each one blocks is PLANT_SPREAD below.
  //
  // Placed for the light, the way a plant actually ends up somewhere — and the big
  // seasonal three are placed for the view as well. They stand where the street is
  // visible behind them, on the two open cutaway edges and in the sage wall's
  // window bay, so when they turn they turn against a matching season outdoors.
  // The rest of the room stays green, which is what stops February looking dead.
  // Each carries an id, for the same reason a desk does: it is what the layout names
  // when it moves one, and what the editor tags the group with. They used to be known
  // by their position in this array, which worked only for as long as the array was
  // fixed — inserting a plant renumbered every plant after it, so a saved layout
  // quietly moved the wrong ones.
  plants: [
    // The three that carry the season, at the size they need to read from across
    // the room: the big leafy plant between the coat stand and the bookshelf, and
    // two more out on the open edge.
    { id: "plant-1", kind: "bush", x: 9.5, z: 1.6, scale: 1.4, seasonal: true, facing: 0 },
    // Down the east edge to stand with the bush, out of the corner it used to hold.
    // It was the only thing in that corner, which is what made the corner available
    // for the bin — and the two big seasonal plants read better as a pair than as one
    // at each end of the same edge. 2.5 apart, which leaves 0.38 between their spreads:
    // near enough to be a group, far enough to be two plants.
    { id: "plant-2", kind: "monstera", x: 24.5, z: 9, scale: 1.55, seasonal: true, facing: 0 },
    { id: "plant-3", kind: "bush", x: 24.6, z: 11.5, scale: 1.65, seasonal: true, facing: 0 },
    // Evergreen, in the body of the room. The hero is a big fig on the beige wall,
    // in the one stretch of it that had nothing on it — between the coffee machine
    // and the window, so everyone waiting on a shot of coffee stands in greenery.
    { id: "plant-4", kind: "fig", x: 1.8, z: 13.2, scale: 1.5, facing: 0 },
    // Blades, not a canopy: this is the gap between the mailbox and the water
    // cooler, and a plant that spread out here would be in the way of both.
    { id: "plant-5", kind: "snake", x: 1.5, z: 6.6, scale: 1.25, facing: 0 }
  ]
};
var PLANT_KINDS = {
  bush: { label: "Leafy bush", spread: 0.4, scale: 1.4 },
  fig: { label: "Fig", spread: 0.36, scale: 1.5 },
  monstera: { label: "Monstera", spread: 0.32, scale: 1.55 },
  snake: { label: "Snake plant", spread: 0.26, scale: 1.25 },
  fern: { label: "Fern", spread: 0.33, scale: 1.1 }
};
var PLANT_SPREAD_FALLBACK = 0.6;
var WINDOW_TROUGHS = [
  { wall: "back", window: 0, align: -1, width: 2.4 },
  { wall: "back", window: 1, align: 1, width: 2.6 },
  { wall: "left", window: 0, align: -1, width: 2.6 }
];
function windowTroughPlacements(exclude = []) {
  const out = [];
  const inset = ROOM.wallT / 2;
  for (const t of WINDOW_TROUGHS) {
    if (exclude.some((e) => e.wall === t.wall && e.window === t.window)) continue;
    const span = windowSpan(t.wall, t.window);
    if (!span) continue;
    const slack = Math.max(0, (span.width - t.width) / 2 - 0.1);
    const along = span.centre + t.align * slack;
    out.push(span.axis === "x" ? { x: along, y: WINDOW_LEDGE_Y, z: inset, rotationY: 0, width: t.width } : { x: inset, y: WINDOW_LEDGE_Y, z: along, rotationY: Math.PI / 2, width: t.width });
  }
  return out;
}
var LOGO_TILT = Math.PI / 12;
var BODY_BERTH = 0.45;
function worldExtent(facing, hw, hd) {
  return Math.abs(Math.cos(facing ?? 0)) > 0.5 ? { hw, hd } : { hw: hd, hd: hw };
}
var DESK_BODY = { hw: 2.03, hd: 1.6, offX: 0, offZ: 0.62 };
var BODIES = {
  "desk:desk": DESK_BODY,
  ...Object.fromEntries(Object.entries(STATION_KINDS).map(([k, v]) => [`station:${k}`, v])),
  ...Object.fromEntries(Object.entries(FURNITURE_KINDS).map(([k, v]) => [`furniture:${k}`, v])),
  ...Object.fromEntries(Object.entries(PLANT_KINDS).map(([k, v]) => [`plant:${k}`, { hw: v.spread, hd: v.spread, offX: 0, offZ: 0 }]))
};
var BERTHS = { "furniture:floorLamp": BODY_BERTH };
var DESK_APPROACH = 3.5;
var STAND_BODY = 0.5;
function standExtent(facing, body, approach) {
  const near = (body.offZ ?? 0) + body.hd;
  const far = approach + STAND_BODY;
  return {
    // Along the way it faces: from its front face out past its user.
    mid: (far + near) / 2,
    ...worldExtent(facing, Math.max(body.hw, STAND_BODY), Math.max(0, (far - near) / 2))
  };
}
function toWorld(facing, ox, oz) {
  const c = Math.cos(facing ?? 0);
  const s = Math.sin(facing ?? 0);
  return { x: ox * c + oz * s, z: oz * c - ox * s };
}
function obstacleFootprints() {
  const f = [];
  const stand2 = (key, at, body, approach) => {
    if (approach == null) return;
    const dir = { x: Math.sin(at.facing ?? 0), z: Math.cos(at.facing ?? 0) };
    const across = { x: dir.z, z: -dir.x };
    const size = standExtent(at.facing, body, approach);
    const cx = at.x + dir.x * size.mid + across.x * (body.offX ?? 0);
    const cz = at.z + dir.z * size.mid + across.z * (body.offX ?? 0);
    f.push({
      key: `stand:${key}`,
      x0: cx - size.hw,
      z0: cz - size.hd,
      x1: cx + size.hw,
      z1: cz + size.hd,
      soft: false,
      berth: 0,
      role: "stand"
    });
  };
  const rect = (key, at, body, { soft = false, scale = 1, berth = 0 } = {}) => {
    const off = toWorld(at.facing, (body.offX ?? 0) * scale, (body.offZ ?? 0) * scale);
    const world2 = worldExtent(at.facing, body.hw * scale, body.hd * scale);
    f.push({
      key,
      x0: at.x + off.x - world2.hw,
      z0: at.z + off.z - world2.hd,
      x1: at.x + off.x + world2.hw,
      z1: at.z + off.z + world2.hd,
      soft,
      berth,
      role: "prop"
    });
  };
  for (const d of DESKS) {
    rect(`desk:${d.id}`, d, DESK_BODY);
    stand2(`desk:${d.id}`, d, DESK_BODY, DESK_APPROACH);
  }
  for (const s of Object.values(STATIONS)) {
    const body = BODIES[`station:${s.kind}`];
    if (!body) continue;
    rect(`station:${s.id}`, s, body, { berth: BERTHS[`station:${s.kind}`] ?? 0 });
    stand2(`station:${s.id}`, s, body, body.approachDist ?? null);
  }
  for (const piece of FURNITURE) {
    const body = BODIES[`furniture:${piece.kind}`];
    if (!body) continue;
    rect(`furniture:${piece.id}`, piece, body, {
      soft: !!FURNITURE_KINDS[piece.kind]?.walkable,
      berth: BERTHS[`furniture:${piece.kind}`] ?? 0
    });
    stand2(`furniture:${piece.id}`, piece, body, body.approachDist ?? null);
  }
  for (const p of DECOR.plants) {
    const body = BODIES[`plant:${p.kind}`];
    if (!body) {
      rect(`plant:${p.id}`, { ...p, facing: 0 }, {
        hw: PLANT_SPREAD_FALLBACK,
        hd: PLANT_SPREAD_FALLBACK,
        offX: 0,
        offZ: 0
      }, { scale: p.scale });
      continue;
    }
    rect(`plant:${p.id}`, { ...p, facing: 0 }, body, { scale: p.scale });
  }
  return f;
}
var LAYOUT_VERSION = 4;
var LAYOUT_MARGIN = 0.8;
var clampX = (x) => Math.min(ROOM.W - LAYOUT_MARGIN, Math.max(LAYOUT_MARGIN, x));
var clampZ = (z) => Math.min(ROOM.D - LAYOUT_MARGIN, Math.max(LAYOUT_MARGIN, z));
var SQUARE_TOLERANCE = 0.01;
function squareUp(facing) {
  const quarter = Math.PI / 2;
  const nearest = Math.round(facing / quarter) * quarter;
  return Math.abs(facing - nearest) < SQUARE_TOLERANCE ? nearest : facing;
}
var MOVABLE_DECOR = [];
var DESK_LIMITS = { min: 1, max: 24 };
var PLANT_LIMITS = { min: 0, max: 24 };
var AUTHORED = snapshot();
function snapshot() {
  const out = {
    layout: LAYOUT_VERSION,
    complete: true,
    desks: {},
    stations: {},
    furniture: {},
    decor: {},
    plants: {},
    // Which ways in are switched on. A fact about this office, so it travels with the
    // furniture rather than living in the session.
    channels: { ...CHANNELS }
  };
  for (const d of DESKS) {
    out.desks[d.id] = d.standing ? { x: d.x, z: d.z, facing: d.facing, standing: true } : { x: d.x, z: d.z, facing: d.facing };
  }
  for (const [id, s] of Object.entries(STATIONS)) {
    out.stations[id] = { kind: s.kind, x: s.x, z: s.z, facing: s.facing };
  }
  for (const f of FURNITURE) {
    const paint = FURNITURE_KINDS[f.kind]?.palette ? { color: f.color ?? null } : {};
    out.furniture[f.id] = f.facing == null ? { kind: f.kind, x: f.x, z: f.z, ...paint } : { kind: f.kind, x: f.x, z: f.z, facing: f.facing, ...paint };
  }
  for (const p of DECOR.plants) {
    out.plants[p.id] = {
      kind: p.kind,
      x: p.x,
      z: p.z,
      facing: p.facing,
      scale: p.scale,
      seasonal: !!p.seasonal
    };
  }
  for (const key of MOVABLE_DECOR) {
    out.decor[key] = { x: DECOR[key].x, z: DECOR[key].z, facing: DECOR[key].facing };
  }
  return out;
}
function applyLayout(blob) {
  if (blob && typeof blob === "object" && blob.channels && typeof blob.channels === "object") {
    for (const [key, on] of Object.entries(blob.channels)) {
      if (key === "birdKind") {
        if (BIRD_KIND_OPTIONS.includes(on)) CHANNELS.birdKind = on;
      } else if (key in CHANNELS && typeof on === "boolean") CHANNELS[key] = on;
    }
  }
  if (!blob || typeof blob !== "object") return false;
  let touched = false;
  const num = (v, fallback) => Number.isFinite(v) ? v : fallback;
  const paint = (target, from) => {
    const palette = FURNITURE_KINDS[target.kind]?.palette;
    if (!palette || !from || !("color" in from)) return;
    const want = from.color;
    if (want === null || typeof want === "string" && want in palette) {
      target.color = want;
      touched = true;
    }
  };
  const move = (target, from, { facing = true } = {}) => {
    if (!from || typeof from !== "object") return;
    target.x = clampX(num(from.x, target.x));
    target.z = clampZ(num(from.z, target.z));
    if (facing && "facing" in target) target.facing = squareUp(num(from.facing, target.facing));
    touched = true;
  };
  const prune = blob.complete === true;
  const family = (entries, { list, id, keyOf, move: moveOne, create }) => {
    if (!entries || typeof entries !== "object" || Array.isArray(entries)) return;
    for (const [key, from] of Object.entries(entries)) {
      const existing = list().find((item) => id(item) === key);
      if (existing) moveOne(existing, from);
      else if (create(key, from)) touched = true;
    }
    if (!prune) return;
    const keep = new Set(Object.keys(entries));
    for (const item of list().filter((i) => !keep.has(id(i)))) {
      if (canRemoveObject(keyOf(item)).ok && dropInstance(item)) touched = true;
    }
  };
  family(blob.desks, {
    list: () => DESKS,
    id: (d) => d.id,
    keyOf: (d) => `desk:${d.id}`,
    // A blob may also convert a desk it already knows: `standing` is the one property of
    // a desk that is neither its place nor its heading, so `move` cannot carry it.
    move: (d, from) => {
      move(d, from);
      if (from && "standing" in from) d.standing = !!from.standing;
    },
    create: (key, from) => !!addDesk({
      id: key,
      x: num(from?.x, ROOM.W / 2),
      z: num(from?.z, ROOM.D / 2),
      facing: num(from?.facing, 0),
      standing: !!from?.standing
    })
  });
  family(blob.stations, {
    list: () => Object.values(STATIONS),
    id: (s) => s.id,
    keyOf: (s) => `station:${s.id}`,
    move: (s, from) => move(s, from),
    // A station entry names its kind. One that does not gets the benefit of the doubt
    // from its own id, so a hand-written `"bookshelf-2": { x, z }` is understood.
    create: (key, from) => !!addStation(stationKindOf(from?.kind ?? key), {
      id: key,
      x: num(from?.x, ROOM.W / 2),
      z: num(from?.z, ROOM.D / 2),
      facing: num(from?.facing, 0)
    })
  });
  family(blob.plants, {
    list: () => DECOR.plants,
    id: (p) => p.id,
    keyOf: (p) => `plant:${p.id}`,
    /**
     * A blob may also **repot** a plant it already knows.
     *
     * The same argument the desk's `standing` makes above, and it took the layout
     * generator to notice the asymmetry: a plant's species, its size and whether
     * it follows the seasons are three properties that are neither its place nor
     * its heading, so `move` cannot carry them — and without this, importing a
     * layout with a fern at `plant-2` into a room whose `plant-2` is a monstera
     * silently kept the monstera. The plan said fern, the room showed monstera,
     * and the difference is a third of a unit of blocked floor (see `spread` in
     * `PLANT_KINDS`), which is enough for the nav grid and the plan to disagree
     * about whether a desk beside it fits.
     *
     * Each is taken only if it is *sayable*: an unknown species is ignored rather
     * than believed, exactly as `addPlant` refuses to create one.
     */
    move: (p, from) => {
      move(p, from);
      if (from && PLANT_KINDS[from.kind]) p.kind = from.kind;
      if (from && Number.isFinite(from.scale)) p.scale = from.scale;
      if (from && "seasonal" in from) p.seasonal = !!from.seasonal;
    },
    // Unlike a station, a plant cannot be guessed from its id: `plant-7` says nothing
    // about what is growing in it, so an entry with no species is left unplanted.
    create: (key, from) => !!addPlant(from?.kind, {
      id: key,
      x: num(from?.x, ROOM.W / 2),
      z: num(from?.z, ROOM.D / 2),
      facing: num(from?.facing, 0),
      scale: from?.scale,
      seasonal: from?.seasonal
    })
  });
  family(blob.furniture, {
    list: () => FURNITURE,
    id: (f) => f.id,
    keyOf: (f) => `furniture:${f.id}`,
    move: (f, from) => {
      move(f, from);
      paint(f, from);
    },
    // Like a station and unlike a plant, a piece of furniture can be guessed from its
    // own id when an entry does not name its kind, so a hand-written `"couch-2": {x, z}`
    // is understood.
    create: (key, from) => !!addFurniture(furnitureKindOf(from?.kind ?? key), {
      id: key,
      x: num(from?.x, ROOM.W / 2),
      z: num(from?.z, ROOM.D / 2),
      facing: num(from?.facing, 0),
      color: typeof from?.color === "string" ? from.color : null
    })
  });
  for (const key of MOVABLE_DECOR) move(DECOR[key], blob.decor?.[key]);
  const firstRug = furnitureOfKind("rug")[0];
  if (firstRug && blob.decor?.rug) {
    move(firstRug, blob.decor.rug);
    paint(firstRug, blob.decor.rug);
  }
  const firstCouch = couches()[0];
  if (firstCouch) move(firstCouch, blob.couch);
  for (const kind of ["sideTable", "floorLamp"]) {
    const first = furnitureOfKind(kind)[0];
    if (first) move(first, blob.decor?.[kind], { facing: false });
  }
  if (Array.isArray(blob.plants)) {
    for (const [i, p] of DECOR.plants.entries()) move(p, blob.plants[i], { facing: false });
  }
  if (touched) reviseLayout();
  return touched;
}
function resetLayout() {
  return applyLayout(AUTHORED);
}
function nextId(prefix, taken) {
  let n = taken.length + 1;
  const used = new Set(taken);
  while (used.has(`${prefix}-${n}`)) n += 1;
  return `${prefix}-${n}`;
}
function freeStationId(kind) {
  if (!STATIONS[kind]) return kind;
  let n = stationsOfKind(kind).length + 1;
  while (STATIONS[`${kind}-${n}`]) n += 1;
  return `${kind}-${n}`;
}
function stationKindOf(name) {
  if (typeof name !== "string") return null;
  if (STATION_KINDS[name]) return name;
  const base = name.replace(/-\d+$/, "");
  return STATION_KINDS[base] ? base : null;
}
function freeFurnitureId(kind) {
  const taken = new Set(FURNITURE.map((f) => f.id));
  if (!taken.has(kind)) return kind;
  let n = furnitureOfKind(kind).length + 1;
  while (taken.has(`${kind}-${n}`)) n += 1;
  return `${kind}-${n}`;
}
function furnitureKindOf(name) {
  if (typeof name !== "string") return null;
  if (FURNITURE_KINDS[name]) return name;
  const base = name.replace(/-\d+$/, "");
  return FURNITURE_KINDS[base] ? base : null;
}
function addDesk({ id, x = ROOM.W / 2, z = ROOM.D / 2, facing = 0, standing = false } = {}) {
  if (DESKS.length >= DESK_LIMITS.max) return null;
  const desk = {
    id: id && !DESKS.some((d) => d.id === id) ? id : nextId("desk", DESKS.map((d) => d.id)),
    x: clampX(x),
    z: clampZ(z),
    facing: squareUp(facing),
    // Only on the desks that are one, so an ordinary desk's spec is unchanged from
    // before sit-stand desks existed and `'standing' in spec` stays a real question.
    ...standing ? { standing: true } : {}
  };
  DESKS.push(desk);
  return desk;
}
function addStation(kind, { id, x = ROOM.W / 2, z = ROOM.D / 2, facing = 0 } = {}) {
  const def = STATION_KINDS[kind];
  if (!def) return null;
  if (stationsOfKind(kind).length >= def.max) return null;
  const key = id && !STATIONS[id] ? id : freeStationId(kind);
  const at = { x: clampX(x), z: clampZ(z) };
  const square = squareUp(facing);
  const dir = heading(square);
  const s = def.approachDist == null ? { kind, id: key, ...at, facing: square } : station(kind, key, at.x, at.z, {
    x: at.x + dir.x * def.approachDist,
    z: at.z + dir.z * def.approachDist
  });
  STATIONS[key] = s;
  return s;
}
function addPlant(kind, { id, x = ROOM.W / 2, z = ROOM.D / 2, facing, scale, seasonal } = {}) {
  const def = PLANT_KINDS[kind];
  if (!def) return null;
  if (DECOR.plants.length >= PLANT_LIMITS.max) return null;
  const taken = DECOR.plants.map((p) => p.id);
  const plant = {
    id: id && !taken.includes(id) ? id : nextId("plant", taken),
    kind,
    x: clampX(x),
    z: clampZ(z),
    facing: squareUp(Number.isFinite(facing) ? facing : 0),
    scale: Number.isFinite(scale) ? scale : def.scale,
    seasonal: !!seasonal
  };
  DECOR.plants.push(plant);
  return plant;
}
function addFurniture(kind, { id, x = ROOM.W / 2, z = ROOM.D / 2, facing = 0, color = null } = {}) {
  const def = FURNITURE_KINDS[kind];
  if (!def) return null;
  if (furnitureOfKind(kind).length >= FURNITURE_LIMITS.max) return null;
  const square = squareUp(facing);
  const piece = {
    id: id && !FURNITURE.some((f) => f.id === id) ? id : freeFurnitureId(kind),
    kind,
    x: clampX(x),
    z: clampZ(z),
    // A heading only for a piece that has a front. Its absence is what tells the editor
    // this is something that does not turn, which is the rule the floor lamp follows.
    ...def.turns ? { facing: square } : {},
    // A colour only for a kind that comes in colours, and null — "whatever the room
    // is" — for the same reason the authored rug starts there. See `RUG_COLORS`.
    ...def.palette && { color: color in def.palette ? color : null }
  };
  if (def.seatOffsets) {
    piece.approach = { x: piece.x, z: piece.z };
    piece.seats = [];
  }
  FURNITURE.push(piece);
  return piece;
}
function canRemoveObject(key) {
  const found = findInstance(key);
  if (!found) return { ok: false, why: "nothing the layout knows about" };
  const { family, item } = found;
  if (family === "desk" && DESKS.length <= DESK_LIMITS.min) {
    return { ok: false, why: "the office needs a desk to work at" };
  }
  if (family === "station") {
    const orphaned = rolesOf(item).filter((role) => JOB_ROLES.includes(role) && stationsForRole(role).length <= 1);
    if (orphaned.length) {
      return { ok: false, why: `the office needs somewhere to ${ROLE_VERBS[orphaned[0]]}` };
    }
  }
  if (family === "furniture" && furnitureOfKind(item.kind).length <= FURNITURE_LIMITS.min) {
    return { ok: false, why: `no ${FURNITURE_KINDS[item.kind]?.label ?? item.kind} left to remove` };
  }
  if (family === "plant" && DECOR.plants.length <= PLANT_LIMITS.min) {
    return { ok: false, why: "no plants left to remove" };
  }
  return { ok: true, why: "" };
}
function findInstance(key) {
  if (typeof key !== "string") return null;
  const [family, id] = key.split(":");
  if (family === "desk") {
    const item = DESKS.find((d) => d.id === id);
    return item && { family, item };
  }
  if (family === "station") {
    const item = STATIONS[id];
    return item && { family, item };
  }
  if (family === "furniture") {
    const item = FURNITURE.find((f) => f.id === id);
    return item && { family, item };
  }
  if (family === "plant") {
    const item = DECOR.plants.find((p) => p.id === id);
    return item && { family, item };
  }
  return null;
}
function dropInstance(item) {
  if (STATIONS[item.id] === item) {
    delete STATIONS[item.id];
    return true;
  }
  for (const list of [DESKS, FURNITURE, DECOR.plants]) {
    const i = list.indexOf(item);
    if (i >= 0) {
      list.splice(i, 1);
      return true;
    }
  }
  return false;
}

// dist/ui/roving/src/scene/canopy.js
var CANOPY_HEIGHT = 10.8;
var CANOPY_PORTAL_WIDTH = 5.25;
var OAK = 11370576;
var END_GRAIN = 8872766;
var BRONZE = 4080952;
var STONE2 = 13156254;
function timberTexture() {
  const canvas2 = document.createElement("canvas");
  canvas2.width = 256;
  canvas2.height = 1024;
  const c = canvas2.getContext("2d"), rand = seeded(2041);
  c.fillStyle = "#d1b183";
  c.fillRect(0, 0, 256, 1024);
  for (let i = 0; i < 180; i++) {
    const x = rand() * 256;
    c.strokeStyle = `rgba(89,59,26,${0.025 + rand() * 0.07})`;
    c.lineWidth = 0.4 + rand() * 1.2;
    c.beginPath();
    c.moveTo(x, 0);
    for (let y = 0; y <= 1024; y += 32) c.lineTo(x + Math.sin(y * 8e-3 + i) * (1 + rand() * 3), y);
    c.stroke();
  }
  const texture = new THREE17.CanvasTexture(canvas2);
  texture.colorSpace = THREE17.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE17.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}
function buildCanopyFloor() {
  const g = group();
  g.name = "canopy-oak-floor";
  const map = timberTexture(), geometry = new THREE17.BoxGeometry(1, 1, 1);
  const material = new THREE17.MeshStandardMaterial({ map, roughness: 0.7, color: 16777215 });
  const count = 26 * 5, mesh2 = new THREE17.InstancedMesh(geometry, material, count);
  const dummy = new THREE17.Object3D(), colour = new THREE17.Color(), rand = seeded(2042);
  let i = 0;
  for (let x = 0; x < 26; x++) for (let j = 0; j < 5; j++) {
    const start = j === 0 ? 0 : j * 4 - (x % 2 ? 1.3 : 0);
    const end = j === 4 ? ROOM.D : (j + 1) * 4 - (x % 2 ? 1.3 : 0);
    dummy.position.set(x + 0.5, 0, (start + end) / 2);
    dummy.scale.set(0.988, 0.2, end - start - 0.018);
    dummy.updateMatrix();
    mesh2.setMatrixAt(i, dummy.matrix);
    mesh2.setColorAt(i++, colour.setHSL(0.105, 0.14, 0.82 + rand() * 0.12));
  }
  mesh2.receiveShadow = true;
  mesh2.computeBoundingBox();
  mesh2.computeBoundingSphere();
  g.add(mesh2);
  return g;
}
function buildCanopyHouse() {
  const g = group();
  g.name = "canopy-house";
  const plants = planting(g);
  put(g, box(ROOM.W - 0.05, 0.95, ROOM.D - 0.05, STONE2, { rough: 0.95, cast: false }), ROOM.W / 2, -0.68, ROOM.D / 2);
  const glass = new THREE17.MeshStandardMaterial({
    color: 12177597,
    roughness: 0.18,
    metalness: 0.05,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
    side: THREE17.DoubleSide
  });
  function pane(width, height, x, y, z, rotation = 0) {
    const m = new THREE17.Mesh(new THREE17.PlaneGeometry(width, height), glass);
    m.position.set(x, y, z);
    m.rotation.y = rotation;
    m.name = "canopy-glazing";
    g.add(m);
  }
  const backStart = CANOPY_PORTAL_WIDTH + 0.06, backEnd = ROOM.W;
  const pitch = (backEnd - backStart) / 4;
  for (let i = 0; i < 4; i++) {
    const x = backStart + (i + 0.5) * pitch;
    pane(pitch - 0.32, 9.75, x, 5.22, -0.075);
    put(g, box(0.055, 9.75, 0.085, BRONZE, { cast: false }), x, 5.22, -0.01);
  }
  for (let i = 0; i <= 4; i++) put(g, box(0.3, 10.25, 0.42, OAK), backStart + i * pitch, 5.23, 0);
  for (let i = 0; i < 3; i++) {
    const z = 2.05 + i * 4.1;
    pane(3.79, 9.75, -0.075, 5.22, z, Math.PI / 2);
    put(g, box(0.085, 9.75, 0.055, BRONZE, { cast: false }), 0, 5.22, z);
  }
  for (let i = 0; i <= 3; i++) put(g, box(0.42, 10.25, 0.3, OAK), 0, 5.23, i * 4.1);
  put(g, box(backEnd - backStart, 0.075, 0.12, BRONZE, { cast: false }), (backStart + backEnd) / 2, 7.65, 0.035);
  put(g, box(0.12, 0.075, 12.25, BRONZE, { cast: false }), 0.035, 7.65, 6.125);
  for (const [wall, index] of [["back", 0], ["back", 1], ["left", 0]]) {
    const span = windowSpan(wall, index), back = wall === "back";
    put(
      g,
      box(back ? span.width + 0.35 : 0.58, 0.16, back ? 0.58 : span.width + 0.35, OAK),
      back ? span.centre : 0.12,
      WINDOW_LEDGE_Y - 0.08,
      back ? 0.12 : span.centre
    );
  }
  put(g, box(ROOM.W + 0.75, 0.64, 0.75, OAK), ROOM.W / 2, CANOPY_HEIGHT - 0.35, 0);
  put(g, box(0.75, 0.64, ROOM.D - 0.45, OAK), 0, CANOPY_HEIGHT - 0.35, (ROOM.D + 0.45) / 2);
  for (let x = 1; x < ROOM.W; x += 2.25) put(g, box(0.17, 0.35, 2.8, END_GRAIN), x, CANOPY_HEIGHT + 0.12, 0.55);
  for (let z = 2.3; z < ROOM.D; z += 2.25) put(g, box(2.6, 0.35, 0.17, END_GRAIN), 0.55, CANOPY_HEIGHT + 0.12, z);
  put(g, box(ROOM.W - 5.7, 0.32, 0.95, END_GRAIN), 15.7, 9.95, -0.32);
  for (let x = 6.5; x < 25; x += 1.1) {
    plants.fern(x, 10.15, -0.38, 0.75, 5);
    if (Math.floor(x * 2) % 3 !== 0) plants.vine(x, 9.9, 0.23, 1 + plants.rand() * 1.55);
  }
  const wallStart = 12.5, wallLength = ROOM.D - wallStart;
  const clock = DECOR.wallClock;
  const byClock = (z) => Math.abs(z - clock.z) < clock.w / 2 + 0.5;
  put(g, box(0.32, 9.9, wallLength, 3361073, { rough: 1 }), -0.04, 5.1, wallStart + wallLength / 2);
  put(g, box(0.46, 10.3, 0.32, OAK), 0.02, 5.23, ROOM.D);
  for (let z = wallStart + 0.2; z < ROOM.D - 0.2; z += 0.35) for (let y = 0.75; y < 9.9; y += 0.4) {
    if (byClock(z) && Math.abs(y - clock.y) < clock.h / 2 + 0.6) continue;
    plants.leaf(
      0.16 + plants.rand() * 0.09,
      y + (plants.rand() - 0.5) * 0.24,
      z + (plants.rand() - 0.5) * 0.22,
      0.38 + plants.rand() * 0.38,
      Math.PI / 2 + (plants.rand() - 0.5) * 0.9,
      1.2 + plants.rand() * 0.55
    );
  }
  for (const y of [3.6, 6.2, 8.9]) {
    put(g, box(0.55, 0.2, wallLength - 0.3, OAK), 0.08, y, wallStart + wallLength / 2);
    for (let z = 13; z < 19.5; z += 1.4) plants.vine(
      0.28,
      y + 0.18,
      z,
      byClock(z) && y === 6.2 ? 0.3 : 0.65 + plants.rand() * 0.9,
      1.57
    );
  }
  put(g, box(0.09, clock.h + 0.3, clock.w + 0.4, END_GRAIN, { cast: false }), 0.165, clock.y, clock.z);
  put(g, box(ROOM.W + 0.6, 0.55, 0.45, STONE2), ROOM.W / 2, -0.28, ROOM.D + 0.15);
  put(g, box(0.45, 0.55, ROOM.D, STONE2), ROOM.W + 0.15, -0.28, ROOM.D / 2);
  put(g, box(ROOM.W + 0.6, 0.1, 0.18, END_GRAIN, { cast: false }), ROOM.W / 2, -0.08, ROOM.D + 0.4);
  for (const [x, z, w, d] of [[9, -0.95, 6.1, 1.25], [19.7, -0.95, 7.7, 1.25], [-0.95, 7, 1.25, 8.8]]) {
    put(g, box(w, 0.7, d, STONE2, { rough: 0.9 }), x, 0.02, z);
    put(g, box(w - 0.14, 0.07, d - 0.14, 5261367, { cast: false }), x, 0.39, z);
    const alongX = w > d, length = Math.max(w, d);
    for (let t = -length / 2 + 0.7; t < length / 2 - 0.2; t += 0.9) {
      plants.fern(x + (alongX ? t : 0), 0.44, z + (alongX ? 0 : t), 0.66, 5);
    }
  }
  for (const [x, z] of [[8.1, 1.25], [18.3, 1.25], [1.2, 9]]) {
    const pendant = group(x, 8.1, z);
    put(pendant, cyl(0.025, 0.025, 2.3, BRONZE, { segments: 5, cast: false }), 0, 1.15, 0);
    for (let ring = 0; ring < 5; ring++) {
      const radius = 0.38 + Math.sin(ring / 4 * Math.PI * 0.7) * 0.55;
      const hoop = new THREE17.Mesh(
        new THREE17.TorusGeometry(radius, 0.026, 4, 28),
        new THREE17.MeshStandardMaterial({ color: OAK, roughness: 0.8 })
      );
      hoop.rotation.x = Math.PI / 2;
      hoop.position.y = -0.1 - ring * 0.22;
      pendant.add(hoop);
    }
    for (let rib = 0; rib < 16; rib++) {
      const a = rib / 16 * Math.PI * 2;
      plants.branch(
        [x + Math.cos(a) * 0.38, 8, z + Math.sin(a) * 0.38],
        [x + Math.cos(a) * 0.88, 7.15, z + Math.sin(a) * 0.88],
        0.025,
        OAK
      );
    }
    const bulbMaterial = new THREE17.MeshStandardMaterial({ color: 16769443, emissive: 16763762, emissiveIntensity: 1 });
    const bulb = new THREE17.Mesh(new THREE17.SphereGeometry(0.19, 10, 6), bulbMaterial);
    bulb.position.y = -0.62;
    pendant.add(bulb);
    markNightLight(pendant, { emissive: [bulbMaterial], emissiveIntensity: 1.6 });
    g.add(pendant);
  }
  plants.finish();
  return g;
}

// dist/ui/roving/src/scene/tide-house.js
import * as THREE18 from "three";
var TIDE_HEIGHT = 8.6;
var TIDE_PORTAL_WIDTH = 5.25;
var INK2 = 2704723;
var ASH = 12893091;
var LINEN = 15000793;
function ashTexture() {
  const canvas2 = document.createElement("canvas");
  canvas2.width = 256;
  canvas2.height = 1024;
  const c = canvas2.getContext("2d"), rand = seeded(20501);
  c.fillStyle = "#ded9c9";
  c.fillRect(0, 0, 256, 1024);
  for (let i = 0; i < 150; i++) {
    const x = rand() * 256;
    c.strokeStyle = `rgba(107,111,105,${0.025 + rand() * 0.08})`;
    c.lineWidth = 0.5 + rand();
    c.beginPath();
    c.moveTo(x, 0);
    for (let y = 0; y <= 1024; y += 32) c.lineTo(x + Math.sin(y * 5e-3 + i) * 3, y);
    c.stroke();
  }
  const texture = new THREE18.CanvasTexture(canvas2);
  texture.colorSpace = THREE18.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
function buildTideFloor() {
  const g = group();
  g.name = "tide-ash-floor";
  const mesh2 = new THREE18.InstancedMesh(
    new THREE18.BoxGeometry(1, 1, 1),
    new THREE18.MeshStandardMaterial({ map: ashTexture(), roughness: 0.73 }),
    20 * 4
  );
  const dummy = new THREE18.Object3D(), colour = new THREE18.Color(), rand = seeded(20502);
  let index = 0;
  for (let x = 0; x < 20; x++) for (let z = 0; z < 4; z++) {
    const offset = x % 2 ? 1.3 : 0;
    const start = z === 0 ? 0 : z * 5 - offset;
    const end = z === 3 ? ROOM.D : (z + 1) * 5 - offset;
    dummy.position.set((x + 0.5) * 1.3, 0, (start + end) / 2);
    dummy.scale.set(1.283, 0.2, end - start - 0.015);
    dummy.updateMatrix();
    mesh2.setMatrixAt(index, dummy.matrix);
    mesh2.setColorAt(index++, colour.setHSL(0.13, 0.055, 0.88 + rand() * 0.1));
  }
  mesh2.receiveShadow = true;
  mesh2.computeBoundingBox();
  mesh2.computeBoundingSphere();
  g.add(mesh2);
  return g;
}
function buildTideHouse() {
  const g = group();
  g.name = "tide-house";
  put(g, box(ROOM.W - 0.05, 1.05, ROOM.D - 0.05, 11056052, { rough: 0.95 }), ROOM.W / 2, -0.73, ROOM.D / 2);
  const glass = new THREE18.MeshStandardMaterial({
    color: 12050661,
    roughness: 0.12,
    metalness: 0.08,
    transparent: true,
    opacity: 0.075,
    depthWrite: false,
    side: THREE18.DoubleSide
  });
  function pane(width2, x, z, turn = 0) {
    const m = new THREE18.Mesh(new THREE18.PlaneGeometry(width2, 7.5), glass);
    m.position.set(x, 4.32, z);
    m.rotation.y = turn;
    m.name = "tide-glazing";
    g.add(m);
  }
  const start = TIDE_PORTAL_WIDTH + 0.06, width = ROOM.W - start, pitch = width / 3;
  for (let i = 0; i < 3; i++) pane(pitch - 0.13, start + (i + 0.5) * pitch, -0.09);
  for (let i = 0; i <= 3; i++) put(g, box(0.13, 8.1, 0.24, INK2), start + i * pitch, 4.24, 0);
  for (let i = 0; i < 2; i++) pane(6.16, -0.09, 3.15 + i * 6.3, Math.PI / 2);
  for (let i = 0; i <= 2; i++) put(g, box(0.24, 8.1, 0.13, INK2), 0, 4.24, i * 6.3);
  for (const y of [0.49, 8.08]) {
    put(g, box(width, 0.13, 0.28, INK2), start + width / 2, y, -0.01);
    put(g, box(0.28, 0.13, 12.65, INK2), -0.01, y, 6.3);
  }
  put(g, box(width, 0.055, 0.12, INK2, { cast: false }), start + width / 2, 6.55, 5e-3);
  put(g, box(0.12, 0.055, 12.6, INK2, { cast: false }), 5e-3, 6.55, 6.3);
  for (const [wall, index] of [["back", 0], ["back", 1], ["left", 0]]) {
    const span = windowSpan(wall, index), back = wall === "back";
    put(
      g,
      box(back ? span.width + 0.28 : 0.54, 0.12, back ? 0.54 : span.width + 0.28, ASH),
      back ? span.centre : 0.12,
      WINDOW_LEDGE_Y - 0.06,
      back ? 0.12 : span.centre
    );
  }
  const panelStart = 12.75, panelWidth = ROOM.D - panelStart;
  put(g, box(0.3, 8.05, panelWidth, LINEN), -0.04, 4.25, panelStart + panelWidth / 2);
  const slatCount = Math.ceil((panelWidth - 0.25) / 0.34);
  const slats = new THREE18.InstancedMesh(
    new THREE18.BoxGeometry(0.05, 7.9, 0.045),
    new THREE18.MeshStandardMaterial({ color: ASH, roughness: 0.9 }),
    slatCount
  );
  const dummy = new THREE18.Object3D();
  for (let i = 0; i < slatCount; i++) {
    dummy.position.set(0.13, 4.26, panelStart + 0.25 + i * 0.34);
    dummy.updateMatrix();
    slats.setMatrixAt(i, dummy.matrix);
  }
  slats.receiveShadow = true;
  slats.computeBoundingBox();
  slats.computeBoundingSphere();
  g.add(slats);
  put(
    g,
    box(0.1, DECOR.wallClock.h + 0.3, DECOR.wallClock.w + 0.38, LINEN, { cast: false }),
    0.15,
    DECOR.wallClock.y,
    DECOR.wallClock.z
  );
  put(g, box(0.28, 8.15, 0.18, INK2), 0.02, 4.3, ROOM.D);
  put(g, box(ROOM.W + 1.25, 0.31, 1.65, LINEN), ROOM.W / 2, TIDE_HEIGHT - 0.22, -0.22);
  put(g, box(1.65, 0.31, ROOM.D - 0.65, LINEN), -0.22, TIDE_HEIGHT - 0.22, ROOM.D / 2 + 0.33);
  put(g, box(ROOM.W + 1.45, 0.12, 1.8, INK2), ROOM.W / 2, TIDE_HEIGHT + 0.015, -0.22);
  put(g, box(1.8, 0.12, ROOM.D - 0.65, INK2), -0.22, TIDE_HEIGHT + 0.015, ROOM.D / 2 + 0.33);
  put(g, box(width, 0.09, 0.91, ASH), start + width / 2, TIDE_HEIGHT - 0.42, 0.37);
  put(g, box(0.91, 0.09, ROOM.D - 0.4, ASH), 0.37, TIDE_HEIGHT - 0.42, ROOM.D / 2);
  for (const [x, z] of [[9.4, 1.28], [20, 1.28], [1.2, 8.5]]) {
    const back = z < 2;
    put(
      g,
      box(back ? 0.06 : x - 0.27, 0.06, back ? z - 0.27 : 0.06, INK2),
      back ? x : (x + 0.37) / 2,
      8.19,
      back ? (z + 0.37) / 2 : z
    );
    const pendant = group(x, 6.55, z);
    put(pendant, cyl(0.02, 0.02, 1.34, INK2, { segments: 5, cast: false }), 0, 0.97, 0);
    put(pendant, cyl(0.22, 0.82, 0.55, 8232102, { segments: 24 }), 0, 0, 0);
    const lampMaterial = new THREE18.MeshStandardMaterial({ color: 16771522, emissive: 16766107 });
    const diffuser = new THREE18.Mesh(new THREE18.CircleGeometry(0.72, 24), lampMaterial);
    diffuser.rotation.x = Math.PI / 2;
    diffuser.position.y = -0.287;
    pendant.add(diffuser);
    markNightLight(pendant, { emissive: [lampMaterial], emissiveIntensity: 1.2 });
    g.add(pendant);
  }
  put(g, box(ROOM.W + 0.1, 0.31, 0.18, INK2), ROOM.W / 2, -0.17, ROOM.D + 0.04);
  put(g, box(0.18, 0.31, ROOM.D, INK2), ROOM.W + 0.04, -0.17, ROOM.D / 2);
  return g;
}

// dist/ui/roving/src/scene/dune-atelier.js
import * as THREE19 from "three";
var DUNE_HEIGHT = 10.3;
var DUNE_PORTAL_WIDTH = 5.25;
var PLASTER = 14994853;
var CLAY = 10969152;
var TIMBER = 7884857;
function plasterTexture() {
  const canvas2 = document.createElement("canvas");
  canvas2.width = canvas2.height = 256;
  const c = canvas2.getContext("2d"), rand = seeded(20521);
  c.fillStyle = "#f4e8d4";
  c.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 3200; i++) {
    c.fillStyle = i % 2 ? "rgba(152,112,64,.035)" : "rgba(255,255,248,.08)";
    c.fillRect(rand() * 256, rand() * 256, 0.5 + rand() * 3, 0.5 + rand() * 2);
  }
  const map = new THREE19.CanvasTexture(canvas2);
  map.colorSpace = THREE19.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE19.RepeatWrapping;
  map.repeat.set(0.45, 0.45);
  return map;
}
function buildDuneFloor() {
  const g = group();
  g.name = "dune-handmade-clay-floor";
  const canvas2 = document.createElement("canvas");
  canvas2.width = canvas2.height = 512;
  const c = canvas2.getContext("2d"), rand = seeded(20522);
  c.fillStyle = "#9a6c51";
  c.fillRect(0, 0, 512, 512);
  for (let row = 0; row < 2; row++) for (let col = 0; col < 2; col++) {
    const x = col * 256, y = row * 256;
    c.fillStyle = ["#bd7853", "#c7855d", "#b77350", "#c27e56"][row * 2 + col];
    c.fillRect(x + 2, y + 2, 252, 252);
    for (let i = 0; i < 1300; i++) {
      c.fillStyle = i % 2 ? "rgba(99,40,21,.025)" : "rgba(255,208,147,.035)";
      c.fillRect(x + 3 + rand() * 247, y + 3 + rand() * 247, rand() * 4 + 0.5, rand() * 3 + 0.5);
    }
  }
  const map = new THREE19.CanvasTexture(canvas2);
  map.colorSpace = THREE19.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE19.RepeatWrapping;
  map.repeat.set(6.5, 5);
  map.anisotropy = 4;
  const floor2 = new THREE19.Mesh(
    new THREE19.PlaneGeometry(ROOM.W, ROOM.D),
    new THREE19.MeshStandardMaterial({ map, roughness: 0.91 })
  );
  floor2.rotation.x = -Math.PI / 2;
  floor2.position.set(ROOM.W / 2, 0.1, ROOM.D / 2);
  floor2.receiveShadow = true;
  g.add(floor2);
  put(g, box(ROOM.W, 0.2, ROOM.D, CLAY), ROOM.W / 2, -0.03, ROOM.D / 2);
  return g;
}
function archPath(path, span, bottom = WINDOW_SILL_Y - 0.04) {
  const side = WINDOW_HEAD_Y + 0.15, rise = 2.15, extra = 0.08;
  path.moveTo(span.from - extra, bottom);
  path.lineTo(span.to + extra, bottom);
  path.lineTo(span.to + extra, side);
  path.absellipse(span.centre, side, span.width / 2 + extra, rise, 0, Math.PI, false);
  path.lineTo(span.from - extra, bottom);
  return path;
}
function punchedWall(from, to, windows, material) {
  const shape = new THREE19.Shape(), radius = 0.34;
  shape.moveTo(from, -0.04);
  shape.lineTo(to, -0.04);
  shape.lineTo(to, DUNE_HEIGHT - radius);
  shape.quadraticCurveTo(to, DUNE_HEIGHT, to - radius, DUNE_HEIGHT);
  shape.lineTo(from + radius, DUNE_HEIGHT);
  shape.quadraticCurveTo(from, DUNE_HEIGHT, from, DUNE_HEIGHT - radius);
  shape.closePath();
  for (const span of windows) shape.holes.push(archPath(new THREE19.Path(), span));
  const geometry = new THREE19.ExtrudeGeometry(shape, {
    depth: 1.14,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.055,
    bevelSegments: 3,
    steps: 1,
    curveSegments: 18
  });
  const mesh2 = new THREE19.Mesh(geometry, material);
  mesh2.castShadow = true;
  mesh2.receiveShadow = true;
  return mesh2;
}
function buildDuneAtelier() {
  const g = group();
  g.name = "dune-atelier";
  const plaster = new THREE19.MeshStandardMaterial({ color: PLASTER, map: plasterTexture(), roughness: 0.96 });
  const backSpans = [windowSpan("back", 0), windowSpan("back", 1)];
  put(g, punchedWall(DUNE_PORTAL_WIDTH + 0.015, ROOM.W, backSpans, plaster), 0, 0, -1.14);
  const left = punchedWall(0.12, ROOM.D, [windowSpan("left", 0)], plaster);
  left.rotation.y = -Math.PI / 2;
  g.add(left);
  put(g, box(ROOM.W, 1.12, ROOM.D, 12161638, { rough: 1 }), ROOM.W / 2, -0.71, ROOM.D / 2);
  const glass = new THREE19.MeshStandardMaterial({
    color: 13357499,
    transparent: true,
    opacity: 0.1,
    roughness: 0.28,
    depthWrite: false,
    side: THREE19.DoubleSide
  });
  for (const [wall, index] of [["back", 0], ["back", 1], ["left", 0]]) {
    const span = windowSpan(wall, index), back = wall === "back";
    const pane = new THREE19.Mesh(new THREE19.ShapeGeometry(archPath(new THREE19.Shape(), span), 24), glass);
    if (back) pane.position.z = -0.76;
    else {
      pane.rotation.y = -Math.PI / 2;
      pane.position.x = -0.76;
    }
    pane.name = "dune-recessed-glazing";
    g.add(pane);
    put(
      g,
      box(back ? span.width + 0.18 : 0.88, 0.18, back ? 0.88 : span.width + 0.18, PLASTER),
      back ? span.centre : -0.03,
      WINDOW_LEDGE_Y - 0.09,
      back ? -0.03 : span.centre
    );
    put(
      g,
      box(back ? span.width : 0.055, 0.055, back ? 0.055 : span.width, TIMBER, { cast: false }),
      back ? span.centre : -0.7,
      WINDOW_HEAD_Y + 0.16,
      back ? -0.7 : span.centre
    );
  }
  for (let z = 1.25; z < 12; z += 1.4) {
    put(g, box(3.1, 0.17, 0.14, TIMBER), 0.52, DUNE_HEIGHT + 0.17, z);
  }
  put(g, box(0.19, 0.32, 11.8, TIMBER), 1.83, DUNE_HEIGHT + 0.09, 6.15);
  for (const y of [1.4, 2.8, 6.4, 7.9, 9.3]) {
    put(g, box(0.027, 0.022, 7.9, 12951669, { cast: false }), 0.078, y, 16);
  }
  const clock = DECOR.wallClock;
  put(g, box(0.08, clock.h + 0.28, clock.w + 0.34, 13345657, { cast: false }), 0.12, clock.y, clock.z);
  for (const [x, z] of [[12.9, 0.9], [0.9, 12.2]]) {
    const back = z < 2;
    put(
      g,
      box(back ? 0.08 : 1.4, 0.08, back ? 1.4 : 0.08, TIMBER),
      back ? x : 0.3,
      10.25,
      back ? 0.3 : z
    );
    const pendant = group(x, 8.2, z);
    put(pendant, cyl(0.018, 0.018, 2, TIMBER, { segments: 5, cast: false }), 0, 1.05, 0);
    const hood = new THREE19.Mesh(
      new THREE19.CylinderGeometry(0.24, 0.64, 0.64, 24, 1, true),
      new THREE19.MeshStandardMaterial({ color: CLAY, roughness: 0.95, side: THREE19.DoubleSide })
    );
    hood.position.y = -0.28;
    hood.castShadow = true;
    pendant.add(hood);
    const glow2 = new THREE19.MeshStandardMaterial({ color: 16768161, emissive: 16758603, emissiveIntensity: 1 });
    const bulb = new THREE19.Mesh(new THREE19.SphereGeometry(0.14, 10, 6), glow2);
    bulb.position.y = -0.47;
    pendant.add(bulb);
    markNightLight(pendant, { emissive: [glow2], emissiveIntensity: 1.7 });
    g.add(pendant);
  }
  return g;
}

// dist/ui/roving/src/scene/lantern-court.js
import * as THREE20 from "three";
var LANTERN_HEIGHT = 7.8;
var LANTERN_PORTAL_WIDTH = 5.25;
var TIMBER2 = 3419689;
var CEDAR = 6902851;
var STONE3 = 7961201;
function joinery(parent2) {
  const parts = [], dummy = new THREE20.Object3D(), colour = new THREE20.Color();
  return {
    add(w, h, d, x, y, z, tone = TIMBER2) {
      parts.push({ w, h, d, x, y, z, tone });
    },
    finish() {
      const mesh2 = new THREE20.InstancedMesh(
        new THREE20.BoxGeometry(1, 1, 1),
        new THREE20.MeshStandardMaterial({ roughness: 0.86 }),
        parts.length
      );
      mesh2.name = "lantern-timber-joinery";
      parts.forEach((p, i) => {
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.set(p.w, p.h, p.d);
        dummy.updateMatrix();
        mesh2.setMatrixAt(i, dummy.matrix);
        mesh2.setColorAt(i, colour.setHex(p.tone));
      });
      mesh2.castShadow = mesh2.receiveShadow = true;
      mesh2.computeBoundingBox();
      mesh2.computeBoundingSphere();
      parent2.add(mesh2);
    }
  };
}
function floorTexture() {
  const canvas2 = document.createElement("canvas");
  canvas2.width = 1040;
  canvas2.height = 800;
  const c = canvas2.getContext("2d"), rand = seeded(20531);
  c.fillStyle = "#605347";
  c.fillRect(0, 0, canvas2.width, canvas2.height);
  const edge = 40, cols = 4, rows = 5, w = 240, h = 144;
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
    const x = edge + col * w, y = edge + row * h;
    c.fillStyle = "#4a4c3e";
    c.fillRect(x + 1, y + 1, w - 2, h - 2);
    c.fillStyle = (row + col) % 2 ? "#c8bf99" : "#c4b98f";
    c.fillRect(x + 4, y + 4, w - 8, h - 8);
    for (let line = 5; line < h - 5; line += 2) {
      c.fillStyle = `rgba(79,76,44,${0.03 + rand() * 0.09})`;
      c.fillRect(x + 4, y + line, w - 8, 0.65);
    }
    for (let line = 7; line < w - 5; line += 6) {
      c.fillStyle = "rgba(255,246,212,.10)";
      c.fillRect(x + line, y + 4, 0.8, h - 8);
    }
  }
  const texture = new THREE20.CanvasTexture(canvas2);
  texture.colorSpace = THREE20.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
function buildLanternFloor() {
  const g = group();
  g.name = "lantern-woven-floor";
  const material = new THREE20.MeshStandardMaterial({ map: floorTexture(), roughness: 0.96 });
  const floor2 = new THREE20.Mesh(new THREE20.BoxGeometry(ROOM.W, 0.2, ROOM.D), material);
  floor2.position.set(ROOM.W / 2, 0, ROOM.D / 2);
  floor2.receiveShadow = true;
  g.add(floor2);
  return g;
}
function paperTexture() {
  const canvas2 = document.createElement("canvas");
  canvas2.width = canvas2.height = 128;
  const c = canvas2.getContext("2d"), rand = seeded(20532);
  c.fillStyle = "#f1e8d1";
  c.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 700; i++) {
    c.strokeStyle = `rgba(118,101,66,${0.025 + rand() * 0.05})`;
    c.lineWidth = 0.5;
    const x = rand() * 128, y = rand() * 128;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + rand() * 6 - 3, y + 1 + rand() * 7);
    c.stroke();
  }
  const texture = new THREE20.CanvasTexture(canvas2);
  texture.colorSpace = THREE20.SRGBColorSpace;
  return texture;
}
function buildLanternCourt() {
  const g = group();
  g.name = "lantern-court";
  const wood = joinery(g), paperMap = paperTexture();
  const paper = new THREE20.MeshStandardMaterial({
    map: paperMap,
    color: 16774879,
    roughness: 1,
    side: THREE20.DoubleSide,
    emissive: 16763782,
    emissiveIntensity: 0
  });
  const glass = new THREE20.MeshStandardMaterial({
    color: 13228240,
    roughness: 0.2,
    transparent: true,
    opacity: 0.075,
    depthWrite: false,
    side: THREE20.DoubleSide
  });
  markNightLight(g, { emissive: [paper], emissiveIntensity: 0.8 });
  put(g, box(ROOM.W - 0.02, 0.92, ROOM.D - 0.02, STONE3, { cast: false, rough: 1 }), ROOM.W / 2, -0.67, ROOM.D / 2);
  function bay(start, end, back, shoji = false) {
    const length = end - start, centre = (start + end) / 2;
    const plane = new THREE20.Mesh(new THREE20.PlaneGeometry(length - 0.17, 7.12), shoji ? paper : glass);
    plane.name = shoji ? "lantern-shoji" : "lantern-picture-window";
    plane.position.set(back ? centre : -0.045, 3.93, back ? -0.045 : centre);
    if (!back) plane.rotation.y = Math.PI / 2;
    plane.castShadow = shoji;
    plane.receiveShadow = true;
    g.add(plane);
    for (const endPoint of [start, end]) wood.add(
      back ? 0.17 : 0.28,
      7.4,
      back ? 0.28 : 0.17,
      back ? endPoint : 0,
      3.89,
      back ? 0 : endPoint
    );
    for (const y of [0.27, 7.58]) wood.add(
      back ? length : 0.3,
      0.16,
      back ? 0.3 : length,
      back ? centre : 0.025,
      y,
      back ? 0.025 : centre
    );
    if (shoji) {
      const divisions = Math.max(2, Math.round(length / 1.25));
      for (let i = 1; i < divisions; i++) wood.add(
        back ? 0.045 : 0.06,
        7.1,
        back ? 0.06 : 0.045,
        back ? start + length * i / divisions : 0.025,
        3.93,
        back ? 0.025 : start + length * i / divisions,
        CEDAR
      );
      for (let i = 1; i < 6; i++) wood.add(
        back ? length - 0.17 : 0.07,
        0.038,
        back ? 0.07 : length - 0.17,
        back ? centre : 0.035,
        0.38 + 7.1 * i / 6,
        back ? 0.035 : centre,
        CEDAR
      );
    } else {
      wood.add(back ? length : 0.13, 0.07, back ? 0.13 : length, back ? centre : 0.02, 7.03, back ? 0.02 : centre);
    }
  }
  bay(5.37, 11.92, true);
  bay(12.12, 14.58, true, true);
  bay(14.78, 21.65, true);
  bay(21.85, 25.9, true, true);
  bay(0.15, 4.06, false, true);
  bay(4.26, 11.3, false);
  bay(11.5, 13.91, false, true);
  put(g, box(0.28, 7.5, 5.89, TIMBER2), -0.025, 3.9, 17.055);
  const clock = DECOR.wallClock;
  for (let z = 14.35; z < 20; z += 0.42) {
    if (Math.abs(z - clock.z) > clock.w / 2 + 0.35) wood.add(0.09, 7.35, 0.038, 0.16, 3.9, z, CEDAR);
  }
  put(g, box(0.075, clock.h + 0.52, clock.w + 0.5, 14208695, { cast: false }), 0.175, clock.y, clock.z);
  put(g, box(0.39, 0.16, 4.8, CEDAR), 0.08, 2.95, 17.15);
  put(g, box(0.035, 1.02, 1.5, 6833482, { cast: false }), 0.145, 6.46, 17.05);
  for (const [wall, index] of [["back", 0], ["back", 1], ["left", 0]]) {
    const span = windowSpan(wall, index), back = wall === "back";
    wood.add(
      back ? span.width + 0.2 : 0.53,
      0.13,
      back ? 0.53 : span.width + 0.2,
      back ? span.centre : 0.1,
      WINDOW_LEDGE_Y - 0.065,
      back ? 0.1 : span.centre,
      CEDAR
    );
  }
  wood.add(ROOM.W + 1.55, 0.34, 2.25, ROOM.W / 2 - 0.15, 7.99, -0.67);
  wood.add(2.25, 0.34, ROOM.D + 0.2, -0.67, 7.99, 10.6);
  wood.add(ROOM.W + 1.8, 0.12, 2.48, ROOM.W / 2 - 0.15, 8.25, -0.72, 5593170);
  wood.add(2.48, 0.12, ROOM.D + 0.2, -0.72, 8.25, 10.72, 5593170);
  for (let x = 0.55; x < ROOM.W; x += 1.35) wood.add(0.095, 0.12, 2.14, x, 7.75, -0.6, CEDAR);
  for (let z = 1.55; z < ROOM.D; z += 1.35) wood.add(2.14, 0.12, 0.095, -0.6, 7.75, z, CEDAR);
  wood.add(20.5, 0.22, 2.15, 15.9, -0.05, -1.32, CEDAR);
  wood.add(2.15, 0.22, 20.3, -1.32, -0.05, 9.95, CEDAR);
  for (let z = -0.1; z < 20; z += 0.48) wood.add(2.1, 0.018, 0.017, -1.32, 0.069, z);
  for (let x = 5.9; x < 26; x += 0.48) wood.add(0.017, 0.018, 2.1, x, 0.069, -1.32);
  wood.add(ROOM.W + 0.26, 0.36, 0.27, ROOM.W / 2, -0.13, ROOM.D + 0.12);
  wood.add(0.27, 0.36, ROOM.D, ROOM.W + 0.12, -0.13, ROOM.D / 2);
  for (const [x, z] of [[12.85, 0.65], [0.65, 12.75]]) {
    const back = z < 2;
    wood.add(
      back ? 0.08 : 0.8,
      0.12,
      back ? 0.8 : 0.08,
      back ? x : 0.35,
      7.79,
      back ? 0.35 : z
    );
    const lantern = new THREE20.Mesh(new THREE20.BoxGeometry(0.74, 1.12, 0.74), paper);
    lantern.position.set(x, 6.35, z);
    lantern.name = "lantern-paper-pendant";
    g.add(lantern);
    wood.add(0.028, 0.84, 0.028, x, 7.35, z);
    for (const y of [5.76, 6.94]) wood.add(0.85, 0.06, 0.85, x, y, z);
    for (const dx of [-0.38, 0.38]) for (const dz of [-0.38, 0.38]) wood.add(0.035, 1.16, 0.035, x + dx, 6.35, z + dz);
  }
  wood.finish();
  return g;
}

// dist/ui/roving/src/scene/office-shells.js
var OFFICE_SHELLS = {
  canopy: { build: buildCanopyHouse, floor: buildCanopyFloor, height: CANOPY_HEIGHT, portalWidth: CANOPY_PORTAL_WIDTH },
  tide: { build: buildTideHouse, floor: buildTideFloor, height: TIDE_HEIGHT, portalWidth: TIDE_PORTAL_WIDTH },
  dune: { build: buildDuneAtelier, floor: buildDuneFloor, height: DUNE_HEIGHT, portalWidth: DUNE_PORTAL_WIDTH },
  lantern: { build: buildLanternCourt, floor: buildLanternFloor, height: LANTERN_HEIGHT, portalWidth: LANTERN_PORTAL_WIDTH }
};

// dist/ui/roving/src/scene/environment.js
var BASE_TO = {
  "skyline-high": SKYLINE_GROUND_Y - 0.5,
  "paris-rooftops": PARIS_BASE_Y + 2
};
function buildEnvironment(scene, theme4) {
  const env = group(0, 0, 0);
  const handles = {};
  const floorSpec = theme4?.floor ?? { kind: "plank", plankWidth: 1.6 };
  const outside = theme4?.outside ?? "street-summer";
  const elevation = theme4?.elevation ?? "ground";
  const storeysBelow = theme4?.storeysBelow ?? 0;
  const showPlinth = theme4?.plinth ?? true;
  const entrance = theme4?.entrance ?? "stoop";
  const lowerWalls = theme4?.lowerWalls ?? "glazed";
  const serviceYard = theme4?.serviceYard ?? false;
  const signText = theme4?.signText ?? null;
  const roof = theme4?.roof ?? null;
  const shell = OFFICE_SHELLS[theme4?.building];
  if (showPlinth) {
    put(env, box(ROOM.W + 4, 1.2, ROOM.D + 4, COLORS.baseboard, { rough: 0.95 }), ROOM.W / 2, -0.6, ROOM.D / 2);
    put(env, box(ROOM.W + 4.2, 0.5, ROOM.D + 4.2, COLORS.woodMid, { rough: 0.9 }), ROOM.W / 2, -1, ROOM.D / 2);
  }
  if (storeysBelow > 0) {
    const storeys = buildStoreysBelow({
      count: storeysBelow,
      roomW: ROOM.W,
      roomD: ROOM.D,
      wallT: ROOM.wallT,
      walls: lowerWalls,
      signText,
      baseTo: BASE_TO[outside] ?? null
    });
    env.add(storeys);
  }
  env.add(shell ? shell.floor(theme4) : buildFloor(floorSpec));
  if (theme4?.building === "skyscraper") env.add(buildEdgeBalustrade());
  if (theme4?.building === "mansard") env.add(buildEdgeBalcony(theme4?.season));
  const glazedStairwell = entrance === "stairs" && theme4?.building === "mansard";
  if (shell) {
    const { height, portalWidth } = shell;
    const portal = buildWall({
      length: portalWidth,
      height,
      position: [portalWidth / 2, height / 2, 0],
      rotationY: 0,
      color: COLORS.wallSage,
      extent: [0.2 - portalWidth / 2, portalWidth / 2],
      door: { localX: DOOR.x - portalWidth / 2, width: DOOR.width, height: DOOR.height, entrance }
    });
    env.add(portal.obj, shell.build(theme4));
    handles.door = portal.door;
  } else {
    const doorLeftX = DOOR.x - DOOR.width / 2;
    const doorRightX = DOOR.x + DOOR.width / 2;
    const pocketRightX = doorRightX + 0.4;
    const stubLen = doorLeftX - ROOM.wallT / 2;
    const rightStubEnd = doorRightX + stubLen;
    const backWall = buildWall({
      length: ROOM.W,
      color: COLORS.wallSage,
      position: [ROOM.W / 2, ROOM.H / 2, 0],
      rotationY: 0,
      extent: glazedStairwell ? [-ROOM.W / 2 + ROOM.wallT / 2, rightStubEnd - ROOM.W / 2] : [-ROOM.W / 2 + ROOM.wallT / 2, ROOM.W / 2],
      skirtReturns: [false, true],
      windows: glazedStairwell ? [] : WINDOWS.back,
      door: {
        localX: DOOR.x - ROOM.W / 2,
        width: DOOR.width,
        height: DOOR.height,
        entrance,
        storeysBelow
      }
    });
    env.add(backWall.obj);
    handles.door = backWall.door;
    if (entrance === "elevator") handles.elevator = backWall.door;
    if (glazedStairwell) {
      put(env, box(pocketRightX - doorLeftX, ROOM.H, ROOM.wallT, COLORS.facadeLower, { rough: 0.9, cast: false }), (doorLeftX + pocketRightX) / 2, ROOM.H / 2, -STAIR_WIDTH);
      put(env, box(ROOM.wallT, ROOM.H, STAIR_WIDTH, COLORS.facadeLower, { rough: 0.9, cast: false }), doorLeftX, ROOM.H / 2, -STAIR_WIDTH / 2);
      const landingCap = box(
        pocketRightX - doorLeftX + ROOM.wallT,
        0.3,
        STAIR_WIDTH + 0.2,
        COLORS.baseCourse,
        { rough: 0.9, cast: false }
      );
      landingCap.position.set((doorLeftX + pocketRightX) / 2, ROOM.H + 0.15, -STAIR_WIDTH);
      env.add(landingCap);
      const dropHeight = storeysBelow * STOREY_H + 1.5;
      put(env, box(ROOM.wallT, ROOM.H + dropHeight, STAIR_WIDTH, COLORS.facadeLower, { rough: 0.9, cast: false }), ROOM.W, ROOM.H / 2 - dropHeight / 2, -STAIR_WIDTH / 2);
      env.add(buildStairwellGlazing(pocketRightX, ROOM.W, ROOM.H, dropHeight));
      env.add(buildStairwellRail(rightStubEnd, ROOM.W + BALCONY_LEDGE_D - 0.04, theme4?.season));
    }
    const leftWall = buildWall({
      length: ROOM.D,
      color: COLORS.wallWhite,
      position: [0, ROOM.H / 2, ROOM.D / 2],
      rotationY: Math.PI / 2,
      extent: [-ROOM.D / 2, ROOM.D / 2 + ROOM.wallT / 2],
      skirtReturns: [true, false],
      windows: WINDOWS.left,
      door: null
    });
    env.add(leftWall.obj);
  }
  if (roof) env.add(buildRoof(roof, ROOM));
  if (entrance !== "elevator") {
    const levelLanding = storeysBelow > 0 || entrance === "hatch";
    env.add(buildStoop(levelLanding));
    handles.stoop = stoopApproach(levelLanding);
    if (entrance === "stairs") {
      handles.stairs = stairFlight(storeysBelow * STOREY_H);
      env.add(buildStaircase(handles.stairs, glazedStairwell ? {
        tread: COLORS.baseCourse,
        post: COLORS.metalDark ?? COLORS.frame,
        rail: COLORS.metalDark ?? COLORS.frame,
        baluster: COLORS.metalDark ?? COLORS.frame
      } : void 0));
    }
  }
  env.add(buildCeilingLights(theme4?.fittings));
  scene.add(env);
  buildExterior(env, {
    mode: outside,
    season: theme4?.season,
    elevation,
    storeysBelow,
    serviceYard,
    building: theme4?.building
  });
  handles.nightLights = collectNightLights(env);
  return handles;
}
function buildFloor(floorSpec) {
  const g = group(0, 0, 0);
  const kind = floorSpec.kind || "plank";
  if (kind === "plank") {
    const plankW = floorSpec.plankWidth ?? 1.6;
    const gap = plankW * 0.03;
    const planks = Math.ceil(ROOM.W / plankW);
    for (let i = 0; i < planks; i++) {
      const shade = i % 2 === 0 ? COLORS.floorWood : COLORS.floorWoodAlt;
      const x0 = i * plankW + gap / 2;
      const x1 = Math.min((i + 1) * plankW - gap / 2, ROOM.W);
      if (x1 - x0 <= 0) continue;
      const p = box(x1 - x0, FLOOR_THICKNESS, ROOM.D, shade, { rough: 0.8, cast: false });
      p.position.set((x0 + x1) / 2, 0, ROOM.D / 2);
      p.receiveShadow = true;
      g.add(p);
    }
  } else if (kind === "concrete") {
    const tileSize = floorSpec.tileSize ?? 6;
    const tilesX = Math.ceil(ROOM.W / tileSize);
    const tilesZ = Math.ceil(ROOM.D / tileSize);
    const seamThickness = 0.08;
    for (let ix = 0; ix < tilesX; ix++) {
      for (let iz = 0; iz < tilesZ; iz++) {
        const x = ix * tileSize + tileSize / 2;
        const z = iz * tileSize + tileSize / 2;
        const shade = (ix + iz) % 2 === 0 ? COLORS.floorConcrete : COLORS.floorConcreteAlt;
        const slab = box(tileSize - seamThickness, FLOOR_THICKNESS, tileSize - seamThickness, shade, {
          rough: 0.4,
          // Polished concrete: lower roughness
          cast: false
        });
        slab.position.set(x, 0, z);
        slab.receiveShadow = true;
        g.add(slab);
      }
    }
    for (let iz = 0; iz <= tilesZ; iz++) {
      const z = iz * tileSize;
      if (z > 0 && z < ROOM.D) {
        const seam = box(ROOM.W, 0.15, seamThickness, COLORS.floorSeam, { cast: false });
        seam.position.set(ROOM.W / 2, 0.01, z);
        seam.receiveShadow = true;
        g.add(seam);
      }
    }
    for (let ix = 0; ix <= tilesX; ix++) {
      const x = ix * tileSize;
      if (x > 0 && x < ROOM.W) {
        const seam = box(seamThickness, 0.15, ROOM.D, COLORS.floorSeam, { cast: false });
        seam.position.set(x, 0.01, ROOM.D / 2);
        seam.receiveShadow = true;
        g.add(seam);
      }
    }
  } else if (kind === "carpet") {
    const tileSize = floorSpec.tileSize ?? 2.4;
    const tilesX = Math.ceil(ROOM.W / tileSize);
    const tilesZ = Math.ceil(ROOM.D / tileSize);
    for (let ix = 0; ix < tilesX; ix++) {
      for (let iz = 0; iz < tilesZ; iz++) {
        const x = ix * tileSize + tileSize / 2;
        const z = iz * tileSize + tileSize / 2;
        const shade = (ix + iz) % 2 === 0 ? COLORS.floorCarpet : COLORS.floorCarpetAlt;
        const tile = box(tileSize * 0.99, FLOOR_THICKNESS, tileSize * 0.99, shade, {
          rough: 0.95,
          // Matte carpet
          cast: false
        });
        tile.position.set(x, 0, z);
        tile.receiveShadow = true;
        g.add(tile);
      }
    }
  }
  return g;
}
function buildWall({
  length,
  color,
  position,
  rotationY,
  windows = [],
  door = null,
  extent = null,
  skirtReturns = [false, false],
  height = ROOM.H,
  sill = WINDOW_SILL_Y,
  head = WINDOW_HEAD_Y
}) {
  const g = group(...position);
  g.rotation.y = rotationY;
  const t = ROOM.wallT;
  const H = height;
  const [massFrom, massTo] = extent ?? [-length / 2, length / 2];
  const sillY = sill - H / 2;
  const headY = head - H / 2;
  const openings = [];
  for (const w of windows) {
    const cx = -length / 2 + w.center * length;
    openings.push({
      kind: "window",
      cx,
      width: w.width,
      yBottom: sillY,
      yTop: headY
    });
  }
  if (door) {
    openings.push({
      kind: "door",
      cx: door.localX,
      width: door.width,
      yBottom: -H / 2,
      yTop: -H / 2 + door.height
    });
  }
  openings.sort((a, b) => a.cx - b.cx);
  const addSolid = (from, to) => {
    const w = to - from;
    if (w <= 1e-3) return;
    const panel = box(w, H, t, color, { rough: 0.9, cast: false });
    panel.position.set((from + to) / 2, 0, 0);
    panel.receiveShadow = true;
    g.add(panel);
  };
  let cursor = massFrom;
  let doorHandle = null;
  for (const op of openings) {
    const from = op.cx - op.width / 2;
    const to = op.cx + op.width / 2;
    addSolid(cursor, from);
    if (op.yBottom > -H / 2 + 1e-3) {
      const belowH = op.yBottom - -H / 2;
      const below = box(op.width, belowH, t, color, { rough: 0.9, cast: false });
      below.position.set(op.cx, -H / 2 + belowH / 2, 0);
      below.receiveShadow = true;
      g.add(below);
    }
    if (op.yTop < H / 2 - 1e-3) {
      const aboveH = H / 2 - op.yTop;
      const above = box(op.width, aboveH, t, color, { rough: 0.9, cast: false });
      above.position.set(op.cx, op.yTop + aboveH / 2, 0);
      above.receiveShadow = true;
      g.add(above);
    }
    if (op.kind === "window") {
      g.add(buildWindow(op.cx, (op.yBottom + op.yTop) / 2, op.width, op.yTop - op.yBottom));
    } else {
      const built = door?.entrance === "elevator" ? buildElevator(
        op.cx,
        -H / 2,
        op.width,
        op.yTop - op.yBottom,
        { storeysBelow: door.storeysBelow }
      ) : buildDoor(op.cx, -H / 2, op.width, op.yTop - op.yBottom);
      g.add(built.obj);
      doorHandle = built.handle;
    }
    cursor = to;
  }
  addSolid(cursor, massTo);
  const SKIRT_PROUD = 0.04;
  const skirtFrom = massFrom - (skirtReturns[0] ? SKIRT_PROUD : 0);
  const skirtTo = massTo + (skirtReturns[1] ? SKIRT_PROUD : 0);
  const doorSpan = door ? [door.localX - door.width / 2, door.localX + door.width / 2] : null;
  const addBase = (from, to) => {
    if (to - from <= 1e-3) return;
    put(g, box(to - from, 0.6, t + SKIRT_PROUD * 2, COLORS.baseboard, { rough: 0.85, cast: false }), (from + to) / 2, -H / 2 + 0.3, 0);
  };
  if (doorSpan) {
    addBase(skirtFrom, doorSpan[0]);
    addBase(doorSpan[1], skirtTo);
  } else {
    addBase(skirtFrom, skirtTo);
  }
  return { obj: g, door: doorHandle };
}
function buildWindow(cx, cy, w, h) {
  const g = group(cx, cy, 0);
  const frameC = COLORS.frame;
  const fT = WINDOW_FRAME_T;
  const fD = WINDOW_FRAME_D;
  const top = box(w + fT, fT, fD, frameC);
  top.position.set(0, h / 2, 0);
  const bot = box(w + fT, fT, fD, frameC);
  bot.position.set(0, -h / 2, 0);
  const left = box(fT, h + fT, fD, frameC);
  left.position.set(-w / 2, 0, 0);
  const right = box(fT, h + fT, fD, frameC);
  right.position.set(w / 2, 0, 0);
  g.add(top, bot, left, right);
  const { cols, rows, barT, barD } = WINDOW_LIGHTS;
  for (let i = 1; i < cols; i++) {
    put(g, box(barT, h, barD, frameC, { cast: false }), -w / 2 + w / cols * i, 0, 0);
  }
  for (let j = 1; j < rows; j++) {
    put(g, box(w, barT, barD, frameC, { cast: false }), 0, -h / 2 + h / rows * j, 0);
  }
  const glass = new THREE21.Mesh(
    new THREE21.PlaneGeometry(w, h),
    new THREE21.MeshStandardMaterial({
      color: COLORS.glass,
      transparent: true,
      opacity: 0.22,
      roughness: 0.1,
      metalness: 0
    })
  );
  glass.position.set(0, 0, 0.05);
  g.add(glass);
  return g;
}
function buildDoor(cx, yFloor, w, h) {
  const g = group(cx, yFloor, 0);
  const frameC = COLORS.frame;
  const fT = 0.3;
  const left = box(fT, h + fT, 0.62, frameC);
  left.position.set(-w / 2, (h + fT) / 2, 0);
  const right = box(fT, h + fT, 0.62, frameC);
  right.position.set(w / 2, (h + fT) / 2, 0);
  const head = box(w + fT * 2, fT, 0.62, frameC);
  head.position.set(0, h + fT / 2, 0);
  g.add(left, right, head);
  put(g, box(w, 0.12, 0.7, 9071178, { rough: 0.8, cast: false }), 0, 0.06, 0);
  put(g, box(1.5, 0.34, 0.1, 12557125, { rough: 0.35, metal: 0.6 }), 0, h + 0.75, 0.2);
  const pivot = group(-w / 2 + 0.06, 0, 0);
  const leafW = w - 0.12;
  put(pivot, box(leafW, h - 0.1, 0.14, 9065008, { rough: 0.65 }), leafW / 2, (h - 0.1) / 2, 0);
  for (const py of [h * 0.28, h * 0.66]) {
    put(pivot, box(leafW * 0.62, h * 0.26, 0.06, 10116920, { rough: 0.6, cast: false }), leafW / 2, py, 0.09);
  }
  const knob = cyl(0.09, 0.09, 0.22, 12557125, { segments: 10, metal: 0.7, rough: 0.3 });
  knob.rotation.x = Math.PI / 2;
  knob.position.set(leafW - 0.28, h * 0.45, 0.16);
  pivot.add(knob);
  g.add(pivot);
  const MAX_OPEN = -Math.PI * 0.46;
  const handle = {
    id: "door",
    pivot,
    _hold: 0,
    /** Ask the door to be open this frame; it eases shut once nobody asks. */
    requestOpen(seconds = 0.9) {
      this._hold = Math.max(this._hold, seconds);
    },
    update(dt) {
      if (this._hold > 0) this._hold -= dt;
      const target = this._hold > 0 ? MAX_OPEN : 0;
      pivot.rotation.y += (target - pivot.rotation.y) * Math.min(1, dt * 7);
    }
  };
  return { obj: g, handle };
}
function buildStairwellGlazing(x0, x1, height, dropHeight) {
  const g = group(0, 0, 0);
  const frameC = COLORS.frame;
  const stone = COLORS.baseCourse;
  const w = x1 - x0;
  const cx = (x0 + x1) / 2;
  const z = -STAIR_WIDTH;
  const bottom = -dropHeight;
  const fullH = height - bottom;
  put(g, box(w + ROOM.wallT, 0.3, STAIR_WIDTH + 0.2, stone, { rough: 0.9, cast: false }), cx, height + 0.15, z);
  const cols = Math.max(2, Math.round(w / 2.6));
  const colW = w / cols;
  for (let i = 0; i <= cols; i++) {
    put(g, box(0.1, fullH, 0.16, frameC, { rough: 0.5, metal: 0.4, cast: false }), x0 + i * colW, (height + bottom) / 2, z);
  }
  put(g, box(w, 0.1, 0.16, frameC, { rough: 0.5, metal: 0.4, cast: false }), cx, height, z);
  for (let i = 0; i < cols; i++) {
    const pane = new THREE21.Mesh(
      new THREE21.PlaneGeometry(colW - 0.14, fullH - 0.16),
      new THREE21.MeshStandardMaterial({
        color: COLORS.glass ?? 11061468,
        transparent: true,
        opacity: 0.22,
        roughness: 0.08,
        metalness: 0
      })
    );
    pane.position.set(x0 + (i + 0.5) * colW, (height + bottom) / 2, z + 0.05);
    g.add(pane);
  }
  return g;
}
function buildStairwellRail(x0, x1, season = "autumn") {
  const g = group(0, 0, 0);
  const iron = COLORS.metalDark ?? COLORS.frame;
  const w = x1 - x0;
  const cx = (x0 + x1) / 2;
  put(g, box(w, 0.06, 0.06, iron, { rough: 0.5, metal: 0.55, cast: false }), cx, FLOOR_TOP + BALCONY_RAIL_H, 0);
  const balusters = Math.max(3, Math.round(w / 0.55));
  for (let i = 0; i <= balusters; i++) {
    put(g, box(0.05, BALCONY_RAIL_H, 0.05, iron, { rough: 0.5, metal: 0.55, cast: false }), x0 + i / balusters * w, FLOOR_TOP + BALCONY_RAIL_H / 2, 0);
  }
  put(g, buildWindowTrough({ width: Math.min(1.8, w - 0.6), season }), cx, FLOOR_TOP - 0.02, -0.08);
  put(g, box(0.1, BALCONY_RAIL_H, 0.1, iron, { rough: 0.45, metal: 0.6, cast: false }), x1, FLOOR_TOP + BALCONY_RAIL_H / 2, 0);
  return g;
}
var CAR_SPEED = 9.5;
var CAR_DOOR_TIME = 0.75;
var CAR_MIN_DWELL = 1.6;
function buildElevator(cx, yFloor, w, h, { storeysBelow = 3 } = {}) {
  const g = group(cx, yFloor, 0);
  const parkFloors = [];
  for (let f = -Math.max(1, storeysBelow); f <= -1; f++) parkFloors.push(f);
  const frameC = COLORS.frame;
  const shaftDepth = DOOR.stoopDepth + 0.4;
  const halfW = w / 2;
  const jambT = 0.34;
  const LAP = 0.06;
  const left = box(jambT + LAP, h + jambT, 0.7, frameC);
  left.position.set(-halfW - jambT / 2 + LAP / 2, (h + jambT) / 2, 0);
  const right = box(jambT + LAP, h + jambT, 0.7, frameC);
  right.position.set(halfW + jambT / 2 - LAP / 2, (h + jambT) / 2, 0);
  const headBottom = h - LAP;
  const headTop = h + jambT - 0.03;
  const head = box(w - LAP * 2 + 0.08, headTop - headBottom, 0.7, frameC);
  head.position.set(0, (headBottom + headTop) / 2, 0);
  g.add(left, right, head);
  put(g, box(w + 0.08, 0.12, 0.8, 7304572, { rough: 0.5, metal: 0.5, cast: false }), 0, 0.06, 0);
  const lampMat = mat(3817544, { rough: 0.4, emissive: 16763498, emissiveIntensity: 0 });
  const lamp = new THREE21.Mesh(new THREE21.BoxGeometry(0.9, 0.26, 0.12), lampMat);
  lamp.position.set(0, h + 0.72, 0.3);
  g.add(lamp);
  const shaftBottom = (Math.min(...parkFloors) - 0.5) * STOREY_H;
  const shaftTop = h + 1.6;
  const shaftH = shaftTop - shaftBottom;
  const shaftY = shaftBottom + shaftH / 2;
  put(g, box(w + jambT * 2, shaftH, 0.3, COLORS.facadeLower, { rough: 0.85 }), 0, shaftY, -shaftDepth);
  put(g, box(0.3, shaftH, shaftDepth, COLORS.facadeLower, { rough: 0.85 }), -halfW - jambT, shaftY, -shaftDepth / 2);
  for (const cz of [-0.15, -shaftDepth + 0.15]) {
    put(g, box(0.26, shaftH, 0.26, frameC, { rough: 0.6, metal: 0.4, cast: false }), halfW + jambT, shaftY, cz);
  }
  for (let ty = shaftBottom + STOREY_H; ty < shaftTop; ty += STOREY_H) {
    put(g, box(0.22, 0.22, shaftDepth, frameC, { rough: 0.6, metal: 0.4, cast: false }), halfW + jambT, ty, -shaftDepth / 2);
  }
  const car = group(0, 0, 0);
  const carH = h + 0.5;
  const carW = w + 0.1;
  const carD = shaftDepth - 0.4;
  const carZ = -carD / 2 - 0.2;
  const SIDE_T = 0.12;
  const FLOOR_BITE = 0.07;
  const CEIL_BITE = 0.09;
  const BACK_BITE = 0.05;
  const carFloor = box(
    carW - FLOOR_BITE * 2,
    0.22,
    carD,
    9278619,
    { rough: 0.5, metal: 0.3, cast: false }
  );
  carFloor.position.set(0, 0, carZ);
  carFloor.receiveShadow = true;
  car.add(carFloor);
  put(car, box(carW - CEIL_BITE * 2, 0.18, carD, 8291724, { rough: 0.6, cast: false }), 0, carH, carZ);
  put(car, box(carW - BACK_BITE * 2, carH, 0.12, 10133928, { rough: 0.55, cast: false }), 0, carH / 2, carZ - carD / 2);
  for (const sx of [-1, 1]) {
    put(car, box(SIDE_T, carH, carD - 0.08, 9673377, { rough: 0.55, cast: false }), sx * (carW - SIDE_T) / 2, carH / 2, carZ);
  }
  const carLight = box(carW * 0.6, 0.06, carD * 0.5, 16773848, {
    rough: 0.3,
    emissive: 16770736,
    emissiveIntensity: 0.9,
    cast: false
  });
  carLight.position.set(0, carH - 0.14, carZ);
  car.add(carLight);
  const rail = cyl(0.05, 0.05, carW * 0.7, 13225684, { segments: 8, metal: 0.8, rough: 0.3, cast: false });
  rail.rotation.z = Math.PI / 2;
  rail.position.set(0, carH * 0.42, carZ - carD / 2 + 0.18);
  car.add(rail);
  g.add(car);
  const SEAM = 0.015;
  const leafW = halfW - SEAM;
  const leafBottom = 0.02;
  const leafTop = h + 0.04;
  const panels = [];
  for (const sx of [-1, 1]) {
    const panel = box(
      leafW,
      leafTop - leafBottom,
      0.14,
      11975875,
      { rough: 0.4, metal: 0.45, cast: false }
    );
    const home = sx * (halfW + SEAM) / 2;
    panel.position.set(home, (leafBottom + leafTop) / 2, 0);
    put(panel, box(0.05, h - 0.6, 0.06, 9146776, { rough: 0.5, cast: false }), -sx * (halfW / 2 - 0.12), 0, 0.06);
    g.add(panel);
    panels.push({ mesh: panel, dir: sx, home });
  }
  const pickPark = () => pick(parkFloors) * STOREY_H;
  const handle = {
    id: "elevator",
    kind: "elevator",
    // 'away' parked elsewhere | 'arriving' | 'open' | 'closing' | 'departing'
    state: "away",
    carY: pickPark(),
    targetY: 0,
    doorT: 0,
    _hold: 0,
    _dwell: 0,
    /** True only when the car is here and the doors are wide enough to walk through. */
    get ready() {
      return this.state === "open" && this.doorT > 0.9;
    },
    /** Summon the car to this floor. Safe to call repeatedly. */
    call() {
      if (this.state === "away" || this.state === "departing") {
        this.state = "arriving";
        this.targetY = 0;
      }
      if (this.state === "closing") this.state = "open";
    },
    /**
     * Door-compatible API so the agent layer can treat this like the swinging
     * door: asking it to open also summons it.
     */
    requestOpen(seconds = 0.9) {
      this._hold = Math.max(this._hold, seconds);
      this.call();
    },
    update(dt) {
      if (this._hold > 0) this._hold -= dt;
      switch (this.state) {
        case "arriving":
        case "departing": {
          const dy = this.targetY - this.carY;
          const step = Math.sign(dy) * Math.min(Math.abs(dy), CAR_SPEED * dt);
          this.carY += step;
          if (Math.abs(this.targetY - this.carY) < 0.02) {
            this.carY = this.targetY;
            if (this.state === "arriving") {
              this.state = "open";
              this._dwell = CAR_MIN_DWELL;
            } else {
              this.state = "away";
            }
          }
          break;
        }
        case "open":
          this.doorT = Math.min(1, this.doorT + dt / CAR_DOOR_TIME);
          this._dwell -= dt;
          if (this.doorT >= 1 && this._hold <= 0 && this._dwell <= 0) this.state = "closing";
          break;
        case "closing":
          this.doorT = Math.max(0, this.doorT - dt / CAR_DOOR_TIME);
          if (this.doorT <= 0) {
            this.state = "departing";
            let next = pickPark();
            if (next === this.carY) next = pickPark();
            this.targetY = next;
          }
          break;
        case "away":
          break;
      }
      car.position.y = this.carY;
      const slide = (halfW - 0.06) * this.doorT;
      for (const p of panels) p.mesh.position.x = p.home + p.dir * slide;
      lampMat.emissiveIntensity = this.carY === 0 ? 0.95 : 0;
    }
  };
  return { obj: g, handle };
}
var DESK_TOP_Y = 1.58;
var BALUSTRADE_T = 0.16;
function buildEdgeBalustrade() {
  const g = group(0, 0, 0);
  const T = BALUSTRADE_T;
  const SHOE_H = 0.14;
  const CAP_H = 0.07;
  const shoeBottom = FLOOR_TOP - 0.03;
  const capTop = DESK_TOP_Y;
  const run = (cx, cz, w, d) => {
    put(g, box(w, SHOE_H + 0.03, d, 9147033, { rough: 0.45, metal: 0.55, cast: false }), cx, shoeBottom + (SHOE_H + 0.03) / 2, cz);
    put(g, box(w, CAP_H, d, 10134185, { rough: 0.4, metal: 0.6, cast: false }), cx, capTop - CAP_H / 2, cz);
    const paneBottom = shoeBottom + SHOE_H - 0.02;
    const paneTop = capTop - CAP_H + 0.02;
    const pane = new THREE21.Mesh(
      new THREE21.BoxGeometry(w, paneTop - paneBottom, d * 0.3),
      new THREE21.MeshStandardMaterial({
        color: COLORS.glass,
        transparent: true,
        opacity: 0.18,
        roughness: 0.08,
        metalness: 0
      })
    );
    pane.position.set(cx, (paneBottom + paneTop) / 2, cz);
    g.add(pane);
  };
  const xEdge = ROOM.W - T / 2;
  const zEdge = ROOM.D - T / 2;
  const zFrom = ROOM.wallT / 2;
  const xFrom = ROOM.wallT / 2;
  run(xEdge, (zFrom + ROOM.D) / 2, T, ROOM.D - zFrom);
  run((xFrom + ROOM.W - T) / 2, zEdge, ROOM.W - T - xFrom, T);
  return g;
}
var BALCONY_LEDGE_D = 0.85;
var BALCONY_RAIL_H = 0.95;
function buildEdgeBalcony(season = "autumn") {
  const g = group(0, 0, 0);
  const stone = COLORS.baseCourse;
  const iron = COLORS.metalDark ?? COLORS.frame;
  const T = BALCONY_LEDGE_D;
  const railTopY = FLOOR_TOP + BALCONY_RAIL_H;
  const railMidY = FLOOR_TOP + BALCONY_RAIL_H / 2;
  const lipX = ROOM.W + T - 0.04;
  const lipZ = ROOM.D + T - 0.04;
  const zNear = 0;
  const xWall = -ROOM.wallT / 2;
  const ledgeX = box(T, 0.22, lipZ - zNear + T, stone, { rough: 0.9, cast: false });
  ledgeX.position.set(ROOM.W + T / 2, FLOOR_TOP - 0.11, (zNear + lipZ) / 2);
  ledgeX.receiveShadow = true;
  g.add(ledgeX);
  const ledgeZ = box(lipX - xWall + T, 0.22, T, stone, { rough: 0.9, cast: false });
  ledgeZ.position.set((xWall + lipX) / 2, FLOOR_TOP - 0.11, ROOM.D + T / 2);
  ledgeZ.receiveShadow = true;
  g.add(ledgeZ);
  put(g, box(0.06, 0.06, lipZ - zNear, iron, { rough: 0.5, metal: 0.55, cast: false }), lipX, railTopY, (zNear + lipZ) / 2);
  const balustersX = Math.max(3, Math.round((lipZ - zNear) / 0.55));
  for (let i = 0; i <= balustersX; i++) {
    put(g, box(0.05, BALCONY_RAIL_H, 0.05, iron, { rough: 0.5, metal: 0.55, cast: false }), lipX, railMidY, zNear + i / balustersX * (lipZ - zNear));
  }
  put(g, box(lipX - xWall, 0.06, 0.06, iron, { rough: 0.5, metal: 0.55, cast: false }), (xWall + lipX) / 2, railTopY, lipZ);
  const balustersZ = Math.max(3, Math.round((lipX - xWall) / 0.55));
  for (let i = 0; i <= balustersZ; i++) {
    put(g, box(0.05, BALCONY_RAIL_H, 0.05, iron, { rough: 0.5, metal: 0.55, cast: false }), xWall + i / balustersZ * (lipX - xWall), railMidY, lipZ);
  }
  put(g, box(0.1, BALCONY_RAIL_H, 0.1, iron, { rough: 0.45, metal: 0.6, cast: false }), lipX, railMidY, lipZ);
  const wrapLen = 1.1;
  put(g, box(0.06, 0.06, wrapLen, iron, { rough: 0.5, metal: 0.55, cast: false }), xWall, railTopY, lipZ - wrapLen / 2);
  const wrapBalusters = Math.max(2, Math.round(wrapLen / 0.55));
  for (let i = 0; i <= wrapBalusters; i++) {
    put(g, box(0.05, BALCONY_RAIL_H, 0.05, iron, { rough: 0.5, metal: 0.55, cast: false }), xWall, railMidY, lipZ - i / wrapBalusters * wrapLen);
  }
  put(g, box(0.1, BALCONY_RAIL_H, 0.1, iron, { rough: 0.45, metal: 0.6, cast: false }), xWall, railMidY, lipZ);
  const stubX0 = xWall - T / 2;
  const stubX1 = 0;
  const stubZ0 = lipZ - wrapLen;
  const stubZ1 = ROOM.D;
  put(g, box(stubX1 - stubX0, 0.22, stubZ1 - stubZ0, stone, { rough: 0.9, cast: false }), (stubX0 + stubX1) / 2, FLOOR_TOP - 0.11, (stubZ0 + stubZ1) / 2);
  const potEvery = 3.6;
  const potX = ROOM.W + T / 2 + 0.08;
  const potsAlongX = Math.max(1, Math.floor(ROOM.D / potEvery));
  for (let i = 0; i < potsAlongX; i++) {
    const width = Math.min(1.9, ROOM.D / potsAlongX - 0.5);
    const trough = buildWindowTrough({ width, season });
    trough.rotation.y = Math.PI / 2;
    trough.position.set(potX, FLOOR_TOP - 0.02, (i + 0.5) / potsAlongX * ROOM.D);
    g.add(trough);
  }
  const potZ = ROOM.D + T / 2 + 0.08;
  const potsAlongZ = Math.max(1, Math.floor(ROOM.W / potEvery));
  for (let i = 0; i < potsAlongZ; i++) {
    const width = Math.min(1.9, ROOM.W / potsAlongZ - 0.5);
    put(g, buildWindowTrough({ width, season }), (i + 0.5) / potsAlongZ * ROOM.W, FLOOR_TOP - 0.02, potZ);
  }
  return g;
}
function buildStaircase({ groundY, steps, riser, run, xTop, pitch }, style) {
  const g = group(0, 0, 0);
  const treadC = style?.tread ?? COLORS.woodMid;
  const postC = style?.post ?? COLORS.woodDark;
  const railC = style?.rail ?? COLORS.woodDark;
  const capRailC = style?.rail ?? 11569754;
  const balusterC = style?.baluster ?? 11569754;
  for (let i = 0; i < steps; i++) {
    const bottom = -riser * (i + 1);
    const x = xTop + (i + 0.5) * STAIR_TREAD;
    const step = box(
      STAIR_TREAD * 1.02,
      riser,
      STAIR_WIDTH,
      treadC,
      { rough: 0.9, cast: false }
    );
    step.position.set(x, bottom + riser / 2, STAIR_Z);
    step.receiveShadow = true;
    g.add(step);
    if (i % STAIR_POST_EVERY === 0 && i > 0) {
      const h = bottom - groundY;
      put(g, box(0.18, h, 0.18, postC, { rough: 0.9, cast: false }), x, groundY + h / 2, STAIR_Z - STAIR_WIDTH / 2 + 0.14);
    }
  }
  const midX = xTop + run / 2;
  const midY = -riser * steps / 2;
  const sloped = (h, y, z, colour) => {
    const beam = box(
      Math.hypot(run, riser * steps),
      h,
      0.16,
      colour,
      { rough: 0.85, cast: false }
    );
    beam.position.set(midX, y, z);
    beam.rotation.z = -pitch;
    g.add(beam);
    return beam;
  };
  const noseY = midY + riser / 2;
  sloped(0.34, noseY - 0.42, STAIR_Z - STAIR_WIDTH / 2 + 0.08, railC);
  sloped(0.12, noseY + STAIR_RAIL_H, STAIR_Z - STAIR_WIDTH / 2 + 0.08, capRailC);
  for (let i = 0; i < steps; i += STAIR_POST_EVERY) {
    const top = -riser * i;
    const baluster = box(0.1, STAIR_RAIL_H, 0.1, balusterC, { rough: 0.8, cast: false });
    baluster.position.set(
      xTop + (i + 0.5) * STAIR_TREAD,
      top + STAIR_RAIL_H / 2,
      STAIR_Z - STAIR_WIDTH / 2 + 0.08
    );
    g.add(baluster);
  }
  const pad = box(
    STAIR_TREAD * 3,
    0.2,
    STAIR_WIDTH + 0.4,
    COLORS.baseCourse,
    { rough: 0.95, cast: false }
  );
  pad.position.set(xTop + run + STAIR_TREAD, groundY + 0.1, STAIR_Z);
  pad.receiveShadow = true;
  g.add(pad);
  return g;
}
function buildStoop(isInterior = false) {
  const g = group(0, 0, 0);
  const w = DOOR.width + 2.6;
  const d = DOOR.stoopDepth;
  const landing = box(w, 1.4, d, isInterior ? COLORS.facadeLower : COLORS.baseboard, {
    rough: 0.95,
    cast: false
  });
  landing.position.set(DOOR.x, FLOOR_TOP - 0.7, -d / 2);
  landing.receiveShadow = true;
  g.add(landing);
  put(g, box(w + 0.3, 0.28, d + 0.3, COLORS.woodMid, { rough: 0.9, cast: false }), DOOR.x, -0.62, -d / 2);
  if (!isInterior) {
    for (const s of stoopSteps()) {
      const step = box(s.width, 0.42, 0.7, COLORS.sidewalk, { rough: 1, cast: false });
      step.position.set(DOOR.x, s.y, s.z);
      step.receiveShadow = true;
      g.add(step);
    }
  }
  put(g, box(1.8, 0.06, 1, 7035460, { rough: 1, cast: false }), DOOR.x, 0.13, -0.9);
  return g;
}

// dist/ui/roving/src/scene/globe.js
import * as THREE22 from "three";
var OCEAN = "#2f6f9e";
var LAND = "#5f9e63";
var COAST2 = "#3f7d4a";
var GRATICULE = "rgba(255, 255, 255, 0.09)";
var SPIN_SPEED = 0.5;
var SPIN_SECONDS = 6;
var EASE = 1.4;
var TILT = 23.4 * Math.PI / 180;
var LANDMASSES = [
  // North America, Alaska round to the Pacific coast via Central America.
  [
    [-168, 65],
    [-160, 71],
    [-140, 70],
    [-120, 71],
    [-100, 73],
    [-85, 70],
    [-75, 68],
    [-60, 60],
    [-55, 51],
    [-65, 45],
    [-70, 42],
    [-75, 36],
    [-81, 31],
    [-80, 26],
    [-85, 30],
    [-90, 29],
    [-97, 26],
    [-95, 19],
    [-88, 21],
    [-87, 16],
    [-83, 9],
    [-78, 8],
    [-83, 13],
    [-92, 15],
    [-100, 17],
    [-106, 21],
    [-110, 24],
    [-114, 28],
    [-117, 32],
    [-122, 37],
    [-124, 43],
    [-125, 48],
    [-133, 55],
    [-145, 60],
    [-152, 58],
    [-162, 59],
    [-168, 65]
  ],
  // South America.
  [
    [-81, 8],
    [-76, 11],
    [-70, 12],
    [-62, 10],
    [-52, 5],
    [-45, -2],
    [-35, -6],
    [-38, -13],
    [-42, -23],
    [-48, -26],
    [-58, -35],
    [-62, -40],
    [-66, -46],
    [-69, -52],
    [-74, -53],
    [-73, -45],
    [-71, -33],
    [-70, -18],
    [-76, -14],
    [-81, -6],
    [-81, 8]
  ],
  // Africa.
  [
    [-17, 15],
    [-10, 28],
    [0, 36],
    [10, 37],
    [20, 32],
    [32, 31],
    [35, 23],
    [38, 18],
    [43, 12],
    [51, 12],
    [48, 5],
    [42, -2],
    [40, -10],
    [35, -18],
    [33, -25],
    [27, -33],
    [20, -35],
    [15, -28],
    [12, -18],
    [9, -5],
    [1, 5],
    [-8, 5],
    [-13, 10],
    [-17, 15]
  ],
  // Eurasia: Iberia round the Arctic coast, then back along the south through
  // south-east Asia, the Indian peninsula and Arabia — the two shapes that make
  // the southern edge legible at a glance.
  [
    [-10, 36],
    [-9, 43],
    [-2, 48],
    [3, 51],
    [7, 54],
    [10, 57],
    [5, 60],
    [12, 65],
    [20, 70],
    [30, 70],
    [45, 68],
    [60, 72],
    [75, 73],
    [90, 75],
    [105, 77],
    [120, 73],
    [135, 72],
    [150, 70],
    [165, 68],
    [178, 66],
    [172, 61],
    [160, 58],
    [150, 46],
    [140, 42],
    [135, 35],
    [122, 30],
    [118, 22],
    [108, 18],
    [105, 10],
    [100, 13],
    [98, 8],
    [95, 16],
    [92, 22],
    [88, 21],
    [87, 15],
    [80, 13],
    [77, 8],
    [73, 16],
    [70, 22],
    [65, 25],
    [60, 25],
    [57, 26],
    [58, 22],
    [55, 17],
    [52, 14],
    [45, 13],
    [43, 18],
    [40, 21],
    [37, 25],
    [35, 29],
    [34, 31],
    [36, 36],
    [28, 40],
    [20, 42],
    [14, 45],
    [3, 42],
    [-5, 36],
    [-10, 36]
  ],
  // Australia.
  [
    [114, -22],
    [122, -18],
    [130, -12],
    [137, -12],
    [142, -11],
    [146, -19],
    [150, -25],
    [153, -28],
    [150, -37],
    [145, -38],
    [140, -38],
    [130, -32],
    [125, -33],
    [115, -34],
    [114, -22]
  ],
  // Antarctica, as a band closed off along the bottom edge.
  [
    [-180, -71],
    [-150, -76],
    [-110, -74],
    [-70, -66],
    [-40, -71],
    [-10, -70],
    [20, -70],
    [60, -67],
    [100, -66],
    [140, -67],
    [170, -72],
    [180, -71],
    [180, -90],
    [-180, -90],
    [-180, -71]
  ],
  // Greenland.
  [[-45, 60], [-30, 68], [-25, 75], [-35, 83], [-55, 82], [-60, 76], [-55, 68], [-45, 60]],
  // Islands worth the four points they cost, for orientation.
  [[-5, 50], [-3, 53], [-5, 57], [-2, 58], [1, 53], [1, 51], [-5, 50]],
  // Britain & Ireland
  [[130, 31], [136, 34], [140, 36], [142, 41], [146, 44], [141, 45], [138, 37], [133, 33], [130, 31]],
  // Japan
  [[43, -12], [50, -15], [50, -25], [45, -25], [43, -16], [43, -12]],
  // Madagascar
  [[172, -34], [177, -38], [178, -38], [174, -41], [170, -46], [167, -46], [170, -41], [172, -34]],
  // New Zealand
  [[95, 5], [100, 2], [106, -6], [102, -6], [97, 0], [95, 5]],
  // Sumatra
  [[109, 2], [115, 5], [119, 4], [117, -3], [110, -4], [109, 2]],
  // Borneo
  [[131, -1], [140, -2], [147, -6], [150, -9], [141, -9], [134, -5], [131, -1]],
  // New Guinea
  [[120, 14], [124, 17], [126, 10], [122, 6], [120, 14]]
  // Philippines
];
var _worldTexture = null;
function worldTexture() {
  if (_worldTexture) return _worldTexture;
  const W = 1024, H = 512;
  const canvas2 = document.createElement("canvas");
  canvas2.width = W;
  canvas2.height = H;
  const ctx = canvas2.getContext("2d");
  const x = (lon) => (lon + 180) / 360 * W;
  const y = (lat) => (90 - lat) / 180 * H;
  ctx.fillStyle = OCEAN;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = GRATICULE;
  ctx.lineWidth = 1.5;
  for (let lon = -180; lon <= 180; lon += 30) {
    ctx.beginPath();
    ctx.moveTo(x(lon), 0);
    ctx.lineTo(x(lon), H);
    ctx.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y(lat));
    ctx.lineTo(W, y(lat));
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.beginPath();
  ctx.moveTo(0, y(0));
  ctx.lineTo(W, y(0));
  ctx.stroke();
  ctx.fillStyle = LAND;
  ctx.strokeStyle = COAST2;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  for (const ring of LANDMASSES) {
    ctx.beginPath();
    ring.forEach(([lon, lat], i) => i ? ctx.lineTo(x(lon), y(lat)) : ctx.moveTo(x(lon), y(lat)));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  _worldTexture = new THREE22.CanvasTexture(canvas2);
  _worldTexture.colorSpace = THREE22.SRGBColorSpace;
  _worldTexture.wrapS = THREE22.RepeatWrapping;
  _worldTexture.__shared = true;
  return _worldTexture;
}
function buildGlobe({ radius = 0.6 } = {}) {
  const g = group(0, 0, 0);
  const footH = radius * 0.167;
  const postH = radius * 0.267;
  const foot = cyl(radius * 0.5, radius * 0.633, footH, 8018488, { segments: 16, rough: 0.65 });
  foot.position.y = footH / 2;
  const post = cyl(radius * 0.093, radius * 0.093, postH, 11570495, { segments: 10, rough: 0.35, metal: 0.65 });
  post.position.y = footH + postH / 2;
  g.add(foot, post);
  const ringRadius = radius * 1.15;
  const holder = group(0, footH + postH + ringRadius, 0);
  holder.rotation.z = -TILT;
  g.add(holder);
  const ring = new THREE22.Mesh(
    new THREE22.TorusGeometry(ringRadius, radius * 0.053, 8, 44),
    mat(11570495, { rough: 0.35, metal: 0.65 })
  );
  ring.castShadow = true;
  holder.add(ring);
  const world2 = new THREE22.Mesh(
    new THREE22.SphereGeometry(radius, 28, 20),
    new THREE22.MeshStandardMaterial({ map: worldTexture(), roughness: 0.55, metalness: 0.05 })
  );
  world2.castShadow = true;
  world2.receiveShadow = true;
  holder.add(world2);
  const handle = {
    id: "globe",
    kind: "globe",
    spinning: false,
    _velocity: 0,
    _remaining: 0,
    /**
     * Set it turning, because somebody is looking something up.
     *
     * Repeat calls extend rather than restart, so two agents researching at once
     * keeps it going smoothly instead of making it lurch.
     * @param {number} [seconds]
     */
    spin(seconds = SPIN_SECONDS) {
      this._remaining = Math.max(this._remaining, seconds);
    },
    update(dt) {
      this._remaining = Math.max(0, this._remaining - dt);
      const target = this._remaining > 0 ? SPIN_SPEED : 0;
      this._velocity += (target - this._velocity) * Math.min(1, dt * EASE);
      if (this._velocity < 1e-4) {
        this._velocity = 0;
        this.spinning = false;
        return;
      }
      this.spinning = true;
      world2.rotation.y += this._velocity * dt;
    }
  };
  return { obj: g, handle };
}

// dist/ui/roving/src/scene/movables.js
function unbuild(m) {
  m.teardown?.();
  m.obj.parent?.remove(m.obj);
  releaseGeometry(m.obj);
}
function releaseGeometry(root) {
  root.traverse((o) => o.geometry?.dispose?.());
}
function movable(obj, key, { label: label2, spec, relocate, teardown }) {
  obj.userData.movable = { key, label: label2, spec, obj, relocate, teardown };
  return obj;
}
function movables(root) {
  const found = [];
  root.traverse((o) => {
    if (o.userData?.movable) found.push(o.userData.movable);
  });
  return found;
}
function place(obj, station2) {
  obj.position.set(station2.x, 0, station2.z);
  obj.rotation.y = (station2.lookRotation ?? 0) + Math.PI;
  return obj;
}
function placed(obj, spec, label2, teardown = void 0) {
  return movable(obj, `station:${spec.id}`, {
    label: label2,
    spec,
    relocate: () => place(obj, spec),
    teardown
  });
}
function drop(list, item) {
  const i = list.indexOf(item);
  if (i >= 0) list.splice(i, 1);
}

// dist/ui/roving/src/scene/props/bookshelf.js
function buildBookshelf() {
  const g = group(0, 0, 0);
  const W = 2.4, H = 4.4, D = 1;
  const frameC = 13150318;
  const left = box(0.15, H, D, frameC);
  left.position.set(-W / 2, H / 2, 0);
  const right = box(0.15, H, D, frameC);
  right.position.set(W / 2, H / 2, 0);
  const topP = box(W, 0.15, D, frameC);
  topP.position.set(0, H, 0);
  const botP = box(W, 0.15, D, frameC);
  botP.position.set(0, 0.08, 0);
  const backP = box(W, H, 0.08, 12163683);
  backP.position.set(0, H / 2, -D / 2 + 0.05);
  g.add(left, right, topP, botP, backP);
  const books = [];
  for (let s = 1; s <= 4; s++) {
    const y = H / 5 * s;
    put(g, box(W - 0.2, 0.1, D - 0.2, frameC, { rough: 0.7 }), 0, y, 0);
    let bx = -W / 2 + 0.25;
    while (bx < W / 2 - 0.35) {
      const bw = spread(0.12, 0.14);
      const bh = spread(0.5, 0.45);
      const c = pick(BOOK_COLORS);
      const bk = put(g, box(bw, bh, D - 0.4, c, { rough: 0.8 }), bx + bw / 2, y + 0.05 + bh / 2, 0);
      books.push({ mesh: bk, color: c, taken: false });
      bx += bw + 0.03;
    }
  }
  const handle = {
    id: "bookshelf",
    kind: "bookshelf",
    books,
    topY: H + 0.075,
    // where things can be stood on top of it
    topW: W,
    // ... and how much room there is up there, so a
    topD: D,
    //     caller can find a corner rather than guess
    /** Pull a book off the shelf; returns a token to return it later. */
    takeBook() {
      const available = books.filter((b2) => !b2.taken);
      if (!available.length) return null;
      const b = pick(available);
      b.taken = true;
      b.mesh.visible = false;
      return b;
    },
    returnBook(token) {
      if (!token) return;
      token.taken = false;
      token.mesh.visible = true;
    }
  };
  return { obj: g, handle };
}
var BOOK_COLORS = [12611919, 5208714, 9152648, 14201434, 10120018, 5925770, 12081754];
function mount(s, handles) {
  const { obj, handle } = buildBookshelf();
  place(obj, s);
  const globe = buildGlobe();
  globe.obj.position.set(0, handle.topY, 0);
  obj.add(globe.obj);
  put(obj, buildPothos(1.15, { sideDrop: 11 }), handle.topW / 2 - 0.3, handle.topY - 0.02, handle.topD / 2 - 0.24);
  const entry = { id: s.id, shelf: handle, globe: globe.handle };
  handles.bookshelves.push(entry);
  handles.byStation[s.id] = handle;
  return placed(obj, s, "Bookshelf", () => drop(handles.bookshelves, entry));
}

// dist/ui/roving/src/scene/props/water-cooler.js
import * as THREE23 from "three";
function buildWaterCooler() {
  const g = group(0, 0, 0);
  put(g, box(0.92, 1.15, 0.72, COLORS.coolerBody, { rough: 0.55 }), 0, 0.575);
  put(g, box(0.86, 0.12, 0.66, 10133670, { rough: 0.7, cast: false }), 0, 0.06);
  put(g, box(0.5, 0.34, 0.1, 7304829, { rough: 0.6, cast: false }), 0, 0.86, 0.37);
  for (const [sx, c] of [[-0.13, 4161471], [0.13, 12597547]]) {
    put(g, box(0.1, 0.16, 0.14, c, { rough: 0.4 }), sx, 0.9, 0.42);
  }
  put(g, box(0.46, 0.05, 0.2, 9409947, { rough: 0.5, cast: false }), 0, 0.7, 0.42);
  put(g, cyl(0.3, 0.34, 0.12, 12173253, { segments: 14, rough: 0.5 }), 0, 1.2);
  const bottle = new THREE23.Mesh(
    new THREE23.CylinderGeometry(0.36, 0.3, 0.78, 16),
    new THREE23.MeshStandardMaterial({
      color: COLORS.coolerWater,
      transparent: true,
      opacity: 0.75,
      roughness: 0.2,
      metalness: 0
    })
  );
  bottle.position.y = 1.66;
  bottle.castShadow = true;
  g.add(bottle);
  put(g, cyl(0.14, 0.24, 0.2, COLORS.coolerWater, { segments: 12, rough: 0.2 }), 0, 1.18);
  put(g, cyl(0.09, 0.09, 0.5, 14672871, { segments: 10, rough: 0.5 }), 0.55, 1, 0.1);
  const handle = { id: "waterCooler", kind: "waterCooler" };
  return { obj: g, handle };
}

// dist/ui/roving/src/scene/props/coffee-station.js
function buildCoffeeStation() {
  const g = group(0, 0, 0);
  const cab = box(2.86, 1.5, 1.6, "woodMid", { rough: 0.7 });
  cab.position.set(0, 0.75, 0.2);
  g.add(cab);
  const worktop = box(3.02, 0.12, 1.72, 4869973, { rough: 0.45 });
  worktop.position.set(0, 1.56, 0.2);
  g.add(worktop);
  for (const sx of [-0.715, 0.715]) {
    const door = box(1.235, 1.1, 0.06, 8015664, { rough: 0.7, cast: false });
    door.position.set(sx, 0.78, 1.01);
    g.add(door);
    const knob = cyl(0.04, 0.04, 0.08, 12557125, { segments: 8, metal: 0.7 });
    knob.rotation.x = Math.PI / 2;
    knob.position.set(sx + 0.455, 0.78, 1.06);
    g.add(knob);
  }
  put(g, buildEspressoMachine(), -0.36, 1.62, -0.05);
  const grinderC = 13225425;
  const grinder = group(0.78, 1.62, -0.1);
  const gBody = cyl(0.15, 0.15, 0.42, grinderC, { segments: 14, metal: 0.75, rough: 0.22 });
  gBody.position.y = 0.21;
  grinder.add(gBody);
  const dial = cyl(0.17, 0.17, 0.05, 2830134, { segments: 14, metal: 0.5, rough: 0.35 });
  dial.position.y = 0.35;
  grinder.add(dial);
  const glass = cyl(0.13, 0.13, 0.22, 13624298, { segments: 14, rough: 0.08, metal: 0.1 });
  glass.position.y = 0.53;
  grinder.add(glass);
  const grounds = cyl(0.115, 0.12, 0.15, 5913124, { segments: 14, rough: 0.95 });
  grounds.position.y = 0.495;
  grinder.add(grounds);
  const lid = cyl(0.09, 0.09, 0.04, 1843236, { segments: 14, rough: 0.4 });
  lid.position.y = 0.66;
  grinder.add(lid);
  const paddle = box(0.05, 0.08, 0.03, 1711136, { rough: 0.6 });
  paddle.position.set(0, 0.28, 0.16);
  grinder.add(paddle);
  const chute = box(0.07, 0.05, 0.08, 2830134, { rough: 0.4, metal: 0.4 });
  chute.position.set(0, 0.15, 0.15);
  grinder.add(chute);
  for (const sx of [-0.08, 0.08]) {
    const fork = box(0.03, 0.05, 0.16, grinderC, { metal: 0.6, rough: 0.3 });
    fork.position.set(sx, 0.07, 0.18);
    grinder.add(fork);
  }
  g.add(grinder);
  for (let i = 0; i < 3; i++) {
    put(g, cyl(0.11, 0.09, 0.2, COLORS.paper, { segments: 10 }), 1.05, 1.72 + i * 0.16, 0.3);
  }
  const handle = { id: "coffee", kind: "coffee" };
  return { obj: g, handle };
}
function buildEspressoMachine() {
  const bodyC = 13488596;
  const railC = 15133163;
  const machine = group(0, 0, 0);
  const chassis = box(1.5, 0.78, 0.85, bodyC, { rough: 0.32, metal: 0.6 });
  chassis.position.y = 0.39;
  machine.add(chassis);
  const topPlate = box(1.56, 0.1, 0.89, 11449272, { rough: 0.3, metal: 0.55 });
  topPlate.position.y = 0.83;
  machine.add(topPlate);
  const front = cyl(0.02, 0.02, 1.56, railC, { segments: 8, metal: 0.9, rough: 0.15 });
  front.rotation.z = Math.PI / 2;
  front.position.set(0, 0.9, 0.4);
  machine.add(front);
  for (const sx of [-0.76, 0.76]) {
    const side = cyl(0.02, 0.02, 0.8, railC, { segments: 8, metal: 0.9, rough: 0.15 });
    side.rotation.x = Math.PI / 2;
    side.position.set(sx, 0.9, 0);
    machine.add(side);
  }
  const CUPS = [
    { x: -0.58, tall: false, c: 14266508 },
    { x: -0.35, tall: true, c: COLORS.paper, stack: 2 },
    { x: -0.12, tall: true, c: COLORS.paper },
    { x: 0.12, tall: true, c: COLORS.paper, stack: 2 },
    { x: 0.35, tall: false, c: 12175792 },
    { x: 0.58, tall: true, c: COLORS.paper }
  ];
  for (const { x, tall, c, stack = 1 } of CUPS) {
    const h = tall ? 0.15 : 0.08;
    const saucer = cyl(tall ? 0.13 : 0.1, tall ? 0.13 : 0.1, 0.015, COLORS.paper, { segments: 10 });
    saucer.position.set(x, 0.89, -0.14);
    machine.add(saucer);
    for (let i = 0; i < stack; i++) {
      const cup = cyl(tall ? 0.1 : 0.065, tall ? 0.085 : 0.055, h, c, { segments: 10 });
      cup.position.set(x, 0.9 + h * (0.5 + i * 0.4), -0.14);
      machine.add(cup);
    }
  }
  for (const sx of [-0.1, 0.1]) {
    const bezelG = cyl(0.09, 0.09, 0.02, 1316635, { segments: 12, rough: 0.4 });
    bezelG.rotation.x = Math.PI / 2;
    bezelG.position.set(sx, 0.62, 0.42);
    machine.add(bezelG);
    const gauge = cyl(0.075, 0.075, 0.025, 15262930, { segments: 12, rough: 0.3 });
    gauge.rotation.x = Math.PI / 2;
    gauge.position.set(sx, 0.62, 0.435);
    machine.add(gauge);
  }
  for (const sx of [-0.5, 0, 0.5]) {
    const groupHead = box(0.2, 0.2, 0.22, 11909565, { rough: 0.3, metal: 0.65 });
    groupHead.position.set(sx, 0.28, 0.42);
    machine.add(groupHead);
    const basket = cyl(0.095, 0.09, 0.1, 7304829, { segments: 12, metal: 0.6, rough: 0.35 });
    basket.position.set(sx, 0.17, 0.42);
    machine.add(basket);
    const pfHandle = box(0.26, 0.055, 0.055, 1711136, { rough: 0.6 });
    pfHandle.position.set(sx, 0.16, 0.63);
    machine.add(pfHandle);
    const paddle = box(0.16, 0.04, 0.05, 1711136, { rough: 0.5, metal: 0.3 });
    paddle.rotation.x = -0.3;
    paddle.position.set(sx, 0.42, 0.44);
    machine.add(paddle);
  }
  for (const sx of [-0.72, 0.72]) {
    const wand = cyl(0.03, 0.03, 0.42, 11909565, { segments: 8, metal: 0.75, rough: 0.2 });
    wand.rotation.x = 0.5;
    wand.position.set(sx, 0.28, 0.4);
    machine.add(wand);
  }
  const led = box(0.06, 0.06, 0.04, 16757575, {
    emissive: 16751918,
    emissiveIntensity: 0.9,
    rough: 0.4,
    cast: false
  });
  led.position.set(-0.72, 0.6, 0.41);
  machine.add(led);
  const tray = box(1.1, 0.05, 0.32, 9475738, { rough: 0.4, metal: 0.5 });
  tray.position.set(0, 0.08, 0.46);
  machine.add(tray);
  for (const sx of [-0.5, 0, 0.5]) {
    const servedCup = cyl(0.1, 0.08, 0.18, COLORS.paper, { segments: 10 });
    servedCup.position.set(sx, 0.19, 0.46);
    machine.add(servedCup);
  }
  return machine;
}

// dist/ui/roving/src/scene/props/mailbox.js
import * as THREE24 from "three";
var MB = {
  L: 1.5,
  // length along x
  W: 1,
  // width along z (also the dome diameter)
  H: 0.8,
  // height of the straight sides
  yBase: 1.15,
  // underside of the tube
  t: 0.07
  // shell thickness
};
var MAILBOX_LETTER_SLOTS = 6;
var MAILBOX_PARCEL_SLOTS = 5;
var PARCEL_STACK = { x: 0.34, z: 1.5 };
var PARCEL = 0.5;
var PARCEL_SLOTS = [
  { x: -0.23, y: 0, z: 0.01, r: 0.06 },
  { x: 0.22, y: 0, z: 0.06, r: -0.11 },
  { x: -0.18, y: 0.42, z: 0.03, r: -0.17 },
  { x: 0.24, y: 0.42, z: -0.04, r: 0.13 },
  { x: 0.03, y: 0.84, z: 0.01, r: 0.24 }
];
var FLAG_UP = 0;
var FLAG_DOWN = -1.45;
function buildMailbox() {
  const g = group(0, 0, 0);
  const post = box(0.25, 1.3, 0.25, "woodDark", { rough: 0.7 });
  post.position.y = 0.65;
  g.add(post);
  const { L, W, H, yBase, t } = MB;
  const R = W / 2;
  const yArch = yBase + H;
  const shell = { rough: 0.5, metal: 0.2 };
  put(g, box(L, t, W, "mailbox", shell), 0, yBase + t / 2);
  put(g, box(L - t, 0.02, W - 2 * t, 2373706, { rough: 0.85, cast: false }), 0, yBase + t + 0.01);
  for (const sz of [-1, 1]) {
    put(g, box(L, H, t, "mailbox", shell), 0, yBase + H / 2, sz * (R - t / 2));
  }
  const roundTop = new THREE24.Mesh(
    new THREE24.CylinderGeometry(R, R, L, 16, 1, true, 0, Math.PI),
    mat("mailbox", shell)
  );
  roundTop.material.side = THREE24.DoubleSide;
  roundTop.rotation.z = Math.PI / 2;
  roundTop.position.set(0, yArch, 0);
  roundTop.castShadow = true;
  g.add(roundTop);
  put(g, box(t, H, W, "mailbox", shell), -(L / 2 - t / 2), yBase + H / 2, 0);
  const rearDome = new THREE24.Mesh(
    new THREE24.CircleGeometry(R, 16, 0, Math.PI),
    mat("mailbox", { rough: 0.5, metal: 0.2, cast: false })
  );
  rearDome.material.side = THREE24.DoubleSide;
  rearDome.rotation.y = -Math.PI / 2;
  rearDome.position.set(-(L / 2 - t), yArch, 0);
  g.add(rearDome);
  const letters = [];
  for (let i = 0; i < MAILBOX_LETTER_SLOTS; i++) {
    const letter = group(0, 0, 0);
    const paper = box(0.62, 0.03, 0.44, COLORS.paper, {
      rough: 0.85,
      cast: false,
      emissive: 16774880,
      emissiveIntensity: 0.14
    });
    letter.add(paper);
    put(letter, box(0.28, 0.033, 0.44, 15129796, { rough: 0.85, cast: false }), 0.17, 1e-3, 0);
    put(letter, box(0.62, 0.034, 0.05, 13777723, { rough: 0.8, cast: false }), 0, 1e-3, 0.185);
    const flip = i % 2 ? 1 : -1;
    letter.position.set(
      0.62 - i * 0.05,
      yBase + t + 0.035 + i * 0.045,
      flip * 0.03
    );
    letter.rotation.y = flip * (0.05 + i * 0.015);
    letter.rotation.z = -0.05 - i * 0.01;
    letter.visible = false;
    g.add(letter);
    letters.push(letter);
  }
  const parcels = [];
  for (let i = 0; i < MAILBOX_PARCEL_SLOTS; i++) {
    const slot = PARCEL_SLOTS[i];
    const parcel = group(
      PARCEL_STACK.x + slot.x,
      slot.y + PARCEL / 2,
      PARCEL_STACK.z + slot.z
    );
    const w = PARCEL * (0.9 + i % 3 * 0.07);
    const d = PARCEL * (0.92 + i % 2 * 0.1);
    parcel.add(box(w, PARCEL, d, COLORS.parcel, { rough: 0.9 }));
    const tape = box(w * 0.13, PARCEL + 6e-3, d + 6e-3, COLORS.parcelTape, { rough: 0.8, cast: false });
    parcel.add(tape);
    put(parcel, box(w * 0.22, 4e-3, d * 0.16, 15261901, { rough: 0.9, cast: false }), -w * 0.22, PARCEL / 2 + 4e-3, d * 0.2);
    parcel.rotation.y = slot.r;
    parcel.visible = false;
    g.add(parcel);
    parcels.push(parcel);
  }
  const flagPivot = group(-0.45, 1.32, R + 0.03);
  const flagPole = box(0.06, 0.52, 0.05, 10132122, { cast: false });
  flagPole.position.y = 0.26;
  flagPivot.add(flagPole);
  const flag = box(0.34, 0.26, 0.04, 13777723, { cast: false });
  flag.position.set(0.19, 0.42, 0);
  flagPivot.add(flag);
  flagPivot.rotation.z = FLAG_DOWN;
  g.add(flagPivot);
  const handle = {
    id: "mailbox",
    kind: "mailbox",
    flagPivot,
    letters,
    parcels,
    deliveries: 0,
    _hold: 0,
    // Where a thrown parcel should come down, in the mailbox's own space. The
    // courier needs it and only this function knows where the pile was put.
    pileOffset: { x: PARCEL_STACK.x, y: PARCEL * 0.6, z: PARCEL_STACK.z },
    // What is waiting to be collected, by size. Not counted here: these are *told*
    // to us once a frame from the post model, which is the only thing that actually
    // knows. They used to be tallied here too, with every path that removed an
    // envelope obliged to call a matching `collect()` — four such paths, one of them
    // a `for` loop of compensations — and any new path that forgot left the flag
    // stuck up over an empty box. One source of truth is worth more than the frame
    // of latency this costs.
    waitingLetters: 0,
    waitingParcels: 0,
    /** Everything waiting, whatever shape it came in. */
    get pending() {
      return this.waitingLetters + this.waitingParcels;
    },
    /** An agent dropped finished work in — a brief flag raise for the outgoing. */
    deliver() {
      this.deliveries++;
      this._hold = 5;
    },
    /**
     * Tell the mailbox what the post model is holding.
     *
     * @param {number} lettersWaiting  envelopes in the tube
     * @param {number} parcelsWaiting  packages on the pile
     */
    setWaiting(lettersWaiting, parcelsWaiting) {
      if (lettersWaiting === this.waitingLetters && parcelsWaiting === this.waitingParcels) return;
      this.waitingLetters = lettersWaiting;
      this.waitingParcels = parcelsWaiting;
      for (let i = 0; i < letters.length; i++) letters[i].visible = i < lettersWaiting;
      for (let i = 0; i < parcels.length; i++) parcels[i].visible = i < parcelsWaiting;
    },
    update(dt) {
      if (this._hold > 0) this._hold -= dt;
      const up = this.pending > 0 || this._hold > 0;
      const target = up ? FLAG_UP : FLAG_DOWN;
      flagPivot.rotation.z += (target - flagPivot.rotation.z) * Math.min(1, dt * 6);
    }
  };
  return { obj: g, handle };
}
function mount2(s, handles) {
  const { obj, handle } = buildMailbox();
  handles.mailbox = handle;
  const relocate = () => mailboxRelocate(obj, handle, s);
  relocate();
  return movable(obj, `station:${s.id}`, { label: "Mailbox", spec: s, relocate });
}
function mailboxRelocate(obj, handle, station2) {
  const spin = station2.facing - Math.PI / 2;
  obj.position.set(station2.x, 0, station2.z);
  obj.rotation.y = spin;
  const s = Math.sin(spin), c = Math.cos(spin);
  const world2 = (dx, dz) => ({
    x: station2.x + dx * c + dz * s,
    z: station2.z - dx * s + dz * c
  });
  const slot = world2(0.6, 0);
  handle.slot = new THREE24.Vector3(slot.x, 1.5, slot.z);
  const pile = world2(handle.pileOffset.x, handle.pileOffset.z);
  handle.pile = new THREE24.Vector3(pile.x, handle.pileOffset.y, pile.z);
}

// dist/ui/roving/src/scene/props/bin.js
import * as THREE25 from "three";
function buildBin() {
  const g = group(0, 0, 0);
  const body = cyl(0.34, 0.29, 0.85, 2830134, { segments: 14, metal: 0.2, rough: 0.6 });
  body.position.y = 0.42;
  g.add(body);
  const lipRing = cyl(0.36, 0.36, 0.06, 3817544, { segments: 14, metal: 0.3 });
  lipRing.position.y = 0.86;
  g.add(lipRing);
  const crumples = [];
  for (let i = 0; i < 3; i++) {
    const ball = new THREE25.Mesh(
      new THREE25.IcosahedronGeometry(0.15, 0),
      mat(COLORS.paper, { flat: true, rough: 0.9 })
    );
    ball.position.set((i - 1) * 0.14, 0.9 + i * 0.05, i % 2 * 0.1);
    ball.visible = false;
    g.add(ball);
    crumples.push(ball);
  }
  const handle = {
    id: "bin",
    kind: "bin",
    discarded: 0,
    discard() {
      const slot = crumples[this.discarded % crumples.length];
      slot.visible = true;
      this.discarded++;
    }
  };
  return { obj: g, handle };
}

// dist/ui/roving/src/scene/props/inbox.js
function buildInbox() {
  const g = group(0, 0, 0);
  const mk = (x, z, s, rot) => {
    const b = group(x, 0, z);
    b.rotation.y = rot;
    const body = box(1.1 * s, 0.8 * s, 1.1 * s, 12557162, { rough: 0.95 });
    body.position.y = 0.4 * s;
    b.add(body);
    const tape = box(0.24 * s, 0.82 * s, 1.12 * s, 14271386, { rough: 0.9, cast: false });
    tape.position.y = 0.4 * s;
    b.add(tape);
    return b;
  };
  g.add(mk(-0.6, 0, 1, 0.15));
  g.add(mk(0.7, 0.25, 0.82, -0.3));
  const stacked = mk(-0.5, -0.1, 0.7, 0.5);
  stacked.position.y = 0.8;
  g.add(stacked);
  const handle = {
    id: "inbox",
    kind: "inbox",
    collected: 0,
    takePackage() {
      this.collected++;
      return true;
    }
  };
  return { obj: g, handle };
}

// dist/ui/roving/src/scene/props/coat-stand.js
function buildCoatStand() {
  const g = group(0, 0, 0);
  const BASE_H3 = 0.1;
  const base = cyl(0.35, 0.4, BASE_H3, "woodDark");
  base.position.y = footY(BASE_H3);
  g.add(base);
  const pole = cyl(0.06, 0.06, 3.4, "woodDark");
  pole.position.y = 1.7;
  g.add(pole);
  const hooks = [];
  const HOOKS = 6;
  for (let i = 0; i < HOOKS; i++) {
    const a = i / HOOKS * Math.PI * 2;
    const hook = box(0.4, 0.08, 0.08, "woodDark");
    hook.position.set(Math.cos(a) * 0.2, 3.3, Math.sin(a) * 0.2);
    hook.rotation.y = -a;
    g.add(hook);
    hooks.push({ angle: a, taken: false, coat: null });
  }
  const handle = {
    id: "coatStand",
    kind: "coatStand",
    hooks,
    /** Hang a coat in this agent's colour; returns the hook used. */
    addCoat(color) {
      const hook = hooks.find((h) => !h.taken);
      if (!hook) return null;
      const coat = box(0.66, 1.15, 0.32, color, { rough: 0.9 });
      coat.position.set(Math.cos(hook.angle) * 0.34, 2.45, Math.sin(hook.angle) * 0.34);
      coat.rotation.y = -hook.angle;
      g.add(coat);
      hook.taken = true;
      hook.coat = coat;
      return hook;
    },
    removeCoat(hook) {
      if (!hook || !hook.coat) return;
      g.remove(hook.coat);
      hook.coat.geometry.dispose?.();
      hook.taken = false;
      hook.coat = null;
    }
  };
  return { obj: g, handle };
}
function mount3(s, handles) {
  const { obj, handle } = buildCoatStand();
  const relocate = () => {
    obj.position.set(s.x, 0, s.z);
    obj.rotation.y = s.facing;
  };
  relocate();
  handles.coatStand = handle;
  return movable(obj, `station:${s.id}`, { label: "Coat stand", spec: s, relocate });
}

// dist/ui/roving/src/scene/props/couch.js
import * as THREE26 from "three";
var COUCH_SEAT_HEIGHT = 0.5;
var CUSHION_T = 0.16;
var BASE_BOTTOM = 0.02;
var BASE_H2 = COUCH_SEAT_HEIGHT - CUSHION_T - BASE_BOTTOM;
var BACK_Z = -0.9;
var FRONT_Z = 0.24;
var DEPTH = FRONT_Z - BACK_Z;
var CUSHION_FRONT_Z = 0.2;
var BACK_TOP = 1.15;
var ARM_TOP = 0.8;
var CUSHION_LIFT = 0.12;
var AUTO_ACCENT = 10466248;
function lighten(hex, by) {
  const lift = (shift2) => {
    const c = hex >> shift2 & 255;
    return Math.round(lerp(c, 255, by));
  };
  return lift(16) << 16 | lift(8) << 8 | lift(0);
}
function upholstery(color) {
  const chosen = SOFA_COLORS[color];
  const body = chosen ? chosen.hex : COLORS.couch;
  return { body, cushion: lighten(body, CUSHION_LIFT), accent: chosen ? chosen.accent : AUTO_ACCENT };
}
var COUCH_SHAPE = {
  width: 6.4,
  armX: [-2.95, 2.95],
  cushions: [-2, 0, 2],
  cushionW: 1.7,
  pillow: { x: -1.2, w: 0.8, tilt: 0.2 }
};
var ARMCHAIR_SHAPE = {
  width: 2.2,
  // A hair inside the base's outer faces: landing them exactly together would make
  // two same-facing planes contest the armchair's visible sides in the depth buffer.
  armX: [-0.84, 0.84],
  cushions: [0],
  cushionW: 1.3,
  pillow: { x: 0, w: 0.9, tilt: -0.08 }
};
function buildLoungeSeat(spec, shape) {
  const g = group(0, 0, 0);
  const paint = upholstery(spec.color);
  const c = paint.body;
  const base = put(g, box(shape.width, BASE_H2, DEPTH, c, { rough: 0.9 }), 0, BASE_BOTTOM + BASE_H2 / 2, BACK_Z + DEPTH / 2);
  const body = [base];
  const cushions = [];
  const backH = BACK_TOP - (COUCH_SEAT_HEIGHT - CUSHION_T);
  const back = put(g, box(shape.width, backH, 0.5, c, { rough: 0.9 }), 0, BACK_TOP - backH / 2, BACK_Z + 0.25);
  body.push(back);
  const armH = ARM_TOP - BASE_BOTTOM;
  for (const sx of shape.armX) {
    const arm = put(g, box(0.5, armH, DEPTH, c, { rough: 0.9 }), sx, BASE_BOTTOM + armH / 2, BACK_Z + DEPTH / 2);
    body.push(arm);
  }
  const cushionD = CUSHION_FRONT_Z - (BACK_Z + 0.5);
  for (const sx of shape.cushions) {
    const cu = put(g, box(shape.cushionW, CUSHION_T, cushionD, paint.cushion, { rough: 0.9 }), sx, COUCH_SEAT_HEIGHT - CUSHION_T / 2, CUSHION_FRONT_Z - cushionD / 2);
    cushions.push(cu);
  }
  const pillow = box(shape.pillow.w, 0.5, 0.22, paint.accent, { rough: 0.9 });
  pillow.position.set(shape.pillow.x, COUCH_SEAT_HEIGHT + 0.25, BACK_Z + 0.62);
  pillow.rotation.z = shape.pillow.tilt;
  g.add(pillow);
  g.userData.repaint = (next) => {
    const now = upholstery(next);
    for (const m of body) m.material = mat(now.body, { rough: 0.9 });
    for (const m of cushions) m.material = mat(now.cushion, { rough: 0.9 });
    pillow.material = mat(now.accent, { rough: 0.9 });
  };
  const handle = {
    id: spec.id,
    kind: spec.kind,
    seats: spec.seats.map((s, i) => ({
      index: i,
      position: new THREE26.Vector3(s.x, 0, s.z),
      // Where somebody stands to get into this seat, and steps back out to when
      // they leave it: the seat itself is inside the couch, so it is the only
      // route in or out that does not cross the furniture (see FURNITURE_KINDS
      // in config).
      front: new THREE26.Vector3(s.front.x, 0, s.front.z),
      rotation: s.rotation,
      occupiedBy: null
    })),
    approach: new THREE26.Vector3(spec.approach.x, 0, spec.approach.z),
    freeSeat() {
      return this.seats.find((s) => !s.occupiedBy) ?? null;
    },
    /**
     * The couch has been moved or turned: bring its cushions with it.
     *
     * Updated in place rather than rebuilt from the config's seats, and that is the whole
     * point of the method. A seat carries a booking — `occupiedBy` — and mapping a
     * fresh array over the config would hand back two empty seats and lose track of
     * whoever is sitting on them, so the couch would let a second person sit down in
     * an occupied cushion.
     */
    relocate() {
      for (const [i, seat] of this.seats.entries()) {
        const s = spec.seats[i];
        if (!s) continue;
        seat.position.set(s.x, 0, s.z);
        seat.front.set(s.front.x, 0, s.front.z);
        seat.rotation = s.rotation;
      }
      this.approach.set(spec.approach.x, 0, spec.approach.z);
    }
  };
  return { obj: g, handle };
}
function buildCouch(spec) {
  return buildLoungeSeat(spec, COUCH_SHAPE);
}
function buildArmchair(spec) {
  return buildLoungeSeat(spec, ARMCHAIR_SHAPE);
}
function mount4(spec, handles, label2) {
  return mountLoungeSeat(spec, handles, label2, buildCouch);
}
function mountArmchair(spec, handles, label2) {
  return mountLoungeSeat(spec, handles, label2, buildArmchair);
}
function mountLoungeSeat(spec, handles, label2, build) {
  const { obj, handle } = build(spec);
  const relocate = () => {
    obj.position.set(spec.x, 0, spec.z);
    obj.rotation.y = spec.facing;
    obj.userData.repaint(spec.color ?? null);
    handle.relocate();
  };
  relocate();
  const entry = { id: spec.id, couch: handle };
  handles.couches.push(entry);
  return movable(obj, `furniture:${spec.id}`, {
    label: label2,
    spec,
    relocate,
    teardown: () => drop(handles.couches, entry)
  });
}

// dist/ui/roving/src/scene/props/side-table.js
function buildSideTable() {
  const g = group(0, 0, 0);
  const top = box(1.6, 0.14, 1, "woodDark", { rough: 0.5 });
  top.position.y = 1;
  g.add(top);
  for (const sx of [-0.65, 0.65]) for (const sz of [-0.35, 0.35]) {
    const leg = cyl(0.06, 0.06, 1, "woodDark", { segments: 8 });
    leg.position.set(sx, 0.5, sz);
    g.add(leg);
  }
  const bookPile = box(0.8, 0.1, 0.55, 5208714);
  bookPile.position.set(-0.35, 1.12, 0);
  bookPile.rotation.y = 0.3;
  g.add(bookPile);
  put(g, buildFern(1.35), 0.45, 1.05, 0);
  return g;
}

// dist/ui/roving/src/scene/props/floor-lamp.js
import * as THREE27 from "three";
function buildFloorLamp() {
  const g = group(0, 0, 0);
  const BASE_H3 = 0.1;
  const base = cyl(0.35, 0.4, BASE_H3, COLORS.metalDark, { metal: 0.6 });
  base.position.y = footY(BASE_H3);
  g.add(base);
  const pole = cyl(0.05, 0.05, 3.2, 14201434, { metal: 0.7, rough: 0.3 });
  pole.position.y = 1.6;
  g.add(pole);
  const shadeMat = new THREE27.MeshStandardMaterial({
    color: 15985360,
    emissive: 16771504,
    emissiveIntensity: 0.5,
    roughness: 0.7,
    side: THREE27.DoubleSide
  });
  const shade = new THREE27.Mesh(new THREE27.CylinderGeometry(0.55, 0.75, 0.9, 16, 1, true), shadeMat);
  shade.position.y = 3.4;
  g.add(shade);
  const bulb = new THREE27.PointLight(16770749, 0.5, 10, 2);
  bulb.position.y = 3.3;
  g.add(bulb);
  return g;
}

// dist/ui/roving/src/scene/props/printer.js
var PR = {
  W: 1.2,
  // body, across the front
  D: 0.82,
  // body, front to back
  castorH: 0.08,
  // it rolls, as the real cabinet does
  bodyH: 1.18,
  // cassettes below, engine and output bin above
  deckW: 1.24,
  // the scanner deck overhangs the body slightly, all round
  deckD: 0.86,
  deckH: 0.14,
  adfH: 0.17
  // document feeder, at the back of the deck
};
var FRONT = PR.D / 2;
var BODY_Y0 = PR.castorH;
var BODY_Y1 = BODY_Y0 + PR.bodyH;
var DECK_Y1 = BODY_Y1 + PR.deckH;
var TRAYS = [0.2, 0.46, 0.72];
var PRINT_SLOTS = 5;
var PRINT_RUN = 1.9;
var RING_SECONDS = 1;
var RING_TILT = 0.22;
var RING_SPEED = 0.028;
var OVERSHOOT_ODDS = 1 / 6;
var SCALE = 2;
var PLAN = 0.75;
function buildPrintout() {
  const g = group(0, 0, 0);
  g.add(box(0.52, 0.02, 0.4, COLORS.paper, { rough: 0.9 }));
  for (const z of [-0.08, 0.06]) {
    put(g, box(0.36, 0.024, 0.05, 12170148, { rough: 0.9, cast: false }), 0, 1e-3, z);
  }
  return g;
}
function buildPrinter() {
  const g = group(0, 0, 0);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const castor = cyl(0.05, 0.05, PR.castorH, COLORS.printerPanel, {
        segments: 10,
        rough: 0.6,
        cast: false
      });
      castor.position.set(sx * (PR.W / 2 - 0.12), PR.castorH / 2, sz * (PR.D / 2 - 0.12));
      g.add(castor);
    }
  }
  put(g, box(PR.W, PR.bodyH, PR.D, COLORS.printerBody, { rough: 0.55 }), 0, BODY_Y0 + PR.bodyH / 2);
  for (const y of TRAYS) {
    put(g, box(PR.W - 0.06, 0.22, 0.04, COLORS.printerBody, { rough: 0.5, cast: false }), 0, y, FRONT - 0.01);
    put(g, box(0.72, 0.04, 0.035, COLORS.printerTrim, { rough: 0.4, cast: false }), 0, y + 0.07, FRONT + 0.02);
  }
  put(g, box(PR.W - 0.02, 0.045, 0.02, COLORS.printerPanel, { rough: 0.7, cast: false }), 0, 0.9, FRONT + 5e-3);
  put(g, box(0.62, 0.15, 0.02, COLORS.printerPanel, { rough: 0.6, cast: false }), -0.24, 1.1, FRONT + 8e-3);
  put(g, box(0.58, 0.035, 0.14, COLORS.printerTrim, { rough: 0.5, cast: false }), -0.24, 0.985, FRONT + 0.02);
  const sheets = [];
  for (let i = 0; i < PRINT_SLOTS; i++) {
    const flip = i % 2 ? 1 : -1;
    const sheet = box(0.44, 0.012, 0.18, COLORS.paper, {
      rough: 0.9,
      cast: false,
      emissive: 16774880,
      emissiveIntensity: 0.1
    });
    sheet.position.set(-0.22 + flip * 0.012, 1.01 + i * 0.016, FRONT + 5e-3);
    sheet.rotation.y = 0.02 + flip * (0.012 + i * 6e-3);
    sheet.visible = i === 0;
    g.add(sheet);
    sheets.push(sheet);
  }
  const escaped = box(0.44, 0.012, 0.3, COLORS.paper, { rough: 0.9, cast: false });
  escaped.position.set(-0.27, 0.012, 0.9);
  escaped.rotation.y = -0.38;
  escaped.visible = false;
  g.add(escaped);
  const ready2 = box(0.05, 0.05, 0.02, 6279306, {
    rough: 0.4,
    cast: false,
    emissive: 6279306,
    emissiveIntensity: 0.5
  });
  ready2.position.set(-0.45, 1.22, FRONT + 0.012);
  g.add(ready2);
  put(g, box(PR.deckW, PR.deckH, PR.deckD, COLORS.printerBody, { rough: 0.5 }), 0, BODY_Y1 + PR.deckH / 2);
  put(g, box(PR.deckW - 0.04, 0.03, 0.02, COLORS.printerPanel, { rough: 0.7, cast: false }), 0, BODY_Y1 + 0.035, PR.deckD / 2 + 5e-3);
  put(g, box(PR.deckW - 0.08, PR.adfH, 0.4, COLORS.printerBody, { rough: 0.5 }), 0, DECK_Y1 + PR.adfH / 2, -0.2);
  put(g, box(0.7, 0.022, 0.26, COLORS.printerTrim, { rough: 0.5, cast: false }), 0, DECK_Y1 + PR.adfH + 0.011, -0.14);
  put(g, box(0.66, 0.03, 0.02, COLORS.printerPanel, { rough: 0.7, cast: false }), 0, DECK_Y1 + PR.adfH - 0.05, 5e-3);
  put(g, box(0.12, 0.07, 0.1, COLORS.printerPanel, { rough: 0.5, cast: false }), 0.36, 1.06, FRONT + 0.03);
  const panel = group(0.36, 1.1, FRONT + 0.07);
  panel.rotation.x = -0.45;
  const bezel = box(0.44, 0.3, 0.035, COLORS.printerPanel, { rough: 0.5, cast: false });
  panel.add(bezel);
  const screen = box(0.36, 0.23, 0.012, 4942726, {
    rough: 0.35,
    cast: false,
    emissive: 7775948,
    emissiveIntensity: 0.45
  });
  screen.position.z = 0.024;
  panel.add(screen);
  const phone = group(0, 0, 0.03);
  const handset = box(0.045, 0.16, 0.014, 16052712, { rough: 0.6, cast: false });
  phone.add(handset);
  for (const sy of [-1, 1]) {
    const cup = box(0.075, 0.05, 0.018, 16052712, { rough: 0.6, cast: false });
    cup.position.set(0.026, sy * 0.078, 0);
    phone.add(cup);
  }
  phone.rotation.z = -0.55;
  phone.visible = false;
  panel.add(phone);
  g.add(panel);
  g.scale.set(SCALE * PLAN, SCALE, SCALE * PLAN);
  ready2.material = ready2.material.clone();
  screen.material = screen.material.clone();
  const readyMat = ready2.material;
  const screenMat = screen.material;
  const READY_GREEN = 6279306;
  const READY_AMBER = 15248210;
  const handle = {
    id: "printer",
    kind: "printer",
    sheets,
    /** How many sheets the queue says are waiting. Set by `setWaiting`. */
    waiting: 1,
    /** Seconds left of the current run. Read by tests; drives the light. */
    _run: 0,
    /** Seconds left of an incoming call. */
    _ringing: 0,
    _overshot: false,
    /**
     * A page comes out.
     *
     * The machine runs for `PRINT_RUN` whatever happens, because the comedy is in the
     * timing: the screen lights, nothing appears for a beat longer than anybody expects,
     * and then the sheet is there. Whether it lands in the tray is a separate draw.
     *
     * @param {() => number} [rng]  injectable so a test can force either outcome
     * @returns {boolean} true if the page missed the tray
     */
    print(rng = Math.random) {
      this._run = PRINT_RUN;
      const missed = !escaped.visible && rng() < OVERSHOOT_ODDS;
      if (missed) {
        escaped.visible = true;
        this._overshot = true;
      }
      return missed;
    },
    /** True while a page is on the floor, waiting to be picked up. */
    get overshot() {
      return escaped.visible;
    },
    /**
     * Somebody picked the loose page up off the floor.
     *
     * Separate from collecting out of the tray, because they are separate errands: the
     * tray is on the way past, and this is a stoop somebody has to make.
     */
    retrieve() {
      escaped.visible = false;
      this._overshot = false;
    },
    /** Finished work fed into the feeder and sent. The machine runs for it. */
    fax() {
      this._run = PRINT_RUN;
    },
    /**
     * A fax is coming in: shake the handset on the screen.
     *
     * The whole of an incoming arrival, because a fax has no journey — it does not fly
     * in through a window or arrive at the door, so without this a page simply appeared
     * in the tray with nothing to watch. The manager rings, waits, and *then* lands the
     * envelope, so the shake is over exactly as the paper shows up.
     */
    ring(seconds = RING_SECONDS) {
      this._ringing = Math.max(this._ringing, seconds);
      phone.visible = true;
    },
    /** True while the handset is shaking. For tests and for the docs gallery. */
    get ringing() {
      return this._ringing > 0;
    },
    /**
     * Tell the tray how many sheets the queue is holding.
     *
     * @param {number} count  sheets waiting to be collected
     */
    setWaiting(count) {
      if (count === this.waiting) return;
      this.waiting = count;
      for (let i = 0; i < sheets.length; i++) sheets[i].visible = i < count;
    },
    update(dt) {
      if (this._run > 0) this._run = Math.max(0, this._run - dt);
      if (this._ringing > 0) {
        this._ringing = Math.max(0, this._ringing - dt);
        const t = performance.now() * RING_SPEED;
        phone.rotation.z = -0.5 + Math.sin(t) * RING_TILT;
        if (this._ringing === 0) {
          phone.visible = false;
          phone.rotation.z = -0.5;
        }
      }
      const busy = this._run > 0 || this._ringing > 0;
      readyMat.color.setHex(busy ? READY_AMBER : READY_GREEN);
      readyMat.emissive.setHex(busy ? READY_AMBER : READY_GREEN);
      const want = busy ? 0.85 : 0.45;
      screenMat.emissiveIntensity += (want - screenMat.emissiveIntensity) * Math.min(1, dt * 5);
    }
  };
  return { obj: g, handle };
}

// dist/ui/roving/src/scene/props/telescope.js
var EYE_Y = 2.1;
var TUBE_PITCH = 30.5 * (Math.PI / 180);
var EYEPIECE_Z = 0.55;
var YOKE_RISE = 0.31;
var LEG_SPREAD = 0.42;
var TUBE_LEN = 1.9;
var TUBE_R = 0.17;
var HUB_Y = EYE_Y - YOKE_RISE + EYEPIECE_Z * Math.sin(TUBE_PITCH);
var LEG_LEN = HUB_Y / Math.cos(LEG_SPREAD);
var FOOT_REACH = LEG_LEN * Math.sin(LEG_SPREAD);
var BRASS = 12096090;
var TUBE_C = 3095882;
var TIMBER3 = 7295796;
function buildTelescope() {
  const g = group(0, 0, 0);
  for (let i = 0; i < 3; i++) {
    const around = Math.PI + i * 2 * Math.PI / 3;
    const bearing = group(0, HUB_Y, 0);
    bearing.rotation.y = around;
    const leg = group(0, 0, 0);
    leg.rotation.x = LEG_SPREAD;
    put(leg, cyl(0.045, 0.055, LEG_LEN, TIMBER3, { rough: 0.75 }), 0, -LEG_LEN / 2);
    put(leg, cyl(0.055, 0.038, 0.1, BRASS, { rough: 0.35, metal: 0.7 }), 0, -LEG_LEN);
    bearing.add(leg);
    g.add(bearing);
  }
  put(g, cyl(0.11, 0.13, 0.16, BRASS, { rough: 0.4, metal: 0.6 }), 0, HUB_Y);
  const yoke = group(0, HUB_Y + 0.08, 0);
  for (const sx of [-0.17, 0.17]) {
    put(yoke, box(0.05, YOKE_RISE, 0.05, BRASS, { rough: 0.4, metal: 0.6 }), sx, YOKE_RISE / 2, 0);
  }
  g.add(yoke);
  const pivot = group(0, HUB_Y + YOKE_RISE, 0);
  pivot.rotation.x = TUBE_PITCH;
  const tube = cyl(TUBE_R, TUBE_R, TUBE_LEN, TUBE_C, { rough: 0.45 });
  tube.rotation.x = Math.PI / 2;
  tube.position.z = EYEPIECE_Z - TUBE_LEN / 2;
  g.add(pivot);
  pivot.add(tube);
  const FRONT_Z2 = EYEPIECE_Z - TUBE_LEN;
  const shield = cyl(TUBE_R + 0.035, TUBE_R + 0.02, 0.24, TUBE_C, { rough: 0.5 });
  shield.rotation.x = Math.PI / 2;
  shield.position.z = FRONT_Z2 + 0.1;
  pivot.add(shield);
  const glass = cyl(TUBE_R - 0.01, TUBE_R - 0.01, 0.03, 1780280, { rough: 0.15, metal: 0.5 });
  glass.rotation.x = Math.PI / 2;
  glass.position.z = FRONT_Z2 + 0.2;
  pivot.add(glass);
  for (const z of [-0.15, 0.3]) {
    const band = cyl(TUBE_R + 0.02, TUBE_R + 0.02, 0.07, BRASS, { rough: 0.35, metal: 0.7 });
    band.rotation.x = Math.PI / 2;
    band.position.z = z;
    pivot.add(band);
  }
  const eyepiece = group(0, 0, EYEPIECE_Z);
  const barrel = cyl(0.075, 0.09, 0.26, BRASS, { rough: 0.3, metal: 0.75 });
  barrel.rotation.x = Math.PI / 2;
  eyepiece.add(barrel);
  const cup = cyl(0.1, 0.075, 0.08, 1710618, { rough: 0.9 });
  cup.rotation.x = Math.PI / 2;
  cup.position.z = 0.16;
  eyepiece.add(cup);
  pivot.add(eyepiece);
  const finder = cyl(0.045, 0.045, 0.52, BRASS, { rough: 0.35, metal: 0.65 });
  finder.rotation.x = Math.PI / 2;
  finder.position.set(0, TUBE_R + 0.09, -0.35);
  pivot.add(finder);
  const knob = cyl(0.06, 0.06, 0.05, BRASS, { rough: 0.3, metal: 0.75 });
  knob.rotation.z = Math.PI / 2;
  knob.position.set(TUBE_R + 0.03, 0, 0.3);
  pivot.add(knob);
  put(pivot, sphere(0.085, 2763306, { rough: 0.5, metal: 0.3 }), 0, -TUBE_R - 0.1, 0.4);
  const restPitch = pivot.rotation.x;
  let scanning = 0;
  const handle = {
    id: "telescope",
    kind: "telescope",
    /** The pitch group, exposed for the docs gallery and for tests to read. */
    pivot,
    /** Height of the eyepiece above the floor — what an eye actually has to reach. */
    eyeY: EYE_Y,
    /**
     * Sweep the tube while somebody is looking through it.
     *
     * Somebody at an eyepiece is hunting for something, and a tube that never moves
     * says they already found it. Small on purpose: this has to read as searching and
     * not as a machine slewing, and the eyepiece has to stay under the face stooped
     * over it — a big sweep would walk it out from under them.
     *
     * @param {number} seconds  how long the sweep should last
     */
    scan(seconds = 2.8) {
      scanning = Math.max(scanning, seconds);
    },
    /** Ticked by the prop ticker. Nothing to do when nobody is looking. */
    update(dt) {
      if (scanning <= 0) {
        const k = Math.min(1, dt * 4);
        pivot.rotation.x += (restPitch - pivot.rotation.x) * k;
        pivot.rotation.y += (0 - pivot.rotation.y) * k;
        return;
      }
      scanning -= dt;
      const t = performance.now() * 9e-4;
      pivot.rotation.x = restPitch + Math.sin(t) * 0.045;
      pivot.rotation.y = Math.sin(t * 0.6) * 0.075;
    },
    /** True while a sweep is running. For tests, not for the room. */
    get scanning() {
      return scanning > 0;
    }
  };
  return { obj: g, handle };
}
function mount5(s, handles) {
  const { obj, handle } = buildTelescope();
  place(obj, s);
  handles.telescope = handle;
  handles.byStation[s.id] = handle;
  const entry = { id: s.id, scope: handle };
  handles.telescopes.push(entry);
  return placed(obj, s, "Telescope", () => drop(handles.telescopes, entry));
}

// dist/ui/roving/src/scene/props/rug.js
function bodyColor(color) {
  return RUG_COLORS[color]?.hex ?? COLORS.rugSage;
}
var EDGE = 0.88;
function borderColor(hex) {
  const shade = (shift2) => Math.round((hex >> shift2 & 255) * EDGE);
  return shade(16) << 16 | shade(8) << 8 | shade(0);
}
var RUG_LIFT = 0.01;
var RUG_TOP = RUG_LIFT + 5e-3 + 0.07 / 2;
function buildRug({ x, z, w, d, facing = 0, color = null }) {
  const g = group(x, FLOOR_TOP + RUG_LIFT, z);
  g.rotation.y = facing;
  const rug = box(w, 0.06, d, bodyColor(color), { rough: 0.98, cast: false });
  rug.receiveShadow = true;
  g.add(rug);
  const border = put(g, box(w - 0.8, 0.07, d - 0.8, borderColor(bodyColor(color)), { rough: 0.98, cast: false }), 0, 5e-3);
  g.userData.repaint = (next) => {
    const body = bodyColor(next);
    rug.material = mat(body, { rough: 0.98 });
    border.material = mat(borderColor(body), { rough: 0.98 });
  };
  return g;
}
function mount6(spec, handles, label2) {
  const kind = FURNITURE_KINDS.rug;
  const obj = buildRug({
    x: spec.x,
    z: spec.z,
    w: kind.hw * 2,
    d: kind.hd * 2,
    facing: spec.facing,
    color: spec.color
  });
  const relocate = () => {
    obj.position.set(spec.x, FLOOR_TOP + RUG_LIFT, spec.z);
    obj.rotation.y = spec.facing ?? 0;
    obj.userData.repaint(spec.color ?? null);
  };
  relocate();
  return movable(obj, `furniture:${spec.id}`, { label: label2, spec, relocate });
}

// dist/ui/roving/src/scene/props/desk.js
import * as THREE30 from "three";

// dist/ui/roving/src/scene/kanban.js
import * as THREE28 from "three";
var KB_TEX_W = 512;
var KB_TEX_H = 290;
var KB = {
  pad: 12,
  // board margin
  gap: 9,
  // between columns
  headTop: 34,
  // board title strip, above the columns
  colHead: 28,
  // column title strip, inside a column
  cardH: 44,
  cardGap: 9,
  slots: 4,
  // cards a column holds before it is full
  moveDur: 0.75,
  // seconds for a card to cross
  waitMin: 5,
  waitMax: 13,
  redrawHz: 20
  // texture uploads while a card is in flight
};
var KB_COLORS = {
  bg: "#0d1826",
  title: "#33465c",
  column: "#122031",
  colTitle: "#7f97b2",
  line: "#a8bdd4",
  lineDim: "#6d89a8",
  slot: "#1b2f45",
  key: "#8ba3bd"
};
var KB_CARDS = [
  { fill: "#2f5075", edge: "#3d6690" },
  // slate blue
  { fill: "#28605f", edge: "#367a78" },
  // teal
  { fill: "#4a3f74", edge: "#5e5090" },
  // violet
  { fill: "#2f5d43", edge: "#3d7857" },
  // green
  { fill: "#6b3a52", edge: "#87496a" },
  // rose
  { fill: "#6a4a2b", edge: "#875f38" }
  // amber
];
var KB_TAGS = ["#6fb1e0", "#7bc47f", "#e0b24f", "#b489e0", "#4fb0b0"];
var KB_TITLES = ["TO DO", "IN PROGRESS", "DONE"];
var KB_LOGO_BLUE = "#1868db";
var KB_LOGO_BOX = 75;
var KB_LOGO_GLYPH_D = "";
var KB_LOGO_GLYPH = typeof Path2D === "function" ? new Path2D(KB_LOGO_GLYPH_D) : null;
function kbDrawLogo(ctx, x, y, size) {
  ctx.fillStyle = KB_LOGO_BLUE;
  kbRoundRect(ctx, x, y, size, size, size * 0.25);
  ctx.fill();
  if (!KB_LOGO_GLYPH) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / KB_LOGO_BOX, size / KB_LOGO_BOX);
  ctx.fillStyle = "#ffffff";
  ctx.fill(KB_LOGO_GLYPH);
  ctx.restore();
}
var KB_COL_W = (KB_TEX_W - 2 * KB.pad - 2 * KB.gap) / 3;
var KB_CARD_W = KB_COL_W - 16;
var KB_COL_H = KB_TEX_H - KB.pad - KB.headTop;
function kbSlot(col, row) {
  return {
    x: KB.pad + col * (KB_COL_W + KB.gap) + 8,
    y: KB.headTop + KB.colHead + row * (KB.cardH + KB.cardGap)
  };
}
var _kbNextKey = 100;
function kbCard() {
  return {
    key: `AOP-${_kbNextKey++}`,
    body: pick(KB_CARDS),
    tag: pick(KB_TAGS),
    tagW: between(20, 44),
    // Fractions of the card's text width, so a summary looks written rather than
    // ruled: one long line and a shorter second one.
    lines: [between(0.55, 0.95), between(0.3, 0.7)],
    twoLines: chance(0.7)
  };
}
function kbRoundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
function kbDrawCard(ctx, card, x, y, lift = 0) {
  if (lift > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${0.4 * lift})`;
    kbRoundRect(ctx, x + 2, y + 3 + 4 * lift, KB_CARD_W, KB.cardH, 4);
    ctx.fill();
  }
  ctx.fillStyle = card.body.fill;
  kbRoundRect(ctx, x, y, KB_CARD_W, KB.cardH, 4);
  ctx.fill();
  ctx.fillStyle = card.body.edge;
  kbRoundRect(ctx, x, y, KB_CARD_W, 2, 1);
  ctx.fill();
  const textW = KB_CARD_W - 16;
  ctx.fillStyle = KB_COLORS.line;
  ctx.fillRect(x + 8, y + 9, textW * card.lines[0], 4);
  if (card.twoLines) {
    ctx.fillStyle = KB_COLORS.lineDim;
    ctx.fillRect(x + 8, y + 17, textW * card.lines[1], 4);
  }
  ctx.fillStyle = card.tag;
  kbRoundRect(ctx, x + 8, y + KB.cardH - 14, card.tagW, 6, 3);
  ctx.fill();
  ctx.fillStyle = KB_COLORS.key;
  ctx.font = "9px ui-monospace, monospace";
  ctx.textBaseline = "middle";
  ctx.fillText(card.key, x + 14 + card.tagW, y + KB.cardH - 11);
}
function kbDraw(ctx, cols, drag) {
  ctx.fillStyle = KB_COLORS.bg;
  ctx.fillRect(0, 0, KB_TEX_W, KB_TEX_H);
  kbDrawLogo(ctx, KB.pad, 5, 24);
  ctx.fillStyle = KB_COLORS.title;
  ctx.fillRect(KB.pad + 32, 13, 88, 7);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = KB_TAGS[i];
    ctx.beginPath();
    ctx.arc(KB_TEX_W - KB.pad - 8 - i * 18, 17, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let c = 0; c < 3; c++) {
    const cx = KB.pad + c * (KB_COL_W + KB.gap);
    ctx.fillStyle = KB_COLORS.column;
    kbRoundRect(ctx, cx, KB.headTop, KB_COL_W, KB_COL_H, 5);
    ctx.fill();
    ctx.fillStyle = KB_COLORS.colTitle;
    ctx.textBaseline = "middle";
    ctx.font = "bold 10px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(KB_TITLES[c], cx + 9, KB.headTop + 14);
    const n = cols[c].length + (drag && drag.dest === c ? 1 : 0);
    ctx.font = "10px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(String(n), cx + KB_COL_W - 15, KB.headTop + 14);
    for (const [row, card] of cols[c].entries()) {
      const s = kbSlot(c, row);
      kbDrawCard(ctx, card, s.x, s.y);
    }
  }
  if (drag) {
    const s = kbSlot(drag.dest, drag.row);
    ctx.fillStyle = KB_COLORS.slot;
    kbRoundRect(ctx, s.x, s.y, KB_CARD_W, KB.cardH, 4);
    ctx.fill();
    kbDrawCard(ctx, drag.card, drag.x, drag.y, 1);
  }
}
function makeKanbanBoard() {
  const canvas2 = document.createElement("canvas");
  canvas2.width = KB_TEX_W;
  canvas2.height = KB_TEX_H;
  const ctx = canvas2.getContext("2d");
  const cols = [[], [], []];
  for (let i = 0; i < 3; i++) cols[0].push(kbCard());
  for (let i = 0; i < 2; i++) cols[1].push(kbCard());
  for (let i = 0; i < whole(1, 2); i++) cols[2].push(kbCard());
  let drag = null;
  let wait2 = between(1, KB.waitMax);
  let dirty = true;
  let sinceDraw = 1;
  function nextMove() {
    const movable2 = [0, 1].filter((c) => cols[c].length && cols[c + 1].length < KB.slots);
    if (!movable2.length) {
      if (cols[2].length) {
        cols[2].shift();
        dirty = true;
      }
      return;
    }
    const src = pick(movable2);
    const row = Math.floor(Math.random() * cols[src].length);
    const [card] = cols[src].splice(row, 1);
    const dest = src + 1;
    const destRow = cols[dest].length;
    const from = kbSlot(src, row);
    const to = kbSlot(dest, destRow);
    drag = { card, dest, row: destRow, from, to, t: 0, x: from.x, y: from.y };
    dirty = true;
  }
  function land() {
    cols[drag.dest].push(drag.card);
    if (cols[2].length >= KB.slots) cols[2].shift();
    if (cols[0].length < 2) cols[0].push(kbCard());
    drag = null;
    dirty = true;
  }
  kbDraw(ctx, cols, drag);
  dirty = false;
  const texture = new THREE28.CanvasTexture(canvas2);
  texture.colorSpace = THREE28.SRGBColorSpace;
  return {
    texture,
    /**
     * @param {number} dt  seconds; only ticks while the desk is being worked at,
     *   so a dark monitor costs nothing.
     */
    update(dt) {
      if (drag) {
        drag.t += dt;
        const k = Math.min(1, drag.t / KB.moveDur);
        const e = smoothstep(k);
        drag.x = lerp(drag.from.x, drag.to.x, e);
        drag.y = lerp(drag.from.y, drag.to.y, e) - Math.sin(Math.PI * k) * 7;
        dirty = true;
        if (k >= 1) land();
      } else {
        wait2 -= dt;
        if (wait2 <= 0) {
          wait2 = between(KB.waitMin, KB.waitMax);
          nextMove();
        }
      }
      sinceDraw += dt;
      if (dirty && sinceDraw >= 1 / KB.redrawHz) {
        kbDraw(ctx, cols, drag);
        texture.needsUpdate = true;
        dirty = false;
        sinceDraw = 0;
      }
    }
  };
}

// dist/ui/roving/src/scene/props/sit-stand.js
var RISE = 0.34;
var STANDING_TYPE_REACH = -109.7 * (Math.PI / 180);
var FOOT_H = 0.12;
function addSitStandFrame({ g, surface: surface2, topY, topT, columnX, deskD, standZ }) {
  const underTop = topY - topT;
  const SLEEVE_W = 0.3;
  const SLEEVE_H = 0.78;
  const INNER_W = 0.19;
  const INNER_TOP = underTop;
  const INNER_COLOR = 9278621;
  const footD = Math.min(deskD - 0.4, 1.6);
  for (const sx of [-columnX, columnX]) {
    put(g, box(0.26, FOOT_H, footD, COLORS.metalDark, { rough: 0.45, metal: 0.5 }), sx, footY(FOOT_H), 0);
    for (const sz of [-footD / 2 + 0.13, footD / 2 - 0.13]) {
      put(g, box(0.22, 0.04, 0.17, 1777187, { rough: 0.9 }), sx, footY(0.04), sz);
    }
    const inner = box(INNER_W, INNER_TOP - FOOT_H, INNER_W, INNER_COLOR, {
      rough: 0.35,
      metal: 0.6
    });
    inner.position.set(sx, FOOT_H + (INNER_TOP - FOOT_H) / 2, 0);
    g.add(inner);
    put(surface2, box(0.13, 0.09, deskD - 0.4, COLORS.metalDark, { rough: 0.45, metal: 0.5 }), sx, underTop - 0.05, 0);
    const sleeve = box(SLEEVE_W, SLEEVE_H, SLEEVE_W, COLORS.metalDark, {
      rough: 0.4,
      metal: 0.55
    });
    sleeve.position.set(sx, underTop - SLEEVE_H / 2, 0);
    surface2.add(sleeve);
    const collar = box(SLEEVE_W + 0.04, 0.07, SLEEVE_W + 0.04, 1316635, {
      rough: 0.6,
      metal: 0.3
    });
    collar.position.set(sx, underTop - SLEEVE_H + 0.035, 0);
    surface2.add(collar);
  }
  const beam = box(columnX * 2 - SLEEVE_W, 0.13, 0.17, COLORS.metalDark, {
    rough: 0.45,
    metal: 0.5
  });
  beam.position.set(0, underTop - 0.17, -0.12);
  surface2.add(beam);
  put(surface2, box(1.7, 0.12, 0.22, 3356735, { rough: 0.7, metal: 0.3 }), -0.4, underTop - 0.15, -deskD / 2 + 0.26);
  put(surface2, box(0.5, 0.1, 0.22, 2237996, { rough: 0.5 }), 1, underTop - 0.05, deskD / 2 - 0.18);
  const display = box(0.18, 0.06, 0.03, 9426632, {
    rough: 0.3,
    emissive: 3112816,
    emissiveIntensity: 0.9
  });
  display.position.set(0.84, underTop - 0.05, deskD / 2 - 0.07);
  surface2.add(display);
  for (const [i, bx] of [1.01, 1.08, 1.17].entries()) {
    put(surface2, box(0.055, 0.04, 0.03, i === 2 ? 14212841 : 7305091, { rough: 0.6 }), bx, underTop - 0.045, deskD / 2 - 0.07);
  }
  put(g, box(2.3, 0.05, 1, 5791336, { rough: 0.95 }), 0, footY(0.05), standZ);
}
var TRAVEL = 1.6;
function sitStandMotor(start = 1) {
  let at = start;
  let from = start;
  let target = start;
  let t = 1;
  return {
    /** Send the surface to `f`, easing there over `TRAVEL`. Re-asking is free. */
    driveTo(f) {
      if (f === target) return;
      from = at;
      target = f;
      t = 0;
    },
    /** Where it is heading, which is where it already is once it has arrived. */
    get target() {
      return target;
    },
    /** Where the surface is: 0 at seated height, 1 fully raised. */
    get at() {
      return at;
    },
    /**
     * Advance the motor.
     * @param   {number} dt  seconds
     * @returns {number} where the surface is now
     */
    step(dt) {
      if (t < 1) {
        t = Math.min(1, t + dt / TRAVEL);
        at = lerp(from, target, smoothstep(t));
      }
      return at;
    }
  };
}

// dist/ui/roving/src/scene/props/desk-marker.js
import * as THREE29 from "three";
function buildDeskMarker({ topY, x, z }) {
  const root = new THREE29.Group();
  root.name = "desk-marker:nameplate";
  root.position.set(x, topY, z);
  root.rotation.y = Math.PI / 6;
  root.visible = false;
  const colour = new THREE29.MeshStandardMaterial({
    color: 16777215,
    roughness: 0.62,
    emissive: 16777215,
    emissiveIntensity: 0.12
  });
  const neutral = new THREE29.MeshStandardMaterial({ color: 14276296, roughness: 0.82 });
  const holder = new THREE29.Mesh(new THREE29.BoxGeometry(0.7, 0.045, 0.25), neutral);
  holder.position.y = 0.025;
  root.add(holder);
  const card = new THREE29.Mesh(new THREE29.BoxGeometry(0.62, 0.21, 0.055), colour);
  card.position.y = 0.145;
  card.rotation.x = -0.22;
  root.add(card);
  return {
    id: "nameplate",
    label: "Blank nameplate",
    root,
    colour,
    setAssignment(agent) {
      root.visible = !!agent;
      if (agent) {
        colour.color.setHex(agent.color);
        colour.emissive.setHex(agent.color);
      }
    }
  };
}

// dist/ui/roving/src/scene/props/desk.js
var SEAT_LOCAL_Z = 1.6;
var SEAT_HEIGHT = 0.68;
var DESK_TOP_Y2 = 1.58;
var DESK_W = 4.4;
var DESK_D = 2.2;
var TOP_T = 0.16;
var LEG_X = 1.9;
var CHAIR_ASIDE_X = -1.25;
var CHAIR_PUSH = 0.45;
var DESK_PLANT_X = 1.7;
var DESK_PLANT_Z = 0.7;
var KEYS_W = 1.5;
var MONITOR_Z = -0.35;
var KEYS_Z = 0.62;
function deskPlantCorner(facing) {
  const camX = CAMERA.position[0] - CAMERA.target[0];
  const camZ = CAMERA.position[2] - CAMERA.target[2];
  const s = Math.sin(facing), c = Math.cos(facing);
  const frontToCamera = s * camX + c * camZ > 0;
  let xSide = c * camX - s * camZ > 0 ? 1 : -1;
  if (frontToCamera && xSide < 0) xSide = 1;
  return { x: xSide * DESK_PLANT_X, z: frontToCamera ? DESK_PLANT_Z : -DESK_PLANT_Z };
}
var MON_BEZEL_W = 1.7;
var MON_GLASS_W = 1.5;
var WIDE = 1.5;
var BEZEL_BEHIND = 0.05;
var CURVE_RADIUS_MM = 1800;
var ULTRAWIDE_MM = 800;
var SCREEN_ARC = ULTRAWIDE_MM / CURVE_RADIUS_MM;
function curvedPanel({ radius, arc, height, mat: mat3, from = 0, to = 1, axisR = null, segments = 24 }) {
  const start = Math.PI - arc / 2 + from * arc;
  const geo = new THREE30.CylinderGeometry(
    radius,
    radius,
    height,
    Math.max(2, Math.round(segments * (to - from))),
    1,
    true,
    start,
    (to - from) * arc
  );
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
  geo.translate(0, 0, axisR ?? radius);
  return new THREE30.Mesh(geo, mat3);
}
var SCREEN_OFF = 0;
var SCREEN_ON = 2.4;
var _codeTexture = null;
function codeScreenTexture() {
  if (_codeTexture) return _codeTexture;
  const W = 256, H = 152;
  const canvas2 = document.createElement("canvas");
  canvas2.width = W;
  canvas2.height = H;
  const ctx = canvas2.getContext("2d");
  ctx.fillStyle = "#0e1b2b";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#152438";
  ctx.fillRect(0, 0, 16, H);
  const palette = ["#6fb1e0", "#7bc47f", "#e0b24f", "#b489e0", "#d8dee9", "#4fb0b0"];
  let y = 10;
  for (let row = 0; row < 13; row++) {
    let x = 22 + row % 4 * 11;
    const segments = whole(2, 4);
    for (let s = 0; s < segments; s++) {
      const w = spread(16, 52);
      if (x + w > W - 10) break;
      ctx.fillStyle = pick(palette);
      ctx.fillRect(x, y, w, 5);
      x += w + 7;
    }
    ctx.fillStyle = "#33465c";
    ctx.fillRect(5, y + 1, 7, 3);
    y += 11;
  }
  ctx.fillStyle = "#f4f1e8";
  ctx.fillRect(22, y, 2, 8);
  _codeTexture = new THREE30.CanvasTexture(canvas2);
  _codeTexture.colorSpace = THREE30.SRGBColorSpace;
  _codeTexture.__shared = true;
  return _codeTexture;
}
function buildDesk(spec, index = 0) {
  const g = group(spec.x, 0, spec.z);
  g.rotation.y = spec.facing;
  const surface2 = group(0, 0, 0);
  g.add(surface2);
  put(surface2, box(DESK_W, TOP_T, DESK_D, "woodMid", { rough: 0.6 }), 0, DESK_TOP_Y2 - TOP_T / 2);
  if (spec.standing) {
    addSitStandFrame({
      g,
      surface: surface2,
      topY: DESK_TOP_Y2,
      topT: TOP_T,
      columnX: LEG_X,
      deskD: DESK_D,
      standZ: SEAT_LOCAL_Z
    });
  } else {
    for (const sx of [-LEG_X, LEG_X]) {
      for (const sz of [-0.9, 0.9]) {
        put(g, box(0.16, 1.5, 0.16, "metalDark", { rough: 0.5, metal: 0.4 }), sx, 0.75, sz);
      }
    }
  }
  const screenMats = [];
  const screenGlows = [];
  const kanban = makeKanbanBoard();
  const screenTextures = [codeScreenTexture(), kanban.texture];
  const screenMaterial = (tex) => new THREE30.MeshStandardMaterial({
    map: tex,
    // Starts black: `color` multiplies the map, so 0x000000 hides the code
    // entirely rather than leaving a dimly-lit screenshot on a dead monitor.
    color: 0,
    emissive: 16777215,
    emissiveMap: tex,
    emissiveIntensity: SCREEN_OFF,
    roughness: 0.3,
    metalness: 0,
    // A plane is single-sided by default; the desk can be rotated to any
    // heading, so render both faces rather than risk a culled (black) screen.
    side: THREE30.DoubleSide
  });
  const glowMaterial = () => new THREE30.MeshBasicMaterial({
    color: 8369896,
    transparent: true,
    opacity: 0,
    blending: THREE30.AdditiveBlending,
    depthWrite: false,
    side: THREE30.DoubleSide
  });
  const flatGlow = (w, h, z) => {
    const glow2 = new THREE30.Mesh(new THREE30.PlaneGeometry(w, h), glowMaterial());
    glow2.position.set(0, 1, z);
    return glow2;
  };
  const monitorBase = (mx, widthScale) => {
    const monitor = group(mx, DESK_TOP_Y2, MONITOR_Z);
    const stand2 = box(0.12, 0.5, 0.12, "metalDark", { metal: 0.5, rough: 0.4 });
    stand2.position.y = 0.25;
    monitor.add(stand2);
    const foot = box(0.5 * widthScale, 0.06, 0.4, "metalDark", { metal: 0.5, rough: 0.4 });
    foot.position.y = 0.03;
    monitor.add(foot);
    return monitor;
  };
  if (spec.standing) {
    const glassW = MON_GLASS_W * WIDE;
    const radius = glassW / SCREEN_ARC;
    const monitor = monitorBase(0, WIDE);
    const bezel = curvedPanel({
      radius: radius + BEZEL_BEHIND,
      arc: SCREEN_ARC * 1.06,
      height: 1,
      mat: new THREE30.MeshStandardMaterial({ color: 1382428, roughness: 0.4, side: THREE30.DoubleSide }),
      axisR: radius
    });
    bezel.position.y = 1;
    monitor.add(bezel);
    for (const [i, tex] of screenTextures.entries()) {
      const mat3 = screenMaterial(tex);
      const win = curvedPanel({
        radius,
        arc: SCREEN_ARC,
        height: 0.85,
        mat: mat3,
        from: i / 2,
        to: (i + 1) / 2
      });
      win.position.y = 1;
      monitor.add(win);
      screenMats.push(mat3);
    }
    const glow2 = curvedPanel({
      radius: radius - 0.06,
      arc: SCREEN_ARC * 1.2,
      height: 1.2,
      mat: glowMaterial(),
      axisR: radius
    });
    glow2.position.y = 1;
    monitor.add(glow2);
    screenGlows.push(glow2);
    surface2.add(monitor);
  } else {
    for (const [side, mx] of [-1.05, 1.05].entries()) {
      const monitor = monitorBase(mx, 1);
      const bezel = box(MON_BEZEL_W, 1, 0.08, 1382428, { rough: 0.4 });
      bezel.position.y = 1;
      monitor.add(bezel);
      const mat3 = screenMaterial(screenTextures[side]);
      const screen = new THREE30.Mesh(new THREE30.PlaneGeometry(MON_GLASS_W, 0.85), mat3);
      screen.position.set(0, 1, 0.05);
      monitor.add(screen);
      screenMats.push(mat3);
      const glow2 = flatGlow(1.9, 1.2, 0.12);
      monitor.add(glow2);
      screenGlows.push(glow2);
      surface2.add(monitor);
    }
  }
  const kb = box(KEYS_W, 0.06, 0.5, 2237995, { rough: 0.6 });
  kb.position.set(0, 1.6, KEYS_Z);
  surface2.add(kb);
  const mouse = box(0.22, 0.08, 0.32, 2237995, { rough: 0.6 });
  mouse.position.set(1, 1.61, KEYS_Z);
  surface2.add(mouse);
  const mug = group(-1.85, 1.6, 0.87);
  mug.name = "desk-mug";
  put(mug, cyl(0.13, 0.11, 0.24, COLORS.paper, { segments: 10 }), 0, 0.12);
  const brew = cyl(0.105, 0.105, 0.02, 3810328, { segments: 10, cast: false });
  brew.material = brew.material.clone();
  brew.position.y = 0.235;
  mug.add(brew);
  mug.visible = false;
  surface2.add(mug);
  const plant = buildDeskPlant(index);
  const corner = deskPlantCorner(spec.facing);
  plant.position.set(corner.x, DESK_TOP_Y2, corner.z);
  plant.rotation.y = index * 1.3;
  surface2.add(plant);
  const assignmentMarker = buildDeskMarker({
    topY: DESK_TOP_Y2,
    x: (-DESK_W / 2 - KEYS_W / 2) / 2,
    z: (DESK_D / 2 + MONITOR_Z) / 2
  });
  surface2.add(assignmentMarker.root);
  const chair = buildAeronChair();
  chair.position.set(0, 0, SEAT_LOCAL_Z);
  chair.rotation.y = Math.PI;
  g.add(chair);
  const anchor = (dz) => {
    const p = new THREE30.Vector3(0, 0, dz).applyEuler(g.rotation).add(g.position);
    return new THREE30.Vector3(p.x, 0, p.z);
  };
  const APPROACH_LOCAL_Z = SEAT_LOCAL_Z + 1.9;
  let placedFacing = spec.facing;
  const motor = spec.standing ? sitStandMotor(1) : null;
  let raised = spec.standing ? 1 : 0;
  const applyHeight = (f) => {
    raised = f;
    surface2.position.y = RISE * f;
  };
  applyHeight(raised);
  let aside = 0;
  let asideTarget = 0;
  const POSTS_MIN = 3;
  const POSTS_MAX = 5;
  const nextRun = () => whole(POSTS_MIN, POSTS_MAX);
  let standingRun = true;
  let postsLeft = nextRun();
  const handle = {
    id: spec.id,
    kind: "desk",
    // Whether this desk stands on a sit-stand frame. Not a different kind of desk — the
    // agent layer reads it to know whether working standing up is even on offer here.
    standing: !!spec.standing,
    seat: anchor(SEAT_LOCAL_Z),
    approach: anchor(APPROACH_LOCAL_Z),
    // The occupant looks at the monitors, i.e. opposite the desk's own facing.
    sitRotation: spec.facing + Math.PI,
    // Which way the chair's seat is pointing, in world terms — the same heading its
    // occupant would be facing. Square to the monitors when nobody is using it.
    chairFacing: spec.facing + Math.PI,
    /**
     * The desk has been moved or turned: work its world anchors out again.
     *
     * A desk is the prop with the most baked into it — a seat, the standing room in
     * front of that seat, the heading an occupant faces, and a plant on whichever
     * corner is nearest the camera — and every one of those is measured from where the
     * desk is. None of it can be left to a world rebuild, because the room goes on
     * running while the furniture is dragged (see src/editor.js).
     *
     * The chair is turned by however far the desk was, rather than being squared back
     * up to the monitors. Both halves of that matter, and only because somebody may be
     * sitting in it: a desk merely slid across the floor must not spin the seat under
     * its occupant, and a desk swung round to face the window must take them with it.
     */
    relocate() {
      const spin = spec.facing - placedFacing;
      placedFacing = spec.facing;
      g.position.set(spec.x, 0, spec.z);
      g.rotation.y = spec.facing;
      this.seat.copy(anchor(SEAT_LOCAL_Z));
      this.approach.copy(anchor(APPROACH_LOCAL_Z));
      this.sitRotation = spec.facing + Math.PI;
      this.setChairFacing(this.chairFacing + spin);
      const c = deskPlantCorner(spec.facing);
      plant.position.set(c.x, DESK_TOP_Y2, c.z);
    },
    screenMats,
    screenGlows,
    working: false,
    // Whether the occupant's drink is sitting on the desk. Mirrors `working`:
    // handle state the agent layer can read back rather than having to remember.
    mug: false,
    occupiedBy: null,
    assignmentMarker,
    setAssignment(agent) {
      assignmentMarker.setAssignment(agent);
    },
    /**
     * Wake or sleep both monitors. Called the moment an agent sits down at the
     * desk and again when they get up, so an empty desk always reads as two
     * black panels.
     */
    setWorking(on) {
      this.working = !!on;
      for (const m of screenMats) {
        m.emissiveIntensity = on ? SCREEN_ON : SCREEN_OFF;
        m.color.setHex(on ? 16777215 : 0);
      }
      for (const glowCard of screenGlows) {
        glowCard.material.opacity = on ? 0.16 : 0;
      }
    },
    /**
     * Advance the board on the second screen.
     *
     * A no-op while the desk is dark: the monitors are genuinely black when
     * nobody is sitting there, so there is no one to see a card move and no
     * reason to repaint the canvas.
     *
     * @param {number} dt  seconds
     */
    update(dt) {
      if (this.working) kanban?.update(dt);
      if (motor) applyHeight(motor.step(dt));
      if (aside !== asideTarget) {
        const per = dt / CHAIR_PUSH;
        aside = Math.abs(asideTarget - aside) <= per ? asideTarget : aside + Math.sign(asideTarget - aside) * per;
        chair.position.x = CHAIR_ASIDE_X * aside;
      }
    },
    /** Where the surface is: 0 at seated height, 1 fully raised. */
    get raised() {
      return raised;
    },
    /**
     * Whether the next post at this desk is worked standing, and count it.
     *
     * Called once as somebody takes up a post, and it has a side effect on purpose: the
     * run of posts is the desk's, not the occupant's, so it survives one agent going
     * home and the next sitting down. An ordinary desk always answers no, which is what
     * lets the agent layer ask without first asking what kind of desk it is holding.
     *
     * @returns {boolean} true to work this post on your feet
     */
    takeStandingTurn() {
      if (!motor) return false;
      if (--postsLeft <= 0) {
        standingRun = !standingRun;
        postsLeft = nextRun();
      }
      return standingRun;
    },
    /** How many more posts before the height changes. Read by the tests. */
    get postsUntilChange() {
      return motor ? postsLeft : 0;
    },
    /**
     * Send a sit-stand desk to standing or seated height.
     *
     * A no-op on an ordinary desk, so the agent layer can call it without asking what it
     * is standing on. Nothing gives the desk back afterwards: it stays where the last
     * person to use it left it, which is what a real one does and what makes the height
     * a fact about the room rather than an animation playing in the corner.
     */
    setStanding(on) {
      motor?.driveTo(on ? 1 : 0);
    },
    /**
     * Push the chair aside, or pull it back in.
     *
     * The only thing that moves a chair sideways, and it is called by the agent who is
     * doing the pushing — never by the desk itself. See `standAtDesk` in
     * agents/AgentManager.js, where it happens between arriving and the desk going up.
     *
     * @param {boolean} on  true to shove it clear of the mat, false to roll it back
     */
    pushChairAside(on) {
      if (!motor) return;
      asideTarget = on ? 1 : 0;
    },
    /** Where the chair is: 0 tucked in, 1 shoved aside. */
    get chairAside() {
      return aside;
    },
    /**
     * Turn the chair to a heading, keeping `chairFacing` true.
     *
     * A chair is furniture that moves, and this is the only way it does. Nobody
     * walks through their own chair to sit down: it is swung out of the way, sat on
     * from the front, and swivelled back to the monitors, and the agent layer drives
     * all three (see the chair choreography in agents/AgentManager.js).
     *
     * @param {number} y  world heading for the seat to face
     */
    setChairFacing(y) {
      this.chairFacing = y;
      chair.rotation.y = y - spec.facing;
    },
    /**
     * Put the occupant's drink on the desk, or clear it away.
     * @param {boolean} on
     * @param {?number} color  what's in the cup (see agents/drinks.js)
     */
    setMug(on, color = null) {
      this.mug = !!on;
      mug.visible = this.mug;
      if (on && color != null) brew.material.color.setHex(color);
    }
  };
  handle.setWorking(false);
  return { obj: g, handle };
}
function buildAeronChair() {
  const g = group(0, 0, 0);
  const FRAME = COLORS.aeronFrame;
  const MESH = COLORS.aeronMesh;
  const GRAPHITE = COLORS.aeronGraphite;
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2;
    const arm = box(0.62, 0.09, 0.14, GRAPHITE, { metal: 0.45, rough: 0.5 });
    arm.position.set(Math.cos(a) * 0.31, 0.12, Math.sin(a) * 0.31);
    arm.rotation.y = -a;
    g.add(arm);
    const caster = cyl(0.09, 0.09, 0.07, 1382428, { segments: 10 });
    caster.rotation.x = Math.PI / 2;
    caster.position.set(Math.cos(a) * 0.6, 0.08, Math.sin(a) * 0.6);
    g.add(caster);
  }
  put(g, cyl(0.075, 0.09, 0.42, 2237995, { segments: 10, metal: 0.6, rough: 0.35 }), 0, 0.36);
  put(g, box(0.34, 0.14, 0.44, GRAPHITE, { metal: 0.4, rough: 0.5 }), 0, 0.57);
  const panY = SEAT_HEIGHT - 0.06;
  put(g, box(1.02, 0.1, 0.94, MESH, { rough: 0.92 }), 0, panY, 0.02);
  const rimFront = cyl(0.07, 0.07, 1.02, GRAPHITE, { segments: 10, metal: 0.3, rough: 0.5 });
  rimFront.rotation.z = Math.PI / 2;
  rimFront.position.set(0, panY - 0.02, 0.5);
  g.add(rimFront);
  for (const sx of [-0.51, 0.51]) {
    const rimSide = cyl(0.055, 0.055, 0.94, GRAPHITE, { segments: 8, metal: 0.3, rough: 0.5 });
    rimSide.rotation.x = Math.PI / 2;
    rimSide.position.set(sx, panY, 0.02);
    g.add(rimSide);
  }
  const arcR = 1.3;
  const halfSpan = 0.42;
  const backBottom = 0.78;
  const backTop = 2.02;
  const backH = backTop - backBottom;
  const slats = 9;
  const arcPoint = (t) => {
    const ang = t * halfSpan;
    return {
      x: Math.sin(ang) * arcR,
      z: -Math.cos(ang) * arcR + arcR - 0.34,
      ang
    };
  };
  for (let i = 0; i < slats; i++) {
    const t = i / (slats - 1) * 2 - 1;
    const p = arcPoint(t);
    const slat = box(0.13, backH * 0.95, 0.07, MESH, { rough: 0.95 });
    slat.position.set(p.x, backBottom + backH / 2, p.z);
    slat.rotation.y = -p.ang;
    g.add(slat);
  }
  for (const t of [-1, 1]) {
    const p = arcPoint(t);
    const post = box(0.1, backH + 0.12, 0.16, FRAME, { metal: 0.35, rough: 0.45 });
    post.position.set(p.x, backBottom + backH / 2, p.z);
    post.rotation.y = -p.ang;
    g.add(post);
  }
  for (const [y, thick] of [[backTop, 0.1], [backBottom + 0.02, 0.09], [backBottom + backH * 0.3, 0.12]]) {
    const segs = 8;
    for (let i = 0; i < segs; i++) {
      const t = i / (segs - 1) * 2 - 1;
      const p = arcPoint(t);
      const isLumbar = Math.abs(y - (backBottom + backH * 0.3)) < 0.01;
      const seg = box(0.34, thick, 0.1, isLumbar ? GRAPHITE : FRAME, {
        metal: 0.3,
        rough: 0.5,
        cast: false
      });
      seg.position.set(p.x, y, p.z);
      seg.rotation.y = -p.ang;
      g.add(seg);
    }
  }
  const spine = box(0.16, 0.55, 0.14, FRAME, { metal: 0.4, rough: 0.45 });
  spine.position.set(0, 0.62, -0.42);
  spine.rotation.x = -0.22;
  g.add(spine);
  for (const sx of [-0.62, 0.62]) {
    put(g, box(0.1, 0.42, 0.12, FRAME, { metal: 0.35, rough: 0.45 }), sx, 0.86, -0.1);
    put(g, box(0.16, 0.09, 0.62, 1382428, { rough: 0.7 }), sx, 1.1, 0.06);
  }
  return g;
}

// dist/ui/roving/src/scene/props/wall-clock.js
import * as THREE31 from "three";
var CLOCK_TEX_W = 512;
var CLOCK_TEX_H = 232;
var SEG_ON = "#ff2f24";
var SEG_OFF = "#3a0c09";
var DIGIT_SEGMENTS = {
  0: "abcdef",
  1: "bc",
  2: "abdeg",
  3: "abcdg",
  4: "bcfg",
  5: "acdfg",
  6: "acdefg",
  7: "abc",
  8: "abcdefg",
  9: "abcdfg"
};
function drawSevenSegment(ctx, ch, x, y, w, h, t) {
  const lit = DIGIT_SEGMENTS[ch] ?? "";
  const half = h / 2;
  const vLen = half - t * 1.5;
  const midY = y + half - t / 2;
  const bars = [
    ["a", x + t, y, w - 2 * t, t],
    ["b", x + w - t, y + t, t, vLen],
    ["c", x + w - t, midY + t, t, vLen],
    ["d", x + t, y + h - t, w - 2 * t, t],
    ["e", x, midY + t, t, vLen],
    ["f", x, y + t, t, vLen],
    ["g", x + t, midY, w - 2 * t, t]
  ];
  for (const [key, bx, by, bw, bh] of bars) {
    const on = lit.includes(key);
    ctx.fillStyle = on ? SEG_ON : SEG_OFF;
    ctx.shadowColor = on ? SEG_ON : "transparent";
    ctx.shadowBlur = on ? 14 : 0;
    ctx.fillRect(bx, by, bw, bh);
  }
  ctx.shadowBlur = 0;
}
function buildWallClock(spec) {
  const g = group(0, 0, 0);
  const { w, h } = spec;
  const shell = box(w, h, 0.16, 1316378, { rough: 0.55, metal: 0.15 });
  g.add(shell);
  put(g, box(w + 0.14, h + 0.14, 0.1, 2369582, { rough: 0.6, metal: 0.2 }), 0, 0, -0.02);
  const canvas2 = document.createElement("canvas");
  canvas2.width = CLOCK_TEX_W;
  canvas2.height = CLOCK_TEX_H;
  const ctx = canvas2.getContext("2d");
  const tex = new THREE31.CanvasTexture(canvas2);
  tex.colorSpace = THREE31.SRGBColorSpace;
  tex.anisotropy = 4;
  const faceMat = new THREE31.MeshStandardMaterial({
    map: tex,
    emissive: 16777215,
    emissiveMap: tex,
    // only the lit segments emit
    emissiveIntensity: 1.7,
    roughness: 0.35,
    metalness: 0
  });
  const face2 = new THREE31.Mesh(new THREE31.PlaneGeometry(w * 0.88, h * 0.74), faceMat);
  face2.position.z = 0.085;
  g.add(face2);
  const dW = 88, dH = 150, dT = 20, gap = 18, colonW = 26;
  const totalW = dW * 4 + gap * 4 + colonW;
  const originX = (CLOCK_TEX_W - totalW) / 2;
  const originY = (CLOCK_TEX_H - dH) / 2;
  let lastKey = null;
  function render(text, colonOn) {
    const key = `${text}|${colonOn}`;
    if (key === lastKey) return;
    lastKey = key;
    ctx.fillStyle = "#0a0b0d";
    ctx.fillRect(0, 0, CLOCK_TEX_W, CLOCK_TEX_H);
    const digits = text.replace(":", "");
    let x = originX;
    for (let i = 0; i < 4; i++) {
      drawSevenSegment(ctx, digits[i] ?? " ", x, originY, dW, dH, dT);
      x += dW + gap;
      if (i === 1) {
        const cx = x + colonW / 2 - dT / 2;
        ctx.fillStyle = colonOn ? SEG_ON : SEG_OFF;
        ctx.shadowColor = colonOn ? SEG_ON : "transparent";
        ctx.shadowBlur = colonOn ? 14 : 0;
        ctx.fillRect(cx, originY + dH * 0.28, dT, dT);
        ctx.fillRect(cx, originY + dH * 0.64, dT, dT);
        ctx.shadowBlur = 0;
        x += colonW + gap;
      }
    }
    tex.needsUpdate = true;
  }
  const handle = {
    id: "wallClock",
    kind: "wallClock",
    /** Show a Date (or now). Leading zero is kept so it reads as a real panel. */
    setTime(date = /* @__PURE__ */ new Date()) {
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      render(`${hh}:${mm}`, date.getSeconds() % 2 === 0);
    }
  };
  handle.setTime();
  return { obj: g, handle };
}

// dist/ui/roving/src/scene/props/index.js
var PROPS = {
  bookshelf: { build: buildBookshelf, mount },
  waterCooler: { build: buildWaterCooler },
  coffee: { build: buildCoffeeStation },
  mailbox: { build: buildMailbox, mount: mount2 },
  bin: { build: buildBin },
  inbox: { build: buildInbox },
  printer: { build: buildPrinter },
  telescope: { build: buildTelescope, mount: mount5 },
  coatStand: { build: buildCoatStand, mount: mount3 },
  couch: { build: buildCouch, mount: mount4 },
  armchair: { build: buildArmchair, mount: mountArmchair },
  sideTable: { build: buildSideTable },
  floorLamp: { build: buildFloorLamp },
  rug: { mount: mount6 }
};
for (const kind of [...Object.keys(STATION_KINDS), ...Object.keys(FURNITURE_KINDS)]) {
  if (!PROPS[kind]) throw new Error(`prop registry: no builder for kind '${kind}'`);
}
for (const kind of Object.keys(PROPS)) {
  if (!STATION_KINDS[kind] && !FURNITURE_KINDS[kind]) {
    throw new Error(`prop registry: '${kind}' is not a kind the layout knows`);
  }
}

// dist/ui/roving/src/scene/props.js
function buildProps(scene, theme4 = null) {
  const props = group(0, 0, 0);
  const handles = {};
  handles.desks = [];
  handles.bookshelves = [];
  handles.telescopes = [];
  handles.byStation = {};
  for (const spec of DESKS) props.add(buildDeskProp(spec, handles));
  for (const s of Object.values(STATIONS)) {
    const obj = buildStationProp(s, handles);
    if (obj) props.add(obj);
  }
  handles.couches = [];
  for (const spec of FURNITURE) props.add(buildFurnitureProp(spec, handles));
  {
    const spec = DECOR.wallClock;
    const { obj, handle } = buildWallClock(spec);
    obj.position.set(spec.x, spec.y, spec.z);
    obj.rotation.y = spec.facing;
    props.add(obj);
    handles.wallClock = handle;
  }
  for (const p of DECOR.plants) props.add(buildPlantProp(p));
  let sill = buildSillDecor(theme4);
  props.add(sill);
  handles.retheme = (nextTheme) => {
    const old = sill;
    props.remove(old);
    applyMaterialPalette(props);
    for (const m of movables(props)) m.obj.userData.repaint?.(m.spec.color ?? null);
    disposeSubtree(old, { keep: scene });
    sill = buildSillDecor(nextTheme);
    props.add(sill);
  };
  scene.add(props);
  handles.propsRoot = props;
  handles.sync = () => syncProps(props, handles);
  return handles;
}
function buildSillDecor(theme4) {
  const props = group();
  const season = theme4?.season ?? "summer";
  const troughExclude = theme4?.building === "mansard" ? [{ wall: "back", window: 0 }, { wall: "back", window: 1 }] : [];
  for (const t of windowTroughPlacements(troughExclude)) {
    const trough = buildWindowTrough({ width: t.width, season });
    trough.position.set(t.x, t.y, t.z);
    trough.rotation.y = t.rotationY;
    props.add(trough);
  }
  return props;
}
function buildDeskProp(spec, handles) {
  const { obj, handle } = buildDesk(spec, DESKS.indexOf(spec));
  handles.desks.push(handle);
  return movable(obj, `desk:${spec.id}`, {
    label: spec.id,
    spec,
    relocate: () => handle.relocate(),
    teardown: () => drop(handles.desks, handle)
  });
}
function buildStationProp(s, handles) {
  const def = PROPS[s.kind];
  if (!def) return null;
  if (def.mount) {
    const mounted = def.mount(s, handles);
    if (handles[s.kind]) handles.byStation[s.id] = handles[s.kind];
    return mounted;
  }
  const { obj, handle } = def.build();
  place(obj, s);
  handles[s.kind] = handle;
  handles.byStation[s.id] = handle;
  return placed(obj, s, STATION_KINDS[s.kind]?.label ?? s.kind);
}
function buildFurnitureProp(spec, handles) {
  const label2 = FURNITURE_KINDS[spec.kind]?.label ?? spec.kind;
  const def = PROPS[spec.kind];
  if (!def) return null;
  if (def.mount) return def.mount(spec, handles, label2);
  const obj = def.build();
  const relocate = () => {
    obj.position.set(spec.x, 0, spec.z);
    obj.rotation.y = spec.facing ?? 0;
  };
  relocate();
  return movable(obj, `furniture:${spec.id}`, { label: label2, spec, relocate });
}
function buildPlantProp(p) {
  const plant = buildPlantKind(p.kind, p.scale, { seasonal: p.seasonal });
  plant.position.set(p.x, FLOOR_TOP - 0.02, p.z);
  plant.rotation.y = p.facing ?? 0;
  return movable(plant, `plant:${p.id}`, {
    label: `${p.kind} plant`,
    spec: p,
    relocate: () => {
      plant.position.set(p.x, FLOOR_TOP - 0.02, p.z);
      plant.rotation.y = p.facing ?? 0;
    }
  });
}
function syncProps(root, handles) {
  const built = new Map(movables(root).map((m) => [m.key, m]));
  const wanted = [
    ...DESKS.map((spec) => [`desk:${spec.id}`, spec, () => buildDeskProp(spec, handles)]),
    ...Object.values(STATIONS).map((s) => [`station:${s.id}`, s, () => buildStationProp(s, handles)]),
    ...FURNITURE.map((spec) => [`furniture:${spec.id}`, spec, () => buildFurnitureProp(spec, handles)]),
    ...DECOR.plants.map((p) => [`plant:${p.id}`, p, () => buildPlantProp(p)])
  ];
  let added = 0;
  let rebuilt = 0;
  for (const [key, spec, make] of wanted) {
    const there = built.get(key);
    if (there && there.spec === spec) continue;
    if (there) {
      unbuild(there);
      built.delete(key);
      rebuilt += 1;
    }
    const obj = make();
    if (!obj) continue;
    root.add(obj);
    if (!there) added += 1;
  }
  const liveStations = new Set(Object.values(STATIONS).map((st) => st.id));
  for (const id of Object.keys(handles.byStation ?? {})) {
    if (!liveStations.has(id)) delete handles.byStation[id];
  }
  let removed = 0;
  const keep = new Set(wanted.map(([key]) => key));
  for (const [key, m] of built) {
    if (keep.has(key) || !CHANGEABLE.test(key)) continue;
    unbuild(m);
    removed += 1;
  }
  return { added, removed, rebuilt };
}
var CHANGEABLE = /^(desk|station|furniture|plant):/;

// dist/ui/roving/src/scene/framing.js
function zoomForFrame({
  mode,
  aspect,
  frustum,
  halfW,
  halfH,
  maxCrop = 0.12,
  margin = 0.95,
  minZoom,
  maxZoom
}) {
  if (!(aspect > 0) || !(halfW > 0) || !(halfH > 0)) return null;
  const byWidth = frustum * aspect / halfW;
  const byHeight = frustum / halfH;
  const raw = mode === "fill" ? (
    // Go for width, but never past the point where the room loses more than
    // maxCrop of its height.
    Math.min(byWidth, byHeight / (1 - maxCrop))
  ) : (
    // Fit: the tighter axis wins and nothing is cropped.
    Math.min(byWidth, byHeight)
  );
  return Math.max(minZoom, Math.min(maxZoom, raw * margin));
}
function verticalCentre({
  frustum,
  zoom,
  boxTop,
  boxBottom,
  bottomSlackShare = 0.25
}) {
  const halfHeight = frustum / zoom;
  const span = boxTop - boxBottom;
  const slack = 2 * halfHeight - span;
  if (slack >= 0) {
    return boxBottom - bottomSlackShare * slack + halfHeight;
  }
  return boxTop - halfHeight;
}
function roomScreenBox({ elements: e, room, headroom = 0 }) {
  if (!e || e.length < 16 || !room) return null;
  const project = (x, y, z) => ({
    x: e[0] * x + e[4] * y + e[8] * z + e[12],
    y: e[1] * x + e[5] * y + e[9] * z + e[13]
  });
  const top = room.H + headroom;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < 8; i++) {
    const p = project(i & 1 ? room.W : 0, i & 2 ? top : 0, i & 4 ? room.D : 0);
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return {
    halfW: (maxX - minX) / 2,
    halfH: (maxY - minY) / 2,
    centreX: (maxX + minX) / 2,
    top: maxY,
    bottom: minY
  };
}

// dist/ui/roving/src/scene/mail.js
import * as THREE32 from "three";
var FLIGHT_TIME = 1.45;
var POOL_SIZE = 4;
var PAPER = 16250090;
var ADDRESS_TINT = 0.55;
var QUEUE_MAX = 16;
function windowEntry() {
  const span = windowSpan("left", 0);
  return { x: -1.8, y: (WINDOW_SILL_Y + WINDOW_HEAD_Y) / 2 + 0.3, z: span.centre };
}
function buildPaperPlaneMesh() {
  const nose = [0, 0, 0.95];
  const tail = [0, 0, -0.55];
  const tipL = [-0.6, -0.1, -0.5];
  const tipR = [0.6, -0.1, -0.5];
  const keel = [0, -0.26, -0.45];
  const tris = [
    nose,
    tail,
    tipL,
    // left wing
    nose,
    tipR,
    tail,
    // right wing
    nose,
    tipL,
    keel,
    // left keel
    nose,
    keel,
    tipR
    // right keel
  ];
  const positions = new Float32Array(tris.length * 3);
  tris.forEach((v, i) => {
    positions[i * 3] = v[0];
    positions[i * 3 + 1] = v[1];
    positions[i * 3 + 2] = v[2];
  });
  const geo = new THREE32.BufferGeometry();
  geo.setAttribute("position", new THREE32.BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  const material = new THREE32.MeshStandardMaterial({
    color: PAPER,
    roughness: 0.85,
    metalness: 0,
    side: THREE32.DoubleSide,
    flatShading: true
  });
  const mesh2 = new THREE32.Mesh(geo, material);
  mesh2.castShadow = true;
  return mesh2;
}
function cubicBezier(p0, p1, p2, p3, t, out) {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  out.set(
    a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    a * p0.y + b * p1.y + c * p2.y + d * p3.y,
    a * p0.z + b * p1.z + c * p2.z + d * p3.z
  );
  return out;
}
var MailFlights = class {
  constructor(scene, boxAt) {
    this.boxAt = typeof boxAt === "function" ? boxAt : () => boxAt;
    this.onArrive = null;
    this.root = group(0, 0, 0);
    scene.add(this.root);
    this.waiting = [];
    this.pool = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const plane = buildPaperPlaneMesh();
      plane.visible = false;
      this.root.add(plane);
      this.pool.push({
        mesh: plane,
        active: false,
        t: 0,
        payload: null,
        p0: new THREE32.Vector3(),
        p1: new THREE32.Vector3(),
        p2: new THREE32.Vector3(),
        p3: new THREE32.Vector3()
      });
    }
    this._pos = new THREE32.Vector3();
    this._prev = new THREE32.Vector3();
  }
  /**
   * Lay out the flight path: in through the window, a sweep into the room, then a dive
   * into the mailbox slot.
   *
   * Its own method rather than four lines in the constructor because the mailbox can
   * move. The path is four fixed control points, computed once against where the slot
   * was — so a mailbox dragged across the room would go on receiving post at its old
   * address, planes diving into thin air. The furniture editor calls this after a drop
   * (see src/editor.js).
   *
   * The control points are updated in place, because a flight already in the air is
   * interpolating along these very vectors: replacing them would leave the plane
   * finishing its journey to the old slot.
   */
  relocate() {
    for (const slot of this.pool) {
      if (slot.active) this._aim(slot, slot.payload?.box ?? null);
    }
  }
  /**
   * Lay one flight's path out: in through the window, a sweep into the room, then a
   * dive into the box this envelope is addressed to.
   *
   * The box comes off the payload rather than being drawn here. The manager draws it
   * once as it posts and stamps the answer on, so the plane and the envelope cannot end
   * up in different boxes — which two independent draws would eventually manage.
   */
  _aim(slot, boxId) {
    const entry = windowEntry();
    const handle = boxId ? this.boxAt?.(boxId) : null;
    const station2 = boxId ? STATIONS[boxId] : null;
    const target = handle?.slot ?? (station2 ? new THREE32.Vector3(station2.x + 0.6, 1.6, station2.z) : entry);
    slot.p0.set(entry.x, entry.y, entry.z);
    slot.p1.set(7, entry.y + 0.8, entry.z - 1.6);
    slot.p2.set(7.5, target.y + 1.9, target.z + 1.5);
    slot.p3.copy(target);
  }
  /**
   * Send a new job flying in.
   *
   * If every plane is already airborne the job is held and sent the moment one
   * lands, rather than dropped: jobs can be requested faster than the flight
   * time (the `t` shortcut is one keypress) and losing one would look like the
   * office had swallowed it. Order is preserved.
   *
   * @param {*} payload  carried along and handed to `onArrive` on touchdown, so
   *                     the UI announces the job exactly as the plane lands.
   *                     `{ job, forId?, color? }` — `forId` addresses the
   *                     envelope to one agent, and `color` is theirs, used to
   *                     tint the plane in flight.
   * @return {boolean} false only if the waiting list is also full
   */
  launch(payload = null) {
    const slot = this.pool.find((p) => !p.active);
    if (!slot) {
      if (this.waiting.length >= QUEUE_MAX) return false;
      this.waiting.push(payload);
      return true;
    }
    this._send(slot, payload);
    return true;
  }
  /** Put a specific pooled plane at the start of the flight path. */
  _send(slot, payload) {
    slot.active = true;
    slot.t = 0;
    slot.payload = payload;
    slot.mesh.visible = true;
    slot.mesh.scale.setScalar(1);
    const to = payload?.color;
    slot.mesh.material.color.set(PAPER);
    if (typeof to === "number") slot.mesh.material.color.lerp(new THREE32.Color(to), ADDRESS_TINT);
    this._aim(slot, payload?.box ?? null);
    cubicBezier(slot.p0, slot.p1, slot.p2, slot.p3, 0, slot.mesh.position);
  }
  update(dt) {
    for (const p of this.pool) {
      if (!p.active) continue;
      this._prev.copy(p.mesh.position);
      p.t += dt / FLIGHT_TIME;
      if (p.t >= 1) {
        p.active = false;
        p.mesh.visible = false;
        p.t = 0;
        const { payload } = p;
        p.payload = null;
        this.onArrive?.(payload);
        continue;
      }
      cubicBezier(p.p0, p.p1, p.p2, p.p3, p.t, this._pos);
      p.mesh.position.copy(this._pos);
      const dx = this._pos.x - this._prev.x;
      const dy = this._pos.y - this._prev.y;
      const dz = this._pos.z - this._prev.z;
      const horiz = Math.hypot(dx, dz);
      if (horiz > 1e-5) {
        p.mesh.rotation.y = Math.atan2(dx, dz);
        p.mesh.rotation.x = -Math.atan2(dy, horiz);
      }
      p.mesh.rotation.z = Math.sin(p.t * Math.PI * 3) * 0.3;
      if (p.t > 0.88) p.mesh.scale.setScalar(1 - (p.t - 0.88) / 0.12 * 0.5);
    }
    while (this.waiting.length) {
      const slot = this.pool.find((p) => !p.active);
      if (!slot) break;
      this._send(slot, this.waiting.shift());
    }
  }
};

// dist/ui/roving/src/scene/birds.js
import * as THREE33 from "three";

// dist/ui/roving/src/time.js
var offsetMs = 0;
function msIntoDay(date) {
  return date.getHours() * 36e5 + date.getMinutes() * 6e4 + date.getSeconds() * 1e3 + date.getMilliseconds();
}
var worldClock = {
  /** The current world time, as a Date. */
  now() {
    return new Date(Date.now() + offsetMs);
  },
  /** Fractional hours since midnight, e.g. 13.5 for half past one. */
  hours() {
    return msIntoDay(this.now()) / 36e5;
  },
  /** Whether the world time has been pushed away from real time. */
  get shifted() {
    return offsetMs !== 0;
  },
  get offsetMs() {
    return offsetMs;
  },
  /**
   * Jump the world clock to a given hour of the day, keeping it ticking from
   * there. Wraps, so 25 is 01:00 tomorrow and −1 is 23:00.
   */
  setHours(hours) {
    const target = (hours % 24 + 24) % 24;
    const real = /* @__PURE__ */ new Date();
    offsetMs = Math.round(target * 36e5) - msIntoDay(real);
  },
  /** Hand the clock back to real time. */
  reset() {
    offsetMs = 0;
  }
};

// dist/ui/roving/src/scene/birds.js
var POOL_SIZE2 = 1;
var IN_TIME = 1.2;
var HOVER_TIME = 0.4;
var OUT_TIME = 0.97;
var DROP_TIME = 0.18;
var PAPER2 = 16250090;
var ADDRESS_TINT2 = 0.55;
var QUEUE_MAX2 = 16;
var TALON_OFFSET = new THREE33.Vector3(0, -0.32, 0.1);
var TUCK_SWEEP = 1.25;
var TUCK_FULL_BY = 1.4;
var TUCK_NONE_BY = 3.6;
var WALL_X = 0;
var NIGHT_FROM = 19;
var NIGHT_TO = 7;
var BIRD_SHARE = 1 / 3;
var OWL_SHARE = { night: 0.75, day: 0.5 };
var UNDERSTUDIES = ["pigeon", "kookaburra", "raven"];
var BIRD_KINDS = ["owl", ...UNDERSTUDIES];
function rosterBird(shift2, rng = Math.random) {
  if (rng() < OWL_SHARE[shift2]) return "owl";
  const i = Math.floor(rng() * UNDERSTUDIES.length);
  return UNDERSTUDIES[Math.min(UNDERSTUDIES.length - 1, i)];
}
var LIGHT = { col: 1, row: WINDOW_LIGHTS.rows - 1 };
var OUTSIDE_X = -1.8;
var THREAD_X = 4;
function windowEntry2() {
  const light = windowLight("left", 0, LIGHT.col, LIGHT.row);
  return { x: OUTSIDE_X, y: light.midY, z: light.centre, light };
}
function tuckAt(x) {
  const d = Math.abs(x - WALL_X);
  if (d <= TUCK_FULL_BY) return 1;
  if (d >= TUCK_NONE_BY) return 0;
  const u = 1 - (d - TUCK_FULL_BY) / (TUCK_NONE_BY - TUCK_FULL_BY);
  return u * u * (3 - 2 * u);
}
function poseWings(bird, tuck, flap) {
  const sweep = tuck * TUCK_SWEEP;
  bird.wingL.rotation.y = -sweep;
  bird.wingR.rotation.y = sweep;
  const beat = flap * (1 - tuck * 0.85);
  bird.wingL.rotation.z = -beat;
  bird.wingR.rotation.z = beat;
}
function cubicBezier2(p0, p1, p2, p3, t, out) {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  out.set(
    a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    a * p0.y + b * p1.y + c * p2.y + d * p3.y,
    a * p0.z + b * p1.z + c * p2.z + d * p3.z
  );
  return out;
}
var mat2 = (color, rough = 0.85) => new THREE33.MeshStandardMaterial({ color, roughness: rough, metalness: 0, flatShading: true });
var SPECIES2 = {
  owl: {
    body: 11107919,
    head: 11107919,
    belly: 14206106,
    wing: 9069888,
    beak: 9071150,
    beakLen: 0.1,
    beakDrop: 0.05,
    // short, hooked downward
    eye: 1840396,
    eyeSize: 0.09,
    // the big owl eyes
    scale: 1.5,
    tail: 0.3,
    face: 15391157,
    tufts: true
  },
  raven: {
    body: 1908774,
    head: 1908774,
    belly: 2435118,
    wing: 1447965,
    beak: 3027256,
    beakLen: 0.24,
    beakDrop: 0,
    // the long straight bill
    eye: 855827,
    eyeSize: 0.055,
    scale: 1.5,
    tail: 0.44,
    gloss: 0.45
    // wedge tail, oily sheen
  },
  pigeon: {
    body: 9080992,
    head: 5922928,
    belly: 11054522,
    wing: 7765132,
    beak: 3816772,
    beakLen: 0.09,
    beakDrop: 0.02,
    eye: 14182954,
    eyeSize: 0.05,
    // the orange pigeon eye
    scale: 1.3,
    tail: 0.3,
    neck: 3836506,
    wingBars: 3027256
  },
  kookaburra: {
    body: 7231032,
    head: 15260864,
    belly: 15260864,
    wing: 6113840,
    beak: 4864554,
    beakLen: 0.3,
    beakDrop: 0.02,
    // the great heavy bill
    eye: 2760726,
    eyeSize: 0.06,
    eyeStripe: 4864554,
    scale: 1.45,
    tail: 0.36,
    tailBar: 10115642,
    wingFlash: 4881080
  }
};
function buildBirdMesh(kind = "raven") {
  const s = SPECIES2[kind] ?? SPECIES2.raven;
  const g = group(0, 0, 0);
  const rough = s.gloss ?? 0.85;
  const chest = new THREE33.Mesh(new THREE33.BoxGeometry(0.42, 0.42, 0.5), mat2(s.body, rough));
  chest.position.set(0, 0.02, 0.08);
  chest.rotation.x = 0.14;
  chest.castShadow = true;
  g.add(chest);
  const rump = new THREE33.Mesh(new THREE33.BoxGeometry(0.32, 0.3, 0.4), mat2(s.body, rough));
  rump.position.set(0, 0.06, -0.26);
  rump.rotation.x = -0.18;
  g.add(rump);
  const belly = new THREE33.Mesh(new THREE33.BoxGeometry(0.36, 0.14, 0.42), mat2(s.belly, 0.9));
  belly.position.set(0, -0.16, 0.06);
  g.add(belly);
  const head = new THREE33.Mesh(new THREE33.BoxGeometry(0.3, 0.28, 0.3), mat2(s.head, rough));
  head.position.set(0, 0.32, 0.32);
  head.castShadow = true;
  g.add(head);
  if (s.neck) {
    const collar = new THREE33.Mesh(new THREE33.BoxGeometry(0.26, 0.1, 0.2), mat2(s.neck, 0.4));
    collar.position.set(0, 0.19, 0.26);
    g.add(collar);
  }
  if (s.face) {
    const face2 = new THREE33.Mesh(new THREE33.BoxGeometry(0.28, 0.22, 0.04), mat2(s.face, 0.95));
    face2.position.set(0, 0.32, 0.48);
    g.add(face2);
  }
  if (s.tufts) {
    for (const sx of [-0.1, 0.1]) {
      const tuft = new THREE33.Mesh(new THREE33.BoxGeometry(0.07, 0.12, 0.07), mat2(s.head));
      tuft.position.set(sx, 0.49, 0.28);
      tuft.rotation.z = -sx * 2;
      g.add(tuft);
    }
  }
  if (s.eyeStripe) {
    const stripe = new THREE33.Mesh(new THREE33.BoxGeometry(0.32, 0.07, 0.2), mat2(s.eyeStripe));
    stripe.position.set(0, 0.35, 0.34);
    g.add(stripe);
  }
  for (const sx of [-0.1, 0.1]) {
    const eye = new THREE33.Mesh(
      new THREE33.BoxGeometry(s.eyeSize, s.eyeSize, 0.03),
      mat2(s.eye, 0.3)
    );
    eye.position.set(sx, 0.35, s.face ? 0.51 : 0.46);
    g.add(eye);
  }
  const beak = new THREE33.Mesh(new THREE33.ConeGeometry(0.055, s.beakLen, 4), mat2(s.beak, 0.5));
  beak.rotation.x = Math.PI / 2 + s.beakDrop * 4;
  beak.position.set(0, 0.3 - s.beakDrop, 0.46 + s.beakLen / 2);
  g.add(beak);
  for (const [i, sx] of [-1, 0, 1].entries()) {
    const slat = new THREE33.Mesh(
      new THREE33.BoxGeometry(0.11, 0.04, s.tail + (sx === 0 ? 0.06 : 0)),
      mat2(i === 1 && s.tailBar ? s.tailBar : s.body, rough)
    );
    slat.position.set(sx * 0.1, 0.06, -0.44 - s.tail / 2);
    slat.rotation.y = sx * 0.16;
    slat.rotation.x = -0.32;
    g.add(slat);
  }
  for (const sx of [-0.09, 0.09]) {
    const leg = new THREE33.Mesh(new THREE33.CylinderGeometry(0.02, 0.02, 0.14, 5), mat2(9071150, 0.6));
    leg.position.set(sx, -0.22, -0.05);
    leg.rotation.x = 1.2;
    g.add(leg);
  }
  const wingPair = (side) => {
    const pivot = group(side * 0.2, 0.14, 0.02);
    const inner = new THREE33.Mesh(new THREE33.BoxGeometry(0.42, 0.05, 0.4), mat2(s.wing, rough));
    inner.position.x = side * 0.21;
    inner.castShadow = true;
    pivot.add(inner);
    const outer = new THREE33.Mesh(new THREE33.BoxGeometry(0.44, 0.04, 0.32), mat2(s.wing, rough));
    outer.position.set(side * 0.58, 0, -0.1);
    outer.rotation.y = -side * 0.5;
    outer.castShadow = true;
    pivot.add(outer);
    if (s.wingBars) {
      const bar = new THREE33.Mesh(new THREE33.BoxGeometry(0.4, 0.055, 0.06), mat2(s.wingBars));
      bar.position.set(side * 0.21, 0, -0.08);
      pivot.add(bar);
    }
    if (s.wingFlash) {
      const flash = new THREE33.Mesh(new THREE33.BoxGeometry(0.2, 0.055, 0.14), mat2(s.wingFlash, 0.5));
      flash.position.set(side * 0.16, 0, 0.06);
      pivot.add(flash);
    }
    return pivot;
  };
  const wingL = wingPair(-1);
  const wingR = wingPair(1);
  g.add(wingL, wingR);
  g.scale.setScalar(s.scale);
  return { root: g, wingL, wingR };
}
var BirdFlights = class {
  /**
   * @param {THREE.Object3D} scene  the world root
   * @param {(id: string) => ?object} boxAt  box prop by id, as MailFlights takes it
   */
  constructor(scene, boxAt) {
    this.boxAt = typeof boxAt === "function" ? boxAt : () => boxAt;
    this.onArrive = null;
    this.root = group(0, 0, 0);
    scene.add(this.root);
    this.waiting = [];
    this.pool = [];
    for (let i = 0; i < POOL_SIZE2; i++) {
      const perch = group(0, 0, 0);
      const birds = {};
      for (const kind of BIRD_KINDS) {
        birds[kind] = buildBirdMesh(kind);
        birds[kind].root.visible = false;
        perch.add(birds[kind].root);
      }
      const letter = new THREE33.Mesh(
        new THREE33.BoxGeometry(0.36, 0.05, 0.26),
        new THREE33.MeshStandardMaterial({ color: PAPER2, roughness: 0.9 })
      );
      letter.position.copy(TALON_OFFSET);
      perch.add(letter);
      perch.visible = false;
      this.root.add(perch);
      this.pool.push({
        perch,
        birds,
        letter,
        bird: birds.raven,
        active: false,
        phase: "in",
        // in → hover → out
        t: 0,
        clock: Math.random() * 10,
        // start the wingbeat somewhere other than zero
        payload: null,
        p0: new THREE33.Vector3(),
        p1: new THREE33.Vector3(),
        p2: new THREE33.Vector3(),
        p3: new THREE33.Vector3(),
        hover: new THREE33.Vector3(),
        slot: new THREE33.Vector3()
      });
    }
    this._pos = new THREE33.Vector3();
    this._prev = new THREE33.Vector3();
    this._drop = new THREE33.Vector3();
  }
  /** Re-aim every flight in the air, for a box dragged mid-delivery. */
  relocate() {
    for (const slot of this.pool) {
      if (slot.active) this._aim(slot, slot.payload?.box ?? null);
    }
  }
  _aim(slot, boxId) {
    const entry = windowEntry2();
    const handle = boxId ? this.boxAt?.(boxId) : null;
    const station2 = (boxId && STATIONS[boxId]) ?? STATIONS.mailbox;
    const target = handle?.slot ?? new THREE33.Vector3(station2.x + 0.6, 1.6, station2.z);
    slot.slot.copy(target);
    slot.hover.set(target.x + 0.4, target.y + 1.15, target.z + 0.5);
    slot.p0.set(entry.x, entry.y, entry.z);
    slot.p1.set(THREAD_X, entry.y, entry.z);
    slot.p2.copy(slot.p1);
    slot.p3.copy(slot.hover);
  }
  /** Point the exit path from wherever the hover ended back out the window. */
  _aimOut(slot) {
    const entry = windowEntry2();
    slot.p0.copy(slot.hover);
    slot.p1.set(THREAD_X, entry.y, entry.z);
    slot.p2.copy(slot.p1);
    slot.p3.set(entry.x, entry.y, entry.z);
  }
  /**
   * Send a letter in by bird. Same contract as MailFlights.launch: held in
   * order if the aviary is busy, false only when the waiting list is also full.
   *
   * **One bird in the air at a time**, which is the courier's rule for the courier's
   * reason: two of them sharing a doorway reads as a bug even when the queue behind
   * them is honest. Planes get away with four at once because a plane is a dart that
   * can pass a foot from another dart; a bird is three units of wingspan aiming at
   * one hole in one window and then at one slot in one box, so two of them at once
   * were not near each other — they were *inside* each other, which is what this
   * fixes. Letters that arrive together now trickle in a flight apart,
   * about two and a half seconds, and the tally on the box is the same either way.
   */
  launch(payload = null) {
    const slot = this.pool.find((p) => !p.active);
    if (!slot) {
      if (this.waiting.length >= QUEUE_MAX2) return false;
      this.waiting.push(payload);
      return true;
    }
    this._send(slot, payload);
    return true;
  }
  _send(slot, payload) {
    slot.active = true;
    slot.phase = "in";
    slot.t = 0;
    slot.payload = payload;
    const h = worldClock.hours();
    const chosen = CHANNELS.birdKind !== "roster" && SPECIES2[CHANNELS.birdKind] ? CHANNELS.birdKind : null;
    const night = h >= NIGHT_FROM || h < NIGHT_TO;
    const kind = chosen ?? rosterBird(night ? "night" : "day");
    for (const b of Object.values(slot.birds)) b.root.visible = false;
    slot.bird = slot.birds[kind];
    slot.bird.root.visible = true;
    slot.letter.visible = true;
    slot.letter.position.copy(TALON_OFFSET);
    slot.letter.material.color.set(PAPER2);
    const to = payload?.color;
    if (typeof to === "number") slot.letter.material.color.lerp(new THREE33.Color(to), ADDRESS_TINT2);
    this._aim(slot, payload?.box ?? null);
    cubicBezier2(slot.p0, slot.p1, slot.p2, slot.p3, 0, slot.perch.position);
    slot.perch.visible = true;
  }
  update(dt) {
    for (const p of this.pool) {
      if (!p.active) continue;
      p.clock += dt;
      const flap = p.phase === "hover" ? Math.sin(p.clock * 26) * 0.85 : Math.sin(p.clock * 23) * 0.55 + 0.1;
      poseWings(p.bird, tuckAt(p.perch.position.x), flap);
      if (p.phase === "in" || p.phase === "out") {
        this._prev.copy(p.perch.position);
        p.t += dt / (p.phase === "in" ? IN_TIME : OUT_TIME);
        if (p.t >= 1) {
          if (p.phase === "in") {
            p.phase = "hover";
            p.t = 0;
            p.perch.position.copy(p.hover);
          } else {
            p.active = false;
            p.perch.visible = false;
            p.t = 0;
            p.payload = null;
          }
          continue;
        }
        cubicBezier2(p.p0, p.p1, p.p2, p.p3, p.t, this._pos);
        p.perch.position.copy(this._pos);
        const dx = this._pos.x - this._prev.x;
        const dz = this._pos.z - this._prev.z;
        if (Math.hypot(dx, dz) > 1e-5) p.perch.rotation.y = Math.atan2(dx, dz);
        p.perch.rotation.z = Math.sin(p.t * Math.PI) * (p.phase === "in" ? -0.18 : 0.18);
      } else {
        p.t += dt / HOVER_TIME;
        p.perch.position.y = p.hover.y + Math.sin(p.clock * 8) * 0.05;
        if (p.letter.visible) {
          const dropT = Math.min(1, p.t * (HOVER_TIME / DROP_TIME));
          const to = this._drop.copy(p.slot).sub(p.perch.position);
          p.letter.position.lerpVectors(TALON_OFFSET, to, dropT * dropT);
          if (dropT >= 1) {
            p.letter.visible = false;
            const { payload } = p;
            this.onArrive?.(payload);
          }
        }
        if (p.t >= 1) {
          p.phase = "out";
          p.t = 0;
          this._aimOut(p);
        }
      }
    }
    while (this.waiting.length) {
      const slot = this.pool.find((s) => !s.active);
      if (!slot) break;
      this._send(slot, this.waiting.shift());
    }
  }
};

// dist/ui/roving/src/scene/courier.js
import * as THREE34 from "three";
var OFF_STAGE = { x: DOOR.x + 4.6, z: -5.4 };
var AT_DOOR = { x: DOOR.x + 0.1, z: -1.85 };
var INSIDE = { x: DOOR.x - 0.25, z: 1.5 };
var IN_CAR = { x: DOOR.x, z: -1.05 };
var LIFT_WAIT = 6;
var WALK = 9.2;
var RUN = WALK * 1.35;
var STEP = WALK * 0.43;
var STRIDE = 1.5;
var DOOR_LEAD = 0.9;
var HEAVE = 0.45;
var THROW_FROM = { x: INSIDE.x - 0.15, y: 2, z: INSIDE.z + 0.6 };
var PARCEL2 = 0.5;
var CARRY_Y = 1.25;
var QUEUE_MAX3 = 8;
var DROPPED_SLOTS = 3;
function buildCourier() {
  const g = group(0, 0, 0);
  const legs = [];
  for (const side of [-1, 1]) {
    const leg = group(side * 0.18, 0.9, 0);
    put(leg, box(0.3, 0.9, 0.3, 4143670, { rough: 0.85 }), 0, -0.45);
    put(leg, box(0.3, 0.12, 0.44, 2237995, { rough: 0.7 }), 0, -0.84, 0.08);
    g.add(leg);
    legs.push(leg);
  }
  put(g, box(0.8, 1, 0.5, COLORS.courier, { rough: 0.8 }), 0, 1.4);
  put(g, box(0.82, 0.12, 0.52, 3025446, { rough: 0.8, cast: false }), 0, 1);
  put(g, box(0.62, 0.62, 0.62, 14133375, { rough: 0.9 }), 0, 2.2);
  put(g, box(0.66, 0.18, 0.64, COLORS.courier, { rough: 0.8 }), 0, 2.58);
  put(g, box(0.58, 0.07, 0.22, 5191722, { rough: 0.8, cast: false }), 0, 2.53, 0.42);
  const arms = group(0, 1.78, 0);
  for (const side of [-1, 1]) {
    put(arms, box(0.22, 0.8, 0.22, COLORS.courier, { rough: 0.8 }), side * 0.52, -0.4, 0.1);
    put(arms, box(0.2, 0.18, 0.2, 14133375, { rough: 0.6, cast: false }), side * 0.52, -0.86, 0.1);
  }
  g.add(arms);
  g.visible = false;
  return { obj: g, legs, arms };
}
function buildParcel() {
  const g = group(0, 0, 0);
  g.add(box(PARCEL2, PARCEL2, PARCEL2, COLORS.parcel, { rough: 0.9 }));
  g.add(box(PARCEL2 * 0.13, PARCEL2 + 6e-3, PARCEL2 + 6e-3, COLORS.parcelTape, {
    rough: 0.8,
    cast: false
  }));
  const label2 = box(PARCEL2 * 0.22, 4e-3, PARCEL2 * 0.16, 15261901, {
    rough: 0.9,
    cast: false
  });
  label2.position.set(-PARCEL2 * 0.22, PARCEL2 / 2 + 4e-3, PARCEL2 * 0.2);
  g.add(label2);
  g.visible = false;
  return g;
}
var Route = class _Route {
  /** @param {Array<{x: number, y?: number, z: number, speed?: number}>} points */
  constructor(points) {
    this.points = points;
    this.legs = [];
    this.seconds = 0;
    let covered = 0;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      const length = Math.hypot(b.x - a.x, (b.y ?? 0) - (a.y ?? 0), b.z - a.z);
      const seconds = length / (b.speed ?? WALK);
      this.legs.push({ a, b, length, seconds, from: this.seconds, covered });
      this.seconds += seconds;
      covered += length;
    }
    this.length = covered;
    this.entersAt = this.legs.length ? this.legs[this.legs.length - 1].from : 0;
  }
  /**
   * Where the walker is at time `t`, written into `out` to keep the frame free of
   * allocation. `heading` is null on a leg with nowhere to go, so a walker holds
   * whatever way they were already facing rather than snapping to due north.
   */
  at(t, out) {
    const legs = this.legs;
    if (!legs.length) {
      const p = this.points[0];
      out.position.set(p.x, p.y ?? 0, p.z);
      out.heading = null;
      out.distance = 0;
      return out;
    }
    let leg = legs[legs.length - 1];
    for (const l of legs) {
      if (t < l.from + l.seconds) {
        leg = l;
        break;
      }
    }
    const k = leg.seconds > 0 ? clamp01((t - leg.from) / leg.seconds) : 1;
    const { a, b } = leg;
    out.position.set(
      lerp(a.x, b.x, k),
      lerp(a.y ?? 0, b.y ?? 0, k),
      lerp(a.z, b.z, k)
    );
    out.heading = leg.length > 1e-4 ? Math.atan2(b.x - a.x, b.z - a.z) : null;
    out.distance = leg.covered + leg.length * k;
    return out;
  }
  /**
   * The same route walked the other way.
   *
   * A speed belongs to the leg that arrives at a point, so reversing the points
   * would hand every leg the speed of the one before it — the run down the flight
   * would be taken at the pavement's walk, and the step through the door at a run.
   * Each point therefore inherits the speed of the point that followed it.
   */
  reversed() {
    const p = this.points;
    const last = p.length - 1;
    return new _Route(p.map((_, i) => ({ ...p[last - i], speed: p[last - i + 1]?.speed })));
  }
};
var CourierDeliveries = class {
  /**
   * @param {THREE.Object3D} scene
   * @param {object} [props]  the prop handles. `mailbox` gives the landing point,
   *   `door` is asked to open, and the entrance-specific ones choose the way in:
   *   `elevator` when the office opens onto a lift, `stairs` when it is up a flight,
   *   `stoop` when the door opens onto the street (see scene/approach.js). All
   *   optional: with none of them, deliveries still complete on time so the post model
   *   never stalls waiting on scenery.
   */
  constructor(scene, {
    boxAt = null,
    door = null,
    elevator = null,
    stairs = null,
    stoop = null
  } = {}) {
    this.boxAt = boxAt;
    this.door = door;
    this.elevator = elevator;
    this.stairs = stairs;
    this.stoop = stoop;
    this.onArrive = null;
    this.root = group(0, 0, 0);
    scene.add(this.root);
    const courier = buildCourier();
    this.courier = courier.obj;
    this.legs = courier.legs;
    this.arms = courier.arms;
    this.root.add(this.courier);
    this.parcel = buildParcel();
    this.root.add(this.parcel);
    this.dropped = [];
    for (let i = 0; i < DROPPED_SLOTS; i++) {
      const box3 = buildParcel();
      box3.visible = false;
      this.root.add(box3);
      this.dropped.push(box3);
    }
    this._droppedAt = null;
    this.waiting = [];
    this.phase = "idle";
    this.t = 0;
    this.payload = null;
    this.route = null;
    this.target = new THREE34.Vector3();
    this.relocate();
    this._pos = new THREE34.Vector3();
    this._at = { position: new THREE34.Vector3(), heading: null, distance: 0 };
  }
  /**
   * Where the throw is aimed: the pile beside the mailbox.
   *
   * Its own method for the same reason MailFlights.relocate() is — the mailbox can be
   * dragged across the room, and a target cloned once at build time would have the
   * courier lobbing parcels at the floor where the box used to stand. Updated in
   * place, so a throw already in flight lands where the box is now.
   */
  relocate() {
    this._aim(this.payload?.box ?? null);
  }
  /** Keep payloads and throws alive when the entrance around the courier changes. */
  redecorate(next, previous) {
    const changed = Boolean(previous.elevator) !== Boolean(next.elevator) || JSON.stringify(previous.stairs?.route) !== JSON.stringify(next.stairs?.route) || JSON.stringify(previous.stoop?.route) !== JSON.stringify(next.stoop?.route);
    for (const key of ["door", "elevator", "stairs", "stoop"]) this[key] = next[key] ?? null;
    if (!changed || !this.busy) return;
    if (this.phase === "approach" || this.phase === "summon") {
      this.route = new Route([{ ...INSIDE, y: 0 }]);
      this.phase = "approach";
      this.t = 0;
      this._place(INSIDE.x, 0, INSIDE.z);
      this._parcelToHands();
    } else if (this.phase === "leave") {
      this.route = this._approach().reversed();
      this.t = 0;
      this._place(INSIDE.x, 0, INSIDE.z);
    } else {
      this.route = this._approach();
    }
    this.relocate();
  }
  /**
   * Where the parcel is going, out of the box named on the payload.
   *
   * Named there rather than decided here, because the manager drew the box once as it
   * posted: two independent draws would eventually send the courier to one box and the
   * envelope to another.
   */
  _aim(boxId) {
    const handle = boxId ? this.boxAt?.(boxId) : null;
    const station2 = boxId ? STATIONS[boxId] : null;
    if (handle?.pile) return this.target.copy(handle.pile);
    if (station2) return this.target.set(station2.x, PARCEL2 * 0.6, station2.z + 1.25);
    const [best] = landingsFor("package");
    if (best) return this.target.set(best.x, PARCEL2 * 0.6, best.z + 1.25);
    return this.target;
  }
  /** Whether there is anywhere for a parcel to be put down. */
  get canDeliver() {
    return STATIONS && landingsFor("package").length > 0;
  }
  /**
   * Draw the parcels waiting beside a station that has no pile of its own.
   *
   * Told rather than counted, on the same terms as the mailbox's own pile: the post
   * model is the only thing that knows what is waiting, and a channel keeping its own
   * tally would be a second answer free to disagree with the first.
   *
   * One station at a time, which is all the room can produce: `landingsFor('package')`
   * returns the best-preferred *kind* present, so parcels go to mailboxes or to printers
   * or to inboxes and never to two of those at once. A change of station clears the old
   * pile, so nothing is left lying beside furniture that is no longer receiving.
   *
   * @param {?string} id     the station, or null to clear
   * @param {number} count   parcels waiting there
   */
  showDropped(id, count = 0) {
    if (id !== this._droppedAt) {
      for (const box3 of this.dropped) box3.visible = false;
      this._droppedAt = id;
    }
    const station2 = id ? STATIONS[id] : null;
    for (let i = 0; i < this.dropped.length; i++) {
      const box3 = this.dropped[i];
      const show = Boolean(station2) && i < count;
      box3.visible = show;
      if (!show) continue;
      const flip = i % 2 ? 1 : -1;
      box3.position.set(
        station2.x + flip * (0.35 + i * 0.12),
        PARCEL2 * 0.6,
        station2.z + 1.25 + i % 3 * 0.28
      );
      box3.rotation.y = flip * (0.2 + i * 0.15);
    }
  }
  /**
   * Send a package out for delivery.
   *
   * @param {*} payload  handed to `onArrive` as the parcel lands, so the office
   *   announces the work at the moment it thumps down.
   * @return {boolean} false only if the waiting list is full
   */
  launch(payload = null) {
    if (!payload?.box && !this.canDeliver) return false;
    if (this.phase !== "idle") {
      if (this.waiting.length >= QUEUE_MAX3) return false;
      this.waiting.push(payload);
      return true;
    }
    this._begin(payload);
    return true;
  }
  /** True while a delivery is running, for anything that wants to know. */
  get busy() {
    return this.phase !== "idle";
  }
  _begin(payload) {
    this.payload = payload;
    this._aim(payload?.box ?? null);
    this.t = 0;
    this.courier.visible = true;
    this.parcel.visible = true;
    this.arms.rotation.x = 0;
    this.route = this._approach();
    if (this.elevator) {
      this.phase = "summon";
      this.elevator.call();
      this._place(IN_CAR.x, this.elevator.carY, IN_CAR.z);
      this.courier.rotation.y = 0;
      this._parcelToHands();
      return;
    }
    this.phase = "approach";
    const start = this.route.points[0];
    this._place(start.x, start.y ?? 0, start.z);
    this.courier.rotation.y = this.route.at(0, this._at).heading ?? 0;
    this._parcelToHands();
  }
  /** The way in, whichever entrance this office has. */
  _approach() {
    if (this.elevator) {
      return new Route([{ ...IN_CAR, y: 0 }, { ...INSIDE, y: 0, speed: STEP }]);
    }
    if (this.stairs) {
      const f = this.stairs;
      const [pad, bottom, top, landing] = f.route;
      return new Route([
        // In along the pavement, a storey below the floor being delivered to.
        { x: f.xPad + f.tread * 5, y: f.groundY, z: f.z },
        { ...pad },
        // Up the flight at a run. Two points, because the pitch is constant and the
        // line through the tread noses is the flight itself (see scene/approach.js).
        { ...bottom, speed: RUN },
        { ...top, speed: RUN },
        { ...landing },
        { ...INSIDE, y: 0, speed: STEP }
      ]);
    }
    if (this.stoop) {
      const [corner, edge, up, landing] = this.stoop.route;
      return new Route([
        { ...corner },
        { ...edge },
        { ...up, speed: STEP },
        { ...landing },
        { ...INSIDE, y: 0, speed: STEP }
      ]);
    }
    return new Route([
      { ...OFF_STAGE, y: 0 },
      { ...AT_DOOR, y: 0 },
      { ...INSIDE, y: 0, speed: STEP }
    ]);
  }
  _place(x, y, z) {
    this.courier.position.set(x, y, z);
  }
  /** Turn toward the way they are walking, rather than snapping at every corner. */
  _face(heading2, dt) {
    if (heading2 == null) return;
    let delta = heading2 - this.courier.rotation.y;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    this.courier.rotation.y += delta * Math.min(1, dt * 9);
  }
  /** Parcel held in front of the chest, riding along with the courier. */
  _parcelToHands() {
    const c = this.courier.position;
    const r = this.courier.rotation.y;
    this.parcel.position.set(c.x + Math.sin(r) * 0.5, c.y + CARRY_Y, c.z + Math.cos(r) * 0.5);
    this.parcel.rotation.set(0, r, 0);
  }
  /**
   * Hold whatever is in the doorway open.
   *
   * Renewed every frame rather than booked for a duration, because how long the
   * courier is inside depends on a throw whose length depends on the room. A lift's
   * landing doors answer the same call (they are the same handle), and asking also
   * summons the car — which is exactly what is wanted while standing on its floor.
   */
  _holdDoor() {
    this.door?.requestOpen(0.4);
  }
  update(dt) {
    if (this.phase === "idle") {
      if (this.waiting.length) this._begin(this.waiting.shift());
      return;
    }
    this.t += dt;
    if (this.phase === "summon") {
      this._holdDoor();
      this._place(IN_CAR.x, this.elevator.carY, IN_CAR.z);
      this._parcelToHands();
      this._stepLegs(0);
      if (this.elevator.ready || this.t >= LIFT_WAIT) {
        this.phase = "approach";
        this.t = 0;
      }
      return;
    }
    if (this.phase === "approach") {
      if (this._walk(dt, this.route)) {
        this.route = this._approach();
        this.phase = "heave";
        this.t = 0;
      }
      return;
    }
    if (this.phase === "heave") {
      this._holdDoor();
      const k = Math.min(1, this.t / HEAVE);
      this.arms.rotation.x = -1.5 * smoothstep(k);
      this._settleLegs();
      const c = this.courier.position;
      const e = smoothstep(k);
      this.parcel.position.set(
        lerp(c.x, THROW_FROM.x, e),
        lerp(c.y + CARRY_Y, THROW_FROM.y, e),
        lerp(c.z + 0.5, THROW_FROM.z, e)
      );
      this.parcel.rotation.y = lerp(this.courier.rotation.y, 0, e);
      if (this.t >= HEAVE) this._beginThrow();
      return;
    }
    if (this.phase === "throw") {
      this._holdDoor();
      const k = Math.min(1, this.t / this._throwSecs);
      this.arms.rotation.x = lerp(-1.5, 0.35, smoothstep(Math.min(1, k * 3)));
      const a = THROW_FROM;
      const b = this.target;
      const e = smoothstep(k) * 0.35 + k * 0.65;
      this._pos.set(
        lerp(a.x, b.x, e),
        lerp(a.y, b.y, e) + Math.sin(Math.PI * e) * this._throwArc,
        lerp(a.z, b.z, e)
      );
      this.parcel.position.copy(this._pos);
      this.parcel.rotation.x = e * 3.4;
      this.parcel.rotation.y = e * 1.7;
      this._settleLegs();
      if (this.t >= this._throwSecs) {
        this.parcel.visible = false;
        const { payload } = this;
        this.payload = null;
        this.route = this.route.reversed();
        this.phase = "leave";
        this.t = 0;
        this.onArrive?.(payload);
      }
      return;
    }
    if (this.phase === "leave") {
      this.arms.rotation.x *= 0.85;
      if (this._walk(dt, this.route)) {
        this.courier.visible = false;
        this.phase = "idle";
        this.t = 0;
      }
    }
  }
  /**
   * Cover a route, and say when it is done.
   *
   * @return {boolean} true on the frame the last point is reached
   */
  _walk(dt, route) {
    const at = route.at(this.t, this._at);
    this._place(at.position.x, at.position.y, at.position.z);
    this._face(at.heading, dt);
    this._parcelToHands();
    this._stepLegs(at.distance * STRIDE);
    if (this.t >= route.entersAt - DOOR_LEAD) this._holdDoor();
    return this.t >= route.seconds;
  }
  /**
   * Time and shape the throw for the distance it actually has to cover.
   *
   * Both used to be constants, tuned for a parcel launched from the threshold. Now
   * that it leaves from inside the room the throw is a good deal shorter, and the
   * old numbers made it a slow, towering lob across four units.
   */
  _beginThrow() {
    const reach = Math.hypot(this.target.x - THROW_FROM.x, this.target.z - THROW_FROM.z);
    this._throwSecs = Math.min(1.1, Math.max(0.55, reach / 5.5));
    this._throwArc = Math.min(2.4, Math.max(0.9, reach * 0.34));
    this.phase = "throw";
    this.t = 0;
  }
  _stepLegs(phase) {
    const swing = Math.sin(phase) * 0.5;
    this.legs[0].rotation.x = swing;
    this.legs[1].rotation.x = -swing;
  }
  _settleLegs() {
    for (const leg of this.legs) leg.rotation.x *= 0.8;
  }
};

// dist/ui/roving/src/agents/Agent.js
import * as THREE36 from "three";

// dist/ui/roving/src/agents/drinks.js
var WATERS = [
  { name: "Water", color: 14675703 },
  { name: "Sparkling Water", color: 15004410 }
];
var TEAS = [
  { name: "English Breakfast Tea", color: 10773295 },
  { name: "Earl Grey Tea", color: 11563066 },
  { name: "Green Tea", color: 11124074 },
  { name: "Peppermint Tea", color: 12374692 },
  { name: "Chamomile Tea", color: 14269278 },
  { name: "Chai Tea", color: 12618330 }
];
var COFFEES = [
  { name: "Espresso", milk: false, double: true },
  { name: "Long Black", milk: false, double: true },
  { name: "Flat White", milk: true, double: true },
  { name: "Cappuccino", milk: true, double: true },
  { name: "Macchiato", milk: true, double: true },
  { name: "Cortado", milk: true, double: true },
  { name: "Magic", milk: true, double: false }
];
var MILKS = ["Oat", "Almond", "Soy"];
var BLACK_COFFEE = 3810328;
var MILK_COFFEE = 10316613;
var P_COFFEE = 0.55;
var P_TEA = 0.2;
var P_DOUBLE = 0.3;
var P_STRONG = 0.15;
var P_ALT_MILK = 0.5;
function randomDrink() {
  const roll = Math.random();
  if (roll > P_COFFEE + P_TEA) {
    const water = pick(WATERS);
    return { name: water.name, kind: "water", color: water.color };
  }
  if (roll > P_COFFEE) {
    const tea = pick(TEAS);
    return { name: tea.name, kind: "tea", color: tea.color };
  }
  const base = pick(COFFEES);
  const parts = [];
  if (base.double && chance(P_DOUBLE)) parts.push("Double");
  if (chance(P_STRONG)) parts.push("Strong");
  const altMilk = base.milk && chance(P_ALT_MILK);
  if (altMilk) parts.push(pick(MILKS));
  parts.push(base.name);
  return {
    name: parts.join(" "),
    kind: "coffee",
    color: base.milk ? MILK_COFFEE : BLACK_COFFEE
  };
}

// dist/ui/roving/src/agents/mark-texture.js
import * as THREE35 from "three";

// dist/ui/roving/src/ui/marks.js
function renderMark(markup) {
  return String(markup).replaceAll("__UID__", "office-mark");
}

// dist/ui/roving/src/agents/mark-texture.js
var RASTER_PX = 128;
var _textures = /* @__PURE__ */ new Map();
function svgDataUrl(markup, currentColor) {
  const sized = renderMark(markup).replace(
    "<svg",
    `<svg width="${RASTER_PX}" height="${RASTER_PX}" style="color:${currentColor}"`
  );
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sized)}`;
}
function markTexture(markup, currentColor = "#ffffff") {
  if (!markup) return null;
  const key = `${currentColor}|${markup}`;
  const cached = _textures.get(key);
  if (cached) return cached;
  const canvas2 = document.createElement("canvas");
  canvas2.width = RASTER_PX;
  canvas2.height = RASTER_PX;
  const tex = new THREE35.CanvasTexture(canvas2);
  tex.colorSpace = THREE35.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.__shared = true;
  _textures.set(key, tex);
  if (typeof Image === "undefined") return tex;
  const img = new Image();
  img.onload = () => {
    const ctx = canvas2.getContext("2d");
    ctx.clearRect(0, 0, RASTER_PX, RASTER_PX);
    ctx.drawImage(img, 0, 0, RASTER_PX, RASTER_PX);
    tex.needsUpdate = true;
  };
  img.src = svgDataUrl(markup, currentColor);
  return tex;
}

// dist/ui/roving/src/agents/steps.js
var SETTLED = /* @__PURE__ */ new Set(["completed", "skipped", "failed", "cancelled"]);
function planTally(plan) {
  if (!plan?.items?.length) return null;
  const done = plan.items.filter((e) => SETTLED.has(e.status)).length;
  return { done, of: plan.items.length + (plan.more ?? 0) };
}

// dist/ui/roving/src/agents/Agent.js
var SKIN_TONES = [
  15845797,
  // very light, cool-warm
  15253408,
  // light
  14724227,
  // light-mid
  14263671,
  // mid-light
  13010498,
  // mid
  12088394,
  // mid-deep
  10510911,
  // deep
  9262372,
  // deeper
  7356448
  // deep warm
];
var HAIR_COLORS = [
  1972759,
  // black
  3812128,
  // very dark brown
  4863784,
  // dark brown
  7031343,
  // mid-dark brown
  9071178,
  // mid brown
  10520426,
  // light brown
  12953730,
  // light brown/blonde
  8947848
  // grey
];
var HAIRSTYLES = [
  "short",
  // flat slab (classic, gender-neutral)
  "bob",
  // side panels plus short back (feminine)
  "long",
  // longer back panel, reaches upper back (feminine)
  "ponytail",
  // crop plus tapered tail (feminine)
  "bun",
  // crop plus sphere on top-back (feminine)
  "curly"
  // overlapping spheres for volume (gender-neutral)
];
var TAG_W = 640;
var TAG_H = 128;
var TAG_WORLD_W = 5;
var TAG_WORLD_H = 1;
var TAG_Y = 3.3;
var TAG_FONT_PX = 46;
var TAG_FONT_MIN_PX = 30;
var TAG_MARGIN = 14;
var TAG_ICON_PX = 44;
var TAG_ICON_GAP = 13;
var TAG_INDOORS_Z = 0.3;
var TAG_INWORLD_SCALE = 0.28;
var tagLegibility = 1;
function tagPartScale(tagScale) {
  return tagScale * tagLegibility;
}
var TAG_INWORLD_OPACITY = 0.85;
var TAG_INWORLD_Y = 2.95;
var TAG_FONT_STACK = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
var tagFont = (px) => `700 ${px}px ${TAG_FONT_STACK}`;
var _circleTexture = null;
function circleTexture() {
  if (_circleTexture) return _circleTexture;
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.arc(32, 32, 27, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  _circleTexture = new THREE36.CanvasTexture(c);
  _circleTexture.__shared = true;
  return _circleTexture;
}
var HIP_Y = 0.9;
var AGENT_EYE_Y = 2.2;
var STOOP_LEVER = AGENT_EYE_Y - HIP_Y;
var STOOP_BEND = Math.acos(1 - (AGENT_EYE_Y - EYE_Y) / STOOP_LEVER);
var STOOP_EASE = 0.14;
var DIAL_REACH = -126 * (Math.PI / 180);
var DIAL_SPEED = 9e-3;
var DIAL_TRAVEL = 0.2;
var DANCE_RATE = 9;
var DANCE_HOP = 0.17;
var DANCE_SWAY = 0.13;
var DANCE_REACH = -2.45;
var SIT_SECONDS = 0.45;
var SEAT_FOLD = Math.PI / 2 * 0.95;
function footReach(blend) {
  return THIGH_LEN * Math.sin(SEAT_FOLD * blend);
}
var THIGH_LEN = 0.48;
var SHIN_LEN = 0.42;
var TYPE_REACH = -Math.PI / 1.85;
var TYPE_TRAVEL = 0.05;
var TYPE_SPEED = 6e-3;
var HISTORY_CAP = 40;
var HISTORY_SHOWN = 10;
function buildHairstyle(style, color) {
  const hair = group(0, 0, 0);
  if (style === "short") {
    put(hair, box(0.66, 0.22, 0.66, color, { rough: 0.85 }), 0, 0.27);
  } else if (style === "bob") {
    put(hair, box(0.3, 0.24, 0.35, color, { rough: 0.85 }), 0, 0.22, -0.2);
    put(hair, box(0.18, 0.28, 0.28, color, { rough: 0.85 }), -0.38, 0.15, 0);
    put(hair, box(0.18, 0.28, 0.28, color, { rough: 0.85 }), 0.38, 0.15, 0);
  } else if (style === "long") {
    const back = box(0.44, 0.6, 0.32, color, { rough: 0.85 });
    back.position.set(0, -0.1, -0.3);
    hair.add(back);
  } else if (style === "ponytail") {
    put(hair, box(0.66, 0.22, 0.66, color, { rough: 0.85 }), 0, 0.27);
    put(hair, box(0.18, 0.5, 0.18, color, { rough: 0.85 }), 0, -0.15, -0.28);
  } else if (style === "bun") {
    put(hair, box(0.66, 0.22, 0.66, color, { rough: 0.85 }), 0, 0.27);
    put(hair, sphere(0.16, color, { rough: 0.85 }), 0, 0.52, -0.1);
  } else if (style === "curly") {
    put(hair, sphere(0.2, color, { rough: 0.85 }), 0, 0.15, -0.15);
    put(hair, sphere(0.18, color, { rough: 0.85 }), 0, 0.35, 0);
    put(hair, sphere(0.16, color, { rough: 0.85 }), -0.2, 0.1, 0);
    put(hair, sphere(0.16, color, { rough: 0.85 }), 0.2, 0.1, 0);
  }
  return hair;
}
var Agent = class {
  constructor({
    id,
    name,
    color = 7320032,
    colorLabel = null,
    avatar = null,
    drink = randomDrink(),
    source: source2 = null,
    variant = null
  }) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.colorLabel = colorLabel;
    this.avatar = avatar;
    this.status = "idle";
    this.job = null;
    this.step = null;
    this.plan = null;
    this.source = source2;
    this.variant = variant;
    this.drink = drink;
    this.history = [];
    this.root = group(0, 0, 0);
    this.root.userData.agentId = id;
    this._buildBody();
    this._buildNameTag();
    this._buildStatusRing();
    this.walkPhase = Math.random() * Math.PI * 2;
    this.dancePhase = 0;
    this.seated = false;
    this.seatBlend = 0;
    this.seatHeight = SEAT_HEIGHT;
    this.moving = false;
    this.walking = false;
    this.heldUp = 0;
    this.onRoute = false;
    this.routeFlight = null;
    this.routeDir = 1;
  }
  _buildBody() {
    const g = group(0, 0, 0);
    this.skin = pick(SKIN_TONES);
    const hairC = pick(HAIR_COLORS);
    this.hips = [];
    this.knees = [];
    for (const sx of [-0.18, 0.18]) {
      const hip = group(sx, HIP_Y, 0);
      put(hip, box(0.3, THIGH_LEN, 0.3, 3489866, { rough: 0.8 }), 0, -THIGH_LEN / 2);
      const knee = group(0, -THIGH_LEN, 0);
      put(knee, box(0.28, SHIN_LEN, 0.28, 3489866, { rough: 0.8 }), 0, -SHIN_LEN / 2);
      put(knee, box(0.3, 0.12, 0.44, 2237995, { rough: 0.7 }), 0, -SHIN_LEN + 0.06, 0.08);
      hip.add(knee);
      g.add(hip);
      this.hips.push(hip);
      this.knees.push(knee);
    }
    this.trunk = group(0, HIP_Y, 0);
    g.add(this.trunk);
    this.torso = box(0.8, 1, 0.5, this.color, { rough: 0.7 });
    this.torso.position.y = 1.4 - HIP_Y;
    this.trunk.add(this.torso);
    this.shirt = [this.torso];
    this.shoulders = [];
    for (const sx of [-0.52, 0.52]) {
      const shoulder = group(sx, 1.78 - HIP_Y, 0);
      const arm = box(0.22, 0.8, 0.22, this.color, { rough: 0.7 });
      this.shirt.push(arm);
      arm.position.y = -0.4;
      shoulder.add(arm);
      put(shoulder, box(0.2, 0.18, 0.2, this.skin, { rough: 0.6 }), 0, -0.86);
      this.trunk.add(shoulder);
      this.shoulders.push(shoulder);
    }
    this.head = box(0.62, 0.62, 0.62, this.skin, { rough: 0.6 });
    this.head.position.y = AGENT_EYE_Y - HIP_Y;
    this.trunk.add(this.head);
    const hairstyle = pick(HAIRSTYLES);
    const hairGroup = buildHairstyle(hairstyle, hairC);
    hairGroup.position.y = AGENT_EYE_Y - HIP_Y;
    this.trunk.add(hairGroup);
    this.hair = hairGroup;
    this.package = group(0, 1.25 - HIP_Y, 0.5);
    this.package.add(
      box(0.5, 0.4, 0.5, COLORS.parcel, { rough: 0.9 }),
      box(0.12, 0.42, 0.52, COLORS.parcelTape, { cast: false })
    );
    this.package.visible = false;
    this.trunk.add(this.package);
    this.envelope = group(0.2, 1.16 - HIP_Y, 0.42);
    this.envelope.add(
      box(0.44, 0.03, 0.32, COLORS.paper, { rough: 0.85 }),
      box(0.2, 0.034, 0.32, 15129796, { rough: 0.85, cast: false })
    );
    const stripe = box(0.44, 0.036, 0.04, 13777723, { rough: 0.8, cast: false });
    stripe.position.z = 0.13;
    this.envelope.add(stripe);
    this.envelope.rotation.x = -0.35;
    this.envelope.rotation.z = 0.12;
    this.envelope.visible = false;
    this.trunk.add(this.envelope);
    this.sheet = group(0.16, 1.18 - HIP_Y, 0.46);
    this.sheet.add(buildPrintout());
    this.sheet.rotation.x = -0.4;
    this.sheet.rotation.z = 0.1;
    this.sheet.visible = false;
    this.trunk.add(this.sheet);
    this.book = group(0, 1.3 - HIP_Y, 0.44);
    this.bookCover = box(0.42, 0.54, 0.1, 5208714, { rough: 0.8 });
    this.book.add(this.bookCover);
    const pages = box(0.36, 0.48, 0.12, 16052712, { rough: 0.9, cast: false });
    pages.position.z = 0.02;
    this.book.add(pages);
    this.book.rotation.x = -0.5;
    this.book.visible = false;
    this.trunk.add(this.book);
    this.cup = group(0.34, 1.34 - HIP_Y, 0.32);
    this.cupBody = box(0.18, 0.24, 0.18, 16052712, { rough: 0.8 });
    this.cup.add(this.cupBody);
    this.cupBrew = box(0.15, 0.02, 0.15, 3810328, { rough: 0.5, cast: false });
    this.cupBrew.material = this.cupBrew.material.clone();
    this.cupBrew.position.y = 0.12;
    this.cup.add(this.cupBrew);
    this.cup.visible = false;
    this.trunk.add(this.cup);
    this.body = g;
    this.root.add(g);
  }
  // The label is up to three sprites: a static pill with the name (drawn once),
  // a separately tinted circular lozenge, and — when the feed named itself —
  // that source's mark ahead of the lozenge. Tinting a material colour is a cheap
  // uniform change, so the status dot updates reliably without ever having to
  // re-upload a canvas texture. The mark is a sprite for a different reason: it
  // arrives asynchronously (see mark-texture.js) and would otherwise have to
  // invalidate the pill's texture on decode.
  _buildNameTag() {
    const canvas2 = document.createElement("canvas");
    canvas2.width = TAG_W;
    canvas2.height = TAG_H;
    this._tagCanvas = canvas2;
    this._tagMode = "overlay";
    this._tagScale = 1;
    this._tagFade = 1;
    this._tagIndoors = true;
    this._headVisible = true;
    const layout = this._drawNameTag();
    const tex = new THREE36.CanvasTexture(canvas2);
    tex.colorSpace = THREE36.SRGBColorSpace;
    tex.anisotropy = 4;
    this._tagTexture = tex;
    const sprite = new THREE36.Sprite(new THREE36.SpriteMaterial({
      map: tex,
      transparent: true,
      depthTest: false
    }));
    sprite.position.y = TAG_Y;
    sprite.renderOrder = 999;
    this.nameTag = sprite;
    this.root.add(sprite);
    this._sizeNameTag();
    const dot = new THREE36.Sprite(new THREE36.SpriteMaterial({
      map: circleTexture(),
      transparent: true,
      depthTest: false,
      color: STATUS_COLORS[this.status] ?? STATUS_COLORS.idle
    }));
    dot.position.y = TAG_Y;
    dot.renderOrder = 1e3;
    this.statusDot = dot;
    this.root.add(dot);
    const markMap = markTexture(this.source?.mark, this.source?.accent);
    if (markMap) {
      const icon = new THREE36.Sprite(new THREE36.SpriteMaterial({
        map: markMap,
        transparent: true,
        depthTest: false
      }));
      icon.position.y = TAG_Y;
      icon.renderOrder = 1e3;
      this.sourceIcon = icon;
      this.root.add(icon);
    }
    this._placeTagSprites(layout);
  }
  /**
   * Draw the pill and the name into the tag canvas, returning where the sprites
   * that sit on top of it belong. Separate from the sprite setup because a rename
   * has to redraw exactly this and nothing else.
   *
   * @returns {{dotCx: number, iconCx: ?number}} x centres in canvas pixels; a
   *   null `iconCx` means this agent has no source mark to place
   */
  _drawNameTag() {
    const ctx = this._tagCanvas.getContext("2d");
    ctx.clearRect(0, 0, TAG_W, TAG_H);
    const dotR = 21, padL = 26, gap = 18, padR = 30, boxH = 84;
    const iconW = this.source?.mark ? TAG_ICON_PX + TAG_ICON_GAP : 0;
    const chrome = padL + iconW + dotR * 2 + gap + padR;
    let size = TAG_FONT_PX;
    let label2 = this.name;
    let textW;
    for (; ; ) {
      ctx.font = tagFont(size);
      textW = ctx.measureText(label2).width;
      if (chrome + textW <= TAG_W - TAG_MARGIN || size <= TAG_FONT_MIN_PX) break;
      size -= 2;
    }
    while (chrome + textW > TAG_W - TAG_MARGIN && label2.length > 4) {
      label2 = `${label2.slice(0, -2).trimEnd()}\u2026`;
      textW = ctx.measureText(label2).width;
    }
    const boxW = chrome + textW;
    const boxX = (TAG_W - boxW) / 2;
    const boxY = (TAG_H - boxH) / 2;
    ctx.fillStyle = "rgba(252,253,249,0.97)";
    roundRect(ctx, boxX, boxY, boxW, boxH, boxH / 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(36,50,71,0.28)";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    const iconCx = iconW ? boxX + padL + TAG_ICON_PX / 2 : null;
    const dotCx = boxX + padL + iconW + dotR;
    const dotCy = boxY + boxH / 2;
    ctx.fillStyle = "#243247";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label2, dotCx + dotR + gap, dotCy + 2);
    this._dotRadiusPx = dotR;
    return { dotCx, iconCx };
  }
  /**
   * Anchor the status lozenge and the source mark to the left of the name.
   *
   * Sprites always face the camera, so the offset is applied in each sprite's own
   * screen space (via `center`) rather than in world space. That keeps them glued
   * to the name at every camera angle — and it has to be recomputed on a rename,
   * because a longer name makes a wider pill and shifts everything left.
   */
  _placeTagSprites(layout) {
    this._tagLayout = layout;
    const dotD = (this._dotRadiusPx ?? 21) * 2;
    this._placeTagSprite(this.statusDot, layout.dotCx, dotD);
    this._placeTagSprite(this.sourceIcon, layout.iconCx, TAG_ICON_PX);
  }
  /**
   * Re-run this tag's sizing, for when the legibility correction changes.
   *
   * Public because the manager drives it: a viewport change is not something an
   * individual agent can see, and the sizes are otherwise set once at build.
   */
  resizeTag() {
    this._sizeNameTag();
    if (this._tagLayout) this._placeTagSprites(this._tagLayout);
    this._placeStepChip();
  }
  /** The pill's own size, which is all `_tagScale` means for the name sprite. */
  _sizeNameTag() {
    const s = tagPartScale(this._tagScale);
    this.nameTag.scale.set(TAG_WORLD_W * s, TAG_WORLD_H * s, 1);
  }
  /**
   * Put one tag sprite at a canvas-pixel x centre, sized in canvas pixels.
   *
   * `center` is expressed in multiples of the sprite's own size, hence dividing
   * the offset by it.
   */
  _placeTagSprite(sprite, cx, sizePx) {
    if (!sprite || cx == null) return;
    const pxToWorld = TAG_WORLD_W / TAG_W;
    const sizeWorld = sizePx * pxToWorld;
    const drawn = sizeWorld * tagPartScale(this._tagScale);
    sprite.scale.set(drawn, drawn, 1);
    const offsetWorld = (TAG_W / 2 - cx) * pxToWorld;
    sprite.center.set(0.5 + offsetWorld / sizeWorld, 0.5);
  }
  /**
   * How this agent's name tag relates to the rest of the scene.
   *
   * - `overlay` (default): drawn on top of everything, depth ignored. Correct for
   *   the office view, where the camera is outside the building and a tag hidden by
   *   a wall would be a tag you could never read.
   * - `inWorld`: depth-tested, smaller and slightly translucent, so it sits behind
   *   the monitor it is behind. Correct from inside the room.
   *
   * Deliberately not named after the first-person camera: the agent has no business
   * knowing which lens is in use, only how it has been asked to draw.
   */
  setTagMode(mode) {
    if (mode === this._tagMode) return;
    this._tagMode = mode;
    const inWorld = mode === "inWorld";
    for (const sprite of [this.nameTag, this.statusDot, this.sourceIcon]) {
      if (!sprite) continue;
      sprite.material.depthTest = inWorld;
      sprite.position.y = inWorld ? TAG_INWORLD_Y : TAG_Y;
    }
    if (!inWorld) this._tagFade = 1;
    this._applyTagOpacity();
    this._tagScale = inWorld ? TAG_INWORLD_SCALE : 1;
    this._sizeNameTag();
    if (this._tagLayout) this._placeTagSprites(this._tagLayout);
  }
  /**
   * Show or hide this agent's own head and hair.
   *
   * For a camera parked behind these eyes. The head box needs no help — the eye sits
   * inside it, so all six faces present their backs and are culled. The hair is the
   * problem, and it took a raycast to see why: it sits *on* the head, so the eye is
   * underneath it looking at its underside, which faces the viewer and is a solid
   * dark slab a tenth of a unit away. It reads as a black band across the top of the
   * view, at every hairstyle, wherever the agent happens to be standing.
   *
   * The head goes too, though it is invisible anyway, so that the guarantee survives
   * someone retuning FPV.eyeForward past the face.
   *
   * The cost is that a hidden mesh casts no shadow, so this agent's shadow loses its
   * head for as long as it is hidden. Only ever one agent, only while their own eyes
   * are the camera, and the alternative is layer masks on every light — not a trade
   * worth making for the outline of a shadow nobody is looking at.
   *
   * Named for what it does rather than for the lens, like `setTagMode`.
   */
  setHeadVisible(visible) {
    if (visible === this._headVisible) return;
    this._headVisible = visible;
    this.head.visible = visible;
    this.hair.visible = visible;
  }
  /**
   * Fade this agent's tag, 0 (gone) to 1 (fully drawn).
   *
   * Only meaningful in `inWorld` mode, where the viewer is close enough for
   * proximity to matter — see FPV.tagFadeNear in config.js for who decides.
   */
  setTagFade(fade) {
    const f = clamp01(fade);
    if (f === this._tagFade) return;
    this._tagFade = f;
    this._applyTagOpacity();
  }
  /**
   * Show the name tag only while this agent is in the room.
   *
   * Called once a frame for everybody from `AgentManager.update`, rather than from the
   * walking, because it has to be true of an agent who is standing still as much as one
   * on the move — and that loop is the one place guaranteed to run for every agent
   * whatever they are doing.
   *
   * Depth alone decides it: everywhere an agent can be outside the room is behind the
   * back wall, whether that is the stoop, the staircase or a lift car.
   */
  refreshTagVisibility() {
    const inside = this.root.position.z > TAG_INDOORS_Z;
    if (inside === this._tagIndoors) return;
    this._tagIndoors = inside;
    this._applyTagOpacity();
  }
  _applyTagOpacity() {
    const base = this._tagMode === "inWorld" ? TAG_INWORLD_OPACITY : 1;
    const opacity = this._tagIndoors ? base * this._tagFade : 0;
    for (const sprite of [this.nameTag, this.statusDot, this.sourceIcon]) {
      if (!sprite) continue;
      sprite.material.opacity = opacity;
      sprite.visible = opacity > 0.01;
    }
  }
  /**
   * Rename in place — the name lives in a canvas texture, so the pill is redrawn
   * and the status dot re-anchored to the new width. Used when a live session takes
   * on a new job and its surname follows the work (see src/agents/names.js).
   */
  setName(name) {
    if (!name || name === this.name) return;
    this.name = name;
    const layout = this._drawNameTag();
    if (this._tagTexture) this._tagTexture.needsUpdate = true;
    this._placeTagSprites(layout);
  }
  /**
   * Change what somebody is wearing.
   *
   * Only ever used when a harness tells us a colour late — an OpenClaw identity is read
   * one hook after its session starts — so this happens once, seconds in, and never
   * again. `box()` gives every mesh its own material, so the shirt is repainted part by
   * part rather than through a shared one.
   */
  setColor(color, label2 = null) {
    if (!Number.isFinite(color) || color === this.color) return;
    this.color = color;
    this.colorLabel = label2;
    for (const part of this.shirt ?? []) part.material?.color?.setHex(color);
  }
  /**
   * The picture, when one arrives.
   *
   * Later than the colour and for a better reason: the adapter has to upload the file
   * before it can name it, so an avatar is always news. Held rather than drawn — the
   * character in the room is the character, and the portrait belongs in the panel.
   */
  setAvatar(avatar) {
    this.avatar = typeof avatar === "string" && avatar ? avatar : null;
  }
  _buildStatusRing() {
    const ring = new THREE36.Mesh(
      new THREE36.TorusGeometry(0.7, 0.08, 8, 24),
      new THREE36.MeshStandardMaterial({
        color: STATUS_COLORS.idle,
        emissive: STATUS_COLORS.idle,
        emissiveIntensity: 0.6,
        roughness: 0.4
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.06;
    this.statusRing = ring;
    this.root.add(ring);
  }
  setStatus(status2) {
    if (this.status === status2) return;
    this.status = status2;
    const c = STATUS_COLORS[status2] ?? STATUS_COLORS.idle;
    this.statusRing.material.color.setHex(c);
    this.statusRing.material.emissive.setHex(c);
    this.statusDot.material.color.setHex(c);
  }
  // --- Work log ------------------------------------------------------------
  /** The job currently in flight, if any. */
  openJob() {
    const last = this.history[this.history.length - 1];
    return last && last.outcome === "active" ? last : null;
  }
  /** Label of the job in flight — handy for reporting what got binned. */
  currentJobLabel() {
    return this.openJob()?.label ?? null;
  }
  /**
   * Start logging a job. Re-announcing the job already in flight (which the
   * feed does when an agent returns from the bookshelf) is a no-op, so a single
   * job never shows up as two log entries.
   */
  beginJob(label2) {
    if (!label2) return;
    const open = this.openJob();
    if (open) {
      if (open.label === label2) return;
      open.outcome = "done";
      open.endedAt = Date.now();
    }
    this.history.push({
      label: label2,
      outcome: "active",
      startedAt: Date.now(),
      endedAt: null
    });
    if (this.history.length > HISTORY_CAP) this.history.shift();
  }
  /**
   * Retitle the job in flight without opening a new log entry. Used when an
   * agent collects a specific request out of the mailbox: they were already
   * marked as starting work, and this is what the work turned out to be.
   */
  renameOpenJob(label2) {
    const open = this.openJob();
    if (!open || !label2) return false;
    open.label = label2;
    this.job = label2;
    return true;
  }
  /** Retitle the most recent job, but never an unrelated older entry. */
  retitleLatestJob(label2, expected = null) {
    const latest = this.history[this.history.length - 1];
    if (!latest || !label2 || expected && latest.label !== expected) return false;
    latest.label = label2;
    this.job = label2;
    return true;
  }
  /** Close out the job in flight. `outcome` is 'done' or 'error'. */
  finishJob(outcome = "done") {
    const open = this.openJob();
    if (!open) return null;
    open.outcome = outcome;
    open.endedAt = Date.now();
    return open;
  }
  /** Most recent entries, newest first. */
  recentJobs(limit = HISTORY_SHOWN) {
    return this.history.slice(-limit).reverse();
  }
  /**
   * Which part of the round is in hand, and the checklist behind it.
   *
   * Deliberately touches neither the job log nor the status: a step is a label, and
   * the office moves people for tool calls, not for parts (spec §4.2 rule 5).
   *
   * The one thing it does write is the tally, onto the open log entry, because that
   * entry outlives the checklist. The plan is cleared when the turn ends but the walk
   * to the mailbox has not happened yet, so by the time "Recent jobs" is drawn the
   * only record of how many parts there were is the one kept here.
   *
   * @param {?object} step  the open step, or null for none
   * @param {?object} [plan]  the checklist; omit to leave the current one alone
   */
  setStep(step, plan) {
    this.step = step ?? null;
    if (plan !== void 0) this.plan = plan ?? null;
    if (this.plan) {
      const open = this.openJob();
      if (open) {
        open.steps = planTally(this.plan);
        open.plan = {
          items: this.plan.items.map((entry) => ({ ...entry })),
          more: this.plan.more ?? 0
        };
      }
    }
  }
  /**
   * Show one carryable, or none.
   *
   * `kind` is 'package' | 'letter' | 'book' | 'cup' | null. Package and letter are the
   * two ways work arrives — by courier or by air — and which one a job came by is a
   * coin toss that says nothing about it (see `ARRIVALS` in agents/post.js). Carrying
   * it back out the way it came in is consistency, not significance.
   */
  setCarrying(kind, opts = {}) {
    this.package.visible = kind === "package";
    this.envelope.visible = kind === "letter";
    this.sheet.visible = kind === "fax";
    this.book.visible = kind === "book";
    this.cup.visible = kind === "cup";
    if (kind === "book" && opts.color != null) {
      this.bookCover.material = this.bookCover.material.clone();
      this.bookCover.material.color.setHex(opts.color);
    }
    if (kind === "cup" && opts.color != null) this.cupBrew.material.color.setHex(opts.color);
    this.carrying = kind;
  }
  setPositionXZ(x, z) {
    this.root.position.set(x, this.root.position.y, z);
  }
  /**
   * Height of the ground under their feet.
   *
   * Separate from `setPositionXZ`, which deliberately leaves y alone, because the
   * room is one flat plane and almost nothing needs this: only the flight of stairs
   * outside a first-floor door, where an arrival climbs a storey to get in. Kept off
   * `body.position.y`, which is the walk bob and the seat height and is written every
   * frame.
   */
  setElevation(y) {
    this.root.position.y = y;
  }
  get position() {
    return this.root.position;
  }
  setRotation(y) {
    this.root.rotation.y = y;
  }
  faceDirection(dx, dz) {
    if (Math.abs(dx) < 1e-4 && Math.abs(dz) < 1e-4) return;
    const target = Math.atan2(dx, dz);
    let d = target - this.root.rotation.y;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    this.root.rotation.y += d * 0.2;
  }
  /**
   * Sit down (in a chair or on the couch) or stand back up.
   *
   * Sets where they are going, not where they are. `seated` is the intent and takes
   * effect at once — the crowd rules and the walk cycle both ask about it, and a
   * character halfway into a chair is not available to walk anywhere — while the pose
   * itself is blended across `SIT_SECONDS` by `update`, which is what makes lowering
   * yourself onto a cushion a movement rather than a cut.
   *
   * `instant` skips the blend, for the two callers that are not animating anything: a
   * reduced-motion still frame, and a world being rebuilt around somebody who was
   * already sitting when it came down.
   */
  setSeated(seated, { seatHeight = SEAT_HEIGHT, instant = false } = {}) {
    this.seated = seated;
    this.seatHeight = seatHeight;
    if (instant) {
      this.seatBlend = seated ? 1 : 0;
      this._applySeatBlend(this.seatBlend);
    }
  }
  /**
   * Put the body somewhere between standing and sitting.
   *
   * Every part of the seated pose is a straight interpolation from its standing value,
   * which is why this reads as one movement: the hips and knees fold at the same rate
   * the body descends, so the shins swing out in front as the character comes down
   * rather than being folded after they land.
   */
  _applySeatBlend(k) {
    this.body.position.y = (this.seatHeight + 0.06 - HIP_Y) * k;
    for (const hip of this.hips) hip.rotation.x = -SEAT_FOLD * k;
    for (const knee of this.knees) knee.rotation.x = SEAT_FOLD * k;
    for (const s of this.shoulders) s.rotation.x = -Math.PI / 6 * k;
  }
  update(dt, {
    moving = false,
    typing = false,
    reading = false,
    drinking = false,
    dancing = false,
    stooping = false,
    dialling = false
  } = {}) {
    this.moving = moving && !this.seated;
    if (!dancing && this.body.rotation.z !== 0) {
      this.body.rotation.z = Math.abs(this.body.rotation.z) < 1e-3 ? 0 : this.body.rotation.z * 0.82;
    }
    const stoopTarget = stooping && !this.seated ? STOOP_BEND : 0;
    if (this.trunk.rotation.x !== stoopTarget) {
      const gap = stoopTarget - this.trunk.rotation.x;
      this.trunk.rotation.x = Math.abs(gap) < 1e-3 ? stoopTarget : this.trunk.rotation.x + gap * STOOP_EASE;
    }
    const seatTarget = this.seated ? 1 : 0;
    if (this.seatBlend !== seatTarget) {
      const step = dt / SIT_SECONDS;
      this.seatBlend = seatTarget > this.seatBlend ? Math.min(seatTarget, this.seatBlend + step) : Math.max(seatTarget, this.seatBlend - step);
    }
    if (dancing && !this.seated) {
      this.dancePhase += dt * DANCE_RATE;
      const t = this.dancePhase;
      const beat = Math.sin(t);
      const hop = Math.abs(beat);
      this.body.position.y = hop * DANCE_HOP;
      this.body.rotation.z = Math.sin(t * 0.5) * DANCE_SWAY;
      this.shoulders[0].rotation.x = DANCE_REACH + beat * 0.45;
      this.shoulders[1].rotation.x = DANCE_REACH - beat * 0.45;
      for (const knee of this.knees) knee.rotation.x = (1 - hop) * 0.55;
      this.hips[0].rotation.x = beat * 0.12;
      this.hips[1].rotation.x = -beat * 0.12;
      return;
    }
    if (this.seatBlend > 0) {
      this._applySeatBlend(this.seatBlend);
      if (this.seated && this.seatBlend >= 1) {
        if (typing) {
          const t = performance.now() * TYPE_SPEED;
          this.shoulders[0].rotation.x = TYPE_REACH + Math.sin(t) * TYPE_TRAVEL;
          this.shoulders[1].rotation.x = TYPE_REACH + Math.sin(t + 1.6) * TYPE_TRAVEL;
        } else if (reading) {
          this.shoulders[0].rotation.x = -Math.PI / 3;
          this.shoulders[1].rotation.x = -Math.PI / 3;
        }
      }
      return;
    }
    if (moving) {
      this.walkPhase += dt * 16;
      const swing = Math.sin(this.walkPhase) * 0.5;
      this.hips[0].rotation.x = swing;
      this.hips[1].rotation.x = -swing;
      this.knees[0].rotation.x = Math.max(0, -swing) * 0.9;
      this.knees[1].rotation.x = Math.max(0, swing) * 0.9;
      if (this.carrying) {
        this.shoulders[0].rotation.x = -Math.PI / 3;
        this.shoulders[1].rotation.x = -Math.PI / 3;
      } else {
        this.shoulders[0].rotation.x = -swing * 0.7;
        this.shoulders[1].rotation.x = swing * 0.7;
      }
      this.body.position.y = Math.abs(Math.sin(this.walkPhase)) * 0.07;
      return;
    }
    const ease = (v, target = 0) => lerp(v, target, 0.2);
    for (const hip of this.hips) hip.rotation.x = ease(hip.rotation.x);
    for (const knee of this.knees) knee.rotation.x = ease(knee.rotation.x);
    if (dialling) {
      const t = performance.now() * DIAL_SPEED;
      this.shoulders[0].rotation.x = DIAL_REACH + Math.abs(Math.sin(t)) * DIAL_TRAVEL;
      this.shoulders[1].rotation.x = ease(this.shoulders[1].rotation.x);
    } else if (drinking) {
      const t = performance.now() * 4e-3;
      this.shoulders[1].rotation.x = -Math.PI / 2.2 + Math.sin(t) * 0.18;
      this.shoulders[0].rotation.x = ease(this.shoulders[0].rotation.x);
    } else if (typing) {
      const t = performance.now() * TYPE_SPEED;
      this.shoulders[0].rotation.x = STANDING_TYPE_REACH + Math.sin(t) * TYPE_TRAVEL;
      this.shoulders[1].rotation.x = STANDING_TYPE_REACH + Math.sin(t + 1.6) * TYPE_TRAVEL;
    } else if (reading) {
      for (const s of this.shoulders) s.rotation.x = ease(s.rotation.x, -Math.PI / 3);
    } else if (this.carrying) {
      for (const s of this.shoulders) s.rotation.x = ease(s.rotation.x, -Math.PI / 3);
    } else {
      for (const s of this.shoulders) s.rotation.x = ease(s.rotation.x);
    }
    this.body.position.y = ease(this.body.position.y);
  }
  dispose() {
    this.root.traverse((o) => {
      if (o.geometry) o.geometry.dispose?.();
      const m = o.material;
      if (m) {
        if (m.map && !m.map.__shared) m.map.dispose?.();
        m.dispose?.();
      }
    });
  }
};
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// dist/ui/roving/src/agents/states.js
import * as THREE38 from "three";

// dist/ui/roving/src/agents/crowd.js
import * as THREE37 from "three";
var AGENT_RADIUS = 0.46;
var MIN_GAP = AGENT_RADIUS * 2;
var PASSES = 8;
function resolveOverlaps(agents, nav) {
  if (agents.length < 2) return 0;
  let separated = 0;
  for (let pass = 0; pass < PASSES; pass++) {
    let touched = 0;
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const a = agents[i], b = agents[j];
        if (a.seated && b.seated) continue;
        if (a.onRoute || b.onRoute) continue;
        let dx = b.position.x - a.position.x;
        let dz = b.position.z - a.position.z;
        let d = Math.hypot(dx, dz);
        if (d >= MIN_GAP) continue;
        if (d > 1e-4) {
          dx /= d;
          dz /= d;
        } else {
          const angle = pairAngle(a, b);
          dx = Math.sin(angle);
          dz = Math.cos(angle);
          d = 0;
        }
        const overlap = MIN_GAP - d;
        const wa = yieldWeight(a), wb = yieldWeight(b);
        const moved = shift(a, -dx, -dz, overlap * (wa / (wa + wb)), nav);
        shift(b, dx, dz, overlap - moved, nav);
        touched++;
      }
    }
    if (pass === 0) separated = touched;
    if (touched === 0) break;
  }
  return separated;
}
function yieldWeight(agent) {
  if (agent.seated) return 0;
  return agent.walking ? 0.25 : 1;
}
function shift(agent, ux, uz, amount, nav) {
  if (amount <= 1e-6) return 0;
  const { x, z } = agent.position;
  const loose = !nav.walkableAt(x, z);
  for (const fraction of [1, 0.6, 0.3]) {
    const step = amount * fraction;
    const nx = x + ux * step, nz = z + uz * step;
    if (loose || nav.walkableAt(nx, nz)) {
      agent.setPositionXZ(nx, nz);
      return step;
    }
  }
  return 0;
}
var LOOK_AHEAD = MIN_GAP + 0.3;
var AHEAD_DOT = 0.55;
function wayBlocked(agent, others, ux, uz) {
  for (const other of others) {
    if (other === agent || other.seated) continue;
    const dx = other.position.x - agent.position.x;
    const dz = other.position.z - agent.position.z;
    const d = Math.hypot(dx, dz);
    if (d > LOOK_AHEAD || d < 1e-6) continue;
    if ((dx * ux + dz * uz) / d < AHEAD_DOT) continue;
    if (other.moving && !other.heldUp) return true;
    if (!goesFirst(other, agent)) continue;
    return true;
  }
  return false;
}
function goesFirst(other, agent) {
  const waited = (other.heldUp ?? 0) - (agent.heldUp ?? 0);
  if (Math.abs(waited) > 0.05) return waited > 0;
  return String(other.id) < String(agent.id);
}
function pairAngle(a, b) {
  const key = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = Math.imul(h, 31) + key.charCodeAt(i) | 0;
  return (h >>> 0) % 360 * Math.PI / 180;
}
var SPOT_GAP = 1.05;
var SPOT_OFFSETS = [0, SPOT_GAP, -SPOT_GAP, SPOT_GAP * 2, -SPOT_GAP * 2];
var HOLD_RADIUS = 1.5;
var CLAIM_TIMEOUT = 25;
var StandingSpots = class {
  /** @param {{walkableAt: function}} nav */
  constructor(nav) {
    this.nav = nav;
    this.claims = /* @__PURE__ */ new Map();
  }
  /**
   * Book this agent a place at `station` and say where it is.
   *
   * The middle is taken first, because that is where the layout put the approach
   * point and it is where somebody using a machine on their own belongs — square in
   * front of it. Only when the middle is taken do the side places come into it, and
   * then the nearest free one wins, so an arrival stops at the near end of the queue
   * rather than walking through somebody to reach the far side.
   *
   * @param {{id: string, approach: {x: number, z: number}, lookRotation?: number}} station
   * @param {{id: string, position: THREE.Vector3}} agent
   * @returns {THREE.Vector3} where to walk to
   */
  claim(station2, agent) {
    this.release(agent.id);
    const { approach, lookRotation = 0 } = station2;
    const sx = Math.cos(lookRotation), sz = -Math.sin(lookRotation);
    const taken = new Set([...this.claims.values()].map((c) => c.key));
    const free = [];
    for (const offset of SPOT_OFFSETS) {
      const key2 = `${station2.id}:${offset}`;
      if (taken.has(key2)) continue;
      const x2 = approach.x + sx * offset;
      const z2 = approach.z + sz * offset;
      if (offset !== 0 && !this.nav.walkableAt(x2, z2)) continue;
      free.push({ key: key2, x: x2, z: z2, offset });
    }
    if (!free.length) {
      const key2 = `${station2.id}:overflow:${agent.id}`;
      const point2 = new THREE37.Vector3(approach.x, 0, approach.z);
      this.claims.set(agent.id, { key: key2, point: point2, arrived: false, age: 0 });
      return point2.clone();
    }
    const cost = (s) => Math.hypot(s.x - agent.position.x, s.z - agent.position.z);
    const middle = free.find((s) => s.offset === 0);
    if (!middle) free.sort((a, b) => cost(a) - cost(b) || Math.abs(a.offset) - Math.abs(b.offset));
    else free.unshift(...free.splice(free.indexOf(middle), 1));
    const { key, x, z } = free.find((s) => s.offset === 0) ?? free[0];
    const point = new THREE37.Vector3(x, 0, z);
    this.claims.set(agent.id, { key, point, arrived: false, age: 0 });
    return point.clone();
  }
  release(agentId) {
    this.claims.delete(agentId);
  }
  /**
   * Drop bookings nobody is standing in.
   *
   * @param {number} dt
   * @param {(agentId: string) => ?THREE.Vector3} positionOf  null if they have left
   */
  prune(dt, positionOf) {
    for (const [agentId, claim] of this.claims) {
      const p = positionOf(agentId);
      if (!p) {
        this.claims.delete(agentId);
        continue;
      }
      const near = Math.hypot(p.x - claim.point.x, p.z - claim.point.z) <= HOLD_RADIUS;
      if (near) {
        claim.arrived = true;
        claim.age = 0;
        continue;
      }
      claim.age += dt;
      if (claim.arrived || claim.age > CLAIM_TIMEOUT) this.claims.delete(agentId);
    }
  }
};
var TAG_CLUSTER_RADIUS = 1.8;
function declutterTags(agents) {
  for (const a of agents) {
    let outranked = false;
    for (const b of agents) {
      if (b === a) continue;
      if (String(b.id) >= String(a.id)) continue;
      const dx = b.position.x - a.position.x;
      const dz = b.position.z - a.position.z;
      if (Math.hypot(dx, dz) < TAG_CLUSTER_RADIUS) {
        outranked = true;
        break;
      }
    }
    a.setTagFade(outranked ? 0 : 1);
  }
}

// dist/ui/roving/src/agents/states.js
var WALK_SPEED = 6.4;
var HELD_UP_DETOUR = 0.3;
var DETOUR_LOOK = 4.5;
var DETOUR_LOOK_GROWTH = 0.6;
var DETOUR_LOOK_MAX_TRIES = 4;
var NEAR_GOAL_RADIUS = 0.6;
var NEAR_GOAL_ABANDON = 3;
var HELD_UP_ABANDON = 40;
var ARRIVE_EPS = 0.06;
var STAIR_GAP = AGENT_RADIUS * 2 + 0.7;
var MOUNT_WAIT = 20;
var AgentController = class {
  /**
   * @param agent
   * @param nav
   * @param {?(agent, ux: number, uz: number) => boolean} wayBlocked  asked before
   *   each step whether a colleague is standing in the way; see agents/crowd.js
   * @param {?(() => Iterable<{position: THREE.Vector3, seated: boolean}>)} crowd
   *   who else is in the room, asked for when a way round somebody is needed
   */
  constructor(agent, nav, wayBlocked2 = null, crowd = null) {
    this.agent = agent;
    this.nav = nav;
    this.wayBlocked = wayBlocked2;
    this.crowd = crowd;
    this._heldUp = 0;
    this.queue = [];
    this.current = null;
    this.onIdle = null;
    this._faceFrom = 0;
    this._faceT = 0;
    this._path = null;
    this._pathIndex = 0;
    this._lastPath = null;
    this._lastPathAt = 0;
  }
  /**
   * Retire the current route, remembering it as the one just walked.
   *
   * Every way a walk can end comes through here: arriving, being abandoned as
   * impossible, and being interrupted by a new action list. Missing any one of them
   * would leave a stale route on display, which is worse than none — it would be
   * pointing somewhere nobody is going.
   */
  _endPath() {
    if (this._path) {
      this._lastPath = this._path;
      this._lastPathAt = performance.now();
    }
    this._path = null;
  }
  /**
   * Where this agent has just been, and where they are going next.
   *
   * Both are the runner's own arrays rather than copies, on the understanding that the
   * caller only reads them: they are replaced wholesale on every re-plan and detour, so
   * a caller reading them each frame always sees the current answer without having to
   * be told that it changed.
   *
   * `ahead` starts at the waypoint being walked towards, not at the agent — whoever
   * draws it can put the line's first point wherever the agent actually is, which is
   * between waypoints almost all of the time.
   *
   * `behindAge` is in seconds since that walk ended, and `Infinity` when there has never
   * been one, so that a caller fading old routes out can treat "too old to draw" and
   * "nothing to draw" as the same case.
   *
   * @returns {{ahead: ?THREE.Vector3[], behind: ?THREE.Vector3[], behindAge: number}}
   */
  pathTrail() {
    const walking = this.current?.kind === "walk" && this._path;
    return {
      ahead: walking ? this._path.slice(this._pathIndex) : null,
      behind: this._lastPath,
      behindAge: this._lastPath ? (performance.now() - this._lastPathAt) / 1e3 : Infinity
    };
  }
  get busy() {
    return this.current !== null || this.queue.length > 0;
  }
  /** Replace whatever the agent was doing. */
  run(actions) {
    this.clear();
    this.push(actions);
  }
  push(actions) {
    const list = Array.isArray(actions) ? actions : [actions];
    for (const a of list) if (a) this.queue.push(a);
  }
  clear() {
    this.queue.length = 0;
    this.current = null;
    this._endPath();
    this.agent.walking = false;
    this.agent.heldUp = 0;
    this.agent.onRoute = false;
    this.agent.routeFlight = null;
  }
  /** Replace only the remaining entrance steps, keeping queued work intact. */
  replaceEntrance(direction, actions) {
    const matches = (a) => a?.entrance === direction;
    const current = matches(this.current);
    const index = this.queue.findIndex(matches);
    if (!current && index < 0) return false;
    const remaining = this.queue.filter((a) => !matches(a));
    if (current) {
      this.clear();
      this.push([...actions, ...remaining]);
    } else {
      remaining.splice(index, 0, ...actions);
      this.queue = remaining;
    }
    return true;
  }
  /**
   * The room changed under this walker: work out the way there again.
   *
   * The furniture editor moves walls of the room while people are crossing it (see
   * src/editor.js), and a path is a list of points computed once against the grid as
   * it was. Left alone, somebody mid-stride would walk their old route straight
   * through a desk that had just been dropped in front of them.
   *
   * Only walkers are affected, and only the current step: anybody standing, sitting or
   * queueing has no path to correct, and the actions still in the queue resolve their
   * own targets when they begin.
   *
   * @returns {boolean} whether a route was found. False means the walk is now
   *   impossible, which the editor treats as a reason to refuse the drop.
   */
  replan() {
    if (this.current?.kind !== "walk" || !this._goal) return true;
    const path = this.nav.findPath(this.agent.position, this._goal);
    if (!path || !path.length) return false;
    this._path = path;
    this._pathIndex = 0;
    this._lastDist = null;
    return true;
  }
  // -------------------------------------------------------------------------
  update(dt) {
    if (!this.current) {
      if (this.queue.length === 0) {
        this.agent.update(dt, { moving: false });
        this.onIdle?.();
        if (this.queue.length === 0) return;
      }
      this.current = this.queue.shift();
      this._begin(this.current);
    }
    const done = this._step(this.current, dt);
    if (done) {
      this.current._onEnd?.();
      this.current = null;
    }
  }
  _begin(a) {
    switch (a.kind) {
      case "walk": {
        const target = typeof a.target === "function" ? a.target() : a.target;
        const path = this.nav.findPath(this.agent.position, target);
        this._path = path && path.length ? path : null;
        this._pathIndex = 0;
        this._heldUp = 0;
        this._nextDetour = HELD_UP_DETOUR;
        this._detourTries = 0;
        this._nearGoal = 0;
        this._goal = target;
        this._lastDist = null;
        this.agent.heldUp = 0;
        this.agent.walking = true;
        if (a.status) this.agent.setStatus(a.status);
        if (this.agent.seated) this.agent.setSeated(false);
        break;
      }
      case "face": {
        this._faceFrom = this.agent.root.rotation.y;
        this._faceT = 0;
        a._to = a.at != null ? this._headingTo(a.at) : typeof a.rotation === "function" ? a.rotation() : a.rotation;
        break;
      }
      case "turnChair": {
        a._from = a.desk.chairFacing ?? a.desk.sitRotation ?? 0;
        a._to = typeof a.to === "function" ? a.to() : a.to;
        a._elapsed = 0;
        break;
      }
      case "wait":
        a._left = a.duration;
        break;
      case "until":
        a._left = a.timeout;
        break;
      case "sit": {
        if (a.rotation != null) this.agent.setRotation(a.rotation);
        a._from = this.agent.position.clone();
        a._elapsed = 0;
        a._folding = false;
        a._spot = a.position ? seatStand(a.position, this.agent.root.rotation.y) : this.agent.position.clone();
        break;
      }
      case "stand":
        a._elapsed = 0;
        this.agent.setSeated(false);
        break;
      case "stepTo":
        a._from = this.agent.position.clone();
        a._elapsed = 0;
        break;
      case "follow":
        this.agent.setElevation(a.points[0].y ?? 0);
        a._index = 1;
        a._flight = flightKey(a.points);
        a._dir = flightDirection(a.points);
        a._waited = 0;
        this.agent.walking = true;
        this.agent.onRoute = false;
        if (a.status) this.agent.setStatus(a.status);
        if (this.agent.seated) this.agent.setSeated(false);
        break;
      case "status":
        this.agent.setStatus(a.status);
        break;
      case "carry": {
        const item = typeof a.item === "function" ? a.item() : a.item;
        this.agent.setCarrying(item, a.opts || {});
        break;
      }
      case "do":
        a.fn?.();
        break;
      default:
        console.warn("Unknown action", a);
    }
  }
  _step(a, dt) {
    switch (a.kind) {
      case "walk":
        return this._stepWalk(dt);
      case "face":
        return this._stepFace(a, dt);
      case "turnChair":
        return this._stepTurnChair(a, dt);
      case "wait": {
        a._left -= dt;
        this.agent.update(dt, a.anim || {});
        return a._left <= 0;
      }
      case "until": {
        a._left -= dt;
        this.agent.update(dt, a.anim || {});
        return a.predicate() || a._left <= 0;
      }
      // Instant actions complete immediately.
      case "stepTo":
        return this._stepStepTo(a, dt);
      case "follow":
        return this._stepFollow(a, dt);
      case "sit":
        return this._stepSit(a, dt);
      case "stand":
        return this._stepStand(a, dt);
      case "status":
      case "carry":
      case "do":
        return true;
      default:
        return true;
    }
  }
  /**
   * Cover the pace set by `stepTo`, easing to a stop so they settle into a seat
   * rather than arriving at it dead on. Their facing is left alone: the turn
   * belongs to whoever queued the step, and somebody sitting down keeps looking
   * out into the room as they lower themselves backwards onto the cushion.
   */
  _stepStepTo(a, dt) {
    a._elapsed += dt;
    const k = Math.min(1, a._elapsed / a.seconds);
    const eased = easeOut(k);
    this.agent.setPositionXZ(
      lerp(a._from.x, a.target.x, eased),
      lerp(a._from.z, a.target.z, eased)
    );
    this.agent.update(dt, { moving: k < 1 });
    return k >= 1;
  }
  /**
   * Lower somebody into a seat: the last step and the fold, together.
   *
   * These used to be two actions — a `stepTo` that slid them into the seat on their
   * feet, and a `sit` that teleported them onto the cushion and snapped the pose in a
   * single frame. Both halves showed. Walking backwards into a couch put a standing
   * pair of legs through the frame on the way, and the snap at the end was a character
   * jumping from mid-stride to fully seated with nothing in between.
   *
   * One action fixes both, because it is one movement. The travel is eased out so they
   * settle rather than arrive, and `setSeated` has already started the pose blending at
   * the same rate — so the knees are folding while the body is still moving, and the
   * shins swing out in front of the couch instead of sweeping through it.
   *
   * A seat with no position is a seat they are already standing in: the sit is then
   * just the fold, which is what a chair swung in underneath somebody amounts to.
   */
  _stepSit(a, dt) {
    a._elapsed += dt;
    if (!a._folding) {
      const k = Math.min(1, a._elapsed / SIT_STEP_SECONDS);
      const eased = easeOut(k);
      this.agent.setPositionXZ(
        lerp(a._from.x, a._spot.x, eased),
        lerp(a._from.z, a._spot.z, eased)
      );
      const left = Math.hypot(a._spot.x - this.agent.position.x, a._spot.z - this.agent.position.z);
      this.agent.update(dt, { moving: left > SIT_STEP_SETTLE });
      if (k < 1) return false;
      a._folding = true;
      a._elapsed = 0;
      this.agent.setSeated(true, a.seatHeight != null ? { seatHeight: a.seatHeight } : {});
      return false;
    }
    const before = footReach(this.agent.seatBlend);
    this.agent.update(dt, {});
    const back = footReach(this.agent.seatBlend) - before;
    if (back > 0) {
      const heading2 = this.agent.root.rotation.y;
      const { x, z } = this.agent.position;
      this.agent.setPositionXZ(x - Math.sin(heading2) * back, z - Math.cos(heading2) * back);
    }
    return this.agent.seatBlend >= 1;
  }
  /**
   * Get up, and finish getting up before going anywhere.
   *
   * This used to complete in the same frame it started, which meant the step out of the
   * seat began while the character was still unfolding — so they rose and slid forward
   * at once, and what you saw was somebody sliding out of a couch and standing up
   * somewhere in front of it. Nobody leaves a sofa like that: you stand, and then you
   * walk.
   *
   * So it holds the queue until the pose has actually arrived. It does move them, but
   * only by what it takes to keep their feet still: see below. Whatever comes next — a
   * step clear, a walk across the room — starts from a character already on their feet.
   *
   * Gated on the pose rather than a clock, so a `setSeated(false, { instant: true })`
   * that has already put somebody on their feet costs no frames at all.
   */
  _stepStand(a, dt) {
    a._elapsed += dt;
    const before = footReach(this.agent.seatBlend);
    this.agent.update(dt, {});
    const forward = before - footReach(this.agent.seatBlend);
    if (forward > 0) {
      const heading2 = this.agent.root.rotation.y;
      const { x, z } = this.agent.position;
      this.agent.setPositionXZ(x + Math.sin(heading2) * forward, z + Math.cos(heading2) * forward);
    }
    return this.agent.seatBlend <= 0;
  }
  /**
   * Cover a fixed route, heights and all, spending one frame's worth of travel
   * across as many of its points as that reaches.
   *
   * Nobody goes round anybody here — a flight of stairs has no lanes, and stepping
   * aside on one means stepping off it — so the crowd is answered by *taking turns*
   * instead. One walker holds the flight; the rest wait at the end they are getting
   * on at, which is ground the room's ordinary separation pass can spread them
   * across, and follow them up one after another. That is what a staircase is: a
   * queue with a gap in it, going one way at a time.
   *
   * See `_mountBlocked` for the rule, and crowd.js for the other half of it.
   */
  _stepFollow(a, dt) {
    const agent = this.agent;
    const finish = () => {
      agent.walking = false;
      agent.onRoute = false;
      agent.routeFlight = null;
      agent.update(dt, { moving: false });
      return true;
    };
    if (!agent.onRoute) {
      a._waited += dt;
      if (this._mountBlocked(a) && a._waited < MOUNT_WAIT) {
        const mount7 = a.points[0];
        agent.faceDirection(mount7.x - agent.position.x, mount7.z - agent.position.z);
        agent.heldUp += dt;
        agent.update(dt, { moving: false });
        return false;
      }
      agent.onRoute = true;
      agent.routeFlight = a._flight;
      agent.routeDir = a._dir;
      agent.heldUp = 0;
    }
    let budget = a.speed * dt;
    while (budget > 0 && a._index < a.points.length) {
      const target = a.points[a._index];
      const pos = agent.position;
      const dx = target.x - pos.x;
      const dy = (target.y ?? 0) - pos.y;
      const dz = target.z - pos.z;
      const dist = Math.hypot(dx, dy, dz);
      if (dist <= Math.max(budget, ARRIVE_EPS)) {
        agent.setPositionXZ(target.x, target.z);
        agent.setElevation(target.y ?? 0);
        budget -= dist;
        a._index++;
      } else {
        const k = budget / dist;
        agent.setPositionXZ(pos.x + dx * k, pos.z + dz * k);
        agent.setElevation(pos.y + dy * k);
        budget = 0;
      }
      agent.faceDirection(dx, dz);
    }
    if (a._index >= a.points.length) return finish();
    agent.update(dt, { moving: true });
    return false;
  }
  /**
   * Is somebody else's turn still running on this flight?
   *
   * Two ways it can be, and both are the same rule seen from either end:
   *
   *   * **Coming the other way.** One line, walked in both directions: a climber and
   *     a descender do not pass, they walk through each other. So whoever is on it
   *     owns it, and the other waits at their end until it is empty.
   *   * **Still on the bottom step.** Behind somebody going the same way is fine —
   *     that is a queue — as long as it is a body's length behind, so wait until
   *     they are clear of the end being got on at.
   *
   * Only walkers who are actually *on* the flight count. Somebody else waiting to get
   * on never blocks, which is what keeps two people who both arrive at the foot from
   * standing there deferring to each other forever: the first controller to be asked
   * gets on, and by the time the second is asked there is a body on the stairs to
   * wait for. And nothing blocks a walker already on it, so a queue always drains.
   */
  _mountBlocked(a) {
    const mount7 = a.points[0];
    for (const other of this.crowd?.() ?? []) {
      if (other === this.agent || !other.onRoute) continue;
      if (other.routeFlight !== a._flight) continue;
      if (other.routeDir !== a._dir) return true;
      const dx = other.position.x - mount7.x;
      const dy = other.position.y - (mount7.y ?? 0);
      const dz = other.position.z - mount7.z;
      if (Math.hypot(dx, dy, dz) < STAIR_GAP) return true;
    }
    return false;
  }
  _stepWalk(dt) {
    const a = this.agent;
    const finish = () => {
      this._endPath();
      a.heldUp = 0;
      a.walking = false;
      a.update(dt, { moving: false });
      return true;
    };
    if (!this._path) return finish();
    const target = this._path[this._pathIndex];
    const pos = a.position;
    const dx = target.x - pos.x, dz = target.z - pos.z;
    const dist = Math.hypot(dx, dz);
    const step = WALK_SPEED * dt;
    if (dist <= Math.max(step, ARRIVE_EPS)) {
      a.setPositionXZ(target.x, target.z);
      this._pathIndex++;
      this._lastDist = null;
      if (this._pathIndex >= this._path.length) return finish();
    } else {
      const ux = dx / dist, uz = dz / dist;
      if (dist < NEAR_GOAL_RADIUS) {
        this._nearGoal += dt;
        if (this._nearGoal >= NEAR_GOAL_ABANDON) return finish();
      } else {
        this._nearGoal = 0;
      }
      const blocked = this.wayBlocked?.(a, ux, uz) === true;
      const gained = this._lastDist == null ? step : this._lastDist - dist;
      this._lastDist = dist;
      if (blocked || gained < step * 0.15) {
        this._heldUp += dt;
        a.heldUp = this._heldUp;
      } else {
        this._heldUp = 0;
        a.heldUp = 0;
        this._detourTries = 0;
      }
      if (this._heldUp >= this._nextDetour) {
        this._nextDetour = this._heldUp + HELD_UP_DETOUR;
        this._detour();
      }
      if (this._heldUp >= HELD_UP_ABANDON) return finish();
      if (blocked) {
        a.faceDirection(dx, dz);
        a.update(dt, { moving: false });
        return false;
      }
      a.setPositionXZ(pos.x + ux * step, pos.z + uz * step);
      a.faceDirection(dx, dz);
    }
    a.update(dt, { moving: true });
    return false;
  }
  /**
   * The heading that points this agent at `target`, matching Agent.faceDirection:
   * rotation 0 faces +z, so the arguments to atan2 go (dx, dz) in that order.
   */
  _headingTo(target) {
    const to = typeof target === "function" ? target() : target;
    const pos = this.agent.root.position;
    const dx = to.x - pos.x;
    const dz = to.z - pos.z;
    if (Math.abs(dx) < 1e-4 && Math.abs(dz) < 1e-4) return this._faceFrom;
    return Math.atan2(dx, dz);
  }
  /**
   * Held up: look for a way round the people in the way, and take it.
   *
   * Nobody waits for a colleague they could walk around, so waiting is what is left
   * when there is no way past — a lane too narrow for two, or the last step to a
   * machine somebody else is standing at. That is exactly when a queue is the right
   * behaviour, so the queue survives by being the only thing left rather than by
   * being asked for.
   *
   * The look radius widens with each attempt in a row that hasn't worked (see
   * DETOUR_LOOK_GROWTH): a route that dodges the nearest few people and still
   * runs straight back into a holdup is telling you the crowd is bigger than the
   * radius it was drawn from, and retrying that same radius forty times over is
   * just a slow way of finding HELD_UP_ABANDON.
   */
  _detour() {
    const look = DETOUR_LOOK * (1 + Math.min(this._detourTries, DETOUR_LOOK_MAX_TRIES) * DETOUR_LOOK_GROWTH);
    this._detourTries++;
    const around = [];
    for (const other of this.crowd?.() ?? []) {
      if (other === this.agent || other.seated) continue;
      const dx = other.position.x - this.agent.position.x;
      const dz = other.position.z - this.agent.position.z;
      if (Math.hypot(dx, dz) > look) continue;
      around.push(other.position);
    }
    const path = around.length && this.nav.findPath(this.agent.position, this._goal, { avoid: around }) || this.nav.findPath(this.agent.position, this._goal);
    if (!path || !path.length) return;
    this._path = path;
    this._pathIndex = 0;
    this._lastDist = null;
  }
  _stepFace(a, dt) {
    const FACE_TIME = 0.28;
    this._faceT += dt;
    const t = Math.min(1, this._faceT / FACE_TIME);
    this.agent.setRotation(this._faceFrom + shortestTurn(a._to - this._faceFrom) * t);
    this.agent.update(dt, { moving: false });
    return t >= 1;
  }
  /**
   * Swivel a desk chair, and whoever is sitting in it.
   *
   * The seat point never moves — a task chair turns about its post — so this is a
   * rotation and nothing else. Turning the occupant in step is what makes it read as
   * one movement: a person swinging round to their monitors, rather than a chair
   * revolving under a body that stares straight ahead.
   */
  _stepTurnChair(a, dt) {
    a._elapsed += dt;
    const k = Math.min(1, a._elapsed / a.seconds);
    const eased = smoothstep(k);
    const y = a._from + shortestTurn(a._to - a._from) * eased;
    a.desk.setChairFacing?.(y);
    if (this.agent.seated) this.agent.setRotation(y);
    this.agent.update(dt, { moving: false });
    return k >= 1;
  }
};
function shortestTurn(delta) {
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}
var walk = (target, status2 = "walking") => ({ kind: "walk", target, status: status2 });
var face = (rotation) => ({ kind: "face", rotation });
var lookAt = (target) => ({ kind: "face", at: target });
var SIT_STEP_SECONDS = 0.4;
var SIT_STEP_SETTLE = 0.75;
function seatStand(position, rotation) {
  const reach = footReach(1);
  return new THREE38.Vector3(
    position.x + Math.sin(rotation) * reach,
    0,
    position.z + Math.cos(rotation) * reach
  );
}
var sit = (rotation, seatHeight, position = null, seconds = SIT_SECONDS) => ({ kind: "sit", rotation, seatHeight, position, seconds });
var stepTo = (target, seconds = 0.45) => ({ kind: "stepTo", target, seconds });
var follow = (points, { speed = WALK_SPEED * 0.66, status: status2 = "walking" } = {}) => ({ kind: "follow", points, speed, status: status2 });
function flightKey(points) {
  const ends = [points[0], points[points.length - 1]].map((p) => `${p.x.toFixed(2)},${(p.y ?? 0).toFixed(2)},${p.z.toFixed(2)}`).sort();
  return ends.join("|");
}
function flightDirection(points) {
  const rise = (points[points.length - 1].y ?? 0) - (points[0].y ?? 0);
  return rise < 0 ? -1 : 1;
}
var stand = () => ({ kind: "stand" });
var turnChair = (desk, to, seconds = 0.2) => ({ kind: "turnChair", desk, to, seconds });
var wait = (duration, anim) => ({ kind: "wait", duration, anim });
var waitUntil = (predicate, timeout = 14, anim) => ({ kind: "until", predicate, timeout, anim });
var status = (s) => ({ kind: "status", status: s });
var carry = (item, opts) => ({ kind: "carry", item, opts });
var act = (fn) => ({ kind: "do", fn });
var vec = (p) => new THREE38.Vector3(p.x, 0, p.z);

// dist/ui/roving/src/agents/pathfinding.js
import * as THREE39 from "three";
var CELL = 0.5;
var MIN_X = 0;
var MIN_Z = -4;
var DOOR_HALF = 1.2;
var WALL_MARGIN = 0.6;
var EDGE_MARGIN = 0.6;
var DOORWAY_DEPTH = 4;
var BODY_CLEARANCE = 0.62;
var TIGHT_REACH = 1;
var TIGHT_PENALTY = 1;
var NavGrid = class {
  constructor() {
    this.cols = Math.ceil((ROOM.W - MIN_X) / CELL);
    this.rows = Math.ceil((ROOM.D - MIN_Z) / CELL);
    this.blocked = new Uint8Array(this.cols * this.rows);
    this.furniture = new Uint8Array(this.cols * this.rows);
    this.tight = new Uint8Array(this.cols * this.rows);
    this.rebuild();
  }
  /**
   * Re-derive the walkable map from the layout, in place.
   *
   * In place, and that is the point: one grid is handed out by reference to every
   * agent's controller, to the standing-spot book and to the crowd separation pass,
   * none of which are told when the furniture moves. Replacing the object would leave
   * all of them pathing around a room that no longer exists, so the same object is
   * re-derived and everybody holding it is correct again for free.
   *
   * Cheap enough to call on every drop: one pass over ~2.5k cells plus a rectangle
   * each for the props (see `obstacleFootprints`).
   */
  rebuild() {
    this.blocked.fill(0);
    this.furniture.fill(0);
    this._addBoundaries();
    this._addPropObstacles();
    this._markTight();
  }
  idx(cx, cz) {
    return cz * this.cols + cx;
  }
  inBounds(cx, cz) {
    return cx >= 0 && cz >= 0 && cx < this.cols && cz < this.rows;
  }
  isBlocked(cx, cz) {
    return !this.inBounds(cx, cz) || this.blocked[this.idx(cx, cz)] === 1;
  }
  /**
   * Flag every free cell within TIGHT_REACH of a piece of furniture.
   *
   * Furniture specifically, not `blocked` in general — a wall is not
   * something a walker's shoulders round the way a desk corner is, and the
   * doorway corridor is meant to be walked straight down the middle of, not
   * skirted like an obstacle. Checking the general blocked map here
   * charged TIGHT_PENALTY near every wall and the whole entrance lane, which
   * the chair-clipping measurements never covered — the frame-clipping percentages
   * that picked TIGHT_PENALTY's value were furniture-only.
   *
   * Run once per rebuild rather than measured mid-search: it depends only on
   * the furniture map, which a search never changes, so finding it up front is
   * one pass over ~2.5k cells instead of the same neighbourhood check redone
   * for every cell A* touches.
   */
  _markTight() {
    this.tight.fill(0);
    for (let cz = 0; cz < this.rows; cz++) {
      for (let cx = 0; cx < this.cols; cx++) {
        if (this.blocked[this.idx(cx, cz)]) continue;
        outer:
          for (let dz = -TIGHT_REACH; dz <= TIGHT_REACH; dz++) {
            for (let dx = -TIGHT_REACH; dx <= TIGHT_REACH; dx++) {
              if (!dx && !dz) continue;
              const nx = cx + dx, nz = cz + dz;
              if (!this.inBounds(nx, nz) || !this.furniture[this.idx(nx, nz)]) continue;
              this.tight[this.idx(cx, cz)] = 1;
              break outer;
            }
          }
      }
    }
  }
  worldToCell(x, z) {
    return [Math.floor((x - MIN_X) / CELL), Math.floor((z - MIN_Z) / CELL)];
  }
  cellToWorld(cx, cz) {
    return new THREE39.Vector3(MIN_X + cx * CELL + CELL / 2, 0, MIN_Z + cz * CELL + CELL / 2);
  }
  cellCenter(cx, cz) {
    return { x: MIN_X + cx * CELL + CELL / 2, z: MIN_Z + cz * CELL + CELL / 2 };
  }
  /** @param {Uint8Array} [into] which grid to mark; `this.blocked` if omitted. */
  block(x0, z0, x1, z1, into = this.blocked) {
    const [cx0, cz0] = this.worldToCell(Math.min(x0, x1), Math.min(z0, z1));
    const [cx1, cz1] = this.worldToCell(Math.max(x0, x1), Math.max(z0, z1));
    for (let cz = cz0; cz <= cz1; cz++)
      for (let cx = cx0; cx <= cx1; cx++)
        if (this.inBounds(cx, cz)) into[this.idx(cx, cz)] = 1;
  }
  // Walls, cutaway edges, and the outside area (except the doorway corridor).
  _addBoundaries() {
    for (let cz = 0; cz < this.rows; cz++) {
      for (let cx = 0; cx < this.cols; cx++) {
        const { x, z } = this.cellCenter(cx, cz);
        let blocked = false;
        if (z < WALL_MARGIN) {
          const inCorridor = Math.abs(x - DOOR.x) <= DOOR_HALF;
          const onStoop = z >= -DOOR.stoopDepth;
          blocked = !(inCorridor && onStoop);
        } else if (x < WALL_MARGIN) {
          blocked = true;
        } else if (x > ROOM.W - EDGE_MARGIN) {
          blocked = true;
        } else if (z > ROOM.D - EDGE_MARGIN) {
          blocked = true;
        }
        if (blocked) this.blocked[this.idx(cx, cz)] = 1;
      }
    }
  }
  // Furniture footprints, taken straight from the layout config. Marked in
  // both grids: `blocked`, same as any obstacle, and `furniture`, which is
  // what `_markTight` costs a shoulder-width margin around — walls and the
  // doorway are blocked too, but never furniture, so never tight. The soft
  // ones are skipped entirely; see `obstacleFootprints`.
  _addPropObstacles() {
    for (const f of obstacleFootprints()) {
      if (f.soft) continue;
      if (f.role === "stand") continue;
      const b = f.berth ?? 0;
      this.block(f.x0 - b, f.z0 - b, f.x1 + b, f.z1 + b);
      this.block(f.x0 - b, f.z0 - b, f.x1 + b, f.z1 + b, this.furniture);
    }
  }
  /**
   * Can somebody stand at this world point?
   *
   * The same question `isBlocked` answers, asked in world units, because the
   * crowd separation pass works in world space and has to know where it is
   * allowed to push people (see agents/crowd.js).
   */
  walkableAt(x, z) {
    const [cx, cz] = this.worldToCell(x, z);
    return !this.isBlocked(cx, cz);
  }
  /**
   * Every cell reachable on foot from a world point, as a flag per cell.
   *
   * A flood fill rather than a route, because the question it answers is about the
   * whole room at once: the furniture editor asks whether *anything* has been fenced
   * off, and one pass over the grid answers that for every approach point together,
   * where a path search would be one search per point (see `validate` in
   * src/editor.js).
   *
   * Four-connected on purpose, and this is the one place that differs from `findPath`.
   * A route may cut a diagonal between two blocked cells because a walker has width
   * and rounds the corner; reachability is a promise, and a promise squeezed through a
   * gap of exactly zero is not one worth making.
   *
   * @param {{x: number, z: number}} from
   * @returns {Uint8Array} indexed by `idx(cx, cz)`
   */
  reachableFrom(from) {
    const seen = new Uint8Array(this.cols * this.rows);
    const [sx, sz] = this.nearestFree(from.x, from.z);
    if (this.isBlocked(sx, sz)) return seen;
    const queue = [this.idx(sx, sz)];
    seen[queue[0]] = 1;
    for (let head = 0; head < queue.length; head++) {
      const cur = queue[head];
      const cx = cur % this.cols, cz = Math.floor(cur / this.cols);
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, nz = cz + dz;
        if (this.isBlocked(nx, nz)) continue;
        const ni = this.idx(nx, nz);
        if (seen[ni]) continue;
        seen[ni] = 1;
        queue.push(ni);
      }
    }
    return seen;
  }
  /** Can somebody get from `from` to this world point at all? Uses a prepared fill. */
  reachedBy(seen, x, z) {
    const [cx, cz] = this.worldToCell(x, z);
    if (!this.inBounds(cx, cz)) return false;
    return seen[this.idx(cx, cz)] === 1;
  }
  /** Nearest walkable cell to a world point (targets may sit on obstacles). */
  nearestFree(x, z) {
    const [cx, cz] = this.worldToCell(x, z);
    if (!this.isBlocked(cx, cz)) return [cx, cz];
    for (let r = 1; r < Math.max(this.cols, this.rows); r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.abs(dx) !== r && Math.abs(dz) !== r) continue;
          const nx = cx + dx, nz = cz + dz;
          if (!this.isBlocked(nx, nz)) return [nx, nz];
        }
      }
    }
    return [cx, cz];
  }
  /**
   * A* -> list of world-space waypoints. The final point is the exact target.
   *
   * `avoid` is a set of world points to route around as though they were furniture
   * — the people standing in the way. The room is fixed but its occupants are not,
   * so a walker who finds somebody in front of them asks for the way round rather
   * than standing there (see `_stepWalk` in states.js). Where there is no way round
   * this returns null, and waiting is the right answer after all.
   *
   * @param {{x: number, z: number}} start
   * @param {{x: number, z: number}} goal
   * @param {{avoid?: Iterable<{x: number, z: number}>, clearance?: number}} [opts]
   */
  findPath(start, goal, { avoid = null, clearance = BODY_CLEARANCE } = {}) {
    const [sx, sz] = this.nearestFree(start.x, start.z);
    const [gx, gz] = this.nearestFree(goal.x, goal.z);
    const startI = this.idx(sx, sz), goalI = this.idx(gx, gz);
    const exact = new THREE39.Vector3(goal.x, 0, goal.z);
    if (startI === goalI) return [exact];
    const shut = this._cellsAround(avoid, clearance, [startI, goalI]);
    const isBlocked = shut ? (cx, cz) => this.isBlocked(cx, cz) || shut.has(this.idx(cx, cz)) : (cx, cz) => this.isBlocked(cx, cz);
    const open = new MinHeap();
    const gScore = /* @__PURE__ */ new Map([[startI, 0]]);
    const came = /* @__PURE__ */ new Map();
    open.push(startI, this._h(sx, sz, gx, gz));
    const neighbors = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1]
    ];
    while (open.size) {
      const current = open.pop();
      if (current === goalI) {
        const pts = this._reconstruct(came, current);
        pts[pts.length - 1] = exact;
        return pts;
      }
      const ccx = current % this.cols, ccz = Math.floor(current / this.cols);
      for (const [dx, dz] of neighbors) {
        const nx = ccx + dx, nz = ccz + dz;
        if (isBlocked(nx, nz)) continue;
        if (dx !== 0 && dz !== 0 && (isBlocked(ccx + dx, ccz) || isBlocked(ccx, ccz + dz))) continue;
        const ni = this.idx(nx, nz);
        const step = dx !== 0 && dz !== 0 ? 1.414 : 1;
        const cost = step + (this.tight[ni] ? TIGHT_PENALTY : 0);
        const tentative = gScore.get(current) + cost;
        if (tentative < (gScore.get(ni) ?? Infinity)) {
          came.set(ni, current);
          gScore.set(ni, tentative);
          open.push(ni, tentative + this._h(nx, nz, gx, gz));
        }
      }
    }
    return null;
  }
  /**
   * The cells within `clearance` of any of these points, as a set of indices.
   *
   * A body's width rather than a point, because a route that merely misses
   * somebody's centre still walks through their shoulder.
   */
  _cellsAround(points, clearance, keep = []) {
    if (!points) return null;
    const set = /* @__PURE__ */ new Set();
    const reach = Math.ceil(clearance / CELL);
    for (const p of points) {
      const [px, pz] = this.worldToCell(p.x, p.z);
      for (let dz = -reach; dz <= reach; dz++) {
        for (let dx = -reach; dx <= reach; dx++) {
          const cx = px + dx, cz = pz + dz;
          if (!this.inBounds(cx, cz)) continue;
          const c = this.cellCenter(cx, cz);
          if (Math.hypot(c.x - p.x, c.z - p.z) > clearance) continue;
          set.add(this.idx(cx, cz));
        }
      }
    }
    for (const i of keep) set.delete(i);
    return set.size ? set : null;
  }
  _h(ax, az, bx, bz) {
    const dx = Math.abs(ax - bx), dz = Math.abs(az - bz);
    return dx + dz + (1.414 - 2) * Math.min(dx, dz);
  }
  _reconstruct(came, current) {
    const cells = [current];
    while (came.has(current)) {
      current = came.get(current);
      cells.unshift(current);
    }
    const pts = cells.map((i) => this.cellToWorld(i % this.cols, Math.floor(i / this.cols)));
    return this._smooth(pts);
  }
  // Drop collinear waypoints for smoother walking.
  _smooth(pts) {
    if (pts.length <= 2) return pts;
    const out = [pts[0]];
    for (let i = 1; i < pts.length - 1; i++) {
      const a = out[out.length - 1], b = pts[i], c = pts[i + 1];
      const abx = b.x - a.x, abz = b.z - a.z;
      const bcx = c.x - b.x, bcz = c.z - b.z;
      if (Math.abs(abx * bcz - abz * bcx) > 1e-3) out.push(b);
    }
    out.push(pts[pts.length - 1]);
    return out;
  }
  /** A random walkable point inside the room (never on the stoop). */
  randomInteriorPoint() {
    for (let tries = 0; tries < 60; tries++) {
      const cx = Math.floor(Math.random() * this.cols);
      const cz = Math.floor(Math.random() * this.rows);
      if (this.isBlocked(cx, cz)) continue;
      const { x, z } = this.cellCenter(cx, cz);
      if (z < 1) continue;
      if (z < DOORWAY_DEPTH && Math.abs(x - DOOR.x) < DOOR_HALF + 0.8) continue;
      return new THREE39.Vector3(x, 0, z);
    }
    return new THREE39.Vector3(ROOM.W / 2, 0, ROOM.D / 2);
  }
};
var MinHeap = class {
  constructor() {
    this.items = [];
  }
  get size() {
    return this.items.length;
  }
  push(node, prio) {
    this.items.push({ node, prio });
    let i = this.items.length - 1;
    while (i > 0) {
      const p = i - 1 >> 1;
      if (this.items[p].prio <= this.items[i].prio) break;
      [this.items[p], this.items[i]] = [this.items[i], this.items[p]];
      i = p;
    }
  }
  pop() {
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length) {
      this.items[0] = last;
      let i = 0;
      const n = this.items.length;
      for (; ; ) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let s = i;
        if (l < n && this.items[l].prio < this.items[s].prio) s = l;
        if (r < n && this.items[r].prio < this.items[s].prio) s = r;
        if (s === i) break;
        [this.items[s], this.items[i]] = [this.items[i], this.items[s]];
        i = s;
      }
    }
    return top.node;
  }
};

// dist/ui/roving/src/agents/colour.js
var SHIRT_PALETTE = [
  7320032,
  // soft blue
  8111231,
  // sage green
  11831776,
  // lavender
  14723407,
  // warm gold
  5222576,
  // teal
  14253998,
  // dusty rose
  14710874,
  // warm coral
  9141151,
  // muted mauve
  5939156,
  // deeper blue
  7179119,
  // muted green
  14264170,
  // burnt orange
  13204090,
  // muted terracotta
  8036285,
  // slate blue
  11048301,
  // warm taupe
  6269087,
  // dusty teal
  14719411
  // soft pink
];
var srgbToLinear = (c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
function toOklab(color) {
  const r = srgbToLinear((color >> 16 & 255) / 255);
  const g = srgbToLinear((color >> 8 & 255) / 255);
  const b = srgbToLinear((color & 255) / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  ];
}
function toLch(color) {
  const [L, a, b] = toOklab(color);
  return [L, Math.hypot(a, b), Math.atan2(b, a)];
}
var WARDROBE = (() => {
  const lch = SHIRT_PALETTE.map(toLch);
  const ls = lch.map((x) => x[0]);
  const cs = lch.map((x) => x[1]);
  return {
    lMin: Math.min(...ls),
    lMax: Math.max(...ls),
    cMin: Math.min(...cs),
    cMax: Math.max(...cs)
  };
})();

// dist/ui/roving/src/agents/post.js
var ARRIVALS = ["letter", "package", "fax"];
var ARRIVAL_WEIGHTS = { letter: 2, package: 1, fax: 1 };
function arrivalFor(rng = Math.random, channels = ARRIVALS) {
  const pool = channels.length ? channels : ARRIVALS;
  const shareOf = (a) => ARRIVAL_WEIGHTS[a] ?? 1;
  const total = pool.reduce((n, a) => n + shareOf(a), 0);
  let roll = rng() * total;
  for (const a of pool) {
    roll -= shareOf(a);
    if (roll < 0) return a;
  }
  return pool[pool.length - 1];
}
var Post = class {
  constructor() {
    this.pending = [];
    this.inFlight = /* @__PURE__ */ new Map();
  }
  /** How many envelopes are sitting in the box. */
  get size() {
    return this.pending.length;
  }
  /**
   * Post an envelope. Counted as in-flight immediately, so a recipient will walk
   * over and wait at the box for a plane that has not landed yet — the request
   * exists the moment it is made, and only the animation lags.
   */
  post(forId = null) {
    if (forId) this.inFlight.set(forId, (this.inFlight.get(forId) ?? 0) + 1);
  }
  /** A posting that never got airborne, so nobody should wait for it. */
  unpost(forId = null) {
    if (forId) this._land(forId);
  }
  _land(forId) {
    if (!forId) return;
    const left = (this.inFlight.get(forId) ?? 1) - 1;
    if (left > 0) this.inFlight.set(forId, left);
    else this.inFlight.delete(forId);
  }
  /**
   * Touchdown.
   *
   * `arrival` is settled before the flight rather than here, because it decides which
   * way the work travels — a letter comes in through the window, a package comes to
   * the door — so by the time anything lands the choice is long made. It is worked
   * out from the title if a caller leaves it off.
   *
   * `plan` is the checklist the request arrived with, when it had one — carried
   * rather than acted on, because an envelope's contents are nobody's business until
   * somebody opens it. Most post has none.
   *
   * @param {{job: string, forId: ?string, arrival: ?string, plan: ?object}} envelope
   * @param {(id: string) => boolean} isPresent  is the recipient still in the room?
   * @return {boolean} false if the envelope was binned undelivered
   */
  land({ job, forId = null, jobId = null, arrival = null, plan = null, box: box2 = null }, isPresent = () => true) {
    this._land(forId);
    if (forId && !isPresent(forId)) return false;
    this.pending.push({
      job,
      forId,
      jobId,
      arrival: arrival ?? arrivalFor(),
      plan,
      box: box2,
      at: Date.now()
    });
    return true;
  }
  /**
   * How many envelopes arrived a given way, in one box or in all of them.
   *
   * Scoped by box because a room may have several, and each prop draws only what is
   * actually in it: two boxes both showing the same three letters would be worse than
   * not offering a second box at all. Omit `box` for the room's whole total.
   */
  countByArrival(arrival, box2 = null) {
    return this.pending.reduce((n, m) => {
      if (m.arrival !== arrival) return n;
      if (box2 !== null && m.box !== box2) return n;
      return n + 1;
    }, 0);
  }
  /**
   * Which boxes hold something this agent may open, oldest envelope first.
   *
   * So a collector can be sent to the nearest box that has anything for them rather
   * than to *the* box, which is a question a room with two of them cannot answer.
   * Boxes are returned in the order their oldest openable envelope arrived, so with
   * nothing else to choose between them the older work is still preferred.
   */
  boxesWith(id) {
    const seen = [];
    for (const m of this.pending) {
      if (m.forId && m.forId !== id) continue;
      if (!seen.includes(m.box ?? null)) seen.push(m.box ?? null);
    }
    return seen;
  }
  /**
   * Index of the first envelope this agent may open, or -1.
   *
   * `box` narrows it to one box, which is what a collector standing at a particular
   * box needs: they can only take what is in front of them. Left off, it asks about the
   * room, which is what deciding whether to set off at all needs.
   */
  indexFor(id, box2 = void 0) {
    return this.pending.findIndex((m) => (!m.forId || m.forId === id) && (box2 === void 0 || (m.box ?? null) === box2));
  }
  /** Is there anything for this agent — anywhere, or in one particular box? */
  canCollect(id, box2 = void 0) {
    return this.indexFor(id, box2) >= 0;
  }
  /**
   * Does this agent have post of their own to fetch — in the box or still inbound?
   *
   * Addressed post only. Unaddressed mail keeps its older, looser meaning — it is
   * picked up on the way to a job by whoever is going anyway — so it must not
   * drag a seated agent out of their chair.
   */
  hasOwn(id) {
    if ((this.inFlight.get(id) ?? 0) > 0) return true;
    return this.pending.some((m) => m.forId === id);
  }
  /**
   * Take the first envelope this agent may open, out of one box or out of any.
   *
   * Scoped in practice: an agent takes from the box they walked to. Unscoped is kept
   * for the headless case, where there is no scenery and no walk to speak of.
   */
  take(id, box2 = void 0) {
    const i = this.indexFor(id, box2);
    if (i < 0) return null;
    return this.pending.splice(i, 1)[0];
  }
  /** Retitle addressed mail that landed before its harness learned the concise title. */
  retitleFor(id, from, to) {
    if (!id || !from || !to || from === to) return 0;
    let changed = 0;
    for (const item of this.pending) {
      if (item.forId !== id || item.job !== from) continue;
      item.job = to;
      changed += 1;
    }
    return changed;
  }
  /**
   * Give up on post that never arrived.
   *
   * An agent who has stood at the box for the full wait and found nothing was
   * expecting a plane that is not coming: the flight was dropped for a full
   * queue, or the scene was torn down under it. The expectation has to go, because
   * `hasOwn` is what sends them to the box — leave it standing and they set off
   * again the moment they sit down, and again, and again, forever.
   *
   * Safe against a plane that lands late. `land` puts a late envelope in the box
   * regardless, and one waiting there is enough to bring its recipient back.
   *
   * @return {number} how many expectations were abandoned
   */
  abandon(id) {
    const expected = this.inFlight.get(id) ?? 0;
    this.inFlight.delete(id);
    return expected;
  }
  /**
   * Bin everything addressed to an agent who has gone, including what is still in
   * the air, and say how many envelopes left the box so the flag can be corrected.
   */
  dropFor(id) {
    const before = this.pending.length;
    this.pending = this.pending.filter((m) => m.forId !== id);
    this.inFlight.delete(id);
    return before - this.pending.length;
  }
};

// dist/ui/roving/src/agents/pilot.js
var PILOT_HOLD = 10;
var PILOT_PART = 2;
var CHECKLIST = [
  "Pull the branch",
  "Run the tests",
  "Read the diff",
  "Write the notes",
  "Post the summary"
];
var PILOT_ACTIONS = [
  {
    // The one button that exercises the whole delivery path: posted, flown in,
    // announced, waited for at the box, opened, and carried to a desk. `Work` cannot
    // stand in for it — with an empty mailbox that button goes to the inbox stack
    // instead, and an agent who already has material does not fetch anything at all.
    key: "letter",
    label: "Job by air",
    title: "A request flies in by air, addressed to them: they fetch it from the mailbox and take it to a desk",
    mail: { job: "A request that came by air", arrival: "letter" },
    event: { type: "status", status: "working" }
  },
  {
    // Same trip, different arrival — the two buttons exist so each channel can be
    // door with the courier and up the stairs onto the pile — and the two channels
    // are separate scenery, so a button that only ever posted letters would leave
    // half of it unpressable.
    key: "package",
    label: "Job by courier",
    title: "A request brought by courier to the door, fetched from the mailbox like any other",
    mail: { job: "A request that came by courier", arrival: "package" },
    event: { type: "status", status: "working" }
  },
  {
    // The letter channel's other vehicle, pinned rather than left to the toss —
    // the birds are rare on purpose, and a button that only sometimes shows a
    // bird is a button that mostly shows a plane.
    key: "bird",
    label: "Job by bird",
    title: "The same letter, carried in by bird \u2014 mostly the owl, and mostly at night",
    mail: { job: "A request that came by bird", arrival: "letter", vehicle: "bird" },
    event: { type: "status", status: "working" }
  },
  {
    key: "work",
    label: "Work",
    title: "Get the work and sit down at a desk with it: the mailbox if there is post, the inbox stack if not",
    job: "Working at the desk",
    event: { type: "status", status: "working" }
  },
  {
    key: "checklist",
    label: "Checklist",
    title: "Work through a five-part checklist at the desk",
    job: "Release checks",
    event: { type: "status", status: "working" },
    plan: CHECKLIST
  },
  {
    key: "wait",
    label: "Wait",
    title: "Waiting on input: stay at the desk, screens down",
    job: "Waiting for an answer",
    event: { type: "status", status: "waiting" }
  },
  {
    key: "lookup",
    label: "Look up",
    title: "Take a book off the shelf and read it",
    event: { type: "research", topic: "the filing conventions", scope: "graph" }
  },
  {
    key: "web",
    label: "Search web",
    title: "Go outside for the answer: the globe on the shelf turns",
    event: { type: "research", topic: "the state of the art", scope: "web" }
  },
  {
    key: "post",
    label: "Post run",
    title: "Take something to the mailbox mid-job and come back to the desk",
    event: { type: "status", status: "delivering" }
  },
  {
    key: "dispatch",
    label: "Deliver",
    title: "Finish: carry the work to the mailbox and post it",
    job: "Work to deliver",
    event: { type: "dispatch", summary: "Delivered by hand" }
  },
  {
    key: "bin",
    label: "Bin it",
    title: "Error: crumple the work up and drop it in the bin",
    job: "Work to bin",
    event: { type: "status", status: "error" }
  },
  {
    key: "drink",
    label: "Drink",
    title: "Fetch a drink and take it wherever this one takes it",
    event: { type: "activity", activity: "drink" }
  },
  {
    key: "sofa",
    label: "Sofa",
    title: "Sit down on the couch for a while",
    event: { type: "activity", activity: "couch" }
  },
  {
    // The one movement the room could already do and nobody had ever seen: the pose
    // was written with the agent and nothing asked for it, so it was reachable only by
    // hand. A button, because a celebration has no feed event that implies it —
    // finishing work delivers, and delivering is its own errand.
    key: "dance",
    label: "Dance",
    title: "A happy dance, on the spot: arms overhead, off the floor, out of whatever they were sitting in",
    event: { type: "activity", activity: "dance" }
  },
  {
    key: "wander",
    label: "Wander",
    title: "Nothing on: walk somewhere else in the room",
    event: { type: "status", status: "idle" }
  },
  {
    key: "home",
    label: "Go home",
    title: "Coat off the stand, out through the door, and gone",
    event: { type: "exit" }
  },
  {
    // The second exception, and the only entry here that stands in for no event at
    // all. Nothing a harness can send asks to be beamed up: the cone of light is the
    // *room* giving up on a departure that has not finished, thirty seconds after it
    // was asked for (see `LEAVE_GRACE` in AgentManager). So what this button stands in
    // for is the thirty seconds, which is the one thing about the feature nobody would
    // sit through to look at — and the alternative to a button is backgrounding the
    // tab for half a minute and hoping you catch the tail of it.
    //
    // Last in the row, after `home`, because that is when it happens: this is what
    // going home looks like when going home does not work.
    key: "beam",
    label: "Beam up",
    title: "Give up on the walk out: a cone of light comes down and takes them, as it does thirty seconds after a departure gets stuck",
    beam: true
  }
];
var BY_KEY = new Map(PILOT_ACTIONS.map((a) => [a.key, a]));
var pilotAction = (key) => BY_KEY.get(key) ?? null;
function pilotPlan(action) {
  if (!action?.plan?.length) return null;
  return {
    items: action.plan.map((title, i) => ({ id: `part-${i + 1}`, title, status: "pending" })),
    more: 0
  };
}

// dist/ui/roving/src/scene/beam.js
import * as THREE40 from "three";
var STRIKE = 0.22;
var LIFT = 0.95;
var FADE = 0.3;
var TOTAL = STRIKE + LIFT + FADE;
var AT_ONCE = 8;
var BEAM_H = ROOM.H * 6;
var BEAM_R_TOP = 2.4;
var BEAM_R_BOTTOM = 0.52;
var RISE2 = 6.4;
var SPIN = 9;
var GLOW = 4570610;
var CORE = 15399679;
function stillness() {
  return globalThis.window?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
}
function glow(color, opacity, { additive = false } = {}) {
  return new THREE40.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: additive ? THREE40.AdditiveBlending : THREE40.NormalBlending,
    depthWrite: false,
    side: THREE40.DoubleSide
  });
}
function buildBeam() {
  const root = group(0, 0, 0);
  const column = group(0, BEAM_H, 0);
  const cone = new THREE40.Mesh(
    new THREE40.CylinderGeometry(BEAM_R_TOP, BEAM_R_BOTTOM, BEAM_H, 18, 1, true),
    glow(GLOW, 0)
  );
  cone.position.y = -BEAM_H / 2;
  cone.castShadow = false;
  cone.receiveShadow = false;
  const core = new THREE40.Mesh(
    new THREE40.CylinderGeometry(BEAM_R_TOP * 0.22, BEAM_R_BOTTOM * 0.3, BEAM_H, 12, 1, true),
    glow(CORE, 0, { additive: true })
  );
  core.position.y = -BEAM_H / 2;
  core.castShadow = false;
  core.receiveShadow = false;
  column.add(cone, core);
  const ring = new THREE40.Mesh(new THREE40.RingGeometry(0.66, 0.95, 28), glow(CORE, 0, { additive: true }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = FLOOR_TOP + 0.04;
  ring.castShadow = false;
  ring.receiveShadow = false;
  root.add(column, ring);
  root.visible = false;
  return { root, column, cone, core, ring };
}
var BeamUps = class {
  /** @param {THREE.Object3D} scene  where the cones are drawn */
  constructor(scene) {
    this.root = group(0, 0, 0);
    scene.add(this.root);
    this.slots = [];
  }
  /** How many characters are being beamed up right now. */
  get active() {
    return this.slots.filter((s) => s.agent).length;
  }
  /**
   * Whether another one would have to wait.
   *
   * Asked before a caller disturbs anybody, so that being refused costs the person
   * refused nothing — see `AgentManager._beamOut`.
   */
  get busy() {
    return !stillness() && this.active >= AT_ONCE;
  }
  /**
   * Take somebody out of the room.
   *
   * Built on first use rather than pooled up front, because a room where nobody
   * ever gets stuck should carry no cones at all — including in the coplanar
   * probe, which walks the whole scene graph and does not care whether a mesh is
   * visible.
   *
   * @param {{root: THREE.Object3D, position: THREE.Vector3, setTagFade: Function}} agent
   * @param {Function} onGone  called once, when they should be removed from the room
   * @returns {boolean} whether this one has been dealt with — either beamed, or
   *   removed outright because the viewer asked for stillness. False means every
   *   beam is busy and the caller should offer them again on a later frame; they
   *   are already overdue, and a few seconds more of that is worth having the
   *   clear-out actually be watchable.
   */
  beamUp(agent, onGone) {
    if (stillness()) {
      onGone?.();
      return true;
    }
    if (this.busy) return false;
    let slot = this.slots.find((s) => !s.agent);
    if (!slot) {
      slot = { beam: buildBeam(), agent: null, onGone: null, t: 0, gone: false, y: 0, spin: 0 };
      this.root.add(slot.beam.root);
      this.slots.push(slot);
    }
    slot.agent = agent;
    slot.onGone = onGone ?? null;
    slot.t = 0;
    slot.gone = false;
    slot.y = agent.root.position.y;
    slot.spin = agent.root.rotation.y;
    agent.setTagFade(0);
    slot.beam.root.position.set(agent.position.x, 0, agent.position.z);
    slot.beam.root.visible = true;
    this._draw(slot, 0);
    return true;
  }
  update(dt) {
    for (const slot of this.slots) {
      if (!slot.agent) continue;
      slot.t += dt;
      this._draw(slot, slot.t);
      if (!slot.gone && slot.t >= STRIKE + LIFT) {
        slot.gone = true;
        const done = slot.onGone;
        slot.onGone = null;
        done?.();
      }
      if (slot.t >= TOTAL) {
        slot.agent = null;
        slot.beam.root.visible = false;
      }
    }
  }
  /** Where everything is at `t` seconds into one beam. */
  _draw(slot, t) {
    const { beam, agent } = slot;
    const strike = clamp01(t / STRIKE);
    const lift = clamp01((t - STRIKE) / LIFT);
    const fade = clamp01((t - STRIKE - LIFT) / FADE);
    beam.column.scale.y = 0.04 + 0.96 * smoothstep(strike);
    const pinch = 1 - 0.72 * fade;
    beam.column.scale.x = pinch;
    beam.column.scale.z = pinch;
    const shimmer = 1 + 0.12 * Math.sin(t * 34);
    beam.cone.material.opacity = 0.42 * strike * (1 - fade) * shimmer;
    beam.core.material.opacity = 0.55 * strike * (1 - fade * fade) * shimmer;
    const pool = clamp01(t / (STRIKE + LIFT * 0.45));
    beam.ring.scale.setScalar(0.7 + pool * 1.5);
    beam.ring.material.opacity = 0.6 * (1 - pool) * strike;
    if (!agent || slot.gone) return;
    const k = lift * lift;
    agent.root.position.y = slot.y + RISE2 * k;
    agent.root.rotation.y = slot.spin + t * SPIN;
    const shrink = 1 - 0.86 * clamp01((lift - 0.25) / 0.75);
    agent.root.scale.setScalar(shrink);
  }
};

// dist/ui/roving/src/agents/AgentManager.js
var HOLD = 3600;
var HAND_HELD = /* @__PURE__ */ new Set(["status", "job", "step", "research", "activity", "dispatch"]);
var DOORWAY = { id: "doorway", approach: DOOR.inside, lookRotation: 0 };
var entranceSteps = (direction, actions) => actions.map((a) => ({ ...a, entrance: direction }));
var sitDownOn = (seat, seatHeight) => [
  walk(seat.front),
  face(seat.rotation),
  // No separate step in. `sit` carries them the last stride itself, lowering them as
  // it goes: stepping in first put a standing pair of legs through the couch frame,
  // and then the sit snapped the pose in one frame once they were already there.
  sit(seat.rotation, seatHeight, seat.position)
];
var standUpFrom = (seat) => [
  stand(),
  stepTo(seat.front)
];
var CHAIR_FRONT = 0.95;
var chairEntry = (desk, nav, agent) => {
  const sides = [1, -1].map((sign) => {
    const facing = desk.sitRotation + sign * (Math.PI / 2);
    return { facing, front: chairFront(desk, facing) };
  }).filter(({ front }) => nav.walkableAt(front.x, front.z)).sort((a, b) => a.front.distanceToSquared(agent.position) - b.front.distanceToSquared(agent.position));
  if (sides.length) return sides[0];
  return chairEntryFromTheFront(desk);
};
var chairFront = (desk, facing) => vec({
  x: desk.seat.x + Math.sin(facing) * CHAIR_FRONT,
  z: desk.seat.z + Math.cos(facing) * CHAIR_FRONT
});
var chairEntryFromTheFront = (desk) => {
  const facing = desk.sitRotation + Math.PI;
  return { facing, front: chairFront(desk, facing) };
};
var sitDownAtDesk = (rec, desk, nav) => [
  // Which side to sit down from is decided from across the room, before they set
  // off, so that the walk brings them up beside the chair. Deciding it on arrival
  // meant walking in behind the chair first and then round the back of it.
  act(() => {
    rec.chairEntry = chairEntry(desk, nav, rec.agent);
  }),
  // If the last person to use this desk stood at it, the chair is parked aside and the
  // desk is up. Both are undone by the person who wants to sit: they pull the chair back
  // in and put the desk down. No-ops on an ordinary desk and on one already seated.
  act(() => desk.pushChairAside(false)),
  act(() => desk.setStanding(false)),
  walk(() => rec.chairEntry.front),
  // And wait for both to arrive, rather than assuming the walk was longer than the motor.
  // Usually already true by now, which is the point: this costs nothing when the desk
  // beat them to it and saves the one case where it did not. The chair matters as much as
  // the height — sitting on a chair still sliding back in is sitting on thin air.
  waitUntil(() => desk.raised === 0 && desk.chairAside === 0),
  ...getIntoChair(desk, () => rec.chairEntry)
];
var takeUpPostAtDesk = (rec, desk, nav) => desk.standing && desk.takeStandingTurn() ? standAtDesk(rec, desk) : sitDownAtDesk(rec, desk, nav);
var standAtDesk = (rec, desk) => [
  act(() => {
    rec.standingAtDesk = true;
  }),
  walk(() => desk.approach),
  // Within arm's reach of it before touching it. The mat and the seat are the same patch
  // of floor, so the chair has to go before there is anywhere to stand.
  act(() => desk.pushChairAside(true)),
  waitUntil(() => desk.chairAside === 1),
  act(() => desk.setStanding(true)),
  waitUntil(() => desk.raised === 1),
  stepTo(desk.seat, 0.5),
  face(() => desk.sitRotation)
];
var leavePostAtDesk = (rec, desk) => [
  stepTo(desk.approach, 0.3),
  act(() => {
    rec.standingAtDesk = false;
  })
];
var getIntoChair = (desk, entryOf) => [
  turnChair(desk, () => entryOf().facing),
  // Facing the way the chair faces, and stepping back into it: the same movement as
  // sitting down on the couch, and for the same reason — you sit on a seat from its
  // front, looking out of it.
  face(() => entryOf().facing),
  sit(null, SEAT_HEIGHT, desk.seat),
  turnChair(desk, desk.sitRotation)
];
var standUpFromDesk = (rec, desk) => {
  const entry = rec.chairEntry ?? chairEntryFromTheFront(desk);
  return [
    ...getOutOfChair(desk, entry),
    act(() => {
      rec.chairEntry = null;
    })
  ];
};
var getOutOfChair = (desk, entry) => [
  turnChair(desk, entry.facing),
  stand(),
  stepTo(entry.front, 0.26),
  turnChair(desk, desk.sitRotation)
];
var LONG_JOB = 30;
var P_DESK_DRINK = 0.2;
var MAIL_WAIT = 20;
var RESEARCH_SPIN = 7;
var LEAVE_GRACE = 30;
var FRAME_STALL = 3;
var wallClock = () => globalThis.performance?.now?.() ?? Date.now();
var RESEARCH_HOLD = 2.8;
var FAX_HOLD = 1.1;
var FAX_DIAL = 1.4;
var DANCE_SECONDS = 3.4;
var AgentManager = class {
  constructor(scene, props) {
    this.scene = scene;
    this.props = props;
    this.nav = new NavGrid();
    this.spots = new StandingSpots(this.nav);
    this.agents = /* @__PURE__ */ new Map();
    this.jobOwner = /* @__PURE__ */ new Map();
    this.byActor = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Set();
    this.feedListeners = /* @__PURE__ */ new Set();
    this.beams = new BeamUps(scene);
    this.now = wallClock;
    this._drawnAt = 0;
    this.post = new Post();
    this.ringing = [];
    if (this.props.mail) {
      this.props.mail.onArrive = (payload) => this._mailArrived(payload);
    }
    if (this.props.birds) {
      this.props.birds.onArrive = (payload) => this._mailArrived(payload);
    }
    if (this.props.deliveries) {
      this.props.deliveries.onArrive = (payload) => this._mailArrived(payload);
    }
  }
  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  _emitChange() {
    const r = this.roster();
    for (const fn of this.listeners) fn(r);
  }
  /**
   * Subscribe to mailbox traffic. Entries are
   *   { kind: 'delivery'|'collected'|'removal', job, at, by?, for?, forColor? }
   * where `at` is a timestamp in ms and `for` is the name of the agent an
   * addressed envelope was posted to (absent when it is open to anyone), with
   * `forColor` their colour — the same one the plane was tinted with.
   *
   * The recipient is spelled out on the entry rather than left as an id for the
   * panels to look up, because an entry is a record of a moment: the line naming
   * who a delivery was for should still say so after they have gone home.
   */
  onFeed(fn) {
    this.feedListeners.add(fn);
    return () => this.feedListeners.delete(fn);
  }
  _emitFeed(entry) {
    const full = { ...entry, at: entry.at ?? Date.now(), pending: this.post.size };
    for (const fn of this.feedListeners) fn(full);
  }
  roster() {
    return [...this.agents.values()].map(({ agent, pilot, jobs }) => ({
      id: agent.id,
      name: agent.name,
      status: agent.status,
      // Every job this person has open, one entry each, oldest first. Usually one — and
      // for a single job the panels read `job` and `status` above exactly as before, so
      // nothing had to learn a new shape to keep working. Several means several: two
      // cron ticks, or a chat and an errand, and the row says both rather than picking
      // the newest and quietly dropping the other.
      jobs: [...jobs?.values() ?? []].map((j) => ({ id: j.id, title: j.title, status: j.status })),
      // Which button is driving this agent, if one is: the panel that drew the
      // buttons marks the pressed one and says the agent is being held.
      piloted: pilot?.key ?? null,
      color: agent.color,
      job: agent.job,
      drink: agent.drink,
      // Only set when the colour was somebody's choice rather than the palette's, so
      // the detail panel can say so without claiming a drawn colour means anything.
      colorLabel: agent.colorLabel ?? null,
      // A picture of whoever this is, when their harness sent one up.
      avatar: agent.avatar ?? null,
      variant: agent.variant,
      // Which part of the round is in hand, and the checklist behind it. Both null
      // for nearly every agent in the room; a panel that draws anything for null is
      // the panel with the bug.
      step: agent.step,
      plan: agent.plan,
      // The feed this one came in on, so the panels can mark each row with the
      // harness it belongs to rather than labelling the whole room with one.
      source: agent.source,
      recent: agent.recentJobs()
    }));
  }
  getAgent(id) {
    return this.agents.get(id)?.agent ?? null;
  }
  /**
   * Whose desk this is, by first name, or null if nobody's.
   *
   * A desk is booked for as long as its occupant is in the building rather than for the
   * length of a job (see `_claimDesk`), so this is a stable answer and worth showing in
   * the editor: it is the one fact about a desk that is not visible by looking at it.
   *
   * First name only, because it is read in a narrow panel beside a coordinate pair, and
   * because a room this size has no two Peters in it. `rec.desk` is the truth here rather
   * than the desk's own `occupiedBy` — they are two sides of one booking, and this side is
   * the one that knows the person.
   *
   * @param   {string} deskId  the desk's layout id, e.g. `desk-4`
   * @returns {?string} their first name, or null if the desk is free
   */
  deskOccupantName(deskId) {
    for (const rec of this.agents.values()) {
      if (rec.desk?.id === deskId) return rec.agent.name.split(/\s+/)[0];
    }
    return null;
  }
  agentIdFromObject(obj) {
    let o = obj;
    while (o) {
      if (o.userData && o.userData.agentId) return o.userData.agentId;
      o = o.parent;
    }
    return null;
  }
  /**
   * Show everybody who came from these sources out of the building.
   *
   * The office's sources changed and some of them are no longer wanted. Their
   * characters walk out on the ordinary path — desk given back, coat off the stand,
   * lift called, out the door — rather than being deleted where they stand, because
   * unticking a source is a decision about a *feed*, and the person it was drawing
   * was standing at a desk a second ago. Removing the room instead, which is what
   * changing sources used to do, took everybody else with it.
   *
   * Anyone already on their way out is left to it, and the source is matched on the
   * agent's own def rather than on their id prefix: the prefix names the feed
   * instance, and this is a question about the source.
   *
   * @param {Array<string|{id: string}>} sources  source ids, or the defs themselves
   * @returns {number} how many were sent home
   */
  showOut(sources) {
    const ids = /* @__PURE__ */ new Set();
    for (const s of sources ?? []) {
      const id = typeof s === "string" ? s : s?.id;
      if (id) ids.add(id);
    }
    if (ids.size === 0) return 0;
    let sent = 0;
    for (const rec of [...this.agents.values()]) {
      if (rec.leaving || !ids.has(rec.agent.source?.id)) continue;
      this._leave(rec);
      sent += 1;
    }
    return sent;
  }
  // -------------------------------------------------------------------------
  /**
   * @param {object} ev
   * @param {?object} [source] the SourceDef this event arrived on. Only a spawn
   *   uses it — everything after names an agent who already wears their source —
   *   so a feed that cannot say is simply an agent with no mark.
   */
  handleEvent(ev, source2 = null) {
    if (ev.type === "spawn") return this._spawn(ev, source2);
    if (ev.type === "mail") return this._post(ev);
    const rec = this.agents.get(this.jobOwner.get(ev.id) ?? ev.id);
    if (!rec) return;
    if (rec.beaming) return;
    if (rec.pilot && HAND_HELD.has(ev.type)) return;
    return this._apply(rec, ev);
  }
  /**
   * One event, turned into office behaviour.
   *
   * Split from `handleEvent` so that a button in the agent detail panel can reach the
   * same behaviours the feed reaches, without going back through the gate that is
   * there to keep the feed off it (see `pilot`).
   */
  _apply(rec, ev) {
    switch (ev.type) {
      case "status": {
        this._noteJob(rec, ev.id, { status: ev.status });
        return this._status(rec, ev.status);
      }
      // A live session is re-surnamed whenever it is given a new job. The person
      // is unchanged, so this must not disturb anything they are doing.
      case "rename": {
        rec.agent.setName(ev.name);
        return this._emitChange();
      }
      // A harness that knows what colour an agent wears may only learn it a hook
      // after the session began (spec §3.2), so the shirt can change once, early.
      case "recolor": {
        rec.agent.setColor(ev.color, ev.colorLabel ?? null);
        rec.desk?.setAssignment?.(rec.agent);
        return this._emitChange();
      }
      // A face arrives later still, since the adapter has to get the picture here
      // before it can point at it (spec §3.2).
      case "avatar": {
        rec.agent.setAvatar(ev.avatar ?? null);
        return this._emitChange();
      }
      case "job": {
        const label2 = rec.jobAlias?.from === ev.job ? rec.jobAlias.to : ev.job;
        rec.agent.job = label2;
        rec.agent.beginJob(label2);
        this._noteJob(rec, ev.id, { title: label2, status: "working" });
        this._resetDeskTimer(rec);
        return this._emitChange();
      }
      // A harness may learn its concise job title after work has begun. Change the
      // job already in history instead of opening a second one for the same round.
      // Keep the alias even if the envelope is still flying: `_mailArrived` applies
      // it at touchdown, while `retitleFor` covers one already waiting in the box.
      case "retitle": {
        const from = ev.from ?? rec.agent.job;
        if (from && from !== ev.job) rec.jobAlias = { from, to: ev.job };
        const mailChanged = this.post.retitleFor(rec.agent.id, from, ev.job);
        const jobChanged = rec.agent.retitleLatestJob(ev.job, from);
        this._noteJob(rec, ev.id, { title: ev.job });
        if (mailChanged || jobChanged) return this._emitChange();
        return void 0;
      }
      // A part of the round, in and out. No status, no journey, no log entry — the
      // panels repaint and that is the whole of it.
      case "step": {
        rec.agent.setStep(ev.step ?? null, ev.plan);
        return this._emitChange();
      }
      case "research":
        return this._research(rec, ev.topic, ev.scope);
      case "activity":
        return this._activity(rec, ev.activity);
      case "dispatch":
        return this._deliver(rec, ev.summary);
      // One session ended. That is the end of a *job*, and only the end of the person
      // when it was their last one — an agent whose cron tick finished while their chat
      // is still open has not gone home. `ev.id` is absent when the detail panel drives
      // this by hand, and by hand means the person, so that still shows them out.
      case "exit": {
        if (ev.id && rec.jobs.size > 1 && rec.jobs.has(ev.id)) {
          rec.jobs.delete(ev.id);
          this.jobOwner.delete(ev.id);
          return this._emitChange();
        }
        return this._leave(rec);
      }
      case "despawn":
        return this._remove(rec);
      default:
        console.warn("Unknown agent event", ev);
    }
  }
  // --- Driving one agent by hand --------------------------------------------
  //
  // The buttons along the bottom of the agent detail panel. The catalogue of what
  // they are is in pilot.js, and the reason they exist is there too; this is the
  // three things the room has to do about them — take the wheel, keep the errand
  // going, and hand it back.
  /**
   * Do this, now, and then stand still for a moment.
   *
   * Three parts, and each is a decision:
   *
   *   * **Whatever was in hand is over, quietly.** A hand on the button is neither a
   *     delivery nor an error, so nothing walks to the mailbox or the bin and the
   *     feed panel says nothing — the log closes the open entry where it stood and
   *     opens the one you asked for. That entry is what makes the panel's "Recent
   *     jobs" a record of which buttons were pressed, in order.
   *   * **The behaviour runs as a feed event.** Which is the point of the whole
   *     feature: the room is driven down the path a real harness drives it down.
   *   * **Then the agent is held**, for PILOT_HOLD seconds after the errand comes to
   *     rest, before the idle loop takes them back. See `_pilotTick`.
   *
   * @param {string} id    the agent to drive
   * @param {string} key   a key from PILOT_ACTIONS
   * @returns {boolean} whether there was anybody of that id to drive, and a button
   *   of that name to press
   */
  pilot(id, key) {
    const rec = this.agents.get(id);
    const action = pilotAction(key);
    if (!rec || !action) return false;
    if (action.beam) {
      rec.agent.finishJob("done");
      rec.agent.setStep(null, null);
      rec.jobAlias = null;
      return this._beamOut(rec);
    }
    if (rec.leaving) return false;
    rec.agent.finishJob("done");
    rec.agent.setStep(null, null);
    rec.jobAlias = null;
    rec.onMailRun = false;
    const plan = pilotPlan(action);
    rec.pilot = {
      key,
      // Seconds the errand has been at rest for. The hold runs on this rather than on
      // a wall clock so a backgrounded tab does not quietly serve the whole ten
      // seconds while nothing was being drawn.
      hold: 0,
      // The parts still to be worked through, and how long until the next one is
      // opened. Null for every button but the checklist.
      parts: plan ? [...plan.items] : null,
      partIn: PILOT_PART
    };
    if (action.job) {
      rec.agent.job = action.job;
      rec.agent.beginJob(action.job);
    }
    if (plan) rec.agent.setStep(null, plan);
    if (action.mail) this._post({ type: "mail", ...action.mail, forId: id });
    this._apply(rec, { ...action.event, id });
    this._emitChange();
    return true;
  }
  /**
   * Keep a hand-driven errand going, and hand the agent back when it is over.
   *
   * Called once a frame per agent, from `update`.
   */
  _pilotTick(rec, dt) {
    const p = rec.pilot;
    if (!p) return;
    const left = p.parts && (p.parts.length > 0 || rec.agent.step !== null);
    if (left && rec.agent.seated && rec.agent.status === "working") {
      p.partIn -= dt;
      if (p.partIn <= 0) {
        p.partIn = PILOT_PART;
        this._nextPart(rec, p);
        p.hold = 0;
      }
    }
    if (!this._parked(rec)) {
      p.hold = 0;
      return;
    }
    p.hold += dt;
    if (p.hold >= PILOT_HOLD) this._letGo(rec);
  }
  /**
   * Tick the part in hand off the checklist and open the next one.
   *
   * The plan object is edited in place, which is what `pilotPlan` builds a fresh one
   * per press for: the panels read the agent's own plan every time they paint, so a
   * marked entry shows up in all four of them at once.
   */
  _nextPart(rec, p) {
    const { agent } = rec;
    const plan = agent.plan;
    const open = agent.step;
    if (!plan) {
      p.parts.length = 0;
      agent.setStep(null);
      return;
    }
    if (open) {
      const done = plan.items.find((e) => e.id === open.id);
      if (done) done.status = "completed";
    }
    const next = p.parts.shift() ?? null;
    if (next) next.status = "active";
    const of = plan.items.length + plan.more;
    agent.setStep(next ? { id: next.id, title: next.title, index: of - p.parts.length, of } : null);
    this._emitChange();
  }
  /**
   * Has this errand come to rest?
   *
   * Two ways a behaviour ends, and only one of them empties the queue. The rest
   * *park*: work at a desk finishes on `wait(HOLD)` — "stay like this until told
   * otherwise" — which is an hour long and never runs out, so waiting for an empty
   * queue would hold a piloted agent at their desk until the end of the afternoon.
   * Sitting in that wait with nothing behind it is the same thing as being finished.
   */
  _parked(rec) {
    const { current, queue } = rec.controller;
    if (queue.length) return false;
    if (!current) return true;
    return current.kind === "wait" && current.duration >= HOLD;
  }
  /**
   * Hand a piloted agent back to the room.
   *
   * The seat is given up on the way out, because the hold can end anywhere: at a
   * desk, on a cushion, or standing at the coffee machine. `_release` is the same
   * list every other behaviour starts from, so what happens next starts from
   * somewhere a person could actually stand.
   */
  _letGo(rec) {
    rec.pilot = null;
    rec.agent.setStep(null, null);
    rec.controller.run(this._release(rec));
    this._idle(rec);
    this._emitChange();
  }
  /**
   * Record what one of a person's jobs is now doing.
   *
   * The character animates on the newest event whatever happens — one body, one thing at
   * a time — and this is the other half of that: the *panel* has to be able to say what
   * each job is doing, which the single `agent.status` cannot when there are two.
   *
   * Silent when the session is not one we are tracking. An event for an unknown job is
   * an event for a person we do have, so it has already been applied to them; inventing
   * a job row from it would put work on the panel that no `spawn` ever announced.
   */
  _noteJob(rec, sessionId, patch) {
    const job = sessionId ? rec.jobs?.get(sessionId) : null;
    if (!job) return;
    Object.assign(job, patch);
  }
  /**
   * Somebody new — or somebody already here, starting a second job.
   *
   * The second case is the whole of the many-sessions-one-person problem in one
   * branch. A `spawn` carries the actor
   * behind its session when the harness knows one (spec §3.2), and an actor already in
   * the room is the *same person*: their new session becomes another job of theirs, and
   * nobody walks in. No second character, no second desk, no second name badge reading
   * the same name — which is what a room with three identical Sidelines in it was.
   *
   * Somebody on their way out is not eligible. They have been told to go home and are
   * walking to the door; handing them a job would either strand them mid-stride or need
   * the leaving unwound, and a fresh arrival is both simpler and truer to what happened.
   */
  _spawn({ id, name, actor = null, color, colorLabel = null, variant = null, avatar = null }, source2 = null) {
    if (this.agents.has(id) || this.jobOwner.has(id)) return;
    const actorKey = actor && source2?.id ? `${source2.id}|${actor}` : null;
    const held = actorKey ? this.agents.get(this.byActor.get(actorKey)) : null;
    if (held && !held.leaving) {
      held.jobs.set(id, { id, title: null, status: held.agent.status });
      this.jobOwner.set(id, held.agent.id);
      return this._emitChange();
    }
    const agent = new Agent({
      id,
      name: name || id,
      // A colour the feed supplied is the agent's own — an OpenClaw agent with a
      // `Colour:` in its IDENTITY.md is recognisable across restarts, which a drawn
      // one never is. Everybody else gets the palette.
      color: color ?? this._pickColor(),
      colorLabel,
      avatar,
      source: source2,
      variant
    });
    const arriveAt = this.props.stairs?.route[0] ?? DOOR.outside;
    agent.setPositionXZ(arriveAt.x, arriveAt.z);
    agent.setElevation(arriveAt.y ?? 0);
    agent.setRotation(0);
    this.scene.add(agent.root);
    const controller = new AgentController(
      agent,
      this.nav,
      (walker, ux, uz) => wayBlocked(walker, this._people(), ux, uz),
      () => this._people()
    );
    const rec = {
      agent,
      controller,
      desk: null,
      coatHook: null,
      couchSeat: null,
      book: null,
      // Which couch that seat is a cushion of. Remembered alongside the seat, for the
      // same reason a borrowed book remembers its shelf: with several couches in the
      // room, the standing room to walk to and step back out to is this couch's and not
      // whichever one happens to be first in the list.
      couch: null,
      // How this person got into their chair, so they can get out of it the same way.
      chairEntry: null,
      // Set when mailbox collection retitles the work in flight.
      jobAlias: null,
      // The jobs this person has open, by the session each one arrived in. One on
      // arrival; more when the same actor's next session turns up (see above). The
      // character leaves when the last of them ends, not when the first does.
      jobs: /* @__PURE__ */ new Map([[id, { id, title: null, status: "idle" }]]),
      // How this person is recognised across sessions, so `_remove` can stop
      // advertising them as somebody a later session can join.
      actorKey,
      // Whether the work in hand came as a letter or a package, so it goes back out
      // the way it came in. Null when they are carrying nothing.
      arrivedBy: null,
      // Set while somebody is being driven by hand from the detail panel, and null
      // the rest of the time — which is every agent in a real office. See `pilot`.
      pilot: null,
      // Still on their way in, and not to be interrupted until they are through the
      // door. See `_begin`.
      arriving: true,
      // ...and the other end of it: told to go home and walking out. See `_leave`.
      leaving: false,
      // When they were told, and whether the room has given up on the walk and
      // beamed them up instead. See `LEAVE_GRACE` and `_beamOut`.
      leaveAt: 0,
      beaming: false
    };
    controller.onIdle = () => this._idle(rec);
    this.agents.set(id, rec);
    this.jobOwner.set(id, id);
    if (actorKey) this.byActor.set(actorKey, id);
    this._peopleCache = null;
    this._claimDesk(rec);
    const stairs = this.props.stairs;
    const lift = this.props.elevator;
    if (lift) {
      agent.root.visible = false;
    }
    this._begin(rec, [
      status("walking"),
      ...entranceSteps("in", [
        ...lift ? [
          act(() => this.props.elevator.call()),
          waitUntil(() => this.props.elevator.ready),
          act(() => {
            agent.root.visible = true;
          })
        ] : [],
        ...stairs ? [follow(stairs.route)] : []
      ]),
      // Step in to a place of their own. A lift can put several people on the mat
      // at once, and one shared point just inside the door meant they arrived on
      // top of each other and then had to untangle themselves.
      walk(() => this.spots.claim(DOORWAY, rec.agent)),
      act(() => {
        rec.coatHook = this.props.coatStand?.addCoat(agent.color) ?? null;
        rec.arriving = false;
      }),
      status("idle")
    ]);
    this._emitChange();
  }
  // --- The post -------------------------------------------------------------
  //
  // The ownership rules live in `post.js`; this is only the walking about. See
  // that file for why an envelope is addressed at posting time rather than at
  // collection time.
  /** Send an envelope, addressed or not. */
  _post(ev) {
    const jobId = ev.forId ?? null;
    const forId = jobId ? this.jobOwner.get(jobId) ?? jobId : null;
    if (forId && !this.agents.has(forId)) return;
    const rec = forId ? this.agents.get(forId) : null;
    this.post.post(forId);
    const ways = enabledArrivals(ARRIVALS);
    if (!ways.length) return;
    const asked = ev.arrival && ways.includes(ev.arrival) ? ev.arrival : ev.vehicle === "bird" && ways.includes("letter") ? "letter" : null;
    const arrival = asked ?? arrivalFor(Math.random, ways);
    const box2 = postBoxFor(Math.random, arrival)?.id ?? null;
    const payload = {
      job: ev.job,
      forId,
      jobId,
      arrival,
      box: box2,
      plan: ev.plan ?? null,
      color: rec?.agent.color
    };
    const byBird = arrival === "letter" && CHANNELS.birds && (ev.vehicle === "bird" || ev.vehicle == null && this.props.birds && Math.random() < BIRD_SHARE);
    const channel = arrival === "fax" ? null : arrival === "package" ? this.props.deliveries : byBird ? this.props.birds ?? this.props.mail : this.props.mail;
    if (arrival === "fax") {
      this._propAt({ id: box2 })?.ring?.(RING_SECONDS);
      this.ringing.push({ left: RING_SECONDS, payload });
      return;
    }
    if (!channel) return this._mailArrived(payload);
    if (channel.launch(payload) === false) this.post.unpost(forId);
  }
  // A letter has just come down in the slot, or a parcel on the pile.
  _mailArrived(payload) {
    const incomingJob = payload?.job ?? "New job";
    const forId = payload?.forId ?? null;
    const jobId = payload?.jobId ?? null;
    const arrival = payload?.arrival ?? null;
    const box2 = payload?.box ?? null;
    const plan = payload?.plan ?? null;
    const rec = forId ? this.agents.get(forId) : null;
    const job = rec?.jobAlias?.from === incomingJob ? rec.jobAlias.to : incomingJob;
    const delivered = this.post.land({ job, forId, jobId, arrival, plan, box: box2 }, (id) => this.agents.has(id));
    if (delivered && arrival === "fax" && box2) this._propAt({ id: box2 })?.print?.();
    if (!delivered) return;
    this._emitFeed({
      kind: "delivery",
      job,
      arrival: arrival ?? "letter",
      for: rec?.agent.name ?? null,
      forColor: rec?.agent.color ?? null
    });
  }
  /** Open the envelope: the prompt inside is what the work turns out to be. */
  _collectMail(rec, box2 = void 0) {
    rec.onMailRun = false;
    const item = this.post.take(rec.agent.id, box2);
    if (!item) {
      this.post.abandon(rec.agent.id);
      rec.hasMaterial = true;
      rec.agent.setCarrying(null);
      return;
    }
    const original = rec.agent.currentJobLabel();
    if (rec.agent.renameOpenJob(item.job)) {
      rec.jobAlias = { from: original, to: item.job };
    } else {
      rec.agent.job = item.job;
      rec.agent.beginJob(item.job);
      rec.jobAlias = null;
    }
    if (item.jobId) this._noteJob(rec, item.jobId, { title: item.job, status: "working" });
    if (item.plan) rec.agent.setStep(null, item.plan);
    rec.hasMaterial = true;
    rec.arrivedBy = item.arrival ?? "letter";
    rec.agent.setCarrying(rec.arrivedBy);
    this._emitFeed({
      kind: "collected",
      job: item.job,
      arrival: rec.arrivedBy,
      by: rec.agent.name
    });
    this._emitChange();
  }
  /**
   * A status from the feed, turned into somewhere to be.
   *
   * Spelled out one status at a time rather than as "these three, and everything
   * else wanders": `delivering` used to fall off the end of that list — the AOP
   * adapter emits it for a push or a commit (see AopSource._toolStart) — so an
   * agent told they were delivering went for an aimless walk labelled idle, and
   * the violet ring the palette defines for it was never once seen. Anything
   * genuinely unrecognised still wanders, which is the right shrug for a word we
   * do not know, but it says so first.
   */
  _status(rec, next) {
    switch (next) {
      case "working":
        return this._work(rec);
      case "waiting":
        return this._wait(rec);
      case "error":
        return this._discard(rec);
      case "delivering":
        return this._postRun(rec);
      case "idle":
        return this._wander(rec);
      default:
        console.warn("Unknown agent status", next);
        return this._wander(rec);
    }
  }
  // --- Behaviours ----------------------------------------------------------
  // Collect job material, then sit at a desk and work.
  _work(rec) {
    const desk = rec.desk ?? this._claimDesk(rec);
    if (!desk) return this._wait(rec);
    if (rec.onMailRun) return;
    this._resetDeskTimer(rec);
    const actions = [];
    let mailRun = false;
    const ownPost = this.post.hasOwn(rec.agent.id);
    if (ownPost || !rec.hasMaterial) {
      const fromMailbox = ownPost || this.post.canCollect(rec.agent.id);
      const station2 = fromMailbox ? this._nearestPostBox(rec) : stationForRole("intake", { from: rec.agent.position, serves: "stock" });
      actions.push(
        ...this._release(rec),
        status("walking"),
        walk(() => this.spots.claim(station2, rec.agent)),
        lookAt(station2)
      );
      if (fromMailbox) {
        actions.push(
          // Their own plane may still be in the air. Waiting at the box is the
          // honest move: the request exists, so the agent stands there until it
          // lands rather than pretending it already had.
          //
          // Only for post of their own, though. An agent collecting unaddressed
          // mail came over for an envelope that was already in the box, so there
          // is nothing to wait for — if someone beat them to it, the predicate is
          // checked once and they carry on rather than loitering for the full
          // twenty seconds over a box that is empty.
          waitUntil(() => this.post.canCollect(rec.agent.id, station2?.id ?? null), ownPost ? MAIL_WAIT : 0),
          wait(0.35),
          // A page that missed the tray is picked up on the way past, before whatever is
          // in the tray: it is between them and the machine, and walking over it to take
          // a clean sheet off the top is not what anybody does. Only a printer has one,
          // and asking the prop rather than the kind means nothing here has to know
          // which props can overshoot.
          act(() => {
            const prop = this._propAt(station2);
            if (prop?.overshot) prop.retrieve?.();
          }),
          act(() => this._collectMail(rec, station2?.id ?? null))
        );
      } else {
        actions.push(...this._collectFrom(rec, station2));
      }
      mailRun = fromMailbox;
    }
    actions.push(
      status("walking"),
      ...takeUpPostAtDesk(rec, desk, this.nav),
      carry(null),
      act(() => desk.setWorking(true)),
      status("working"),
      wait(HOLD, { typing: true })
    );
    this._begin(rec, actions, mailRun);
    this._emitChange();
  }
  // Waiting on input: stay at the desk if seated, but dim the screens.
  _wait(rec) {
    if (rec.agent.seated && rec.desk) rec.desk.setWorking(false);
    this._begin(rec, [status("waiting"), wait(HOLD)]);
    this._emitChange();
  }
  /**
   * Look something up, then come back to the desk that is waiting for them.
   *
   * A question is answered in one of two places, and the room shows which. What
   * the company knows is on the shelf, so a graph look-up takes a book down and
   * reads it. The web is not in the building, so it is the globe on top of the
   * shelf that answers for it — and the globe turning is the only way to tell,
   * from across the room, that somebody has gone outside for an answer.
   *
   * @param {'graph'|'web'} [scope] where the answer is being looked for
   */
  _research(rec, topic, scope = "graph") {
    const station2 = stationForRole("research", { from: rec.agent.position, serves: scope });
    if (!station2) return this._work(rec);
    const web = scope === "web";
    if (topic) rec.agent.job = web ? `Searching the web: ${topic}` : `Looking up: ${topic}`;
    const actions = [
      ...this._release(rec),
      status("walking"),
      walk(() => this.spots.claim(station2, rec.agent)),
      lookAt(station2),
      wait(0.7)
    ];
    if (station2.kind === "telescope") {
      const scope3 = this._propAt(station2);
      actions.push(
        act(() => scope3?.scan(RESEARCH_HOLD)),
        status("researching"),
        // The stoop and the sweep run for the same beat, so the tube stops moving as
        // they straighten up rather than sweeping on at an empty eyepiece.
        wait(RESEARCH_HOLD, { stooping: true })
      );
    } else if (web) {
      actions.push(
        act(() => this._globeAt(station2)?.spin(RESEARCH_SPIN)),
        status("researching"),
        wait(RESEARCH_HOLD)
      );
    } else {
      actions.push(
        act(() => {
          rec.shelf = this._propAt(station2);
          rec.book = rec.shelf?.takeBook() ?? null;
        }),
        carry("book", { color: 5208714 }),
        status("researching"),
        wait(RESEARCH_HOLD, { reading: true }),
        act(() => this._returnBook(rec)),
        carry(null)
      );
    }
    actions.push(wait(0.4));
    if (rec.desk) {
      const desk = rec.desk;
      actions.push(
        status("walking"),
        ...takeUpPostAtDesk(rec, desk, this.nav),
        act(() => desk.setWorking(true)),
        status("working"),
        wait(HOLD, { typing: true })
      );
    }
    this._begin(rec, actions);
    this._emitChange();
  }
  // Finished: carry the work to whichever way out is nearest and send it.
  _deliver(rec, _summary) {
    const { agent } = rec;
    const mb = stationForRole("dispatch", { from: rec.agent.position });
    const faxing = mb?.kind === "printer";
    this._begin(rec, [
      ...this._release(rec),
      // Out the way it came in: work that arrived as a letter leaves as one.
      carry(() => rec.arrivedBy ?? "package"),
      status("delivering"),
      walk(() => this.spots.claim(mb, rec.agent)),
      lookAt(mb),
      wait(0.7),
      // Dialling the number, which is what makes an outgoing fax read as *outgoing*.
      // One hand up at the touchscreen jabbing at it, and only at a printer: there is
      // nothing to dial on a mailbox, and a hand raised at one would be a mime.
      ...faxing ? [wait(FAX_DIAL, { dialling: true })] : [],
      act(() => {
        if (faxing) this._fax(rec, mb);
        else this._propAt(mb)?.deliver();
        rec.hasMaterial = false;
        agent.finishJob("done");
        rec.jobAlias = null;
        rec.arrivedBy = null;
        this._emitChange();
      }),
      carry(null),
      // A fax is not instant. The sheet goes into the feeder and the machine takes a
      // beat over it, which is the one place this errand differs from posting: an
      // envelope is gone the moment it is through the slot.
      ...faxing ? [wait(FAX_HOLD)] : [],
      wait(0.4),
      status("idle")
    ]);
    this._emitChange();
  }
  /**
   * Every prop method in this file is called with `?.()` and not `?.`, and this note is
   * the reason: an optional *chain* guards a prop that is absent, and an optional *call*
   * guards a method that is. They are different failures and only the second one is the
   * common one — a prop is nearly always there and is nearly always a stub or an older
   * handle missing the method just added. This has bitten three times over the printer
   * alone
   * (`takePackage`, then `ring`), each time reading as safe because there was a `?` in
   * the line. If you add a call to a prop here, write `prop?.thing?.()`.
   *
   * Pick up material at a station, whatever that station happens to be.
   *
   * Returns the actions for the collection, or an empty list when there is genuinely
   * nothing here to take — an empty printer tray, or a post box being used as the stock
   * fallback in a room with no inbox. Nothing to collect is a real answer and not an
   * error: they walk over, find it bare, and go to work without visible material, which
   * is what the room already does when it is running headless with no scenery at all.
   *
   * @returns {Array} steps to append, possibly none
   */
  _collectFrom(rec, station2) {
    const prop = this._propAt(station2);
    if (typeof prop?.takePackage === "function") {
      return [
        wait(0.6),
        act(() => {
          prop.takePackage();
          rec.hasMaterial = true;
          rec.arrivedBy = "package";
        }),
        carry("package")
      ];
    }
    return [];
  }
  /**
   * Send finished work out as a fax, and let the machine keep its own copy.
   *
   * The copy is the whole reason the printer is an `intake` station as well as a
   * `dispatch` one: the work leaves the building, and the sheet it printed on the way
   * out waits in the tray as material for whoever needs some next. That is what makes
   * the tray fill because the office has been *working*, rather than because something
   * arrived — which is the distinction between a printout and the post, and the reason
   * The printer work asked whether a print was an arrival or a product. It is both, in
   * that
   * order, and this function is where the order is written down.
   *
   * The fax goes whether or not the copy prints. A full tray refuses the sheet (see
   * `TRAY_LIMIT`) and the work still leaves, because a machine out of tray space is not
   * a reason for a finished job to stay finished-but-not-sent.
   */
  _fax(rec, station2) {
    const prop = this._propAt(station2);
    prop?.fax?.();
    const label2 = rec.agent.currentJobLabel() ?? rec.agent.job;
    this.post.land(
      { job: label2 ? `Copy: ${label2}` : "A printed copy", forId: null, arrival: "fax", box: station2.id },
      (id) => this.agents.has(id)
    );
    prop?.print?.();
  }
  /**
   * A trip to the mailbox that is not the end of anything.
   *
   * `dispatch` closes a job: the work is finished, it goes in the box, and the
   * log gets its "done". A `delivering` *status* is a smaller thing — a push, a
   * commit, something sent out mid-turn — so this walks the same walk and comes
   * back to the desk with the job still open. Getting these two confused would
   * mark work finished every time an agent ran `git push`.
   */
  _postRun(rec) {
    const mb = stationForRole("dispatch", { from: rec.agent.position });
    const desk = rec.desk;
    const actions = [
      carry(() => rec.arrivedBy ?? "package"),
      status("delivering"),
      walk(() => this.spots.claim(mb, rec.agent)),
      lookAt(mb),
      wait(0.7),
      act(() => this._propAt(mb)?.deliver()),
      carry(null),
      wait(0.3)
    ];
    if (desk) {
      actions.push(
        status("walking"),
        ...takeUpPostAtDesk(rec, desk, this.nav),
        act(() => desk.setWorking(true)),
        status("working"),
        wait(HOLD, { typing: true })
      );
    } else {
      actions.push(status("idle"));
    }
    this._begin(rec, [...this._release(rec), ...actions]);
    this._emitChange();
  }
  // Errored: crumple it up and bin it, then go idle.
  _discard(rec) {
    const { agent } = rec;
    const bin = stationForRole("discard", { from: rec.agent.position });
    if (!bin) return this._discardInPlace(rec);
    this._begin(rec, [
      ...this._release(rec),
      status("error"),
      wait(1.2),
      carry(() => rec.arrivedBy ?? "package"),
      walk(() => this.spots.claim(bin, rec.agent)),
      lookAt(bin),
      wait(0.5),
      act(() => {
        this.props.bin?.discard();
        rec.hasMaterial = false;
        const label2 = agent.currentJobLabel();
        agent.finishJob("error");
        rec.jobAlias = null;
        rec.arrivedBy = null;
        this._emitFeed({ kind: "removal", job: label2 ?? agent.job, by: agent.name });
        this._emitChange();
      }),
      carry(null),
      wait(0.4),
      status("idle")
    ]);
    this._emitChange();
  }
  /**
   * Throw the work away without a bin to throw it into.
   *
   * A room may have no bin: `discard` is deliberately not one of `JOB_ROLES`, on the
   * grounds that an office with nowhere to bin things is a poorer office and a working
   * one. So the beat still happens — the pause where you realise it has gone wrong, and
   * the work closing as an error — it simply happens at the desk. No walk, no crumple,
   * and the same `removal` entry in the log, because what the panel reports is that the
   * work was thrown away and not which prop received it.
   */
  _discardInPlace(rec) {
    const { agent } = rec;
    this._begin(rec, [
      status("error"),
      wait(1.2),
      act(() => {
        rec.hasMaterial = false;
        const label2 = agent.currentJobLabel();
        agent.finishJob("error");
        rec.jobAlias = null;
        rec.arrivedBy = null;
        this._emitFeed({ kind: "removal", job: label2 ?? agent.job, by: agent.name });
        this._emitChange();
      }),
      wait(0.4),
      status("idle")
    ]);
    this._emitChange();
  }
  // Idle activities: a drink, a sit on the couch, or a celebration.
  _activity(rec, activity) {
    if (activity === "couch") return this._rest(rec);
    if (activity === "dance") return this._celebrate(rec);
    return this._drinkBreak(rec);
  }
  /**
   * The happy dance: arms up, off the floor, and nowhere to go.
   *
   * The pose has been in `Agent` since it was written and nothing ever asked for it —
   * `test/agent-dance.test.js` opened by saying so. It was reachable only by writing a
   * `wait` by hand, which meant the one movement the room could do that nobody had ever
   * seen. So it gets an activity and a button.
   *
   * Done on their feet and on the spot. `_release` gets them out of whatever they are
   * in first, because the seated pose owns the body while it is on and a dance
   * underneath it does nothing — which the tests already pinned. Nobody walks anywhere:
   * a celebration happens where the news arrives, and sending them across the room to
   * do it would make it an errand instead.
   *
   * Nothing is carried, nothing is delivered and nothing is logged. It is not work, and
   * the panel's record of jobs should not gain an entry for a mood.
   */
  _celebrate(rec) {
    this._begin(rec, [
      ...this._release(rec),
      status("idle"),
      wait(0.3),
      status("dancing"),
      wait(DANCE_SECONDS, { dancing: true }),
      status("idle"),
      // A beat standing still afterwards, so it ends rather than simply stopping.
      wait(0.5)
    ]);
    this._emitChange();
  }
  /**
   * Decide where a drink gets drunk, and book whatever that needs.
   *
   * Standing at the machine, sunk into the couch, or back at their own desk, in
   * even thirds — none of the three is the "real" answer, and the mix is what
   * stops break time looking scripted. Both sit-down options can be unavailable
   * (a full couch, or no desk of their own in a room with more people than desks),
   * in which case they drink where they stand.
   *
   * An agent already holding a couch seat keeps it rather than booking a second.
   * "Their own desk" is exactly that, and never a spare one going free: a drink is
   * no reason to move in somewhere else.
   */
  _drinkSpot(rec) {
    const roll = Math.random();
    if (roll < 1 / 3) {
      const chosen = rec.couchSeat && rec.couch ? { couch: rec.couch, seat: rec.couchSeat } : this._freeSeat(rec);
      if (chosen) {
        chosen.seat.occupiedBy = rec.agent.id;
        rec.couchSeat = chosen.seat;
        rec.couch = chosen.couch;
        return { where: "couch", ...chosen };
      }
      return { where: "station" };
    }
    if (roll < 2 / 3 && rec.desk) return { where: "desk", desk: rec.desk };
    return { where: "station" };
  }
  /**
   * Which post box to walk to for work: the nearest one holding something openable.
   *
   * "The nearest box" is not good enough once a room has two. An agent standing beside
   * an empty box while their envelope sits in the one across the room is the whole of
   * the bug a second box could otherwise introduce, so the box is chosen by *contents*
   * first and distance second.
   *
   * Falls back to the nearest post box when nothing is openable anywhere — which is
   * what somebody walking over to *wait* for a plane still in the air needs, since
   * there is nothing in any box yet to choose between.
   */
  _nearestPostBox(rec) {
    const holding = new Set(this.post.boxesWith(rec.agent.id));
    const boxes = stationsForRole("intake").filter((s) => {
      const serves = STATION_KINDS[s.kind]?.serves ?? [];
      return serves.includes("post") || serves.includes("print");
    });
    const candidates = boxes.filter((s) => holding.has(s.id));
    const pool = candidates.length ? candidates : boxes;
    if (!pool.length) return stationForRole("intake", { from: rec.agent.position });
    const at = rec.agent.position;
    let best = pool[0];
    let bestDist = Infinity;
    for (const s of pool) {
      const p = s.approach ?? s;
      const d = (p.x - at.x) ** 2 + (p.z - at.z) ** 2;
      if (d >= bestDist) continue;
      bestDist = d;
      best = s;
    }
    return best;
  }
  /**
   * The built prop standing at this station, or null if the room has not built one.
   *
   * `props.<kind>` holds whichever instance was built last, which was harmless while
   * every kind was a singleton and is a bug the moment one is not: an agent who walked
   * to the second inbox would take a box off the first. So anything that *did the walk*
   * asks by the station it walked to, and `props.byStation` answers.
   *
   * Null is ordinary and not an error — a headless office builds no scenery at all, and
   * the behaviours all optional-chain through this for exactly that reason.
   */
  _propAt(station2) {
    return station2 ? this.props.byStation?.[station2.id] ?? null : null;
  }
  /**
   * Which machine this drink comes out of.
   *
   * A drink says what it *is* — water, tea, a flat white — and the room finds somewhere
   * that serves it: the cooler for water, the espresso machine for tea and coffee. It
   * used to say which station it came from, by name (`station: 'waterCooler'` in
   * drinks.js), which quietly made a room without that exact prop a room where nobody
   * could have a drink. Asking for the job with the drink as a preference means a room
   * with only a cooler still serves everybody — the tea drinkers get water and get on
   * with it, rather than standing at a machine that is not there.
   *
   * Null only if the room has nothing to drink at all, which `_drinkBreak` and
   * `_drinkRun` both have to cope with: `refresh` is deliberately not a job the office
   * is required to be able to do.
   */
  _drinkStation(rec, drink) {
    return stationForRole("refresh", { from: rec.agent.position, serves: drink?.kind });
  }
  /**
   * Go and have your drink, wherever yours comes from: the cooler for water and
   * sparkling water, the espresso machine for tea and coffee. The station is not
   * chosen at random and not chosen by the feed — it falls out of the preference
   * the agent walked in with. Where they then drink it is chosen at random.
   */
  _drinkBreak(rec) {
    const drink = rec.agent.drink;
    const station2 = this._drinkStation(rec, drink);
    if (!station2) return this._wander(rec);
    const spot = this._drinkSpot(rec);
    const actions = [
      ...this._release(rec, { keepCouch: spot.where === "couch" }),
      status("walking"),
      walk(() => this.spots.claim(station2, rec.agent)),
      lookAt(station2),
      wait(0.8),
      carry("cup", { color: drink.color })
    ];
    if (spot.where === "couch") {
      actions.push(
        status("walking"),
        walk(spot.couch.approach),
        ...sitDownOn(spot.seat, COUCH_SEAT_HEIGHT),
        status("drinking"),
        wait(5, { drinking: true }),
        carry(null),
        ...standUpFrom(spot.seat),
        act(() => {
          spot.seat.occupiedBy = null;
          rec.couchSeat = null;
          rec.couch = null;
        }),
        status("idle")
      );
    } else if (spot.where === "desk") {
      const { desk } = spot;
      actions.push(
        status("walking"),
        ...takeUpPostAtDesk(rec, desk, this.nav),
        status("drinking"),
        wait(3.4, { drinking: true }),
        // Set it down rather than letting it vanish, and stay put afterwards:
        // getting up to wander the moment you've sat down with a coffee looks
        // daft. The next job is what moves them on, and it clears the mug.
        act(() => desk.setMug(true, drink.color)),
        carry(null),
        status("idle"),
        wait(HOLD)
      );
    } else {
      actions.push(
        status("drinking"),
        wait(2.6, { drinking: true }),
        carry(null),
        status("idle")
      );
    }
    this._begin(rec, actions);
    this._emitChange();
  }
  /**
   * Mid-job drink run: fetch a drink without giving up the job.
   *
   * Deliberately does not go through _release(), which is what makes this read
   * the way it should — the desk stays claimed and the monitors stay lit, so what
   * you see is a glowing, empty workstation and its occupant over at the machine.
   * They come back, set the mug down and carry on with the same job.
   */
  _drinkRun(rec) {
    const { desk } = rec;
    const drink = rec.agent.drink;
    const station2 = this._drinkStation(rec, drink);
    if (!station2) return void 0;
    this._begin(rec, [
      status("walking"),
      walk(() => this.spots.claim(station2, rec.agent)),
      lookAt(station2),
      wait(1),
      carry("cup", { color: drink.color }),
      status("walking"),
      ...takeUpPostAtDesk(rec, desk, this.nav),
      // Actually drink some of it before getting back to work — fetching a coffee
      // and setting it down untouched is a strange thing to watch. The sip is
      // 'drinking', so it doesn't count towards the next long-job roll.
      status("drinking"),
      wait(1.6, { drinking: true }),
      act(() => desk.setMug(true, drink.color)),
      carry(null),
      status("working"),
      wait(HOLD, { typing: true })
    ]);
    this._emitChange();
  }
  _rest(rec) {
    const pick2 = this._freeSeat(rec);
    if (!pick2) return this._drinkBreak(rec);
    const { couch, seat } = pick2;
    seat.occupiedBy = rec.agent.id;
    rec.couchSeat = seat;
    rec.couch = couch;
    this._begin(rec, [
      ...this._release(rec, { keepCouch: true }),
      status("walking"),
      walk(couch.approach),
      ...sitDownOn(seat, COUCH_SEAT_HEIGHT),
      status("resting"),
      wait(6),
      ...standUpFrom(seat),
      act(() => {
        seat.occupiedBy = null;
        rec.couchSeat = null;
        rec.couch = null;
      }),
      status("idle")
    ]);
    this._emitChange();
  }
  // Walk out through the door, then remove the agent.
  _leave(rec) {
    if (rec.leaving) return;
    rec.leaving = true;
    rec.leaveAt = this.now();
    rec.pilot = null;
    this._begin(rec, [
      ...this._release(rec),
      status("walking"),
      // A place of their own on the way out too: home time can send several people
      // to the door at once, and they wait there for the lift.
      walk(() => this.spots.claim(DOORWAY, rec.agent)),
      act(() => {
        this.props.coatStand?.removeCoat(rec.coatHook);
        rec.coatHook = null;
      }),
      ...this._exitTransport(),
      act(() => this._remove(rec))
    ]);
    this._emitChange();
  }
  _exitTransport() {
    return entranceSteps("out", [
      ...this.props.elevator ? [
        // Summon the lift from the doorway and wait for it, rather than walking
        // into an empty shaft.
        act(() => this.props.elevator.call()),
        waitUntil(() => this.props.elevator.ready)
      ] : [],
      walk(vec(DOOR.outside)),
      // And back down the flight, if that is what they came up. They are already on
      // its top point, so the descent picks them up where the walk left them.
      ...this.props.stairs ? [follow(this.props.stairs.descent)] : []
    ]);
  }
  /**
   * A new shell has the same arranged floor. Preserve every interior action and
   * replan walks; only an entrance that no longer exists needs a handover.
   */
  redecorate(previous) {
    const changed = Boolean(previous.elevator) !== Boolean(this.props.elevator) || JSON.stringify(previous.stairs?.route) !== JSON.stringify(this.props.stairs?.route);
    if (changed) {
      for (const rec of this.agents.values()) {
        const { agent, controller } = rec;
        if (rec.arriving && controller.replaceEntrance("in", [])) {
          const landing = this.spots.claim(DOORWAY, agent);
          agent.setPositionXZ(landing.x, landing.z);
          agent.setElevation(0);
          agent.root.visible = true;
        }
        if (rec.leaving) {
          const inTransport = controller.current?.entrance === "out";
          if (controller.replaceEntrance("out", this._exitTransport()) && inTransport) {
            agent.setPositionXZ(DOOR.inside.x, DOOR.inside.z);
            agent.setElevation(0);
          }
        }
      }
    }
    this.nav.rebuild();
    for (const rec of this.agents.values()) rec.controller.replan();
  }
  /**
   * Empty the room of overdue departures while nothing is being drawn.
   *
   * Called from a timer rather than from a frame (see src/main.js), and it does
   * something only when the frames have stopped — which is the case `_beamOut`
   * cannot cover, because a beam is an animation and an animation needs frames.
   * A tab in the background is not being drawn, so the walk out cannot advance,
   * and every session the feed retires meanwhile is a character who joins a queue
   * for a door nobody can reach. Left alone for a night that is the room filling
   * up without limit.
   *
   * So the timer takes them out where they stand, with no ceremony — there is
   * nobody watching a room that is not being drawn, and the whole value of the
   * cone of light is that somebody sees it. What that buys is a window you can
   * leave open for a week and come back to an office the right size, rather than
   * to half a minute of blue cones.
   *
   * @returns {number} how many were shown the door, for a caller that wants to log it
   */
  tidy() {
    if (this.now() - this._drawnAt < FRAME_STALL * 1e3) return 0;
    const deadline = this.now() - LEAVE_GRACE * 1e3;
    let gone = 0;
    for (const rec of [...this.agents.values()]) {
      if (!rec.beaming && !(rec.leaving && rec.leaveAt < deadline)) continue;
      this._remove(rec);
      gone += 1;
    }
    return gone;
  }
  /**
   * Stop waiting for a departure and take them out of the room.
   *
   * The walk out is the office at its best — a coat off the stand, a lift called,
   * a queue at the door — and this is what happens when it is the office at its
   * worst: a hundred people told to go home at once, or a walk that has not had a
   * frame to run in since the window went behind another one. Thirty seconds of
   * that (`LEAVE_GRACE`) and the room stops asking nicely.
   *
   * Everything else is unchanged: `_remove` is the same one the door uses, so the
   * desk, the coat, the couch seat and any post addressed to them are given back
   * exactly as they would have been, and the beam only decides *when*.
   *
   * Not every candidate goes at once — the cones are capped, and one refused here
   * is simply offered again on the next frame, which is what turns a mass
   * clear-out into a queue of them rather than a wall of blue.
   *
   * Also reached by hand, from the `beam` button in the agent detail panel: waiting
   * thirty seconds for a departure to get stuck is not a way to look at this.
   *
   * @returns {boolean} whether they are on their way. False means every cone was
   *   busy, or they were already in one.
   */
  _beamOut(rec) {
    if (rec.beaming || this.beams.busy) return false;
    rec.controller.clear();
    rec.beaming = true;
    this._peopleCache = null;
    this.beams.beamUp(rec.agent, () => this._remove(rec));
    this._emitChange();
    return true;
  }
  _wander(rec) {
    this._begin(rec, [
      ...this._release(rec),
      status("idle"),
      walk(this.nav.randomInteriorPoint(), "walking"),
      status("idle")
    ]);
    this._emitChange();
  }
  // Called when an agent's queue empties: keep them believably occupied.
  _idle(rec) {
    if (rec.pilot) return;
    const roll = Math.random();
    if (roll < 0.45) {
      rec.controller.push([
        wait(spread(1, 2.5)),
        walk(this.nav.randomInteriorPoint(), "walking"),
        status("idle")
      ]);
    } else if (roll < 0.7) {
      this._drinkBreak(rec);
    } else if (roll < 0.85) {
      this._rest(rec);
    } else {
      rec.controller.push([wait(spread(1.5, 3))]);
    }
  }
  // --- Helpers -------------------------------------------------------------
  /**
   * Start an action list, declaring whether it is a trip to the mailbox.
   *
   * Every behaviour starts here so that `onMailRun` has exactly one owner:
   * whoever started what the agent is doing now. That matters because the
   * controller executes roughly one action per frame, so for a frame or two after
   * a mail run begins the agent is still `idle` with post waiting — and anything
   * that cleared the flag from inside an action (as releasing state used to) let
   * `_checkPost` rebuild the walk from the top on the very next frame. The agent
   * restarted forever and never took a step.
   *
   * Somebody still on their way in is queued behind their arrival rather than having
   * it thrown away, because the arrival is the only thing that knows how to get into
   * this building. Work is announced within a second or two of a spawn, so the race
   * is the normal case, not an edge — and losing it strands them: hidden in the lift
   * shaft waiting for a car nobody is calling any more, or a storey down the stairs
   * with only the room's flat floor plan to walk on, striding home through the air.
   */
  _begin(rec, actions, mailRun = false) {
    rec.onMailRun = mailRun;
    if (rec.arriving) rec.controller.push(actions);
    else rec.controller.run(actions);
  }
  /**
   * Let go of whatever the agent is holding on to, ready for something else.
   *
   * Returns a list, because getting out of a seat takes more than standing up. A
   * couch seat is inside the couch, so anything that walks away from it walks through
   * the furniture; a desk chair is on open floor, but its occupant is inside the
   * chair, and walking off leaves the chair behind them and the desk in front. Either
   * way they get out of the seat first, so that every route onwards — a job, a
   * drink, going home — starts from somewhere a person could actually stand.
   *
   * Standing up is not moving out: the desk stays theirs for every one of those
   * routes, and is only handed back when they leave the building (see `_remove`).
   * The couch is the opposite — a seat is booked for one sit and given back after
   * it, so `keepCouch` covers the walk over to it with the seat already reserved.
   */
  _release(rec, { keepCouch = false } = {}) {
    const { x, z } = rec.agent.position;
    const leavingCouch = rec.couchSeat && insideCouch(x, z) ? standUpFrom(rec.couchSeat) : [];
    const leavingDesk = !leavingCouch.length && rec.desk && rec.agent.seated ? standUpFromDesk(rec, rec.desk) : [];
    const leavingStand = !leavingCouch.length && !leavingDesk.length && rec.standingAtDesk && rec.desk ? leavePostAtDesk(rec, rec.desk) : [];
    const tidyChair = !leavingDesk.length && rec.desk && rec.chairEntry ? [turnChair(rec.desk, rec.desk.sitRotation), act(() => {
      rec.chairEntry = null;
    })] : [];
    return [...leavingCouch, ...leavingDesk, ...leavingStand, ...tidyChair, act(() => {
      if (rec.desk) {
        rec.desk.setWorking(false);
        rec.desk.setMug(false);
      }
      rec.standingAtDesk = false;
      if (rec.couchSeat && !keepCouch) {
        rec.couchSeat.occupiedBy = null;
        rec.couchSeat = null;
        rec.couch = null;
      }
      this._returnBook(rec);
      if (rec.agent.seated) rec.agent.setSeated(false, { instant: true });
      rec.agent.setCarrying(null);
    })];
  }
  /** A new job is a new chance at a mid-job drink run. */
  _resetDeskTimer(rec) {
    rec.deskTime = 0;
    rec.drinkRolled = false;
  }
  /**
   * Count seated, working time and, once it crosses LONG_JOB, roll once for a
   * drink run. Living here rather than in the feed means it works for any source:
   * a long stretch at the desk is the room's observation, not the harness's.
   */
  _deskDrink(rec, dt) {
    const { agent } = rec;
    if (!rec.desk || !(agent.seated || rec.standingAtDesk) || agent.status !== "working") return;
    if (rec.pilot) return;
    rec.deskTime = (rec.deskTime ?? 0) + dt;
    if (rec.drinkRolled || rec.deskTime < LONG_JOB) return;
    rec.drinkRolled = true;
    if (chance(P_DESK_DRINK)) this._drinkRun(rec);
  }
  /**
   * The globe standing on one particular bookshelf.
   *
   * The one thing `byStation` cannot answer, because the globe is not a station: it is
   * a second prop mounted on top of one, and the pair are registered together on
   * `props.bookshelves` (see `mount` in scene/props/bookshelf.js). Looked up by the
   * shelf's own id rather than by proximity, because a room may have two shelves and
   * the globe that turns has to be the one on the case they are standing at.
   *
   * Replaced `_nearestShelf`, which chose the station *and* returned its props in one
   * step. Choosing is `stationForRole`'s job now — it knows about roles, which that did
   * not, and so could only ever find a bookshelf.
   *
   * @returns {?object} the globe's handle, or null if that shelf has no globe
   */
  _globeAt(station2) {
    if (!station2) return null;
    return this.props.bookshelves?.find((b) => b.id === station2.id)?.globe ?? null;
  }
  /**
   * Somewhere to sit down: a free cushion on the nearest couch that has one.
   *
   * The same argument `stationForRole` makes for the stations — a room may hold several
   * couches, and sitting down is not something that has to happen in a particular one, so
   * somebody at the far end of the office uses the couch at their end. Nearest by the
   * standing room in front of it rather than by the couch itself, since that is where they
   * will actually walk to.
   *
   * A couch with both cushions taken is skipped rather than being the answer, which is
   * what makes several couches genuinely several places to sit: the room only sends
   * somebody for a drink instead once every cushion in it is occupied.
   *
   * Returns the couch as well as the seat, because the way into a cushion is that couch's
   * approach point — the seat itself is inside the furniture and cannot be walked to.
   *
   * @returns {?{couch: object, seat: object}} null when there is nowhere at all to sit,
   *   which is a room whose couches are full — or one with no couch in it, since nought
   *   is a number of couches an office may have.
   */
  _freeSeat(rec) {
    const { x, z } = rec.agent.position;
    let best = null;
    let bestDist = Infinity;
    for (const entry of this.props.couches ?? []) {
      const seat = entry.couch?.freeSeat();
      if (!seat) continue;
      const { approach } = entry.couch;
      const dist = (approach.x - x) ** 2 + (approach.z - z) ** 2;
      if (dist >= bestDist) continue;
      bestDist = dist;
      best = { couch: entry.couch, seat };
    }
    return best;
  }
  /**
   * Put a borrowed book back on the case it came off.
   *
   * One place, because it happens from four: the end of a lookup, an interruption
   * partway through one, going home, and being removed outright. The shelf is the one
   * they borrowed from — which is the whole reason it is remembered — and if that shelf
   * has since been deleted out of the room, the book goes nowhere and is simply
   * dropped, because there is no longer a gap on a shelf for it to fill.
   */
  _returnBook(rec) {
    if (rec.book) rec.shelf?.returnBook(rec.book);
    rec.book = null;
    rec.shelf = null;
  }
  /**
   * Book a free desk for an agent, at random, for as long as they are in the office.
   *
   * At random rather than the first free one, which is what this used to do. Taking the
   * first meant the layout's own order was a pecking order: desk 1 was claimed by the
   * first person through the door every single day, and the desk at the end of the row
   * was only ever used in a full house. A roving office that always seats people in the
   * same seats is not roving, so the pick is a real one across whatever is free.
   *
   * Called once, as they arrive. It can come up empty — a live harness can put more
   * agents in the room than the layout has desks — which is not an error: they work
   * standing up and elsewhere until somebody goes home, and `_work` retries then.
   */
  _claimDesk(rec) {
    if (rec.desk) return rec.desk;
    const free = (this.props.desks ?? []).filter((d) => !d.occupiedBy);
    const desk = pick(free);
    if (!desk) return null;
    desk.occupiedBy = rec.agent.id;
    rec.desk = desk;
    desk.setAssignment?.(rec.agent);
    return desk;
  }
  _remove(rec) {
    if (!this.agents.has(rec.agent.id)) return;
    this.post.dropFor(rec.agent.id);
    if (rec.desk) {
      rec.desk.setWorking(false);
      rec.desk.setMug(false);
      rec.desk.occupiedBy = null;
      rec.desk.setAssignment?.(null);
    }
    if (rec.couchSeat) rec.couchSeat.occupiedBy = null;
    this._returnBook(rec);
    if (rec.coatHook) this.props.coatStand?.removeCoat(rec.coatHook);
    this.scene.remove(rec.agent.root);
    rec.agent.dispose();
    this.agents.delete(rec.agent.id);
    for (const session of rec.jobs.keys()) this.jobOwner.delete(session);
    if (rec.actorKey && this.byActor.get(rec.actorKey) === rec.agent.id) {
      this.byActor.delete(rec.actorKey);
    }
    this._peopleCache = null;
    this._emitChange();
  }
  // -------------------------------------------------------------------------
  /**
   * The furniture has been moved: re-derive the room and put everybody in it right.
   *
   * Called by the furniture editor after each drop (see src/editor.js). The office
   * deliberately keeps running while the layout is edited — freezing it would make the
   * one thing the editor is for, watching the paths adjust, impossible to see — so
   * three things have to be brought back into agreement with the new plan.
   *
   * Order matters. The walkable map is re-derived first, because the re-planning below
   * asks it for routes; then anybody whose furniture is no longer in the room gives it
   * up; then anybody still sitting is moved to where their seat now is; and only then is
   * each walker's route recomputed, from the position they have just been put in rather
   * than the one they were in a moment ago.
   *
   * @returns {number} how many walkers were left with no route at all. Zero is the
   *   normal answer; anything else is a layout that has fenced somebody in, and the
   *   editor uses it to decide whether to keep the drop.
   */
  relayout() {
    this.nav.rebuild();
    this._dropVanished();
    this._reseat();
    let stranded = 0;
    for (const rec of this.agents.values()) {
      if (!rec.controller.replan()) stranded++;
    }
    return stranded;
  }
  /**
   * Re-size every tag after the legibility correction changes.
   *
   * The sizes are set once when a tag is built, so a viewport change has to reach
   * the agents already standing in the room. Nothing here recreates a texture; it
   * is the same two calls the tag makes for itself.
   */
  resizeTags() {
    for (const rec of this.agents.values()) {
      rec.agent.resizeTag();
    }
  }
  /**
   * Let go of any furniture that is not in the room any more.
   *
   * The editor can delete a desk with somebody sitting at it, which is a thing worth
   * allowing: the alternative is a room that cannot be rearranged while it is in use,
   * and this office deliberately keeps running while it is edited. So the desk goes,
   * and its occupant stands up where they were and carries on working — the same
   * situation as an agent who arrived to find every desk taken, which the room already
   * knows how to be. `_work()` gives them the next desk to come free.
   *
   * Held handles are checked against the room rather than notified by it, because a
   * deleted prop has no way to tell anybody it is gone: the reconciliation in
   * scene/props.js drops it out of `handles.desks`, and this is the other half of that.
   */
  _dropVanished() {
    const desks = new Set(this.props.desks ?? []);
    const seats = new Set(
      (this.props.couches ?? []).flatMap((entry) => entry.couch?.seats ?? [])
    );
    for (const rec of this.agents.values()) {
      if (rec.desk && !desks.has(rec.desk)) {
        rec.desk.occupiedBy = null;
        rec.desk.setAssignment?.(null);
        rec.desk = null;
        rec.chairEntry = null;
        rec.standingAtDesk = false;
        if (rec.agent.seated) rec.agent.setSeated(false, { instant: true });
        this._claimDesk(rec);
      }
      if (rec.couchSeat && !seats.has(rec.couchSeat)) {
        rec.couchSeat = null;
        rec.couch = null;
        if (rec.agent.seated) rec.agent.setSeated(false, { instant: true });
      }
      if (rec.book && !(this.props.bookshelves ?? []).some((b) => b.shelf === rec.shelf)) {
        rec.shelf = null;
        this._returnBook(rec);
        rec.agent.setCarrying(null);
      }
    }
  }
  /**
   * Everybody's route, ahead and just behind, for the furniture editor to draw.
   *
   * A view rather than a copy: the point arrays belong to the controllers and are
   * replaced wholesale whenever a route is re-planned, so a caller that reads this every
   * frame always has the current answer. Only the wrapper objects are new each call,
   * which is a handful of allocations against a render loop that is already walking
   * every desk in the room.
   *
   * Lives here rather than the editor reaching into `agents` itself, so that what the
   * editor is allowed to know about an agent stays one short list.
   *
   * @returns {Array<{id: string, position: THREE.Vector3, ahead: ?Array,
   *                  behind: ?Array, behindAge: number}>}
   */
  pathTrails() {
    const out = [];
    for (const rec of this.agents.values()) {
      const { ahead, behind, behindAge } = rec.controller.pathTrail();
      out.push({
        id: rec.agent.id,
        position: rec.agent.position,
        ahead,
        behind,
        behindAge
      });
    }
    return out;
  }
  /**
   * Put everybody who is sitting back on the seat they are sitting on.
   *
   * Snapped to the seat's new position rather than shifted by however far the prop
   * moved: the seat has already been recomputed by the prop's own `relocate()`, so
   * asking it where it is now is both simpler and right for a desk that was turned as
   * well as moved. Without this an occupant stays behind, sitting on thin air, while
   * their chair walks off across the room.
   *
   * Their heading is taken from the chair, which the desk turns in step with itself —
   * so somebody at a desk swung round to face the window is turned to face the window
   * too, rather than continuing to stare where the monitors used to be.
   */
  _reseat() {
    for (const rec of this.agents.values()) {
      if (!rec.agent.seated) continue;
      if (rec.desk && rec.agent.status !== "resting") {
        rec.agent.setPositionXZ(rec.desk.seat.x, rec.desk.seat.z);
        rec.agent.setRotation(rec.desk.chairFacing);
      } else if (rec.couchSeat) {
        rec.agent.setPositionXZ(rec.couchSeat.position.x, rec.couchSeat.position.z);
        rec.agent.setRotation(rec.couchSeat.rotation);
      }
    }
  }
  /**
   * Everybody in the room, for the questions that are about all of them at once.
   * Cached, because every walking agent asks for it on every frame; the roster only
   * changes when somebody arrives or leaves.
   */
  _people() {
    if (!this._peopleCache) {
      this._peopleCache = [...this.agents.values()].filter((rec) => !rec.beaming).map((rec) => rec.agent);
    }
    return this._peopleCache;
  }
  _pickColor() {
    return pick(SHIRT_PALETTE);
  }
  // -------------------------------------------------------------------------
  update(dt) {
    let nearDoor = false;
    let overdue = null;
    this._drawnAt = this.now();
    const deadline = this._drawnAt - LEAVE_GRACE * 1e3;
    for (const rec of this.agents.values()) {
      if (rec.beaming) continue;
      if (rec.leaving && rec.leaveAt < deadline) (overdue ??= []).push(rec);
      rec.controller.update(dt);
      this._pilotTick(rec, dt);
      this._deskDrink(rec, dt);
      this._checkDesk(rec);
      this._checkPost(rec);
      if (rec.arriving || rec.leaving) {
        const p = rec.agent.position;
        if (Math.abs(p.x - DOOR.x) < 2.6 && p.z > -3.4 && p.z < 3.4) nearDoor = true;
      }
      rec.agent.refreshTagVisibility();
    }
    if (nearDoor) this.props.door?.requestOpen(0.9);
    if (overdue) for (const rec of overdue) this._beamOut(rec);
    this.beams.update(dt);
    for (let i = this.ringing.length - 1; i >= 0; i -= 1) {
      const call = this.ringing[i];
      call.left -= dt;
      if (call.left > 0) continue;
      this.ringing.splice(i, 1);
      this._mailArrived(call.payload);
    }
    let dropped = null;
    for (const station2 of stationsForRole("intake")) {
      const prop = this._propAt(station2);
      const serves = STATION_KINDS[station2.kind]?.serves ?? [];
      const parcels = this.post.countByArrival("package", station2.id);
      if (parcels > 0 && !serves.includes("post")) dropped = { id: station2.id, parcels };
      if (!prop?.setWaiting) continue;
      if (serves.includes("print")) {
        prop.setWaiting(this.post.countByArrival("fax", station2.id));
      } else {
        prop.setWaiting(
          this.post.countByArrival("letter", station2.id),
          parcels
        );
      }
    }
    this.props.deliveries?.showDropped?.(dropped?.id ?? null, dropped?.parcels ?? 0);
    this.spots.prune(dt, (id) => this.agents.get(id)?.agent.position ?? null);
    resolveOverlaps(this._people(), this.nav);
    declutterTags(this._people());
  }
  /**
   * A desk may have just freed up — someone went home — or been added in the
   * editor, while an agent was left with none of their own. Retried from here
   * because the moment it happens (a departure, a drop) is not the agent's own:
   * nothing about *their* action list changes, so nothing would otherwise wake
   * them up to look again.
   *
   * Two ways to end up with no desk: parked in `_wait` for lack of one (status
   * `waiting`), or standing up mid-job because the editor deleted the one
   * underneath them (status stays `working`, but `seated` goes false — see
   * `_dropVanished`). `waiting` is also where a seated agent sits between
   * prompts, and `working` covers everyone mid-job with a desk to their name,
   * so checking `rec.desk` first is what keeps this from ever touching them.
   */
  _checkDesk(rec) {
    if (rec.desk || rec.onMailRun || rec.pilot) return;
    const stuck = rec.agent.status === "waiting" || rec.agent.status === "working" && !rec.agent.seated && !rec.standingAtDesk;
    if (!stuck) return;
    if (!this._claimDesk(rec)) return;
    this._work(rec);
  }
  /**
   * A follow-up prompt lands while its agent is already at the desk, mid-job.
   * It is still a request that arrived by air, so they get up, walk over, collect
   * it and come back — one trip per prompt, in the order they were posted.
   *
   * Driven from the frame loop rather than from the event, because the event
   * arrives while the agent is part-way through an action list and replacing that
   * list mid-stride is what causes agents to stutter or to abandon a walk. Here
   * they are provably seated and working, so interrupting is safe.
   *
   * A queue that outruns the walking is fine and expected: the room falls behind
   * reality rather than lying about it.
   */
  _checkPost(rec) {
    if (rec.onMailRun || rec.pilot) return;
    const settled = rec.agent.status === "idle" || rec.agent.status === "working" && (rec.agent.seated || rec.standingAtDesk);
    if (!settled) return;
    if (!this.post.hasOwn(rec.agent.id)) return;
    this._work(rec);
  }
};

// dist/ui/model.js
function agentState(agent, issues) {
  if (agent.status === "running") return "working";
  if (agent.status === "error") return "error";
  if (["paused", "pending_approval"].includes(agent.status)) return "waiting";
  if (issues.some((i) => i.assigneeAgentId === agent.id && i.status === "blocked")) return "waiting";
  return "idle";
}
function currentIssue(agentId, issues) {
  const rank = { in_progress: 0, blocked: 1, in_review: 2, todo: 3, backlog: 4 };
  return issues.filter((i) => i.assigneeAgentId === agentId && i.status in rank).sort((a, b) => rank[a.status] - rank[b.status] || String(b.updatedAt).localeCompare(String(a.updatedAt)))[0] ?? null;
}
function idlePlayers(agents, issues, attention = []) {
  const waiting = new Set(attention.map((item) => item.agentId));
  return agents.filter((a) => ["idle", "active"].includes(a.status) && agentState(a, issues) === "idle" && !waiting.has(a.id));
}
function taskBroadcast(issues) {
  if (!issues.length) return { main: null, children: [], completed: 0, total: 0 };
  const byId = new Map(issues.map((i) => [i.id, i]));
  const rootOf = (item) => {
    const visited = /* @__PURE__ */ new Set();
    while (item.parentId && byId.has(item.parentId) && !visited.has(item.id)) {
      visited.add(item.id);
      item = byId.get(item.parentId);
    }
    return item;
  };
  const rank = { in_progress: 0, in_review: 1, blocked: 2, todo: 3, backlog: 4, done: 5, cancelled: 6 };
  const candidates = issues.filter((i) => i.status !== "cancelled").sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")) || a.id.localeCompare(b.id));
  const main = candidates.length ? rootOf(candidates[0]) : null;
  const children = main ? issues.filter((i) => i.id !== main.id && i.status !== "cancelled" && rootOf(i).id === main.id) : [];
  return { main, children, completed: children.filter((i) => i.status === "done").length, total: children.length };
}
function kanbanColumns(issues) {
  return [
    { id: "waiting", label: "Bekliyor", states: ["backlog", "todo"], color: "#c4c9ad" },
    { id: "doing", label: "Geli\u015Ftirme", states: ["in_progress"], color: "#9dc9cf" },
    { id: "review", label: "\u0130nceleme", states: ["in_review", "blocked"], color: "#e3c494" },
    { id: "done", label: "Tamamland\u0131", states: ["done"], color: "#b7d59a" }
  ].map((column) => ({ ...column, issues: issues.filter((i) => column.states.includes(i.status)).sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))) }));
}
function blockingVisits(agents, issues, attention = []) {
  const people = new Set(agents.map((a) => a.id)), tasks = new Map(issues.map((i) => [i.id, i]));
  const askingHuman = new Set(attention.map((q) => q.agentId)), seen = /* @__PURE__ */ new Set(), result = [];
  for (const issue of [...issues].sort((a, b) => (a.status === "blocked" ? -1 : 0) - (b.status === "blocked" ? -1 : 0) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))) {
    const agentId = issue.assigneeAgentId;
    if (!people.has(agentId) || seen.has(agentId) || askingHuman.has(agentId) || ["done", "cancelled"].includes(issue.status)) continue;
    for (const id of issue.blockedByIssueIds || (issue.blockedBy || []).map((b) => b.id)) {
      const blocker = tasks.get(id), blockerAgentId = blocker?.assigneeAgentId;
      if (!blocker || ["done", "cancelled"].includes(blocker.status) || !people.has(blockerAgentId) || blockerAgentId === agentId) continue;
      result.push({ agentId, blockerAgentId, issueId: issue.id, blockerIssueId: blocker.id, identifier: issue.identifier, blockerIdentifier: blocker.identifier });
      seen.add(agentId);
      break;
    }
  }
  return result;
}

// dist/ui/office-props.js
import * as THREE41 from "three";

// dist/ui/office-layout.js
var LOBBY = { x: 36, z: 22, sofaZ: [18.7, 25.3] };
var PRIVATE_ROOM = { left: 29.5, right: 43.5, back: 0.5, front: 13, doorStart: 7, doorEnd: 11, desk: { x: 36, z: 4.5 } };
var EXTRA_OBSTACLES = [
  [29.3, 0.3, 29.7, 7],
  [29.3, 11, 29.7, 13.2],
  [29.3, 12.8, 43.7, 13.2],
  [43.3, 0.3, 43.7, 13.2],
  [34.7, 21.25, 37.3, 22.75],
  [13.8, 28, 19.6, 29.2]
];
function configureOfficeLayout() {
  resetLayout();
  const workstations = [[10, 7.5, Math.PI], [22, 7.5, Math.PI], [7.5, 18, 0], [17, 18, 0], [25, 22, 0]];
  DESKS.forEach((desk, i) => {
    const [x, z, facing] = workstations[i];
    Object.assign(desk, { x, z, facing });
  });
  addDesk({ id: "human-desk", ...PRIVATE_ROOM.desk, facing: Math.PI });
  Object.assign(STATIONS.inbox, { x: 8, z: 27 });
  Object.assign(STATIONS.bin, { x: 26, z: 1 });
  Object.assign(STATIONS.printer, { x: 23, z: 1 });
  const plants = [[9.5, 1.6], [41.5, 3], [41.5, 11], [1.8, 24.5], [1.5, 6.6]];
  DECOR.plants.forEach((plant, i) => {
    if (plants[i]) [plant.x, plant.z] = plants[i];
  });
  addPlant("fig", { id: "decor-fig", x: 12.3, z: 28.5, scale: 1.15 });
  addPlant("snake", { id: "decor-snake", x: 21.1, z: 28.5, scale: 1.35 });
  FURNITURE.splice(0);
  FURNITURE_KINDS.couch.hw = 3.2;
  FURNITURE_KINDS.couch.seatOffsets = [-2, 0, 2].map((x) => ({ x, z: -0.05 }));
  addFurniture("couch", { id: "lobby-north", x: LOBBY.x, z: LOBBY.sofaZ[0], facing: 0 });
  addFurniture("couch", { id: "lobby-south", x: LOBBY.x, z: LOBBY.sofaZ[1], facing: Math.PI });
  addFurniture("floorLamp", { id: "lobby-lamp", x: 41, z: 24 });
  reviseLayout();
}
function humanQueueSlots(count, nav) {
  const slots = [], candidates = [{ x: 36, z: 8.2 }, { x: 33.5, z: 9 }, { x: 31, z: 9 }];
  for (let row = 0; row < 9; row++) for (const x of [27, 24.8]) candidates.push({ x, z: 9.3 + row * 1.9 });
  for (const point of candidates) {
    if (slots.length >= count) break;
    if (nav.walkableAt(point.x, point.z) && slots.every((p) => Math.hypot(p.x - point.x, p.z - point.z) > 1.5)) slots.push(point);
  }
  return slots;
}

// dist/ui/office-props.js
var taskLabels = { backlog: "Planlan\u0131yor", todo: "S\u0131rada", in_progress: "Geli\u015Ftiriliyor", in_review: "\u0130ncelemede", blocked: "Engel var", done: "Tamamland\u0131", cancelled: "\u0130ptal edildi" };
function mesh(geometry, color, parent2, x, y, z) {
  const result = new THREE41.Mesh(geometry, new THREE41.MeshStandardMaterial({ color, roughness: 0.72 }));
  result.position.set(x, y, z);
  result.castShadow = true;
  result.receiveShadow = true;
  parent2.add(result);
  return result;
}
function label(root, text, x, y, z, width, floor2 = false) {
  const surface2 = document.createElement("canvas");
  surface2.width = 1024;
  surface2.height = 160;
  const ctx = surface2.getContext("2d");
  ctx.fillStyle = "#314f42";
  ctx.font = "600 70px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, 512, 106);
  const texture = new THREE41.CanvasTexture(surface2);
  texture.colorSpace = THREE41.SRGBColorSpace;
  const sign = new THREE41.Mesh(new THREE41.PlaneGeometry(width, width * 160 / 1024), new THREE41.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE41.DoubleSide }));
  sign.position.set(x, y, z);
  if (floor2) sign.rotation.x = -Math.PI / 2;
  root.add(sign);
  return sign;
}
function buildLobby(root, nav) {
  buildDecor(root);
  const group2 = new THREE41.Group();
  group2.position.set(LOBBY.x, FLOOR_TOP, LOBBY.z);
  root.add(group2);
  mesh(new THREE41.BoxGeometry(11.5, 0.028, 11), "#bdcbb7", group2, 0, 0.02, 0);
  mesh(new THREE41.BoxGeometry(2.6, 0.16, 1.5), "#ba9264", group2, 0, 0.75, 0);
  for (const x of [-1.05, 1.05]) for (const z of [-0.48, 0.48]) mesh(new THREE41.CylinderGeometry(0.06, 0.075, 0.65, 12), "#4a5549", group2, x, 0.36, z);
  for (const x of [-0.7, 0.7]) {
    mesh(new THREE41.CylinderGeometry(0.18, 0.18, 0.022, 20), "#f4ead8", group2, x, 0.85, 0.16);
    mesh(new THREE41.CylinderGeometry(0.1, 0.075, 0.17, 20), "#ece0c8", group2, x, 0.94, 0.16);
    mesh(new THREE41.CylinderGeometry(0.078, 0.078, 8e-3, 16), "#593c28", group2, x, 1.03, 0.16);
  }
  mesh(new THREE41.BoxGeometry(0.55, 0.045, 0.38), "#647e6d", group2, 0, 0.86, -0.25);
  label(root, "LOB\u0130  /  MOLA ALANI", LOBBY.x, FLOOR_TOP + 0.06, 28.3, 7.5, true);
  const room = new THREE41.Group();
  room.position.y = FLOOR_TOP;
  root.add(room);
  mesh(new THREE41.BoxGeometry(13.6, 0.025, 12.4), "#ded4bd", room, 36.5, 0.022, 6.6);
  const glass = new THREE41.MeshStandardMaterial({ color: "#aac6bd", transparent: true, opacity: 0.17, roughness: 0.15, metalness: 0.05, depthWrite: false, side: THREE41.DoubleSide });
  for (const [start, end] of [[0.5, PRIVATE_ROOM.doorStart], [PRIVATE_ROOM.doorEnd, PRIVATE_ROOM.front]]) {
    const length = end - start;
    mesh(new THREE41.BoxGeometry(0.22, 0.6, length), "#719080", room, PRIVATE_ROOM.left, 0.3, (start + end) / 2);
    const pane = new THREE41.Mesh(new THREE41.BoxGeometry(0.07, 2.8, length), glass);
    pane.position.set(PRIVATE_ROOM.left, 2, (start + end) / 2);
    room.add(pane);
    for (const z of [start, end]) mesh(new THREE41.BoxGeometry(0.13, 3.5, 0.13), "#4e6e60", room, PRIVATE_ROOM.left, 1.75, z);
    mesh(new THREE41.BoxGeometry(0.14, 0.12, length), "#4e6e60", room, PRIVATE_ROOM.left, 3.5, (start + end) / 2);
  }
  mesh(new THREE41.BoxGeometry(14, 0.65, 0.25), "#719080", room, 36.5, 0.325, PRIVATE_ROOM.front);
  mesh(new THREE41.BoxGeometry(0.25, 0.65, 12.5), "#719080", room, PRIVATE_ROOM.right, 0.325, 6.75);
  label(root, "SEN\u0130N ODAN", 36, 4.8, 0.35, 7.5);
  label(root, "G\xD6R\xDC\u015EME", 36, FLOOR_TOP + 0.06, 11, 5.5, true);
  const rebuild = nav.rebuild.bind(nav);
  nav.rebuild = () => {
    rebuild();
    for (const bounds of EXTRA_OBSTACLES) for (const target of [nav.blocked, nav.furniture]) nav.block(...bounds, target);
    nav._markTight();
  };
  nav.rebuild();
  const speech = document.createElement("canvas");
  speech.width = 160;
  speech.height = 80;
  const c = speech.getContext("2d");
  c.fillStyle = "#fffdf1";
  c.beginPath();
  c.roundRect(4, 4, 152, 58, 25);
  c.fill();
  c.beginPath();
  c.moveTo(68, 58);
  c.lineTo(80, 76);
  c.lineTo(92, 58);
  c.fill();
  c.fillStyle = "#8b9d7d";
  for (const x of [48, 80, 112]) {
    c.beginPath();
    c.arc(x, 33, 7, 0, Math.PI * 2);
    c.fill();
  }
  const bubble = new THREE41.Sprite(new THREE41.SpriteMaterial({ map: new THREE41.CanvasTexture(speech), depthTest: false, transparent: true }));
  bubble.scale.set(1.15, 0.575, 1);
  bubble.visible = false;
  root.add(bubble);
  return { group: group2, room, bubble };
}
function buildDecor(root) {
  const group2 = new THREE41.Group();
  group2.name = "office-decor";
  group2.position.set(16.7, FLOOR_TOP, 28.6);
  root.add(group2);
  mesh(new THREE41.BoxGeometry(9.8, 0.025, 2.65), "#c7c1a7", group2, 0, 0.02, -0.25);
  mesh(new THREE41.BoxGeometry(8.9, 0.027, 1.95), "#d8d2bb", group2, 0, 0.023, -0.25);
  mesh(new THREE41.BoxGeometry(5.8, 0.12, 1.2), "#bc9769", group2, 0, 1.28, 0);
  mesh(new THREE41.BoxGeometry(5.5, 0.9, 1.04), "#8b714e", group2, 0, 0.77, 0);
  for (const x of [-1.8, 0, 1.8]) {
    mesh(new THREE41.BoxGeometry(1.72, 0.8, 0.045), "#c3a77d", group2, x, 0.8, -0.54);
    mesh(new THREE41.BoxGeometry(0.38, 0.035, 0.05), "#647464", group2, x, 1, -0.58);
  }
  for (const x of [-2.4, 2.4]) mesh(new THREE41.BoxGeometry(0.12, 0.35, 0.85), "#485747", group2, x, 0.18, 0);
  for (let i = 0; i < 3; i++) {
    const book = mesh(new THREE41.BoxGeometry(0.9 - i * 0.08, 0.12, 0.62), ["#738e7b", "#d1b18b", "#a37258"][i], group2, -1.8, 1.4 + i * 0.13, 0);
    book.rotation.y = i % 2 ? 0.12 : -0.08;
  }
  mesh(new THREE41.CylinderGeometry(0.25, 0.29, 0.06, 24), "#e6decd", group2, 0, 1.4, 0);
  const sculpture = mesh(new THREE41.TorusGeometry(0.43, 0.115, 12, 40), "#f1e8d5", group2, 0, 1.94, 0);
  sculpture.rotation.y = 0.4;
  mesh(new THREE41.SphereGeometry(0.24, 20, 16), "#829d9c", group2, 1.6, 1.58, 0.02);
  mesh(new THREE41.CylinderGeometry(0.09, 0.12, 0.36, 20), "#829d9c", group2, 1.6, 1.84, 0.02);
  mesh(new THREE41.CylinderGeometry(0.14, 0.22, 0.45, 20), "#d4ad70", group2, 2.25, 1.57, -0.05);
}
function buildTelevision(root) {
  const width = 27.2;
  const group2 = new THREE41.Group();
  group2.position.set(0.48, 5.35, 15);
  group2.rotation.y = Math.PI / 2;
  root.add(group2);
  mesh(new THREE41.BoxGeometry(2.4, 0.9, 0.14), "#29332e", group2, 0, -0.04, -0.12);
  mesh(new THREE41.BoxGeometry(width, 4.3, 0.17), "#242d28", group2, 0, 0, 0);
  const surface2 = document.createElement("canvas");
  surface2.width = 4096;
  surface2.height = 640;
  const texture = new THREE41.CanvasTexture(surface2);
  texture.colorSpace = THREE41.SRGBColorSpace;
  const screen = new THREE41.Mesh(new THREE41.PlaneGeometry(width - 0.4, 4.1), new THREE41.MeshBasicMaterial({ map: texture }));
  screen.position.set(0, 0.02, 0.091);
  group2.add(screen);
  mesh(new THREE41.SphereGeometry(0.025, 8, 6), "#89c68e", group2, width / 2 - 0.35, -2.07, 0.09);
  texture.anisotropy = 8;
  group2.traverse((object) => {
    object.userData.officeTV = true;
  });
  return { group: group2, surface: surface2, texture, openAnchor: new THREE41.Vector3(width / 2 - 1.2, -1.45, 0.15), elapsed: 0, lastPaint: -1, broadcast: null };
}
function lines(ctx, text, width, max) {
  const result = [];
  let line = "";
  for (const word of String(text).split(/\s+/)) {
    if (ctx.measureText(`${line} ${word}`).width > width && line) {
      result.push(line);
      line = word;
    } else line += `${line ? " " : ""}${word}`;
  }
  if (line) result.push(line);
  return result.slice(0, max).map((line2, i) => i === max - 1 && result.length > max ? `${line2.slice(0, -1)}\u2026` : line2);
}
function updateTelevision(tv, snapshot3, dt, canvas2) {
  tv.elapsed += dt;
  const second = Math.floor(tv.elapsed * 5);
  if (tv.lastPaint === second) return;
  tv.lastPaint = second;
  if (tv.issueSource !== snapshot3.issues) {
    tv.issueSource = snapshot3.issues;
    tv.broadcast = taskBroadcast(snapshot3.issues);
  }
  const { main, children, completed, total } = tv.broadcast;
  const ctx = tv.surface.getContext("2d"), screenWidth = tv.surface.width;
  ctx.fillStyle = "#12271f";
  ctx.fillRect(0, 0, screenWidth, 640);
  ctx.fillStyle = "#a9c590";
  ctx.font = "bold 38px sans-serif";
  ctx.fillText("OF\u0130S TV  /  KANBAN", 50, 55);
  const status2 = main ? taskLabels[main.status] || main.status : "G\xF6rev yok";
  ctx.fillStyle = "#d4c99f";
  ctx.font = "bold 39px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(main ? `${main.identifier || ""}  \xB7  ${status2}  \xB7  ${completed}/${total} alt g\xF6rev` : "Yeni g\xF6rev bekleniyor", screenWidth - 50, 55);
  ctx.textAlign = "left";
  ctx.fillStyle = "#f7f5df";
  ctx.font = "bold 62px sans-serif";
  lines(ctx, main?.title || "Ekibin g\xF6rev tahtas\u0131", screenWidth - 100, 1).forEach((line) => ctx.fillText(line, 50, 140));
  const columns = kanbanColumns(snapshot3.issues);
  for (const [index, column] of columns.entries()) {
    const width2 = (screenWidth - 72 - 3 * 24) / 4, x = 36 + index * (width2 + 24);
    ctx.fillStyle = "#203a2d";
    ctx.fillRect(x, 178, width2, 312);
    ctx.fillStyle = column.color;
    ctx.font = "bold 42px sans-serif";
    ctx.fillText(`${column.label.toLocaleUpperCase("tr")}  ${column.issues.length}`, x + 20, 226);
    column.issues.slice(0, 2).forEach((issue, row) => {
      const y = 245 + row * 112;
      ctx.fillStyle = issue.status === "blocked" ? "#594231" : "#314a3a";
      ctx.fillRect(x + 13, y, width2 - 26, 102);
      ctx.fillStyle = column.color;
      ctx.font = "28px sans-serif";
      ctx.fillText(`${issue.identifier || ""}${issue.status === "blocked" ? " \xB7 ENGEL VAR" : ""}`, x + 26, y + 33);
      ctx.fillStyle = "#f0f1dd";
      ctx.font = "36px sans-serif";
      lines(ctx, issue.title, width2 - 52, 1).forEach((line) => ctx.fillText(line, x + 26, y + 78));
    });
  }
  canvas2.dataset.tvKanban = JSON.stringify(columns.map((c) => ({ id: c.id, count: c.issues.length })));
  ctx.fillStyle = "#081c15";
  ctx.fillRect(0, 518, screenWidth, 122);
  const ticker = main ? `${main.identifier || ""}  \u2022  ${main.title}  \u2022  ${status2}  \u2022  ${children.filter((i) => i.status === "in_progress").length} alt g\xF6rev geli\u015Ftiriliyor  \u2022  ${snapshot3.attention?.length || 0} soru yan\u0131t bekliyor` : "Ekibin ana g\xF6rev durumu burada canl\u0131 yay\u0131nlan\u0131r.";
  ctx.font = "46px sans-serif";
  ctx.fillStyle = "#dcebc4";
  const width = ctx.measureText(ticker).width + 220, offset = tv.elapsed * 100 % width;
  ctx.save();
  ctx.beginPath();
  ctx.rect(45, 530, screenWidth - 90, 100);
  ctx.clip();
  for (let x = 65 - offset; x < screenWidth; x += width) ctx.fillText(ticker, x, 598);
  ctx.restore();
  tv.texture.needsUpdate = true;
  canvas2.dataset.tvTask = main?.identifier || "";
  canvas2.dataset.tvStatus = main?.status || "empty";
  canvas2.dataset.tvProgress = `${completed}/${total}`;
  canvas2.dataset.tvTicker = String(Math.floor(offset));
}

// dist/ui/scene.entry.js
var companyId = new URLSearchParams(location.search).get("company");
var notify = (type, data = {}) => parent.postMessage({ type, companyId, ...data }, location.origin);
var canvas = document.getElementById("scene");
var hint = document.getElementById("hint");
var world = null;
var snapshot2 = null;
var floor = 0;
var evening = false;
var selected = null;
var signatures = /* @__PURE__ */ new Map();
var ready = false;
var humanName = "Sen";
var HUMAN_ID = "office-human";
var source = { id: "paperclip", label: "Paperclip", kind: "live", mark: "", accent: "#64866b" };
var ray = new THREE42.Raycaster();
var pointer = new THREE42.Vector2();
var bubbleLayer = document.getElementById("question-bubbles");
var bubbleGroups = /* @__PURE__ */ new Map();
var bubbleSignature = "";
var actorButtons = /* @__PURE__ */ new Map();
function report(error) {
  notify("office-error", { message: `3D sahne a\xE7\u0131lamad\u0131: ${error.message || String(error)}` });
}
window.addEventListener("error", (event) => report(event.error || event.message));
window.addEventListener("unhandledrejection", (event) => report(event.reason));
try {
  let fit = function() {
    camera.updateMatrixWorld();
    const box2 = roomScreenBox({ elements: camera.matrixWorldInverse.elements, room: ROOM, headroom: 1 });
    camera.zoom = zoomForFrame({
      mode: "fit",
      aspect: canvas.clientWidth / Math.max(canvas.clientHeight, 1),
      frustum: CAMERA.frustum,
      halfW: box2.halfW,
      halfH: box2.halfH,
      minZoom: 0.3,
      maxZoom: CAMERA.maxZoom,
      margin: 0.98
    });
    camera.updateProjectionMatrix();
    const e = camera.matrixWorld.elements, inverse = camera.matrixWorldInverse.elements, t = controls.target;
    const wantY = verticalCentre({ frustum: CAMERA.frustum, zoom: camera.zoom, boxTop: box2.top, boxBottom: box2.bottom, bottomSlackShare: 0.45 });
    const dx = box2.centreX - (inverse[0] * t.x + inverse[4] * t.y + inverse[8] * t.z + inverse[12]);
    const dy = wantY - (inverse[1] * t.x + inverse[5] * t.y + inverse[9] * t.z + inverse[13]);
    const move = new THREE42.Vector3(e[0] * dx + e[4] * dy, e[1] * dx + e[5] * dy, e[2] * dx + e[6] * dy);
    controls.target.add(move);
    camera.position.add(move);
    controls.update();
  }, build = function() {
    if (world) {
      for (const id of [...world.manager.agents.keys()]) world.manager.handleEvent({ type: "despawn", id });
      scene.remove(world.root);
      disposeSubtree(world.root, { keep: scene });
    }
    clearMaterialCache();
    configureOfficeLayout();
    signatures.clear();
    const theme4 = resolveTheme(createScene({ id: companyId, name: snapshot2?.company.name || "Ofis", building: "simple", season: "spring" }), { building: "simple", season: "spring" });
    applyPalette(theme4.palette);
    scene.background = new THREE42.Color(theme4.sky);
    const root = new THREE42.Group();
    scene.add(root);
    const lights = addLighting(root, theme4.light);
    applyTimeOfDay(lights, evening ? 19 : 11, theme4, scene);
    const exterior = buildEnvironment(root, theme4), handles = buildProps(root, theme4);
    const boxAt = (id) => handles.byStation[id] || handles.mailbox;
    const mail = new MailFlights(root, boxAt), birds = new BirdFlights(root, boxAt);
    const deliveries = new CourierDeliveries(root, { boxAt, ...exterior });
    const props = { ...handles, ...exterior, mail, birds, deliveries };
    const humanDesk = props.desks.find((d) => d.id === "human-desk");
    const human = new Agent({ id: HUMAN_ID, name: humanName || "Sen", color: 12490837 });
    human.setPositionXZ(humanDesk.seat.x, humanDesk.seat.z);
    human.setRotation(humanDesk.sitRotation);
    human.setSeated(true, { instant: true });
    human.setStatus("idle");
    root.add(human.root);
    humanDesk.occupiedBy = HUMAN_ID;
    humanDesk.setAssignment(human);
    const manager = new AgentManager(root, props);
    const boardCanvas = document.createElement("canvas");
    boardCanvas.width = 1536;
    boardCanvas.height = 768;
    const texture = new THREE42.CanvasTexture(boardCanvas);
    texture.colorSpace = THREE42.SRGBColorSpace;
    const board = new THREE42.Mesh(new THREE42.PlaneGeometry(3.2, 1.6), new THREE42.MeshStandardMaterial({ map: texture, roughness: 0.85, side: THREE42.DoubleSide }));
    board.position.set(13.1, 4.5, 0.34);
    board.userData.officeBoard = true;
    root.add(board);
    const frame = new THREE42.Mesh(new THREE42.BoxGeometry(3.34, 1.74, 0.1), new THREE42.MeshStandardMaterial({ color: "#62755a", roughness: 0.8 }));
    frame.position.set(13.1, 4.5, 0.27);
    root.add(frame);
    const lobby = buildLobby(root, manager.nav), television = buildTelevision(root);
    world = { root, theme: theme4, lights, props, mail, birds, deliveries, manager, boardCanvas, texture, board, human, humanDesk, lobby, television, waiting: /* @__PURE__ */ new Map(), blocked: /* @__PURE__ */ new Map(), social: null, socialKey: "", busyAnimations: /* @__PURE__ */ new Set() };
    canvas.dataset.roomSize = `${ROOM.W}x${ROOM.D}`;
    canvas.dataset.privateRoom = JSON.stringify({ ...PRIVATE_ROOM, humanX: human.position.x, humanZ: human.position.z });
    canvas.dataset.lobbySofas = String(props.couches.length);
    canvas.dataset.lobbySeats = String(props.couches.reduce((sum, entry) => sum + entry.couch.seats.length, 0));
    const targets = [...humanQueueSlots(3, manager.nav), ...props.couches.flatMap((entry) => entry.couch.seats.map((seat) => seat.front))];
    canvas.dataset.layoutRoutes = JSON.stringify(targets.map((point) => ({ x: point.x, z: point.z, walkable: manager.nav.walkableAt(point.x, point.z), reachable: (manager.nav.findPath({ x: 3.4, z: 2.4 }, point) || []).length > 0 })));
  }, paintBoard = function() {
    if (!world || !snapshot2) return;
    const ctx = world.boardCanvas.getContext("2d");
    ctx.fillStyle = "#f7f8ee";
    ctx.fillRect(0, 0, 1536, 768);
    ctx.fillStyle = "#365741";
    ctx.font = "bold 45px sans-serif";
    ctx.fillText(snapshot2.company.name.slice(0, 35), 45, 70);
    ctx.fillStyle = "#839079";
    ctx.font = "24px sans-serif";
    ctx.fillText("PAPERCLIP  /  G\xD6REV TAHTASI", 45, 115);
    const groups = [["BEKL\u0130YOR", ["backlog", "todo"], "#d5dec5"], ["GEL\u0130\u015ET\u0130RME", ["in_progress"], "#c3d9db"], ["TEST / \u0130NCELEME", ["in_review", "blocked"], "#e7d4b9"], ["TAMAMLANDI", ["done", "cancelled"], "#cbdcc1"]];
    groups.forEach(([label2, states, color], col) => {
      const x = 30 + col * 377, items = snapshot2.issues.filter((i) => states.includes(i.status));
      ctx.fillStyle = color;
      ctx.fillRect(x, 155, 355, 565);
      ctx.fillStyle = "#3b5443";
      ctx.font = "bold 23px sans-serif";
      ctx.fillText(`${label2} \xB7 ${items.length}`, x + 15, 195);
      items.slice(0, 4).forEach((item, index) => {
        const y = 215 + index * 113;
        ctx.fillStyle = "#fffef7";
        ctx.fillRect(x + 12, y, 330, 99);
        ctx.fillStyle = "#84927d";
        ctx.font = "19px sans-serif";
        ctx.fillText(item.identifier || "", x + 24, y + 26);
        ctx.fillStyle = "#354b3c";
        ctx.font = "22px sans-serif";
        ctx.fillText(item.title.slice(0, 24), x + 24, y + 60);
        ctx.fillStyle = "#81917e";
        ctx.font = "17px sans-serif";
        ctx.fillText((snapshot2.agents.find((a) => a.id === item.assigneeAgentId)?.name || "Atanmam\u0131\u015F").slice(0, 28), x + 24, y + 84);
      });
    });
    world.texture.needsUpdate = true;
  }, restore = function(id) {
    world?.busyAnimations.delete(id);
    signatures.delete(id);
    if (world?.waiting.has(id) || world?.blocked.has(id)) return;
    const a = snapshot2?.agents.find((a2) => a2.id === id);
    if (a && world.manager.agents.has(id)) world.manager.handleEvent({ type: "status", id, status: agentState(a, snapshot2.issues) });
  }, handoff = function(event) {
    if (world.waiting.has(event.from) || world.blocked.has(event.from)) return;
    const from = world.manager.agents.get(event.from), to = world.manager.agents.get(event.to);
    if (!from || !to || from.leaving || to.leaving) return;
    world.busyAnimations.add(event.from);
    stopSocial();
    const target = () => {
      const anchor = to.desk?.seat || to.agent.position;
      return { x: anchor.x + 2.2, z: anchor.z + 0.8 };
    };
    world.manager._begin(from, [
      ...world.manager._release(from),
      carry("letter"),
      status("walking"),
      walk(target),
      lookAt(() => to.agent.position),
      wait(1.4),
      carry(null),
      act(() => queueMicrotask(() => restore(event.from)))
    ]);
  }, queueSlots = function(count) {
    return humanQueueSlots(count, world.manager.nav);
  }, syncBubbles = function() {
    const items = snapshot2.humanQueueEnabled ? snapshot2.attention || [] : [];
    const signature = JSON.stringify(items.map((q) => [q.id, q.agentId, q.title]));
    if (signature === bubbleSignature) return;
    bubbleSignature = signature;
    bubbleLayer.replaceChildren();
    bubbleGroups.clear();
    items.forEach((q, index) => {
      let group2 = bubbleGroups.get(q.agentId);
      if (!group2) {
        group2 = document.createElement("div");
        group2.className = "question-group";
        group2.dataset.agentId = q.agentId;
        bubbleGroups.set(q.agentId, group2);
        bubbleLayer.append(group2);
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = "question-bubble";
      const author = snapshot2.agents.find((a) => a.id === q.agentId)?.name || "Ekip \xFCyesi";
      button.textContent = String(index + 1);
      button.title = `${author}: ${q.title}`;
      button.setAttribute("aria-label", `${index + 1}. soru \xB7 ${author} \xB7 ${q.title}`);
      button.dataset.questionId = q.id;
      button.addEventListener("click", () => notify("office-question", { questionId: q.id }));
      group2.append(button);
    });
  }, positionBubbles = function() {
    let atDesk = 0;
    const waitingPositions = [];
    for (const [id, position] of world.waiting) {
      const rec = world.manager.agents.get(id);
      if (!rec) continue;
      const arrived = Math.hypot(rec.agent.position.x - position.x, rec.agent.position.z - position.z) < 0.5;
      if (arrived) atDesk++;
      waitingPositions.push({ id, x: rec.agent.position.x, z: rec.agent.position.z, targetX: position.x, targetZ: position.z, arrived });
    }
    world.television.group.localToWorld(projectedHead.copy(world.television.openAnchor));
    projectedHead.project(camera);
    const tvOpen = document.getElementById("tv-open");
    tvOpen.style.left = `${(projectedHead.x + 1) * canvas.clientWidth / 2}px`;
    tvOpen.style.top = `${(1 - projectedHead.y) * canvas.clientHeight / 2}px`;
    canvas.dataset.renderScale = String(renderer.getPixelRatio());
    canvas.dataset.atDeskCount = String(atDesk);
    canvas.dataset.queuePositions = JSON.stringify(waitingPositions);
    for (const [id, button] of actorButtons) {
      const actor = world.manager.agents.get(id)?.agent;
      if (!actor) {
        button.hidden = true;
        continue;
      }
      actor.head.getWorldPosition(projectedHead);
      projectedHead.project(camera);
      button.hidden = Math.abs(projectedHead.x) > 1 || Math.abs(projectedHead.y) > 1 || projectedHead.z < -1 || projectedHead.z > 1;
      button.style.left = `${(projectedHead.x + 1) * canvas.clientWidth / 2}px`;
      button.style.top = `${(1 - projectedHead.y) * canvas.clientHeight / 2}px`;
    }
    canvas.dataset.blockerPositions = JSON.stringify([...world.blocked.values()].map((plan) => {
      const actor = world.manager.agents.get(plan.agentId)?.agent;
      return { ...plan.position, agentId: plan.agentId, blockerAgentId: plan.blockerAgentId, actualX: actor?.position.x, actualZ: actor?.position.z };
    }));
    for (const [id, group2] of bubbleGroups) {
      const rec = world.manager.agents.get(id);
      if (!rec || rec.leaving || !world.waiting.has(id)) {
        group2.hidden = true;
        continue;
      }
      rec.agent.head.getWorldPosition(projectedHead);
      projectedHead.y += 1.15;
      projectedHead.project(camera);
      group2.hidden = projectedHead.z < -1 || projectedHead.z > 1 || Math.abs(projectedHead.x) > 1 || Math.abs(projectedHead.y) > 1;
      group2.style.left = `${(projectedHead.x + 1) * canvas.clientWidth / 2}px`;
      group2.style.top = `${(1 - projectedHead.y) * canvas.clientHeight / 2}px`;
    }
  }, syncActorButtons = function() {
    for (const [id, button] of actorButtons) if (!world.manager.agents.has(id)) {
      button.remove();
      actorButtons.delete(id);
    }
    for (const [id, rec] of world.manager.agents) {
      if (actorButtons.has(id)) continue;
      const button = document.createElement("button");
      button.className = "agent-hotspot";
      button.type = "button";
      button.setAttribute("aria-label", `${rec.agent.name} ayr\u0131nt\u0131lar\u0131`);
      button.title = `${rec.agent.name} \xB7 Durum ve prompt ge\xE7mi\u015Fi`;
      button.textContent = "i";
      button.addEventListener("click", () => notify("office-select", { agentId: id }));
      document.getElementById("agent-hotspots").append(button);
      actorButtons.set(id, button);
    }
  }, waitAtHuman = function(agentId, position) {
    const rec = world.manager.agents.get(agentId);
    if (!rec || !position) return;
    world.manager._begin(rec, [
      ...world.manager._release(rec),
      carry("letter"),
      status("walking"),
      walk(position),
      lookAt(() => world.human.position),
      carry(null),
      status("waiting"),
      wait(86400)
    ]);
  }, blockerPlans = function(visits) {
    const plans = /* @__PURE__ */ new Map(), occupied = [];
    const perHost = /* @__PURE__ */ new Map();
    for (const visit of visits) {
      const host = world.manager.agents.get(visit.blockerAgentId), desk = host?.desk;
      if (!desk || !world.manager.agents.has(visit.agentId)) continue;
      const heading2 = desk.sitRotation, index = perHost.get(visit.blockerAgentId) || 0;
      perHost.set(visit.blockerAgentId, index + 1);
      const lateral = index === 0 ? 0 : Math.ceil(index / 2) * 1.4 * (index % 2 ? 1 : -1);
      let position = null;
      for (const distance of [3.4, 4.2, 4.8]) {
        for (const side of [lateral, lateral + 0.7, lateral - 0.7]) {
          const point = { x: desk.seat.x + Math.sin(heading2) * distance + Math.cos(heading2) * side, z: desk.seat.z + Math.cos(heading2) * distance - Math.sin(heading2) * side };
          if (world.manager.nav.walkableAt(point.x, point.z) && occupied.every((p) => Math.hypot(p.x - point.x, p.z - point.z) > 1.2)) {
            position = point;
            break;
          }
        }
        if (position) break;
      }
      if (position) {
        occupied.push(position);
        plans.set(visit.agentId, { ...visit, position, desk: desk.id });
      }
    }
    return plans;
  }, waitAtBlocker = function(plan) {
    const rec = world.manager.agents.get(plan.agentId), host = world.manager.agents.get(plan.blockerAgentId);
    if (!rec || !host?.desk) return;
    world.manager._begin(rec, [...world.manager._release(rec), carry("letter"), status("walking"), walk(plan.position), lookAt(() => host.desk.seat), carry(null), status("waiting"), wait(86400)]);
  }, stopSocial = function() {
    if (world?.social) for (const id of world.social.people.keys()) {
      const agent = world.manager.agents.get(id)?.agent;
      if (agent) {
        agent.setElevation(0);
        agent.trunk.rotation.x = 0;
        agent.head.rotation.x = 0;
        for (const arm of agent.shoulders) arm.rotation.z = 0;
      }
    }
    if (world) {
      world.lobby.bubble.visible = false;
      world.social = null;
      world.socialKey = "";
      world.pendingSocial = null;
      canvas.dataset.socialPhase = "off";
    }
  }, arrangeSocial = function(ids) {
    stopSocial();
    world.socialKey = ids.join("|");
    if (!ids.length) return;
    if (ids.some((id) => world.manager.agents.get(id)?.arriving)) {
      world.pendingSocial = [...ids];
      canvas.dataset.socialPhase = "gathering";
      return;
    }
    const social = { ids, people: /* @__PURE__ */ new Map(), elapsed: 0 };
    world.social = social;
    canvas.dataset.socialPhase = "gathering";
    const sofas = world.props.couches.map((entry) => entry.couch);
    const seats = Array.from({ length: 3 }, (_, index) => sofas.map((couch) => ({ couch, seat: couch.seats[index] }))).flat();
    ids.forEach((id, index) => {
      const rec = world.manager.agents.get(id), allocation = seats[index];
      if (!rec || rec.leaving || !allocation?.seat) return;
      const { couch, seat } = allocation, position = seat.position;
      const participant = { position, couch, seat, ready: false };
      social.people.set(id, participant);
      rec.agent.job = ids.length > 1 ? "Bo\u015Fta \xB7 Lobide sohbet ediyor" : "Bo\u015Fta \xB7 Lobide mola";
      world.manager._begin(rec, [
        ...world.manager._release(rec),
        act(() => {
          rec.couchSeat = seat;
          rec.couch = couch;
          seat.occupiedBy = id;
        }),
        carry(null),
        status("walking"),
        ...sitDownOn(seat, COUCH_SEAT_HEIGHT),
        status("idle"),
        act(() => {
          participant.ready = true;
        }),
        wait(86400)
      ]);
    });
  }, alignAt = function(rec, position, dt, face2) {
    const actor = rec.agent, dx = position.x - actor.position.x, dz = position.z - actor.position.z;
    if (Math.hypot(dx, dz) <= 0.15) {
      if (face2) actor.setRotation(Math.atan2(face2.x - actor.position.x, face2.z - actor.position.z));
      return true;
    }
    const key = `${position.x}:${position.z}`;
    if (rec.officeAlignment?.key !== key) rec.officeAlignment = { key, path: [] };
    const alignment = rec.officeAlignment;
    if (!alignment.path.length) alignment.path = world.manager.nav.findPath(actor.position, position) || [];
    while (alignment.path.length && Math.hypot(alignment.path[0].x - actor.position.x, alignment.path[0].z - actor.position.z) < 0.04) alignment.path.shift();
    const next = alignment.path[0];
    if (!next) return false;
    const px = next.x - actor.position.x, pz = next.z - actor.position.z;
    const step = Math.min(1, dt * 1.8 / Math.max(Math.hypot(px, pz), 1e-3));
    actor.setPositionXZ(actor.position.x + px * step, actor.position.z + pz * step);
    actor.setRotation(Math.atan2(px, pz));
    actor.update(dt, { moving: true });
    return false;
  }, tickWaiting = function(dt) {
    for (const [id, position] of world.waiting) {
      const rec = world.manager.agents.get(id);
      if (rec?.agent.status === "waiting" && rec.controller.current?.kind === "wait") alignAt(rec, position, dt, world.human.position);
    }
    for (const [id, plan] of world.blocked) {
      const rec = world.manager.agents.get(id), host = world.manager.agents.get(plan.blockerAgentId);
      if (rec?.agent.status === "waiting" && rec.controller.current?.kind === "wait") alignAt(rec, plan.position, dt, host?.desk?.seat);
    }
  }, tickSocial = function(dt) {
    if (world?.pendingSocial) {
      if (world.pendingSocial.every((id) => world.manager.agents.has(id) && !world.manager.agents.get(id).arriving)) {
        const ids2 = world.pendingSocial;
        world.pendingSocial = null;
        arrangeSocial(ids2);
      }
      return;
    }
    const social = world?.social;
    if (!social || !social.people.size) return;
    const ready2 = [...social.people.values()].every((p) => p.ready);
    let settled = ready2;
    for (const [id, participant] of social.people) {
      const actor2 = world.manager.agents.get(id)?.agent;
      if (!actor2?.seated || Math.hypot(actor2.position.x - participant.position.x, actor2.position.z - participant.position.z) > 0.15) settled = false;
    }
    const positions = [...social.people].map(([id, p]) => {
      const agent = world.manager.agents.get(id)?.agent;
      return { id, x: agent?.position.x, z: agent?.position.z, targetX: p.position.x, targetZ: p.position.z, ready: p.ready, seated: agent?.seated, sofaId: p.couch.id };
    });
    canvas.dataset.socialPositions = JSON.stringify(positions);
    if (!ready2 || !settled) {
      canvas.dataset.socialPhase = "gathering";
      world.lobby.bubble.visible = false;
      return;
    }
    social.elapsed += dt;
    const ids = [...social.people.keys()], speaker = ids[Math.floor(social.elapsed / 4) % ids.length];
    canvas.dataset.socialPhase = ids.length > 1 ? "chatting" : "on-break";
    canvas.dataset.socialSpeaker = ids.length > 1 ? speaker : "";
    for (const [index, id] of ids.entries()) {
      const agent = world.manager.agents.get(id)?.agent;
      if (!agent) continue;
      const talking = ids.length > 1 && id === speaker;
      agent.head.rotation.x = Math.sin(social.elapsed * (talking ? 4 : 1.4) + index) * (talking ? 0.08 : 0.025);
      agent.shoulders[0].rotation.z = talking ? -0.3 - Math.sin(social.elapsed * 3.5) * 0.12 : 0;
      agent.shoulders[0].rotation.x = talking ? -0.45 + Math.sin(social.elapsed * 2.6) * 0.16 : 0;
    }
    world.lobby.bubble.visible = ids.length > 1;
    const actor = world.manager.agents.get(speaker)?.agent;
    if (actor) {
      actor.head.getWorldPosition(world.lobby.bubble.position);
      world.lobby.bubble.position.y += 1.5;
    }
  }, apply = function(next, nextFloor, changes = []) {
    if (!next || next.company.id !== companyId) return;
    const rebuild = !world || nextFloor !== floor;
    snapshot2 = next;
    floor = nextFloor;
    if (rebuild) build();
    const floorMembers = snapshot2.agents.slice(floor * 5, floor * 5 + 5);
    const floorIds = new Set(floorMembers.map((a) => a.id));
    const visits = blockingVisits(snapshot2.agents, snapshot2.issues, snapshot2.humanQueueEnabled ? snapshot2.attention || [] : []);
    const visitByAgent = new Map(visits.map((v) => [v.agentId, v]));
    const onFloor = floorMembers.filter((a) => !visitByAgent.has(a.id) || floorIds.has(visitByAgent.get(a.id).blockerAgentId));
    const queueIds = [...new Set((snapshot2.humanQueueEnabled ? snapshot2.attention || [] : []).map((item) => item.agentId))];
    const positions = queueSlots(queueIds.length);
    const guestIds = [.../* @__PURE__ */ new Set([...queueIds.slice(0, positions.length), ...visits.filter((v) => floorIds.has(v.blockerAgentId)).map((v) => v.agentId)])];
    const guests = guestIds.map((id) => snapshot2.agents.find((a) => a.id === id)).filter(Boolean);
    const visible = [...onFloor, ...guests.filter((a) => !onFloor.some((p) => p.id === a.id))], ids = new Set(visible.map((a) => a.id));
    const nextWaiting = /* @__PURE__ */ new Map();
    for (const [index, id] of queueIds.slice(0, positions.length).entries()) nextWaiting.set(id, positions[index]);
    const previousWaiting = world.waiting;
    world.waiting = nextWaiting;
    const idleIds = idlePlayers(visible, snapshot2.issues, snapshot2.humanQueueEnabled ? snapshot2.attention || [] : []).map((a) => a.id).filter((id) => !world.busyAnimations.has(id) && !visitByAgent.has(id));
    const idleSet = new Set(idleIds);
    for (const id of previousWaiting.keys()) if (!nextWaiting.has(id)) signatures.delete(id);
    for (const id of [...world.manager.agents.keys()]) {
      if (!ids.has(id)) {
        if (!world.manager.agents.get(id)?.leaving) world.manager.handleEvent({ type: "exit", id });
        signatures.delete(id);
      }
    }
    for (const [index, a] of visible.entries()) if (!world.manager.agents.has(a.id)) world.manager.handleEvent({ type: "spawn", id: a.id, name: a.name, color: [6718058, 12026711, 7048347, 9271968, 11701348][index % 5] }, source);
    const oldBlocked = world.blocked;
    world.blocked = blockerPlans(visits);
    for (const id of oldBlocked.keys()) if (!world.blocked.has(id)) signatures.delete(id);
    for (let index = 0; index < visible.length; index++) {
      const a = visible[index];
      if (!world.manager.agents.has(a.id)) {
        const color = [6718058, 12026711, 7048347, 9271968, 11701348][index % 5];
        world.manager.handleEvent({ type: "spawn", id: a.id, name: a.name, color }, source);
      }
      const rec = world.manager.agents.get(a.id);
      if (rec.agent.name !== a.name) world.manager.handleEvent({ type: "rename", id: a.id, name: a.name });
      const job = currentIssue(a.id, snapshot2.issues), state = agentState(a, snapshot2.issues);
      const waitingAt = nextWaiting.get(a.id), wasAt = previousWaiting.get(a.id);
      if (waitingAt) {
        world.busyAnimations.delete(a.id);
        rec.agent.job = "Yan\u0131t\u0131n\u0131 bekliyor";
        if (!wasAt || waitingAt.x !== wasAt.x || waitingAt.z !== wasAt.z) waitAtHuman(a.id, waitingAt);
        continue;
      }
      const plan = world.blocked.get(a.id), oldPlan = oldBlocked.get(a.id);
      if (plan) {
        world.busyAnimations.delete(a.id);
        rec.agent.job = `${snapshot2.agents.find((p) => p.id === plan.blockerAgentId)?.name || "Ajan"} bekleniyor \xB7 ${plan.blockerIdentifier || ""}`;
        if (!oldPlan || oldPlan.blockerAgentId !== plan.blockerAgentId || oldPlan.position.x !== plan.position.x || oldPlan.position.z !== plan.position.z) waitAtBlocker(plan);
        continue;
      }
      if (world.busyAnimations.has(a.id)) {
        if (state === "idle") continue;
        world.busyAnimations.delete(a.id);
      }
      if (idleSet.has(a.id)) {
        signatures.delete(a.id);
        continue;
      }
      if (world.social?.people.has(a.id)) {
        rec.agent.setElevation(0);
        rec.agent.trunk.rotation.x = 0;
      }
      const signature = `${state}:${job?.id || ""}:${job?.title || ""}`;
      if (signatures.get(a.id) !== signature) {
        if (job) world.manager.handleEvent({ type: "job", id: a.id, job: `${job.identifier} \xB7 ${job.title}` });
        else rec.agent.job = null;
        world.manager.handleEvent({ type: "status", id: a.id, status: state });
        signatures.set(a.id, signature);
      }
    }
    if (world.socialKey !== idleIds.join("|")) arrangeSocial(idleIds);
    canvas.dataset.socialCount = String(idleIds.length);
    canvas.dataset.socialAgents = idleIds.join(",");
    document.getElementById("social-status").textContent = `LOB\u0130 \xB7 ${idleIds.length} ajan bo\u015Fta`;
    for (const event of changes) {
      if (event.kind === "handoff") handoff(event);
      if (event.kind === "complete" && world.manager.agents.has(event.from) && !world.waiting.has(event.from) && !world.blocked.has(event.from)) {
        world.busyAnimations.add(event.from);
        stopSocial();
        world.manager.handleEvent({ type: "dispatch", id: event.from, summary: event.issue.title });
        world.manager.agents.get(event.from)?.controller.push([act(() => queueMicrotask(() => restore(event.from)))]);
      }
    }
    paintBoard();
    syncBubbles();
    hint.textContent = `${snapshot2.company.name} \xB7 Kat ${floor + 1} \xB7 ${onFloor.length} / ${snapshot2.agents.length} ajan`;
    document.getElementById("human-status").textContent = snapshot2.humanQueueEnabled ? `Senin odan \xB7 ${queueIds.length} ki\u015Fi bekliyor${queueIds.length > positions.length ? ` \xB7 \u0130lk ${positions.length} ki\u015Fi ofiste` : ""}` : "Senin odan";
    canvas.dataset.waitingCount = String(queueIds.length);
    canvas.dataset.waitingAgents = [...nextWaiting.keys()].join(",");
    canvas.dataset.blockedVisits = JSON.stringify([...world.blocked.values()].map((p) => ({ agentId: p.agentId, blockerAgentId: p.blockerAgentId, desk: p.desk, x: p.position.x, z: p.position.z })));
    syncActorButtons();
    canvas.dataset.humanSeated = "true";
    canvas.setAttribute("aria-label", `\xDC\xE7 boyutlu ofis. ${humanName} masas\u0131nda oturuyor. ${snapshot2.humanQueueEnabled ? `${queueIds.length} ki\u015Fi yan\u0131t bekliyor.` : "Soru bekleme s\u0131ras\u0131 kapal\u0131."}`);
  }, animate = function(now) {
    const dt = Math.min((now - previous) / 1e3, 0.05);
    previous = now;
    if (world && !document.hidden) {
      world.manager.update(dt);
      world.human.update(dt);
      tickWaiting(dt);
      tickSocial(dt);
      if (snapshot2) updateTelevision(world.television, snapshot2, dt, canvas);
      for (const desk of world.props.desks) desk.update(dt);
      world.props.mailbox?.update(dt);
      world.props.door?.update(dt);
      for (const s of stationsOfKind("printer")) world.props.byStation[s.id]?.update?.(dt);
      for (const shelf of world.props.bookshelves) shelf.globe?.update(dt);
      for (const t of world.props.telescopes || []) t.scope?.update(dt);
      world.mail.update(dt);
      world.birds.update(dt);
      world.deliveries.update(dt);
      const sun = applyTimeOfDay(world.lights, evening ? 19 : 11, world.theme, scene);
      applyNightLights(world.props.nightLights, sun.lampOn);
      world.props.wallClock?.setTime?.(/* @__PURE__ */ new Date());
    }
    controls.update();
    clampPan(camera, controls);
    renderer.render(scene, camera);
    if (world) positionBubbles();
    requestAnimationFrame(animate);
  };
  const renderer = createRenderer({ canvas, pixelRatio: Math.min(Math.max(devicePixelRatio, 1.5), 2) });
  const scene = new THREE42.Scene();
  const environment = createReflectionEnvironment(renderer);
  scene.environment = environment.texture;
  const camera = createCamera(canvas.clientWidth / canvas.clientHeight);
  const controls = createControls(camera, canvas);
  camera.position.set(...CAMERA.position);
  controls.target.set(...CAMERA.target);
  controls.update();
  const defaultPosition = camera.position.clone(), defaultTarget = controls.target.clone();
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    updateCameraAspect(camera, w / Math.max(h, 1));
    fit();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();
  const projectedHead = new THREE42.Vector3();
  window.addEventListener("message", (event) => {
    if (event.source !== parent || event.origin !== location.origin || event.data?.companyId !== companyId) return;
    try {
      const m = event.data;
      if (m.type === "office-snapshot") {
        if (m.humanName) humanName = m.humanName;
        apply(m.snapshot, m.floor || 0, m.changes || []);
      }
      if (m.type === "office-human-name") {
        humanName = m.name || "Sen";
        world?.human.setName(humanName);
        if (world) world.humanDesk.setAssignment(world.human);
      }
      if (m.type === "office-light") evening = !evening;
      if (m.type === "office-lobby") {
        const delta = new THREE42.Vector3(LOBBY.x, controls.target.y, LOBBY.z).sub(controls.target);
        controls.target.add(delta);
        camera.position.add(delta);
      }
      if (m.type === "office-reset") {
        camera.position.copy(defaultPosition);
        controls.target.copy(defaultTarget);
        controls.update();
        fit();
      }
      if (m.type === "office-focus") {
        selected = m.agentId;
        const person = selected === HUMAN_ID ? world?.human : world?.manager.agents.get(selected)?.agent;
        if (person) {
          const delta = new THREE42.Vector3().subVectors(person.position, controls.target);
          delta.y = 0;
          controls.target.add(delta);
          camera.position.add(delta);
        }
      }
    } catch (error) {
      report(error);
    }
  });
  document.getElementById("tv-open").addEventListener("click", () => notify("office-tv"));
  let down = null;
  canvas.addEventListener("pointerdown", (e) => {
    down = { x: e.clientX, y: e.clientY };
  });
  canvas.addEventListener("pointerup", (e) => {
    if (!world || !down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return;
    const rect = canvas.getBoundingClientRect();
    pointer.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
    ray.setFromCamera(pointer, camera);
    for (const hit of ray.intersectObjects(world.root.children, true)) {
      if (hit.object.userData.officeTV) {
        notify("office-tv");
        break;
      }
      if (hit.object.userData.officeBoard) {
        notify("office-board");
        break;
      }
      const id = world.manager.agentIdFromObject(hit.object);
      if (id) {
        selected = id;
        notify(id === HUMAN_ID ? "office-human" : "office-select", { agentId: id });
        break;
      }
    }
  });
  let previous = performance.now();
  requestAnimationFrame(animate);
  ready = true;
  notify("office-ready");
} catch (error) {
  report(error);
}
