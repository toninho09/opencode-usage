import { formatResetLine } from "../../shared/formatting";
import { createUsedProgressBar, boxHeader } from "../../shared/utils";
import type {
  CodexAdditionalRateLimit,
  CodexRateLimitDetails,
  CodexRateLimitWindow,
  CodexUsageResponse,
} from "./types";

export class CodexFormatter {
  private formatWindowLine(label: string, window: CodexRateLimitWindow | null | undefined): string {
    if (!window) {
      return `  ${label.padEnd(16)} N/A`;
    }

    const percentUsed = Math.round(window.used_percent);
    const progressBar = createUsedProgressBar(percentUsed, 20);
    return `  ${label.padEnd(16)} ${progressBar} ${percentUsed}%`;
  }

  private formatMainRateLimits(rateLimit: CodexRateLimitDetails | null | undefined): string[] {
    if (!rateLimit) {
      return ["  Rate Limits:     N/A"];
    }

    const lines: string[] = [];
    lines.push(this.formatWindowLine("Primary:", rateLimit.primary_window));
    lines.push(this.formatWindowLine("Secondary:", rateLimit.secondary_window));

    if (rateLimit.primary_window?.reset_at) {
      lines.push("  " + formatResetLine("Primary Resets:", rateLimit.primary_window.reset_at * 1000, 16));
    }

    if (rateLimit.secondary_window?.reset_at) {
      lines.push("  " + formatResetLine("Secondary Resets:", rateLimit.secondary_window.reset_at * 1000, 16));
    }

    return lines;
  }

  private formatAdditionalLimit(limit: CodexAdditionalRateLimit): string[] {
    const lines: string[] = [];
    lines.push(`  ${limit.limit_name}`);

    const primary = limit.rate_limit?.primary_window;
    lines.push("    " + this.formatWindowLine("Primary:", primary).trim());

    if (primary?.reset_at) {
      lines.push(
        "    " + formatResetLine("Resets:", primary.reset_at * 1000, 12).trim(),
      );
    }

    return lines;
  }

  format(data: CodexUsageResponse): string {
    const lines: string[] = [];

    lines.push(boxHeader("GPT CODEX", 80));
    lines.push(`  Plan:            ${data.plan_type.toUpperCase()}`);
    lines.push(...this.formatMainRateLimits(data.rate_limit));

    if (data.credits) {
      const creditLabel = data.credits.unlimited
        ? "Unlimited"
        : (data.credits.balance ?? "N/A");
      lines.push(`  Credits:         ${creditLabel}`);
    }

    const additional = data.additional_rate_limits ?? [];
    if (additional.length > 0) {
      lines.push("\n  Additional Limits:");
      lines.push(`  ${"─".repeat(76)}`);
      additional.forEach((limit) => {
        lines.push(...this.formatAdditionalLimit(limit));
      });
    }

    return lines.join("\n");
  }

  formatError(error: string): string {
    const lines: string[] = [];
    lines.push(boxHeader("GPT CODEX", 80));
    lines.push(`  Error:           ${error}`);
    lines.push("  Hint:            reconnect OpenAI provider if token expired");
    return lines.join("\n");
  }
}
