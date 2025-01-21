import LoadingModal from "./LoadingModal";
import useMapInit from "../hooks/useMapInit";
import useCrimesContext from "../context/CrimesContext";
import usePaginatedQuery from "../api/canada/toronto/usePaginatedCrimesQuery";
import { QueryFilter } from "../App";
import SummaryPanel from "./SummaryPanel";

interface MapComponentProps {
  queryFilter: QueryFilter;
}

function MapComponent({ queryFilter }: MapComponentProps) {
  const { features, loading } = usePaginatedQuery(queryFilter);
  useMapInit({ features, loading });

  return (
    <div style={{ position: "relative" }}>
      <div id="openLayersMap" style={{ height: "100%" }} className="map" />
      {/* <LoadingModal show={loading} /> */}
    </div>
  );
}

export default MapComponent;
