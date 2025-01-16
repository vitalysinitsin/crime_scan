import LoadingModal from "./LoadingModal";
import useMapInit from "../hooks/useMapInit";
import useCrimesContext from "../context/CrimesContext";
import usePaginatedQuery from "../api/canada/toronto/usePaginatedCrimesQuery";
import { QueryFilter } from "../App";

interface MapComponentProps {
  queryFilter: QueryFilter;
}

function MapComponent({ queryFilter }: MapComponentProps) {
  const { crimes: features } = useCrimesContext();
  const { loading } = usePaginatedQuery(queryFilter);
  const { mapRef } = useMapInit({ features, loading });

  return (
    <div style={{ position: "relative" }}>
      <div
        id="openLayersMap"
        style={{ height: "100%" }}
        className="map"
        ref={mapRef}
      />
      <LoadingModal show={loading} />
    </div>
  );
}

export default MapComponent;
