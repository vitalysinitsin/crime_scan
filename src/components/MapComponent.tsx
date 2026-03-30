import LoadingModal from "./LoadingModal";
import useMapInit, {
  OnIncidentSelect,
} from "../hooks/map/useMapInit";
import usePaginatedQuery from "../api/canada/toronto/usePaginatedCrimesQuery";
import { QueryFilter } from "../App";

interface MapComponentProps {
  queryFilter: QueryFilter;
  selectedMarkerTypes: string[];
  onIncidentSelect?: OnIncidentSelect;
}

function MapComponent({
  queryFilter,
  selectedMarkerTypes,
  onIncidentSelect,
}: MapComponentProps) {
  const { features, loading } = usePaginatedQuery(queryFilter);
  useMapInit({ features, loading, selectedMarkerTypes, onIncidentSelect });

  return (
    <div>
      <div id="openLayersMap" style={{ height: "100%" }} className="map" />
      <LoadingModal open={loading} />
    </div>
  );
}

export default MapComponent;
