/**
 * Minimal type declaration for jest-axe@9 which ships no bundled .d.ts.
 * This file avoids the need for @ts-ignore in test-setup.ts.
 *
 * Kept as narrow as possible: only `toHaveNoViolations` and `axe` are declared
 * because those are the only APIs used in this package's test suite.
 *
 * If jest-axe ever ships its own types (or a @types/jest-axe package becomes
 * available), this file can be removed.
 */
declare module 'jest-axe' {
  /** Generic representation of an axe-core accessibility violation result. */
  export interface AxeViolation {
    id: string;
    impact: string | null;
    description: string;
    help: string;
    helpUrl: string;
    nodes: unknown[];
    tags: string[];
  }

  /** Subset of the axe-core Results object returned by jest-axe. */
  export interface AxeResults {
    violations: AxeViolation[];
    passes: unknown[];
    incomplete: unknown[];
    inapplicable: unknown[];
    url: string;
    timestamp: string;
  }

  /**
   * Matcher object to be passed to `expect.extend()`.
   * Usage: expect.extend(toHaveNoViolations);
   */
  export const toHaveNoViolations: {
    toHaveNoViolations(received: AxeResults): {
      message(): string;
      pass: boolean;
    };
  };

  /**
   * Runs axe-core against the provided HTML element or string.
   */
  export function axe(
    html: Element | string,
    options?: Record<string, unknown>,
  ): Promise<AxeResults>;

  /**
   * Configures axe with global options.
   */
  export function configureAxe(
    options?: Record<string, unknown>,
  ): typeof axe;
}
