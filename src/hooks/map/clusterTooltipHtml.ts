import Feature from "ol/Feature";
import { getCategoryColor } from "../../utils/categoryColors";

const CLUSTER_TOOLTIP_TOP_CATEGORIES = 5;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Tooltip rows mirror SummaryDrawer: color dot + category + count (expects `category` on each feature). */
export function clusterTooltipHtml(
  clusterFeatures: Feature[],
  categoryColorMap: Record<string, string>
): string {
  const counts = new Map<string, number>();
  for (const f of clusterFeatures) {
    const raw = f.get("category") as string | undefined;
    const category = raw?.trim() || "Unknown";
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  const rows = [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
  const top = rows.slice(0, CLUSTER_TOOLTIP_TOP_CATEGORIES);
  const remainingCategories = rows.length - top.length;
  const items = top
    .map((r) => {
      const color = getCategoryColor(categoryColorMap, r.category);
      return `
      <li class="flex flex-row items-center gap-3 py-0.5">
        <span class="h-3.5 w-3.5 shrink-0 rounded-full" style="background-color:${color}"></span>
        <span class="flex min-w-0 items-center leading-tight gap-2">
          <span class=" text-white">${escapeHtml(r.category)}</span>-
          <span class="font-bold text-white">${r.count}</span>
        </span>
      </li>`;
    })
    .join("");
  const more =
    remainingCategories > 0
      ? `<li class="py-0.5 pl-8 text-sm text-white/70 italic">+${remainingCategories} more ${
          remainingCategories === 1 ? "category" : "categories"
        }</li>`
      : "";
  return `<ul class="m-0 list-none space-y-0.5 p-0 text-sm">${items}${more}</ul>`;
}
