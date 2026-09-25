export type LifecycleStatus = 'experimental' | 'stable' | 'deprecated' | 'removed';

export interface PackageMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  status: LifecycleStatus;
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  exports: string[];
}

export interface ApiPropertyMetadata {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
  status?: LifecycleStatus;
}

export interface ApiMetadata {
  id: string;
  name: string;
  packageId: string;
  description: string;
  status: LifecycleStatus;
  properties: ApiPropertyMetadata[];
  related: string[];
}

export interface ExampleMetadata {
  id: string;
  title: string;
  source: string;
  language: string;
  entry?: string;
}

export interface CapabilityMetadata {
  id: string;
  name: string;
  packageId: string;
  description: string;
  apis: string[]; // references ApiMetadata ids
}

/**
 * Foundation definition for the Documentation Registry structure.
 * This ensures strict typing across the Phase 10 implementation.
 */
export interface DocumentationRegistry {
  packages: Record<string, PackageMetadata>;
  capabilities: Record<string, CapabilityMetadata>;
  apis: Record<string, ApiMetadata>;
  examples: Record<string, ExampleMetadata>;
}
