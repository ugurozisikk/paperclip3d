import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
const root = path.dirname(fileURLToPath(import.meta.url));
const upstream = path.join(root, 'vendor/roving-office');
const ui = path.join(root, 'dist/ui');
await fs.rm(path.join(root, 'dist'), { recursive: true, force: true });
await fs.mkdir(ui, { recursive: true });
const sdk = fileURLToPath(import.meta.resolve('@paperclipai/plugin-sdk'));
await build({ absWorkingDir: root, entryPoints: ['src/worker.js'], outfile: 'dist/worker.js', bundle: true,
  format: 'esm', platform: 'node', target: 'node24', alias: { '@paperclipai/plugin-sdk': sdk } });
await fs.copyFile(path.join(root, 'src/manifest.js'), path.join(root, 'dist/manifest.js'));
await build({ absWorkingDir: root, entryPoints: ['src/index.js'], outfile: 'dist/ui/index.js', bundle: true,
  format: 'esm', platform: 'browser', target: 'es2022', external: ['react', 'react-dom', '@paperclipai/plugin-sdk/ui'] });
for (const file of ['office.css', 'scene.html', 'scene.js', 'model.js', 'office-props.js', 'office-layout.js'])
  await fs.copyFile(path.join(root, 'src', file), path.join(ui, file));
// Vendor runtime only; the upstream checkout is kept unmodified.
await fs.cp(path.join(upstream, 'src'), path.join(ui, 'roving/src'), { recursive: true });
// Remove the near east-side neighbour that obscures the expanded office at low camera angles.
const districtPath = path.join(ui, 'roving/src/scene/outlooks/alder-layout.js');
const district = await fs.readFile(districtPath, 'utf8');
const foregroundPlot = '  [82, 17, 20, 27, 12.8, 0, true],';
if (!district.includes(foregroundPlot)) throw new Error('Review foreground-building removal against the updated upstream.');
await fs.writeFile(districtPath, '// Local adaptation: keep the office foreground unobstructed.\n' + district.replace(foregroundPlot, ''));
// The shared geometry, navigation and framing must all use the expanded shell.
const configPath = path.join(ui, 'roving/src/config.js');
const config = await fs.readFile(configPath, 'utf8');
if (!config.includes('  W: 26,\n  D: 20,')) throw new Error('Review expanded-room adaptation against the updated upstream.');
await fs.writeFile(configPath, '// Local adaptation: expanded Paperclip office.\n' + config
  .replace('  W: 26,\n  D: 20,', '  W: 44,\n  D: 30,')
  .replace('position: [26, 25, 26]', 'position: [48, 42, 47]')
  .replace('target: [12, 1.5, 10]', 'target: [22, 1.5, 15]'));
const couchPath = path.join(ui, 'roving/src/scene/props/couch.js');
const couch = await fs.readFile(couchPath, 'utf8');
if (!couch.includes('cushions: [-1.0, 1.0]')) throw new Error('Review three-seat sofa adaptation against the updated upstream.');
await fs.writeFile(couchPath, '// Local adaptation: three-seat lobby sofas.\n' + couch
  .replace('width: 4.2,', 'width: 6.4,').replace('armX: [-1.85, 1.85]', 'armX: [-2.95, 2.95]')
  .replace('cushions: [-1.0, 1.0]', 'cushions: [-2.0, 0, 2.0]'));
await fs.cp(path.join(upstream, 'vendor/three'), path.join(ui, 'roving/vendor/three'), { recursive: true });
for (const file of ['LICENSE', 'NOTICE', 'THIRD_PARTY_NOTICES.txt'])
  await fs.copyFile(path.join(upstream, file), path.join(ui, 'roving', file));
// This local adaptation uses neutral office artwork in place of upstream brand standees.
const propsPath = path.join(ui, 'roving/src/scene/props.js');
let props = await fs.readFile(propsPath, 'utf8');
props = '// Local adaptation: omit third-party brand standees.\n' + props
  .replace("import { buildAceLogo, buildRovoLogo } from './standees.js';", '')
  .replace(/  const LOGO_HEIGHT = 0\.9;[\s\S]*?\n  return props;/, '  return props;');
await fs.writeFile(propsPath, props);
const kanbanPath = path.join(ui, 'roving/src/scene/kanban.js');
let kanban = await fs.readFile(kanbanPath, 'utf8');
kanban = '// Local adaptation: neutral board heading.\n' + kanban.replace(/const KB_LOGO_GLYPH_D = '[^']*';/, "const KB_LOGO_GLYPH_D = '';");
await fs.writeFile(kanbanPath, kanban);
// Agent labels use a neutral Paperclip source, so do not ship the upstream vendor logo catalogue.
await fs.writeFile(path.join(ui, 'roving/src/ui/marks.js'), '// Local adaptation: no vendor artwork.\nexport function renderMark(markup) { return String(markup).replaceAll("__UID__", "office-mark"); }\n');
await fs.copyFile(path.join(root, 'src/scene.js'), path.join(ui, 'scene.entry.js'));
const sceneBuild = await build({ absWorkingDir: root, entryPoints: [path.join(ui, 'scene.entry.js')], outfile: path.join(ui, 'scene.js'), bundle: true,
  format: 'esm', platform: 'browser', target: 'es2022', external: ['three', 'three/*'], legalComments: 'inline', metafile: true,
  banner: { js: '/*! Contains The Roving Office, Copyright (c) 2026 Atlassian US., Inc., Apache-2.0. Modified for Paperclip 3D Ofis: company-scoped scene integration, live task board, handoff choreography, floors, personal human desk, question bubbles, seated lobby conversations, private office, decor, panoramic task TV and controls; excluded vendor brand artwork removed. See roving/LICENSE, roving/NOTICE and package NOTICE. */' } });
await fs.writeFile(path.join(root, '.scene-inputs.json'), JSON.stringify(Object.keys(sceneBuild.metafile.inputs).filter(name => name.startsWith('dist/ui/roving/src/')).map(name => name.slice('dist/ui/roving/src/'.length)), null, 2));
await fs.rm(path.join(ui, 'scene.entry.js'));
// The final scene is bundled; temporary source copies are not runtime entry points.
for (const name of ['model.js', 'office-props.js', 'office-layout.js']) await fs.rm(path.join(ui, name));
await fs.rm(path.join(ui, 'roving/src'), { recursive: true });
await fs.copyFile(path.join(upstream, 'LICENSE'), path.join(root, 'LICENSE'));
const sdkPackageRoot = path.dirname(path.dirname(sdk));
const zodPackageRoot = path.dirname(fileURLToPath(import.meta.resolve('zod')));
await fs.writeFile(path.join(root, 'THIRD_PARTY_NOTICES.txt'),
  'The Roving Office (Apache-2.0): see dist/ui/roving/LICENSE and NOTICE.\nThree.js (MIT): see dist/ui/roving/vendor/three/LICENSE.\n\nPaperclip plugin-sdk and shared (MIT):\n' +
  await fs.readFile(path.join(sdkPackageRoot, 'LICENSE'), 'utf8') +
  '\n\nZod (MIT):\n' + await fs.readFile(path.join(zodPackageRoot, 'LICENSE'), 'utf8'));
console.log('3D Ofis build ready.');
