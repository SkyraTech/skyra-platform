import { docsRegistry } from './registry';


export interface SearchDocument {
  id: string;
  type:
    | 'package'
    | 'capability'
    | 'api'
    | 'example'
    | 'token'
    | 'foundation'
    | 'accessibility'
    | 'responsive'
    | 'pattern'
    | 'release'
    | 'change';
  title: string;
  description?: string;
  packageId?: string;
  capabilityId?: string;
  apiId?: string;
  href: string;
  keywords?: string[];
  content?: string;
  runtime?: string;
  status?: string;
}

/**
 * Builds a flat array of search documents from the DocumentationRegistry.
 */
export function buildSearchIndex(): SearchDocument[] {
  const documents: SearchDocument[] = [];
  const registry = docsRegistry;

  // Packages
  for (const pkg of registry.getPackages()) {
    documents.push({
      id: pkg.id,
      type: 'package',
      title: pkg.name,
      description: pkg.description,
      packageId: pkg.id,
      href: `/packages/${pkg.id.replace('@skyra/', '')}`,
      runtime: pkg.runtime,
      status: pkg.status,
    });
  }

  // Capabilities
  for (const cap of registry.getCapabilities()) {
    const pkgSlug = cap.packageId.replace('@skyra/', '');
    const capSlug = cap.id.split('/')[1];
    documents.push({
      id: cap.id,
      type: 'capability',
      title: cap.name,
      description: cap.description,
      packageId: cap.packageId,
      capabilityId: cap.id,
      href: `/packages/${pkgSlug}/${capSlug}`,
      runtime: cap.runtime,
      status: cap.status,
      keywords: cap.related,
    });
  }

  // APIs
  for (const api of registry.getApis()) {
    const pkgSlug = api.packageId.replace('@skyra/', '');
    const capSlug = api.capabilityId.split('/')[1];
    documents.push({
      id: api.id,
      type: 'api',
      title: api.name,
      description: api.description,
      packageId: api.packageId,
      capabilityId: api.capabilityId,
      apiId: api.id,
      href: `/packages/${pkgSlug}/${capSlug}/${api.name}`,
      status: api.status,
      keywords: [api.kind, ...(api.related || [])],
      content: api.properties?.map(p => p.name).join(' '),
    });
  }

  // Examples
  const apis = registry.getApis();
  const examples = registry.getExamplesForApi ? apis.flatMap(api => registry.getExamplesForApi(api.id)) : [];
  for (const ex of examples) {
    if (!ex.apiId) continue;
    const api = registry.getApi(ex.apiId);
    if (!api) continue;
    
    const pkgSlug = api.packageId.replace('@skyra/', '');
    const capSlug = api.capabilityId.split('/')[1];
    documents.push({
      id: `example-${ex.id}`,
      type: 'example',
      title: ex.title,
      description: `Example for ${api.name}`,
      packageId: api.packageId,
      capabilityId: api.capabilityId,
      apiId: api.id,
      href: `/packages/${pkgSlug}/${capSlug}/${api.name}`, // Navigates to API page where examples are
      content: ex.source,
    });
  }

  // Tokens
  if (registry.getTokens) {
    for (const token of registry.getTokens()) {
      documents.push({
        id: token.id,
        type: 'token',
        title: token.id,
        description: token.description || `${token.category} token`,
        href: `/design-system`,
        content: `${token.name} ${token.value} ${token.darkValue || ''}`,
        keywords: [token.category, 'design token'],
      });
    }
  }

  // Static Documentation Hubs
  documents.push({
    id: 'page-design-system',
    type: 'pattern',
    title: 'Design System',
    description: 'Skyra Platform design tokens and visual foundations.',
    href: '/design-system',
    keywords: ['tokens', 'colors', 'typography', 'spacing', 'radius'],
  });

  documents.push({
    id: 'page-accessibility',
    type: 'accessibility',
    title: 'Accessibility Documentation',
    description: 'Skyra Platform accessibility principles, Axe-Core audits, and ARIA guidelines.',
    href: '/accessibility',
    keywords: ['a11y', 'keyboard', 'focus', 'aria', 'screen reader'],
  });

  documents.push({
    id: 'page-responsive',
    type: 'responsive',
    title: 'Responsive Documentation',
    description: 'Skyra Platform responsive viewports and mobile-first guidelines.',
    href: '/responsive',
    keywords: ['breakpoints', 'mobile', 'tablet', 'desktop'],
  });

  documents.push({
    id: 'page-releases',
    type: 'pattern',
    title: 'Releases & Changelog',
    description: 'Platform versioning, lifecycle, changesets, and release history.',
    href: '/releases',
    keywords: ['changelog', 'release', 'version', 'updates', 'history'],
  });

  // Canonical Component Documentation
  documents.push({
    id: 'page-components',
    type: 'pattern',
    title: 'Components',
    description: 'Canonical documentation for all Skyra Platform Web Components.',
    href: '/components',
    keywords: ['web component', 'custom element', 'framework-independent'],
  });

  documents.push({
    id: 'component-button',
    type: 'foundation',
    title: 'Button',
    description: 'Framework-independent button Web Component. 6 variants, 3 sizes, loading, icon support.',
    href: '/components/basic-controls/button',
    keywords: ['button', 'skyra-tech-button', '@skyra-tech-platform/button', 'Basic Controls', 'primary', 'orange', 'outline', 'ghost', 'danger', 'link', 'loading', 'disabled', 'icon-only', 'web component'],
  });

  documents.push({
    id: 'component-input',
    type: 'foundation',
    title: 'Input',
    description: 'Framework-independent input Web Component. Variants, sizes, icons, validation, formatters.',
    href: '/components/basic-controls/input',
    keywords: ['input', 'skyra-tech-input', '@skyra-tech-platform/input', 'Basic Controls', 'text', 'password', 'number', 'search', 'email', 'tel', 'url', 'validation', 'web component'],
  });

  documents.push({
    id: 'component-textarea',
    type: 'foundation',
    title: 'Textarea',
    description: 'Framework-independent textarea Web Component. Auto-resizing, validation, character counting.',
    href: '/components/basic-controls/textarea',
    keywords: ['textarea', 'text area', 'form textarea', 'skyra-tech-textarea', '@skyra-tech-platform/textarea', 'Basic Controls', 'auto-resize', 'validation', 'web component'],
  });

  documents.push({
    id: 'component-checkbox',
    type: 'foundation',
    title: 'Checkbox',
    description: 'Framework-independent checkbox component for multiple-choice selections.',
    href: '/components/basic-controls/checkbox',
    keywords: ['checkbox', 'skyra-tech-checkbox', '@skyra-tech-platform/checkbox', 'Basic Controls', 'multiple-choice', 'indeterminate', 'web component'],
  });

  documents.push({
    id: 'component-radio',
    type: 'foundation',
    title: 'Radio',
    description: 'Framework-independent radio component for mutually exclusive selections.',
    href: '/components/basic-controls/radio',
    keywords: ['radio', 'skyra-tech-radio', '@skyra-tech-platform/radio', 'Basic Controls', 'exclusive', 'group', 'web component'],
  });

  documents.push({
    id: 'component-switch',
    type: 'foundation',
    title: 'Switch',
    description: 'Framework-independent toggle switch component.',
    href: '/components/basic-controls/switch',
    keywords: ['switch', 'skyra-tech-switch', '@skyra-tech-platform/switch', 'Basic Controls', 'toggle', 'web component'],
  });

  documents.push({
    id: 'component-dynamic-select',
    type: 'foundation',
    title: 'Dynamic Select',
    description: 'Framework-independent single/multi select Web Component with search and chip display.',
    href: '/components/selection/dynamic-select',
    keywords: ['select', 'dynamic-select', 'dropdown', 'skyra-tech-dynamic-select', '@skyra-tech-platform/dynamic-select', 'Selection', 'web component'],
  });

  documents.push({
    id: 'component-date-time',
    type: 'foundation',
    title: 'Date & Time Suite',
    description: 'Complete ISO-compliant date & time suite with calendar popovers.',
    href: '/components/forms/date-time',
    keywords: ['date', 'time', 'calendar', 'date-range', 'skyra-tech-date-field', '@skyra-tech-platform/date-time', 'Forms', 'web component'],
  });

  documents.push({
    id: 'component-qr',
    type: 'foundation',
    title: 'QR Code',
    description: 'Framework-independent QR generation and styled rendering Web Component.',
    href: '/components/qr',
    keywords: ['qr', 'qrcode', 'qr-code', 'skyra-tech-qr-code', '@skyra-tech-platform/qr', 'web component', 'svg'],
  });

  // Releases
  if (registry.getReleases) {
    for (const release of registry.getReleases()) {
      documents.push({
        id: release.id,
        type: 'release',
        title: `Release ${release.version}`,
        description: release.summary || 'Release notes and changelog',
        href: `/releases#${release.id}`,
        keywords: [release.version, 'release'],
      });

      for (const pkg of release.packages) {
        for (const change of pkg.changes) {
          documents.push({
            id: change.id,
            type: 'change',
            title: change.title,
            description: change.description,
            packageId: pkg.packageId,
            href: `/releases#${release.id}`,
            keywords: [change.type, pkg.packageId, release.version, change.breaking ? 'breaking change' : ''],
          });
        }
      }
    }
  }

  return documents;
}

/**
 * Searches a flat index of SearchDocuments.
 */
export function searchDocumentation(query: string, index: SearchDocument[]): SearchDocument[] {
  if (!query || query.trim() === '') {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const tokens = normalizedQuery.split(/\s+/);

  // Scoring function
  const scoreResult = (doc: SearchDocument): number => {
    let score = 0;
    const title = doc.title.toLowerCase();
    const id = doc.id.toLowerCase();
    const desc = doc.description?.toLowerCase() || '';
    const content = doc.content?.toLowerCase() || '';
    const kw = doc.keywords?.join(' ').toLowerCase() || '';

    // Exact title match gets highest priority
    if (title === normalizedQuery) {
      score += 100;
    } 
    // Prefix title match
    else if (title.startsWith(normalizedQuery)) {
      score += 50;
    }
    // Partial title match
    else if (title.includes(normalizedQuery)) {
      score += 20;
    }

    // Exact ID match
    if (id === normalizedQuery || id.endsWith(`::${normalizedQuery}`)) {
      score += 80;
    } else if (id.includes(normalizedQuery)) {
      score += 15;
    }

    // Match each token
    for (const token of tokens) {
      if (title.includes(token)) score += 5;
      if (id.includes(token)) score += 5;
      if (kw.includes(token)) score += 3;
      if (desc.includes(token)) score += 2;
      if (content.includes(token)) score += 1;
    }

    return score;
  };

  const scoredResults = index
    .map(doc => ({ doc, score: scoreResult(doc) }))
    .filter(res => res.score > 0)
    .sort((a, b) => b.score - a.score);

  return scoredResults.map(res => res.doc);
}
