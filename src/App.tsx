import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import MapComponent from "./components/Map/MapComponent";
import usePaginatedQuery from "./api/canada/toronto/usePaginatedCrimesQuery";

// may update later when I'll add new UI components to filter the data
export interface QueryFilter {
  OCC_YEAR: number;
  MCI_CATEGORY: string | null;
  DIVISION: string | null;
}

function App() {
  const [queryFilter, setQueryFilter] = useState<QueryFilter>({
    OCC_YEAR: 2023,
    MCI_CATEGORY: null,
    DIVISION: null,
  });

  const { featuresObject, loading } = usePaginatedQuery(queryFilter);
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
      <MapComponent features={featuresObject?.features} loading={loading} />
      <footer></footer>
    </div>
  );
}
export default App;
