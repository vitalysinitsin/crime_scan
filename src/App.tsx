import { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
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
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="placeholder-glow position-relative"
      >
        <Navbar.Brand className="ms-4">crime_scan</Navbar.Brand>
        <Navbar.Text>
          <span>Currently displays all crimes commited in Toronto in </span>
          {queryFilter?.OCC_YEAR}
        </Navbar.Text>
      </Navbar>
      <MapComponent queryFilter={queryFilter} />
      <SummaryPanel />
      <footer></footer>
    </div>
  );
}
export default App;
