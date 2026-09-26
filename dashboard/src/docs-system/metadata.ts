export type LifecycleStatus = 'experimental' | 'stable' | 'deprecated' | 'removed';

export type RuntimeCategory =
  | 'runtime-neutral'
  | 'react-browser'
  | 'design-tokens'
  | 'mixed';

export interface PackageMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  status: LifecycleStatus;
  runtime: RuntimeCategory;
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  optionalPeerDependencies?: string[];
  exports: string[];
}

export type ApiKind = 'component' | 'function' | 'interface' | 'type' | 'constant' | 'enum';

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
  capabilityId: string;
  exportPath: string;
  kind: ApiKind;
  description: string;
  status: LifecycleStatus;
  deprecation?: {
    reason?: string;
    replacement?: string;
  };
  signature?: string;
  properties: ApiPropertyMetadata[];
  returnType?: string;
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
  /** The export path for this capability, e.g. '@skyra/qr/core' */
  exportPath: string;
  runtime: RuntimeCategory;
  /** Short usage note or code hint */
  usageNote?: string;
  limitations?: string[];
  related?: string[]; // ids of related capabilities
  status?: LifecycleStatus;
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
