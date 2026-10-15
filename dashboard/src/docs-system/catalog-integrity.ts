import type { ApiMetadata, ExampleMetadata, CapabilityMetadata } from './metadata';
import { API_TARGETS } from './catalog-targets';

export interface CatalogBundle {
  current: ApiMetadata[];
  historical: ApiMetadata[];
  examples: ExampleMetadata[];
  historicalExamples: ExampleMetadata[];
  capabilities: Pick<CapabilityMetadata, 'id' | 'packageId' | 'catalogState' | 'apis'>[];
  behavioralIds: string[];
  historicalBehavioralIds: string[];
  unboundHistoricalBehaviorIds: string[];
  releaseApiIds: string[];
}

export function validateCatalogIntegrity(data: CatalogBundle) {
  const current = new Map(data.current.map(api => [api.id, api]));
  const historical = new Map(data.historical.map(api => [api.id, api]));
  const capabilities = new Map(data.capabilities.map(cap => [cap.id, cap]));
  if (current.size !== data.current.length || historical.size !== data.historical.length) throw new Error('Duplicate catalog identity');
  for (const api of data.current) {
    const target = API_TARGETS.find(target => target.exportPath === api.exportPath);
    if (api.catalogState !== 'current' || api.historyReason !== undefined || !target || target.packageId !== api.packageId
      || target.entry !== api.declarationPath || api.id !== api.exportPath + '::' + api.name
      || target.capabilityId !== api.capabilityId) throw new Error('Invalid current API identity ' + api.id);
    const cap = capabilities.get(api.capabilityId);
    if (!cap || cap.catalogState === 'historical' || cap.packageId !== api.packageId) throw new Error('Invalid current capability join ' + api.id);
    for (const related of api.related) if (!current.has(related)) throw new Error('Unknown related current API ' + related);
  }
  for (const api of data.historical) {
    if (api.catalogState !== 'historical' || !['superseded', 'retired-package', 'unresolved-symbol'].includes(api.historyReason || '')) throw new Error('Unclassified historical API ' + api.id);
  }
  for (const cap of data.capabilities) for (const id of cap.apis) {
    const api = cap.catalogState === 'historical' ? historical.get(id) : current.get(id);
    if (!api || api.capabilityId !== cap.id || api.packageId !== cap.packageId) throw new Error('Invalid capability membership ' + id);
  }
  const exampleIds = new Set<string>();
  for (const example of data.examples) {
    const api = current.get(example.apiId || '');
    if (exampleIds.has(example.id) || example.catalogState !== 'current' || !api || api.packageId !== example.packageId
      || api.capabilityId !== example.capabilityId) throw new Error('Invalid current example ' + example.id);
    exampleIds.add(example.id);
  }
  for (const example of data.historicalExamples) {
    const api = historical.get(example.apiId || '');
    if (example.catalogState !== 'historical' || !api) throw new Error('Invalid historical example ' + example.id);
    if (example.packageId !== api.packageId && example.historyReason !== 'original-join-mismatch') throw new Error('Unclassified original example mismatch ' + example.id);
  }
  for (const id of data.behavioralIds) if (!current.has(id)) throw new Error('Unknown current behavioral API ' + id);
  for (const id of data.historicalBehavioralIds) {
    if (!historical.has(id) && !data.unboundHistoricalBehaviorIds.includes(id)) throw new Error('Unclassified historical behavior ' + id);
  }
  for (const id of data.unboundHistoricalBehaviorIds) {
    if (historical.has(id) || !data.historicalBehavioralIds.includes(id)) throw new Error('Invalid unbound behavior quarantine ' + id);
  }
  for (const id of data.releaseApiIds) if (!current.has(id) && !historical.has(id)) throw new Error('Unknown release API ' + id);
}
