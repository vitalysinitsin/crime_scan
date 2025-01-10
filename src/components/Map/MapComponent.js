import MapInit from "./MapInit";
import usePaginatedQuery from "../../utility/paginatedQuery";
import LoadingModal from "../utility/LoadingModal";

const MapComponent = ({ searchParams }) => {
  const { year } = searchParams;

  const queryFilter = {
    where: `OCC_YEAR = ${year}`,
  };
  const {
    featuresObject: { features },
    loading,
  } = usePaginatedQuery(queryFilter);

  return (
    <div style={{ position: "relative" }}>
      <MapInit features={features} loading={loading} />
      <LoadingModal show={loading} />
    </div>
  );
};

export default MapComponent;
