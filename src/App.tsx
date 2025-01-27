import { useState } from "react";
import MapComponent from "./components/MapComponent";
import SummaryDrawer from "./components/SummaryDrawer";
import Navbar from "./components/Navbar";
import FilterDrawer from "./components/FilterDrawer";
export interface QueryFilter {
  OCC_YEAR: number;
  DIVISION?: string | null;
}

function App() {
  const [openSummaryDrawer, setOpenSummaryDrawer] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [queryFilter, setQueryFilter] = useState<QueryFilter>({
    OCC_YEAR: 2023,
  });

  const toggleSummaryDrawer = () => {
    setOpenSummaryDrawer((current) => !current);
    setOpenFilterDrawer(false);
  };

  const toggleFilterDrawer = () => {
    setOpenFilterDrawer((current) => !current);
    setOpenSummaryDrawer(false);
  };

  return (
    <div>
      <Navbar
        toggleSummaryDrawer={toggleSummaryDrawer}
        toggleFilterDrawer={toggleFilterDrawer}
        year={queryFilter.OCC_YEAR}
      />
      <MapComponent queryFilter={queryFilter} />
      <SummaryDrawer
        open={openSummaryDrawer}
        handleClick={toggleSummaryDrawer}
      />
      <FilterDrawer
        open={openFilterDrawer}
        handleClick={toggleFilterDrawer}
        setQueryFilter={setQueryFilter}
        queryFilter={queryFilter}
      />
    </div>
  );
}
export default App;
