import { useState } from "react";
import MapComponent from "./components/MapComponent";
import Navbar from "./components/Navbar";
import FilterDrawer from "./components/FilterDrawer";
export interface QueryFilter {
  OCC_YEAR: number;
  DIVISION?: string | null;
}

function App() {
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [selectedMarkerTypes, setSelectedMarkerTypes] = useState<string[]>([]);
  const [queryFilter, setQueryFilter] = useState<QueryFilter>({
    OCC_YEAR: 2025,
  });

  const toggleFilterDrawer = () => {
    setOpenFilterDrawer((current) => !current);
  };

  return (
    <div>
      <Navbar toggleFilterDrawer={toggleFilterDrawer} />
      <MapComponent
        queryFilter={queryFilter}
        selectedMarkerTypes={selectedMarkerTypes}
      />
      <FilterDrawer
        open={openFilterDrawer}
        handleClick={toggleFilterDrawer}
        setQueryFilter={setQueryFilter}
        queryFilter={queryFilter}
        selectedMarkerTypes={selectedMarkerTypes}
        setSelectedMarkerTypes={setSelectedMarkerTypes}
      />
    </div>
  );
}
export default App;
