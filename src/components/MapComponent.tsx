import LoadingModal from "./LoadingModal";
import useMapInit from "../hooks/map/useMapInit";
import usePaginatedQuery from "../api/canada/toronto/usePaginatedCrimesQuery";
import { QueryFilter } from "../App";

interface MapComponentProps {
  queryFilter: QueryFilter;
}

function MapComponent({ queryFilter }: MapComponentProps) {
  const { features, loading } = usePaginatedQuery(queryFilter);
  useMapInit({ features, loading });

  return (
    <div>
      <div id="openLayersMap" style={{ height: "100%" }} className="map" />
      <LoadingModal open={loading} />
    </div>
  );
}

export default MapComponent;
