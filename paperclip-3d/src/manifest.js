export default {
  id: 'local.office3d', apiVersion: 1, version: '1.6.2', displayName: '3D Ofis',
  description: 'Her şirket için canlı ajanlar, görev tahtası ve iş devirleri.',
  author: 'Local workspace', categories: ['ui'],
  capabilities: ['companies.read', 'agents.read', 'issues.read', 'issue.interactions.read', 'issue.relations.read', 'ui.page.register', 'ui.sidebar.register'],
  entrypoints: { worker: './dist/worker.js', ui: './dist/ui' },
  ui: { slots: [
    { type: 'page', id: 'office-page', displayName: '3D Ofis', exportName: 'OfficePage', routePath: 'office3d' },
    { type: 'sidebar', id: 'office-nav', displayName: '3D Ofis', exportName: 'OfficeLink' }
  ] }
};
