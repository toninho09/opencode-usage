import type { UsageProvider } from "./base";
import { copilotProvider } from "./copilot";
import { claudeProvider } from "./claude";
import { zaiProvider } from "./zai";

/**
 * Centralized registry of all usage providers
 */
export class ProviderRegistry {
  private providers: Map<string, UsageProvider> = new Map();

  /**
   * Registers a new provider
   */
  register(provider: UsageProvider): void {
    this.providers.set(provider.id, provider);
  }

  /**
   * Returns all registered providers
   */
  getAll(): UsageProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Returns a specific provider by ID
   */
  getById(id: string): UsageProvider | undefined {
    return this.providers.get(id);
  }

  /**
   * Returns all configured providers
   */
  getConfigured(): UsageProvider[] {
    return this.getAll().filter((provider) => provider.isConfigured());
  }

  /**
   * Checks if any provider is configured
   */
  hasConfigured(): boolean {
    return this.getConfigured().length > 0;
  }
}

// Creates singleton instance of registry
export const registry = new ProviderRegistry();

// Auto-registers all providers
registry.register(copilotProvider);
registry.register(claudeProvider);
registry.register(zaiProvider);

export default registry;
