import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

export const generateDefaultClusterStyle = (size: number) => {
  return new Style({
    image: new Circle({
      radius: 10,
      fill: new Fill({ color: "rgb(70, 70, 255)" }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
    text: new Text({
      text: size.toString(),
      fill: new Fill({ color: "white" }),
    }),
  });
};

export function areCoordinatesClose(
  coord1: [number, number],
  coord2: [number, number],
  tolerance = 0.00001
) {
  return (
    Math.abs(coord1[0] - coord2[0]) < tolerance &&
    Math.abs(coord1[1] - coord2[1]) < tolerance
  );
}
