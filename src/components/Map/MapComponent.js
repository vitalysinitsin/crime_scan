import LoadingModal from "../utility/LoadingModal";
import useMapInit from "../../hooks/MapInit";

const MapComponent = ({ features, loading }) => {
  const { mapRef } = useMapInit(features, loading);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ height: "100%" }} className="map" ref={mapRef} />;
      <LoadingModal show={loading} />
    </div>
  );
};

export default MapComponent;
