import { useState } from "react";
import MapComponent from "./components/MapComponent";
import SummaryPanel from "./components/SummaryPanel";
import Navbar from "./components/Navbar";

// may update later when I'll add new UI components to filter the data
export interface QueryFilter {
  OCC_YEAR: number;
  DIVISION?: string | null;
}

function App() {
  const [queryFilter] = useState<QueryFilter>({
    OCC_YEAR: 2023,
  });

  return (
    <div>
      <Navbar year={queryFilter?.OCC_YEAR}></Navbar>
      <MapComponent queryFilter={queryFilter} />
      <footer></footer>
    </div>
  );
}
export default App;
