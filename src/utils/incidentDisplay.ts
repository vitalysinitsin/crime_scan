import { TorontoMCIFeatureAttributes } from "../models/feature";

/** ArcGIS OCC_DATE ms; fall back to OCC_* string parts when missing or invalid. */
export function formatOccurrenceDisplay(
  a: Pick<
    TorontoMCIFeatureAttributes,
    | "OCC_DATE"
    | "OCC_YEAR"
    | "OCC_MONTH"
    | "OCC_DAY"
    | "OCC_HOUR"
    | "OCC_DOW"
  >,
): string {
  const occDate = a.OCC_DATE;
  if (occDate != null && Number.isFinite(occDate)) {
    const d = new Date(occDate);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, { dateStyle: "medium" });
    }
  }
  const year = String(a.OCC_YEAR ?? "").trim();
  const month = String(a.OCC_MONTH ?? "").trim();
  const day = String(a.OCC_DAY ?? "").trim();
  const hour = String(a.OCC_HOUR ?? "").trim();
  const dow = String(a.OCC_DOW ?? "").trim();
  const parts = [
    dow,
    year && month && day ? `${year}-${month}-${day}` : "",
    hour,
  ].filter(Boolean);
  return parts.join(" · ").trim();
}

export function formatCoord(lat: number, lon: number): string {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return "";
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}
