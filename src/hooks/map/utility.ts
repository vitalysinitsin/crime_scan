import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { Feature, Map } from "ol";
import { createEmpty, extend } from "ol/extent";
import { SimpleGeometry } from "ol/geom";

export const generateDefeaultMarkerStyle = () => {
  return new Style({
    image: new Circle({
      radius: 12,
      fill: new Fill({ color: "rgb(70, 70, 255)" }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
  });
};

export const generateDefaultClusterStyle = (size: number) => {
  return new Style({
    image: new Circle({
      radius: 15,
      fill: new Fill({ color: "rgb(70, 70, 255)" }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
    text: new Text({
      text: size.toString(),
      fill: new Fill({ color: "white" }),
    }),
  });
};

export const fitTheMapViewToDisplayFeatures = (
  features: Feature[],
  map: Map
) => {
  const extent = createEmpty();

  features.forEach((ftr) => {
    const geometry = ftr.getGeometry();

    if (geometry) {
      extend(extent, geometry.getExtent());
    }
  });

  const view = map.getView();
  view.fit(extent, { duration: 500, padding: [100, 100, 100, 100] });
};

export const allFeaturesInSameSpot = (features: Feature[]): boolean => {
  const firstGeometry = features[0].getGeometry();

  if (!(firstGeometry instanceof SimpleGeometry)) {
    return false;
  }

  const firstCoords = firstGeometry?.getCoordinates();

  if (firstCoords) {
    return features.every((f) =>
      f.getGeometry()?.intersectsCoordinate(firstCoords)
    );
  }

  return false;
};
