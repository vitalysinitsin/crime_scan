import { useState } from "react";
import MapComponent from "./components/MapComponent";
import SummaryPanel from "./components/SummaryPanel";
import Navbar from "./components/Navbar";
export interface QueryFilter {
  OCC_YEAR: number;
  DIVISION?: string | null;
}

function App() {
  const [openSummary, setOpenSummary] = useState(false);
  const [queryFilter] = useState<QueryFilter>({
    OCC_YEAR: 2023,
  });

  const toggleSummary = () => {
    setOpenSummary(!openSummary);
  };

  return (
    <div>
      <Navbar toggleSummary={toggleSummary} year={queryFilter.OCC_YEAR} />
      <MapComponent queryFilter={queryFilter} />
      <SummaryPanel open={openSummary} handleClick={toggleSummary} />
    </div>
  );
}
export default App;
