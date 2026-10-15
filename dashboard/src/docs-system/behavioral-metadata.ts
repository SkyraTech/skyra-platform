import type { ApiMetadata } from './metadata';

// No historical behavioral claims have been verified for current declaration symbols.
export const behavioralMetadataMap: Record<string, Pick<ApiMetadata, 'design' | 'accessibility' | 'responsive'>> = {};
