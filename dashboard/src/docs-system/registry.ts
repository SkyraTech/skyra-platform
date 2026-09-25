import type { DocumentationRegistry, PackageMetadata, CapabilityMetadata, ApiMetadata, ExampleMetadata } from './metadata';

/**
 * In-memory foundation registry for the Documentation System.
 * In later phases, this may be hydrated via static build-time output.
 */
class Registry {
  private store: DocumentationRegistry = {
    packages: {},
    capabilities: {},
    apis: {},
    examples: {}
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
  public registerExample(example: ExampleMetadata) {
    this.store.examples[example.id] = example;
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
   * Retrieve all APIs for a given package.
   */
  public getApisForPackage(packageId: string): ApiMetadata[] {
    return Object.values(this.store.apis).filter(a => a.packageId === packageId);
  }

  /**
   * Retrieve a specific API.
   */
  public getApi(id: string): ApiMetadata | undefined {
    return this.store.apis[id];
  }
}

export const docsRegistry = new Registry();
