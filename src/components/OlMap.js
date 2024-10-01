import "ol/ol.css";
import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import { OSM, Vector } from "ol/source";
import { fromLonLat } from "ol/proj";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import VectorLayer from "ol/layer/Vector";
import { Point } from "ol/geom";
import Feature from "ol/Feature";
import TileLayer from "ol/layer/Tile";
import Pin from "../assets/pin.svg";

const DEFAULT_CENTER = fromLonLat([-79.41636, 43.76681]);

const OlMap = ({ yearlyMarkersObj }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // map init
    const mapConfig = new Map({
      view: new View({ center: DEFAULT_CENTER, zoom: 11 }),
      layers: [new TileLayer({ source: new OSM() })],
    });

    // vector layer for markers
    const vectorSource = new Vector();
    const vectorLayer = new VectorLayer({ source: vectorSource });

    // features/markers
    const markers = [{ lon: -79.41636, lat: 43.76681, name: "TO" }];
    // const markers = yearlyMarkers.features.map((feature) => ({ lon: -79.41636, lat: 43.76681, name: 'markerNamePlaceholder' }));
    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: Pin,
        width: 30,
      }),
    });

    const features = markers.map((marker) => {
      const point = new Point(fromLonLat([marker.lon, marker.lat]));
      const feature = new Feature({
        geometry: point,
        name: marker.name,
      });
      feature.setStyle(markerStyle);
      return feature;
    });

    mapConfig.addLayer(vectorLayer);

    vectorSource.addFeatures(features);

    // link map to the ref
    mapConfig.setTarget(mapRef.current);
    return () => mapConfig.setTarget("");
  }, []);

  return <div className="map" ref={mapRef} />;
};

export default OlMap;
