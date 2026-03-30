import Feature from "ol/Feature";
import { TorontoMCIFeatureAttributes } from "../../models/feature";

/** Build attributes for UI from props stored on the map Feature (subset from API). */
export function openLayersFeatureToAttributes(
  feature: Feature,
): TorontoMCIFeatureAttributes {
  const num = (k: string) => Number(feature.get(k));
  const str = (k: string) => String(feature.get(k) ?? "").trim();

  return {
    DIVISION: str("DIVISION"),
    EVENT_UNIQUE_ID: str("EVENT_UNIQUE_ID"),
    HOOD_140: str("HOOD_140"),
    HOOD_158: str("HOOD_158"),
    LAT_WGS84: num("LAT_WGS84"),
    LOCATION_TYPE: str("LOCATION_TYPE"),
    LONG_WGS84: num("LONG_WGS84"),
    CSI_CATEGORY: str("CSI_CATEGORY"),
    NEIGHBOURHOOD_140: str("NEIGHBOURHOOD_140"),
    NEIGHBOURHOOD_158: str("NEIGHBOURHOOD_158"),
    OBJECTID: 0,
    OCC_DATE: num("OCC_DATE"),
    OCC_DAY: str("OCC_DAY"),
    OCC_DOW: str("OCC_DOW"),
    OCC_DOY: str("OCC_DOY"),
    OCC_HOUR: str("OCC_HOUR"),
    OCC_MONTH: str("OCC_MONTH"),
    OCC_YEAR: str("OCC_YEAR"),
    OFFENCE: str("OFFENCE"),
    PREMISES_TYPE: str("PREMISES_TYPE"),
    REPORT_DATE: 0,
    REPORT_DAY: "",
    REPORT_DOW: "",
    REPORT_DOY: "",
    REPORT_HOUR: "",
    REPORT_MONTH: "",
    REPORT_YEAR: "",
    UCR_CODE: str("UCR_CODE"),
    UCR_EXT: str("UCR_EXT"),
  };
}
