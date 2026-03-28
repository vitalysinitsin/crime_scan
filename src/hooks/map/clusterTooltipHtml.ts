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

function formatCoordinate(n: number): string {
  return Number.isFinite(n) ? n.toFixed(5) : "";
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

function neighbourhoodLabel(feature: Feature): string {
  const n158 = String(feature.get("NEIGHBOURHOOD_158") ?? "").trim();
  if (n158) return n158;
  const n140 = String(feature.get("NEIGHBOURHOOD_140") ?? "").trim();
  if (n140) return n140;
  const h158 = String(feature.get("HOOD_158") ?? "").trim();
  if (h158) return h158;
  return String(feature.get("HOOD_140") ?? "").trim();
}

function detailSection(title: string, rowsHtml: string): string {
  if (!rowsHtml.trim()) return "";
  return `
    <div class="space-y-1.5">
      <div class="text-[0.65rem] font-semibold uppercase tracking-wide text-white/50">${escapeHtml(title)}</div>
      <div class="space-y-1">${rowsHtml}</div>
    </div>`;
}

function detailRow(label: string, value: string): string {
  const v = value.trim();
  if (!v) return "";
  return `
    <div class="min-w-0">
      <div class="text-[0.65rem] text-white/55">${escapeHtml(label)}</div>
      <div class="max-h-24 overflow-y-auto leading-snug text-white">${escapeHtml(v)}</div>
    </div>`;
}

/** One detailed incident card (classification, when, where, record). */
export function detailedMarkerTooltipHtml(
  feature: Feature,
  categoryColorMap: Record<string, string>,
): string {
  const categoryRaw = feature.get("CSI_CATEGORY") as string | undefined;
  const category = categoryRaw?.trim() || "Unknown";
  const color = getCategoryColor(categoryColorMap, category);

  const offence = String(feature.get("OFFENCE") ?? "");
  const ucrCode = String(feature.get("UCR_CODE") ?? "").trim();
  const ucrExt = String(feature.get("UCR_EXT") ?? "").trim();
  const ucr =
    ucrCode && ucrExt
      ? `${ucrCode} (${ucrExt})`
      : ucrCode || ucrExt
        ? `${ucrCode}${ucrExt}`
        : "";

  const classificationRows = [
    `<div class="flex min-w-0 items-start gap-2">
      <span class="mt-1 h-3 w-3 shrink-0 rounded-full" style="background-color:${escapeHtml(color)}"></span>
      <div class="min-w-0 flex-1 space-y-1">
        <div class="leading-snug font-medium text-white">${escapeHtml(category)}</div>
        ${offence.trim() ? detailRow("Offence", offence) : ""}
        ${ucr ? detailRow("UCR", ucr) : ""}
      </div>
    </div>`,
  ].join("");

  const whenText = formatWhen(feature);
  const whenRows = whenText ? detailRow("Occurred", whenText) : "";

  const locType = String(feature.get("LOCATION_TYPE") ?? "").trim();
  const premType = String(feature.get("PREMISES_TYPE") ?? "").trim();
  const hood = neighbourhoodLabel(feature);
  const lat = feature.get("LAT_WGS84") as number | undefined;
  const lon = feature.get("LONG_WGS84") as number | undefined;
  const latLon =
    lat != null && lon != null && Number.isFinite(lat) && Number.isFinite(lon)
      ? `${formatCoordinate(lat)}, ${formatCoordinate(lon)}`
      : "";

  const whereRows = [
    detailRow("Location type", locType),
    detailRow("Premises", premType),
    detailRow("Neighbourhood", hood),
    latLon ? detailRow("Coordinates", latLon) : "",
  ].join("");

  const eventId = String(feature.get("EVENT_UNIQUE_ID") ?? "").trim();
  const division = String(feature.get("DIVISION") ?? "").trim();
  const recordRows = [
    detailRow("Event ID", eventId),
    detailRow("Division", division),
  ].join("");

  const sections = [
    detailSection("Classification", classificationRows),
    detailSection("When", whenRows),
    detailSection("Where", whereRows),
    detailSection("Record", recordRows),
  ].join("");

  return `
    <div class="min-w-56 max-w-xs shrink-0 rounded-md border border-white/10 bg-white/5 p-2.5">
      <div class="flex flex-col gap-3 text-sm">${sections}</div>
    </div>`;
}

/** Horizontal row of detailed cards for multiple incidents at the same coordinates. */
export function multiSameSpotTooltipHtml(
  features: Feature[],
  categoryColorMap: Record<string, string>,
): string {
  const cards = features
    .map((f) => detailedMarkerTooltipHtml(f, categoryColorMap))
    .join("");
  return `
    <div class="pointer-events-auto flex max-w-4xl flex-row gap-3 overflow-x-auto py-0.5">
      ${cards}
    </div>`;
}

/** Tooltip rows mirror SummaryDrawer: color dot + category + count (expects `category` on each feature). */
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
