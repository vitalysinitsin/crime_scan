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

const MapInit = ({ yearlyFeaturesObj, loading }) => {
  const mapRef = useRef(null);
  console.log(yearlyFeaturesObj);

  useEffect(() => {
    if (!mapRef.current) return;

    // map init
    const mapConfig = new Map({
      view: new View({ center: DEFAULT_CENTER, zoom: 11 }),
      layers: [new TileLayer({ source: new OSM() })],
    });

    if (loading) return;

    // vector layer for markers
    const vectorSource = new Vector();
    const vectorLayer = new VectorLayer({ source: vectorSource });

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: Pin,
        width: 30,
      }),
    });

    const OLFeatures = yearlyFeaturesObj.features.map((ftr) => {
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

    mapConfig.addLayer(vectorLayer);

    vectorSource.addFeatures(OLFeatures);

    // link map to the ref
    mapConfig.setTarget(mapRef.current);
    return () => mapConfig.setTarget("");
  }, [yearlyFeaturesObj?.features, loading]);

  return <div style={{ height: "100%" }} className="map" ref={mapRef} />;
};

export default MapInit;
