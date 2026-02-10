/**
 * Common interface for all usage monitoring providers
 */
export interface UsageProvider {
  /**
   * Display name of provider (e.g., "GitHub Copilot")
   */
  readonly name: string;

  /**
   * Unique provider ID for internal use (e.g., "copilot")
   */
  readonly id: string;

  /**
   * Brief description of provider
   */
  readonly description: string;

  /**
   * Fetches usage data from provider API
   * @returns ProviderMessage with formatted content or null if not configured
   */
  getUsageData(): Promise<ProviderMessage | null>;

  /**
   * Checks if provider is configured in auth file
   * @returns true if provider is configured and ready to use
   */
  isConfigured(): boolean;
}

/**
 * Message returned by provider with formatted usage data
 */
export interface ProviderMessage {
  /**
   * Formatted content for display to user
   */
  readonly content: string;

  /**
   * Error message if any problem occurred (optional)
   */
  readonly error?: string;
}
