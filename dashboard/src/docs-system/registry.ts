import type { DocumentationRegistry, PackageMetadata, CapabilityMetadata, ApiMetadata, ExampleMetadata } from './metadata';

/**
 * In-memory foundation registry for the Documentation System.
 * In later phases, this may be hydrated via static build-time output.
 */
export class Registry {
  private historicalApis: Record<string, ApiMetadata> = {};
  private historicalExamples: Record<string, ExampleMetadata> = {};
  private store: DocumentationRegistry = {
    packages: {},
    capabilities: {},
    apis: {},
    examples: {},
    tokens: {},
    foundations: {},
    releases: {}
  };

  /**
   * Register a new package into the documentation system.
   */
  public registerPackage(pkg: PackageMetadata) {
    this.store.packages[pkg.id] = pkg;
  }

  /**
   * Register a capability module under a package.
   */
  public registerCapability(capability: CapabilityMetadata) {
    this.store.capabilities[capability.id] = capability;
  }

  /**
   * Register an API/Component.
   */
  public registerApi(api: ApiMetadata) {
    this.store.apis[api.id] = api;
  }

  /**
   * Register an executable example definition.
   */
  public registerHistoricalApi(api: ApiMetadata) {
    this.historicalApis[api.id] = api;
  }

  public registerHistoricalExample(example: ExampleMetadata) {
    this.historicalExamples[example.id] = example;
  }

  public registerExample(example: ExampleMetadata) {
    this.store.examples[example.id] = example;
  }

  /**
   * Register a design token.
   */
  public registerToken(token: any) {
    this.store.tokens[token.id] = token;
  }

  /**
   * Register a design foundation group.
   */
  public registerFoundation(foundation: any) {
    this.store.foundations[foundation.category] = foundation;
  }

  /**
   * Register a release.
   */
  public registerRelease(release: any) {
    this.store.releases[release.id] = release;
  }

  /**
   * Retrieve all registered packages.
   */
  public getPackages(): PackageMetadata[] {
    return Object.values(this.store.packages);
  }

  /**
   * Retrieve a specific package by ID.
   */
  public getPackage(id: string): PackageMetadata | undefined {
    return this.store.packages[id];
  }

  /**
   * Retrieve all capabilities for a given package.
   */
  public getCapabilitiesForPackage(packageId: string): CapabilityMetadata[] {
    return Object.values(this.store.capabilities).filter(c => c.packageId === packageId);
  }

  /**
   * Retrieve all capabilities.
   */
  public getCapabilities(): CapabilityMetadata[] {
    return Object.values(this.store.capabilities);
  }

  /**
   * Retrieve a capability by ID.
   */
  public getCapability(id: string): CapabilityMetadata | undefined {
    return this.store.capabilities[id];
  }

  /**
   * Retrieve all APIs for a given package.
   */
  public getApisForPackage(packageId: string): ApiMetadata[] {
    return this.getCurrentApis().filter(a => a.packageId === packageId);
  }

  /**
   * Retrieve all APIs.
   */
  public getApis(): ApiMetadata[] {
    return [...this.getCurrentApis(), ...this.getHistoricalApis().filter(api => !this.store.apis[api.id])];
  }

  /**
   * Retrieve a specific API.
   */
  public getCurrentApis(): ApiMetadata[] { return Object.values(this.store.apis); }
  public getHistoricalApis(): ApiMetadata[] { return Object.values(this.historicalApis); }
  public getHistoricalApi(id: string): ApiMetadata | undefined { return this.historicalApis[id]; }

  public getApi(id: string): ApiMetadata | undefined {
    return this.store.apis[id] ?? this.historicalApis[id];
  }

  public findApiForRoute(slug: string, capability: string, name: string): ApiMetadata | undefined {
    const records = this.getApis();
    return records.find(api => api.name === name && api.packageId.split('/').pop() === slug && api.capabilityId.split('/')[1] === capability)
      ?? records.find(api => api.name === name && api.capabilityId === slug + '/' + capability);
  }

  /**
   * Retrieve all examples for a given API.
   */
  public getExamplesForApi(apiId: string): ExampleMetadata[] {
    return this.store.apis[apiId]
      ? Object.values(this.store.examples).filter(e => e.apiId === apiId)
      : this.getHistoricalExamplesForApi(apiId);
  }

  public getHistoricalExamplesForApi(apiId: string): ExampleMetadata[] {
    return Object.values(this.historicalExamples).filter(e => e.apiId === apiId);
  }

  /**
   * Retrieve all tokens.
   */
  public getTokens() {
    return Object.values(this.store.tokens);
  }

  /**
   * Retrieve tokens by category.
   */
  public getTokensByCategory(category: string) {
    return Object.values(this.store.tokens).filter(t => t.category === category);
  }

  /**
   * Retrieve all foundations.
   */
  public getFoundations() {
    return Object.values(this.store.foundations);
  }

  /**
   * Retrieve all releases.
   */
  public getReleases() {
    return Object.values(this.store.releases);
  }

  /**
   * Retrieve a specific release by ID.
   */
  public getRelease(id: string) {
    return this.store.releases[id];
  }
}

export const docsRegistry = new Registry();
