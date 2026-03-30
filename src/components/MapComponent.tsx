import LoadingModal from "./LoadingModal";
import useMapInit, {
  OnIncidentSelect,
} from "../hooks/map/useMapInit";
import usePaginatedQuery from "../api/canada/toronto/usePaginatedCrimesQuery";
import { QueryFilter } from "../App";
import { TorontoMCIFeatureAttributes } from "../models/feature";

interface MapComponentProps {
  queryFilter: QueryFilter;
  selectedMarkerTypes: string[];
  selectedIncidents: TorontoMCIFeatureAttributes[] | null;
  onIncidentSelect?: OnIncidentSelect;
}

function MapComponent({
  queryFilter,
  selectedMarkerTypes,
  selectedIncidents,
  onIncidentSelect,
}: MapComponentProps) {
  const { features, loading } = usePaginatedQuery(queryFilter);
  useMapInit({
    features,
    loading,
    selectedMarkerTypes,
    selectedIncidents,
    onIncidentSelect,
  });

  return (
    <div>
      <div id="openLayersMap" style={{ height: "100%" }} className="map" />
      <LoadingModal open={loading} />
    </div>
  );
}

export default MapComponent;
