import LoadingModal from "../utility/LoadingModal";
import useMapInit from "../../hooks/useMapInit";
import { IFeature } from "@esri/arcgis-rest-request";

const MapComponent = ({
  features,
  loading,
}: {
  features?: IFeature[];
  loading?: boolean;
}) => {
  const { mapRef } = useMapInit({ features, loading });

  return (
    <div style={{ position: "relative" }}>
      <div
        id="openLayersMap"
        style={{ height: "100%" }}
        className="map"
        ref={mapRef}
      />
      ;
      <LoadingModal show={loading} />
    </div>
  );
};

export default MapComponent;
