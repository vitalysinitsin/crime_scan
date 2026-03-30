import "ol/ol.css";
import { useEffect, useRef } from "react";
import { Map as OLMap, Overlay, View } from "ol";
import type { MapBrowserEvent } from "ol";
import { Cluster, OSM, Vector } from "ol/source";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import { Point } from "ol/geom";
import Feature from "ol/Feature";
import TileLayer from "ol/layer/Tile";
import {
  TorontoMCIFeature,
  TorontoMCIFeatureAttributes,
} from "../../models/feature";
import {
  fitTheMapViewToDisplayFeatures,
  generateDefaultClusterStyle,
  allFeaturesInSameSpot,
  generateDefeaultMarkerStyle,
} from "./utility";
import { openLayersFeatureToAttributes } from "./openLayersFeatureToAttributes";
import {
  clusterTooltipHtml,
  compactMarkerTooltipHtml,
  multiSameSpotTooltipHtml,
} from "./clusterTooltipHtml";
import useCrimesContext from "../../context/CrimesContext";
import { getCategoryColor, CLUSTER_COLOR } from "../../utils/categoryColors";

const DEFAULT_CENTER = fromLonLat([-79.30636, 43.70681]);
const DEFAULT_ZOOM = 11;

const TOOLTIP_SHELL_BASE =
  "z-50 rounded-lg bg-gray-900/90 px-3 py-2 text-sm text-white shadow-lg";
/** Narrow overlay; map keeps receiving moves outside the tooltip. */
const TOOLTIP_SHELL_SINGLE = `${TOOLTIP_SHELL_BASE} pointer-events-none max-w-xs min-w-0`;
const TOOLTIP_SHELL_CATEGORY = `${TOOLTIP_SHELL_BASE} pointer-events-none max-w-60 min-w-0`;
/** Wide strip so multiple same-spot cards can scroll horizontally; wheel/touch hit the tooltip. */
const TOOLTIP_SHELL_SAME_SPOT = `${TOOLTIP_SHELL_BASE} pointer-events-auto max-w-[min(100vw-1.5rem,56rem)] min-w-0`;

export type OnIncidentSelect = (
  incidents: TorontoMCIFeatureAttributes[] | null,
) => void;

const useMapInit = ({
  features,
  loading,
  selectedMarkerTypes,
  selectedIncidents,
  onIncidentSelect,
}: {
  features?: TorontoMCIFeature[];
  loading?: boolean;
  selectedMarkerTypes?: string[];
  selectedIncidents?: TorontoMCIFeatureAttributes[] | null;
  onIncidentSelect?: OnIncidentSelect;
}) => {
  const mapInstanceRef = useRef<OLMap | null>(null);
  const { categoryColorMap } = useCrimesContext();
  const onIncidentSelectRef = useRef<OnIncidentSelect | undefined>(undefined);
  onIncidentSelectRef.current = onIncidentSelect;

  // initializes the map with tile layers
  useEffect(() => {
    if (!mapInstanceRef.current) {
      const map = new OLMap({
        target: "openLayersMap",
        view: new View({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM }),
        layers: [new TileLayer({ source: new OSM(), className: "tile-layer" })],
        overlays: [],
      });

      mapInstanceRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (!loading && features && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      const selectedCategories = new Set(selectedMarkerTypes ?? []);
      const hasCategoryFilter = selectedCategories.size > 0;
      const OLFeatures = features.map((torontoFeature) => {
        const mciAttributes = torontoFeature.attributes;
        const category =
          mciAttributes.CSI_CATEGORY?.trim() || "Unknown";
        const color = getCategoryColor(categoryColorMap, category);
        const point = new Point(
          fromLonLat([mciAttributes.LONG_WGS84, mciAttributes.LAT_WGS84]),
        );
        const openLayersFeature = new Feature({
          geometry: point,
          name: mciAttributes.EVENT_UNIQUE_ID,
          category,
          color,
          style: generateDefeaultMarkerStyle(color),
          // Toronto MCI display fields for detailed marker / same-spot tooltips
          CSI_CATEGORY: mciAttributes.CSI_CATEGORY ?? "",
          OFFENCE: mciAttributes.OFFENCE ?? "",
          UCR_CODE: mciAttributes.UCR_CODE ?? "",
          UCR_EXT: mciAttributes.UCR_EXT ?? "",
          OCC_DATE: mciAttributes.OCC_DATE,
          OCC_DAY: mciAttributes.OCC_DAY ?? "",
          OCC_DOW: mciAttributes.OCC_DOW ?? "",
          OCC_DOY: mciAttributes.OCC_DOY ?? "",
          OCC_HOUR: mciAttributes.OCC_HOUR ?? "",
          OCC_MONTH: mciAttributes.OCC_MONTH ?? "",
          OCC_YEAR: mciAttributes.OCC_YEAR ?? "",
          LOCATION_TYPE: mciAttributes.LOCATION_TYPE ?? "",
          PREMISES_TYPE: mciAttributes.PREMISES_TYPE ?? "",
          NEIGHBOURHOOD_140: mciAttributes.NEIGHBOURHOOD_140 ?? "",
          NEIGHBOURHOOD_158: mciAttributes.NEIGHBOURHOOD_158 ?? "",
          HOOD_140: mciAttributes.HOOD_140 ?? "",
          HOOD_158: mciAttributes.HOOD_158 ?? "",
          LAT_WGS84: mciAttributes.LAT_WGS84,
          LONG_WGS84: mciAttributes.LONG_WGS84,
          EVENT_UNIQUE_ID: mciAttributes.EVENT_UNIQUE_ID ?? "",
          DIVISION: mciAttributes.DIVISION ?? "",
        });
        return openLayersFeature;
      });

      const vectorSource = new Vector({
        features: OLFeatures,
      });

      const clusterSource = new Cluster({
        source: vectorSource,
        distance: 75,
        geometryFunction: (feature) => {
          const geometry = feature.getGeometry();
          if (!geometry) return null;
          if (!hasCategoryFilter) return geometry;

          const category = feature.get("category");
          return selectedCategories.has(category) ? geometry : null;
        },
      });

      const clusterLayer = new VectorLayer({
        source: clusterSource,
        className: "vector-layer",
        style: (feature) => {
          const clusterFeatures: Feature[] = feature.get("features");
          const size = clusterFeatures.length;
          if (size > 1) {
            return generateDefaultClusterStyle(size, CLUSTER_COLOR);
          }
          const color = clusterFeatures[0]?.get("color") ?? CLUSTER_COLOR;
          return generateDefeaultMarkerStyle(color);
        },
      });

      map.addLayer(clusterLayer);

      const tooltipEl = document.createElement("div");
      tooltipEl.className = TOOLTIP_SHELL_CATEGORY;
      tooltipEl.setAttribute("role", "tooltip");

      const clusterTooltip = new Overlay({
        element: tooltipEl,
        positioning: "bottom-center",
        offset: [0, -12],
        stopEvent: false,
      });
      map.addOverlay(clusterTooltip);

      const hideTooltip = () => {
        clusterTooltip.setPosition(undefined);
      };

      const onMoveStart = () => {
        hideTooltip();
      };

      const onPointerMove = (mapBrowserEvent: MapBrowserEvent<PointerEvent>) => {
        const hit = map.forEachFeatureAtPixel(
          mapBrowserEvent.pixel,
          (hitFeature) => hitFeature,
          {
            layerFilter: (mapLayer) => mapLayer === clusterLayer,
          },
        );
        if (hit) {
          const clusterFeatures: Feature[] = hit.get("features");
          const n = clusterFeatures.length;
          clusterTooltip.setPosition(mapBrowserEvent.coordinate);
          if (n === 1) {
            tooltipEl.className = TOOLTIP_SHELL_SINGLE;
            tooltipEl.innerHTML = compactMarkerTooltipHtml(
              clusterFeatures[0],
              categoryColorMap,
            );
          } else if (allFeaturesInSameSpot(clusterFeatures)) {
            tooltipEl.className = TOOLTIP_SHELL_SAME_SPOT;
            tooltipEl.innerHTML = multiSameSpotTooltipHtml(
              clusterFeatures,
              categoryColorMap,
            );
          } else {
            tooltipEl.className = TOOLTIP_SHELL_CATEGORY;
            tooltipEl.innerHTML = clusterTooltipHtml(
              clusterFeatures,
              categoryColorMap,
            );
          }
          map.getTargetElement().style.cursor = "pointer";
        } else {
          hideTooltip();
          map.getTargetElement().style.cursor = "";
        }
      };

      const onMapClick = (event: MapBrowserEvent<PointerEvent | MouseEvent>) => {
        const notify = onIncidentSelectRef.current;
        const clickedMarker = map.forEachFeatureAtPixel(
          event.pixel,
          (hitFeature) => {
            const inner = hitFeature.get("features") as Feature[] | undefined;
            if (inner && inner.length > 0) return hitFeature;
            return undefined;
          },
          { layerFilter: (mapLayer) => mapLayer === clusterLayer },
        );

        if (clickedMarker) {
          const clickedFeatures: Feature[] = clickedMarker.get("features");

          if (clickedFeatures.length > 1) {
            if (!allFeaturesInSameSpot(clickedFeatures)) {
              fitTheMapViewToDisplayFeatures(clickedFeatures, map);
              notify?.(null);
            } else {
              notify?.(
                clickedFeatures.map((f) => openLayersFeatureToAttributes(f)),
              );
            }
          } else {
            notify?.(
              clickedFeatures.map((f) => openLayersFeatureToAttributes(f)),
            );
          }
        } else {
          map.getView().animate({
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            duration: 400,
          });
          notify?.(null);
        }
      };

      map.on("movestart", onMoveStart);
      map.on("pointermove", onPointerMove);
      map.on("click", onMapClick);

      return () => {
        map.un("click", onMapClick);
        map.un("pointermove", onPointerMove);
        map.un("movestart", onMoveStart);
        map.removeOverlay(clusterTooltip);
        const layers = map.getLayers().getArray();
        if (layers.length > 1) {
          layers.pop();
        }
      };
    }

    return undefined;
  }, [
    features,
    loading,
    categoryColorMap,
    selectedMarkerTypes,
    selectedIncidents,
  ]);
};

export default useMapInit;
