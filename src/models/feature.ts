import { IQueryFeaturesResponse } from "@esri/arcgis-rest-feature-service";
import { IFeature } from "@esri/arcgis-rest-request";

export type TorontoMCIFeatureAttributes = {
  DIVISION: string;
  EVENT_UNIQUE_ID: string;
  HOOD_140: string;
  HOOD_158: string;
  LAT_WGS84: number;
  LOCATION_TYPE: string;
  LONG_WGS84: number;
  MCI_CATEGORY: string;
  NEIGHBOURHOOD_140: string;
  NEIGHBOURHOOD_158: string;
  OBJECTID: number;
  OCC_DATE: number;
  OCC_DAY: string;
  OCC_DOW: string;
  OCC_DOY: string;
  OCC_HOUR: string;
  OCC_MONTH: string;
  OCC_YEAR: string;
  OFFENCE: string;
  PREMISES_TYPE: string;
  REPORT_DATE: number;
  REPORT_DAY: string;
  REPORT_DOW: string;
  REPORT_DOY: string;
  REPORT_HOUR: string;
  REPORT_MONTH: string;
  REPORT_YEAR: string;
  UCR_CODE: string;
  UCR_EXT: string;
};

// specifies generic feature attribute type with Toronto feature attributes
export type TorontoMCIFeature = Omit<IFeature, "attributes"> & {
  attributes: TorontoMCIFeatureAttributes;
};

// specifies generic feature response type with Toronto specific one
export type TorontoQueryFeaturesResponse = Omit<
  IQueryFeaturesResponse,
  "features"
> & {
  features: TorontoMCIFeature[];
};
