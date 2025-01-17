import { useState } from "react";
import MapComponent from "./components/MapComponent";
import SummaryPanel from "./components/SummaryPanel";

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
      <div className="placeholder-glow position-relative">
        <h2>crime_scan</h2>
        <p>
          <span>Currently displays all crimes commited in Toronto in </span>
          {queryFilter?.OCC_YEAR}
        </p>
      </div>
      <MapComponent queryFilter={queryFilter} />
      <SummaryPanel />
      <footer></footer>
    </div>
  );
}
export default App;
