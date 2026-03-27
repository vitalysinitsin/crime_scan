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
import { TorontoMCIFeature } from "../../models/feature";
import {
  fitTheMapViewToDisplayFeatures,
  generateDefaultClusterStyle,
  allFeaturesInSameSpot,
  generateDefeaultMarkerStyle,
} from "./utility";
import { clusterTooltipHtml } from "./clusterTooltipHtml";
import useCrimesContext from "../../context/CrimesContext";
import { getCategoryColor, CLUSTER_COLOR } from "../../utils/categoryColors";

const DEFAULT_CENTER = fromLonLat([-79.41636, 43.76681]);
const DEFAULT_ZOOM = 11;

const useMapInit = ({
  features,
  loading,
  selectedMarkerTypes,
}: {
  features?: TorontoMCIFeature[];
  loading?: boolean;
  selectedMarkerTypes?: string[];
}) => {
  const mapInstanceRef = useRef<OLMap | null>(null);
  const { categoryColorMap } = useCrimesContext();

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

      // interactions
      map.on("click", (event) => {
        const clickedMarker = map.forEachFeatureAtPixel(
          event.pixel,
          (feature) => {
            if (feature.get("features").length > 0) {
              return feature;
            }
          },
        );

        if (clickedMarker) {
          const clickedFeatures: Feature[] = clickedMarker.get("features");

          if (clickedFeatures.length > 1) {
            if (!allFeaturesInSameSpot(clickedFeatures)) {
              fitTheMapViewToDisplayFeatures(clickedFeatures, map);
            }
            // display the summary of the cluster info here
            console.log("cluster", clickedFeatures);
          } else {
            // display the summary of the single feature here
            console.log("single", clickedFeatures);
          }
        } else {
          map.getView().animate({
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            duration: 400,
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!loading && features && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      const OLFeatures = features.map((ftr) => {
        const category = ftr.attributes.CSI_CATEGORY?.trim() || "Unknown";
        const color = getCategoryColor(categoryColorMap, category);
        const point = new Point(
          fromLonLat([ftr.attributes.LONG_WGS84, ftr.attributes.LAT_WGS84]),
        );
        const feature = new Feature({
          geometry: point,
          name: ftr.attributes.EVENT_UNIQUE_ID,
          category,
          color,
          style: generateDefeaultMarkerStyle(color),
        });
        return feature;
      });

      const vectorSource = new Vector({
        features: OLFeatures,
      });

      const clusterSource = new Cluster({
        source: vectorSource,
        distance: 75,
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
      tooltipEl.className =
        "pointer-events-none z-50 max-w-xs rounded-lg bg-gray-900/90 px-3 py-2 text-sm text-white shadow-lg";
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

      const onPointerMove = (e: MapBrowserEvent<PointerEvent>) => {
        const hit = map.forEachFeatureAtPixel(e.pixel, (f) => f, {
          layerFilter: (layer) => layer === clusterLayer,
        });
        if (hit) {
          const clusterFeatures: Feature[] = hit.get("features");
          if (clusterFeatures.length > 1) {
            clusterTooltip.setPosition(e.coordinate);
            tooltipEl.innerHTML = clusterTooltipHtml(
              clusterFeatures,
              categoryColorMap,
            );
          } else {
            hideTooltip();
          }
          map.getTargetElement().style.cursor = "pointer";
        } else {
          hideTooltip();
          map.getTargetElement().style.cursor = "";
        }
      };

      map.on("movestart", onMoveStart);
      map.on("pointermove", onPointerMove);

      return () => {
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
  }, [features, loading, categoryColorMap, selectedMarkerTypes]);
};

export default useMapInit;
