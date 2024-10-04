import MapInit from "./MapInit";
import usePaginatedQuery from "../utility/paginatedQuery";
import LoadingModal from "./utility/LoadingModal";

const MapComponent = ({ filter }) => {
  const filterPlaceholder = {
    where: "OCC_YEAR = 2023",
  };
  const { yearlyFeaturesObj, loading } = usePaginatedQuery(filterPlaceholder);

  return (
    <div style={{ position: "relative" }}>
      <MapInit yearlyFeaturesObj={yearlyFeaturesObj} loading={loading} />
      <LoadingModal show={loading} />
    </div>
  );
};

export default MapComponent;
