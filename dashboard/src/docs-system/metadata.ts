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
  
  // Phase 10.5 Metadata
  design?: ComponentDesignMetadata;
  accessibility?: AccessibilityMetadata;
  responsive?: ResponsiveMetadata;
}

export type TokenCategory = 'color' | 'typography' | 'spacing' | 'radius' | 'shadow' | 'motion' | 'breakpoint' | 'z-index' | 'other';

export interface TokenMetadata {
  id: string; // e.g. '--skyra-primary'
  name: string;
  value: string;
  darkValue?: string;
  category: TokenCategory;
  description?: string;
  source: string; // e.g. '@skyra/design-tokens'
}

export interface DesignFoundationMetadata {
  category: TokenCategory;
  title: string;
  description: string;
  tokens: string[]; // references TokenMetadata ids
}

export interface AccessibilityMetadata {
  semanticStructure?: string;
  keyboard?: string[];
  focus?: string;
  aria?: string;
  screenReader?: string;
  reducedMotion?: string;
  contrast?: string;
  touchTarget?: string;
}

export interface ResponsiveMetadata {
  breakpointsSupported: string[]; // e.g. ['320', '375', '640', '768']
  mobileBehavior?: string;
  tabletBehavior?: string;
  desktopBehavior?: string;
}

export interface ComponentDesignMetadata {
  variants?: string[];
  states?: string[]; // e.g. ['hover', 'focus', 'disabled', 'loading', 'error']
  rationale?: string;
  dos?: string[];
  donts?: string[];
}

export interface ExampleMetadata {
  id: string;
  title: string;
  source: string;
  language: string;
  entry?: string;
  packageId?: string;
  capabilityId?: string;
  apiId?: string;
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

export interface ReleaseChange {
  id: string;
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  title: string;
  description?: string;
  breaking?: boolean;
  apiIds?: string[];
  migrationGuide?: string;
}

export interface ReleasePackageChange {
  packageId: string;
  packageName: string;
  version?: string;
  changes: ReleaseChange[];
}

export interface ReleaseMetadata {
  id: string;
  version: string;
  date?: string;
  packages: ReleasePackageChange[];
  summary?: string;
  breaking?: boolean;
  migrationGuide?: string;
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
  tokens: Record<string, TokenMetadata>;
  foundations: Record<string, DesignFoundationMetadata>;
  releases: Record<string, ReleaseMetadata>;
}

