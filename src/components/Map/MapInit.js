import "ol/ol.css";
import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import { Cluster, OSM, Vector } from "ol/source";
import { fromLonLat } from "ol/proj";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";
import VectorLayer from "ol/layer/Vector";
import { Point } from "ol/geom";
import Feature from "ol/Feature";
import TileLayer from "ol/layer/Tile";
import Pin from "../../assets/pin.svg";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import Stroke from "ol/style/Stroke";

const DEFAULT_CENTER = fromLonLat([-79.41636, 43.76681]);

const MapInit = ({ features, loading }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // initializes the map with tile layers
  useEffect(() => {
    if (!mapInstanceRef.current) {
      const map = new Map({
        target: mapRef.current,
        view: new View({ center: DEFAULT_CENTER, zoom: 11 }),
        layers: [new TileLayer({ source: new OSM() })],
      });

      mapInstanceRef.current = map;
    }
    return () => {
      mapInstanceRef.current.setTarget(null);
    };
  }, []);

  // adds markers when features are loaded
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
      // const vectorLayer = new VectorLayer({ source: vectorSource });
      const clusterLayer = new VectorLayer({
        source: clusterSource,
        style: (feature) => {
          const size = feature.get("features").length;
          let style = markerStyle;
          if (size > 1) {
            style = new Style({
              image: new Circle({
                radius: 10,
                fill: new Fill({ color: "rgb(70, 70, 255)" }),
                stroke: new Stroke({ color: "white", width: 2 }),
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({ color: "white" }),
                onClick: () => {
                  console.log("clicked the cluster");
                },
              }),
            });
          }
          return style;
        },
      });

      mapInstanceRef.current.addLayer(clusterLayer);
    }
  }, [features, loading]);

  return <div style={{ height: "100%" }} className="map" ref={mapRef} />;
};

export default MapInit;
