import Feature from "ol/Feature";
import { getCategoryColor } from "../../utils/categoryColors";

const CLUSTER_TOOLTIP_TOP_CATEGORIES = 5;

const COMPACT_CARD_CTA = "Click the marker for more.";
const CLUSTER_CTA = "Click the cluster to explore.";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** OCC_DATE is ArcGIS epoch ms; fall back to OCC_* parts when missing or invalid. */
function formatWhen(feature: Feature): string {
  const occDate = feature.get("OCC_DATE") as number | undefined;

  if (occDate != null && Number.isFinite(occDate)) {
    const d = new Date(occDate);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, { dateStyle: "medium" });
    }
  }
  const year = String(feature.get("OCC_YEAR") ?? "").trim();
  const month = String(feature.get("OCC_MONTH") ?? "").trim();
  const day = String(feature.get("OCC_DAY") ?? "").trim();
  const hour = String(feature.get("OCC_HOUR") ?? "").trim();
  const dow = String(feature.get("OCC_DOW") ?? "").trim();
  const parts = [
    dow,
    year && month && day ? `${year}-${month}-${day}` : "",
    hour,
  ]
    .filter(Boolean)
    .join(" · ");
  return parts.trim();
}

/** Compact hover card: classification, when, offence, click hint. */
export function compactMarkerTooltipHtml(
  feature: Feature,
  categoryColorMap: Record<string, string>,
): string {
  const categoryRaw = feature.get("CSI_CATEGORY") as string | undefined;
  const category = categoryRaw?.trim() || "Unknown";
  const color = getCategoryColor(categoryColorMap, category);
  const offence = String(feature.get("OFFENCE") ?? "").trim();
  const whenText = formatWhen(feature);

  const offenceBlock = offence
    ? `<div class="line-clamp-2 text-[0.7rem] leading-snug text-white/85">${escapeHtml(offence)}</div>`
    : "";

  const whenBlock = whenText
    ? `<div class="text-[0.7rem] text-white/65">${escapeHtml(whenText)}</div>`
    : "";

  return `
    <div class="max-w-52 shrink-0 rounded border border-white/10 bg-white/5 px-2 py-1.5">
      <div class="flex min-w-0 items-start gap-1.5">
        <span class="mt-0.5 h-2 w-2 shrink-0 rounded-full" style="background-color:${escapeHtml(color)}"></span>
        <div class="min-w-0 flex-1 space-y-0.5">
          <div class="text-[0.75rem] font-medium leading-tight text-white">${escapeHtml(category)}</div>
          ${whenBlock}
          ${offenceBlock}
          <div class="border-t border-white/10 pt-1 text-[0.65rem] italic text-white/45">${escapeHtml(COMPACT_CARD_CTA)}</div>
        </div>
      </div>
    </div>`;
}

/** Horizontal row of compact cards for multiple incidents at the same coordinates. */
export function multiSameSpotTooltipHtml(
  features: Feature[],
  categoryColorMap: Record<string, string>,
): string {
  const cards = features
    .map((f) => compactMarkerTooltipHtml(f, categoryColorMap))
    .join("");
  return `
    <div class="pointer-events-auto -mx-1 min-w-0 max-w-full touch-pan-x overflow-x-auto overflow-y-visible py-0.5">
      <div class="flex w-max flex-row gap-2 px-1">${cards}</div>
    </div>`;
}

/** Category counts for spread clusters; expects `category` on each feature. */
export function clusterTooltipHtml(
  clusterFeatures: Feature[],
  categoryColorMap: Record<string, string>,
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
        <span class="flex min-w-0 items-center gap-2 leading-tight">
          <span class="text-white">${escapeHtml(r.category)}</span>-
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
  return `<div class="min-w-0 max-w-60 space-y-1.5">
    <ul class="m-0 list-none space-y-0.5 p-0 text-sm">${items}${more}</ul>
    <p class="m-0 border-t border-white/10 pt-1.5 text-[0.65rem] italic text-white/45">${escapeHtml(CLUSTER_CTA)}</p>
  </div>`;
}
