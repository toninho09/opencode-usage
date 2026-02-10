import { formatResetLine } from "../../shared/formatting";
import { createUsedProgressBar } from "../../shared/utils";
import type { CopilotUsageResponse, QuotaDetail } from "./types";

export class CopilotFormatter {
  /**
   * Formats a Copilot quota line with progress bar
   */
  private formatQuotaLine(name: string, quota: QuotaDetail | undefined): string {
    if (!quota) {
      return "";
    }

    if (quota.unlimited) {
      return `${name.padEnd(16)} Unlimited`;
    }

    const total = quota.entitlement;
    const used = total - quota.remaining;
    const percentUsed = Math.round((used / total) * 100);
    const progressBar = createUsedProgressBar(percentUsed, 20);

    return `${name.padEnd(16)} ${progressBar} ${percentUsed}% (${used}/${total})`;
  }

  /**
   * Formats Copilot usage data for display
   */
  format(data: CopilotUsageResponse): string {
    const lines: string[] = [];

    lines.push("╔════════════════════════════════════════╗");
    lines.push("║         GITHUB COPILOT                 ║");
    lines.push("╚════════════════════════════════════════╝");
    lines.push(`Plan:            ${data.copilot_plan}`);

    const premium = data.quota_snapshots.premium_interactions;
    if (premium) {
      const premiumLine = this.formatQuotaLine("Premium:", premium);
      if (premiumLine) {
        lines.push(premiumLine);
      }
    }

    const chat = data.quota_snapshots.chat;
    if (chat) {
      const chatLine = this.formatQuotaLine("Chat:", chat);
      if (chatLine) {
        lines.push(chatLine);
      }
    }

    const completions = data.quota_snapshots.completions;
    if (completions) {
      const completionsLine = this.formatQuotaLine("Completions:", completions);
      if (completionsLine) {
        lines.push(completionsLine);
      }
    }

    lines.push(formatResetLine("Quota Resets:", data.quota_reset_date, 16));

    return lines.join("\n");
  }
}
