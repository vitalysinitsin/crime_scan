import "ol/ol.css";
import { useEffect, useRef } from "react";
import { Map, View } from "ol";
import { Cluster, OSM, Vector } from "ol/source";
import { fromLonLat } from "ol/proj";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import VectorLayer from "ol/layer/Vector";
import { Point } from "ol/geom";
import Feature from "ol/Feature";
import TileLayer from "ol/layer/Tile";
import Pin from "../../assets/pin.svg";
import { IFeature } from "@esri/arcgis-rest-request";
import {
  fitTheMapViewToDisplayFeatures,
  generateDefaultClusterStyle,
  allFeaturesInSameSpot,
} from "./utility";

const DEFAULT_CENTER = fromLonLat([-79.41636, 43.76681]);
const DEFAULT_ZOOM = 11;
const MAXIMUM_NUMBER_OF_LAYERS_FOR_THE_MAP = 2;

const useMapInit = ({
  features,
  loading,
}: {
  features?: IFeature[];
  loading?: boolean;
}) => {
  const mapInstanceRef = useRef<Map | null>(null);

  // initializes the map with tile layers
  useEffect(() => {
    if (!mapInstanceRef.current) {
      const map = new Map({
        target: "openLayersMap",
        view: new View({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM }),
        layers: [new TileLayer({ source: new OSM(), className: "tile-layer" })],
      });

      mapInstanceRef.current = map;

      // interactions
      map.on("click", (event) => {
        const clickedMarker = map.forEachFeatureAtPixel(
          event.pixel,
          (feature) => {
            if (feature.get("features").length > 0) {
              console.log("Clicked the cluster", feature.get("features"));
              return feature;
            }
          }
        );

        if (clickedMarker) {
          const clickedFeatures: Feature[] = clickedMarker.get("features");

          if (clickedFeatures.length > 1) {
            // display the summary of the cluster info here

            if (!allFeaturesInSameSpot(clickedFeatures)) {
              fitTheMapViewToDisplayFeatures(clickedFeatures, map);
            }
          } else {
            // display the summary of the single feature here
          }
        } else {
          console.log("clicked a map");

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
      const markerStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: Pin,
          width: 30,
        }),
      });

      const OLFeatures = features.map((ftr) => {
        const point = new Point(
          fromLonLat([ftr.attributes.LONG_WGS84, ftr.attributes.LAT_WGS84])
        );
        const feature = new Feature({
          geometry: point,
          name: ftr.attributes.EVENT_UNIQUE_ID,
        });
        feature.setStyle(markerStyle);
        return feature;
      });

      const vectorSource = new Vector({
        features: OLFeatures,
      });

      const clusterSource = new Cluster({
        source: vectorSource,
        distance: 40,
      });

      const clusterLayer = new VectorLayer({
        source: clusterSource,
        className: "vector-layer",
        style: (feature) => {
          const size = feature.get("features").length;
          let style = markerStyle;
          if (size > 1) {
            style = generateDefaultClusterStyle(size);
          }
          return style;
        },
      });

      mapInstanceRef.current.addLayer(clusterLayer);
    }

    return () => {
      const layers = mapInstanceRef.current?.getLayers().getArray();
      if (
        layers?.length &&
        layers?.length > MAXIMUM_NUMBER_OF_LAYERS_FOR_THE_MAP
      ) {
        layers?.pop();
      }
    };
  }, [features, loading]);
};

export default useMapInit;
