import { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import MapComponent from "./components/MapComponent";
import usePaginatedQuery from "./api/canada/toronto/usePaginatedCrimesQuery";
import useCrimesContext from "./context/CrimesContext";

// may update later when I'll add new UI components to filter the data
export interface QueryFilter {
  OCC_YEAR: number;
  DIVISION?: string | null;
}

function App() {
  const [queryFilter, setQueryFilter] = useState<QueryFilter>({
    OCC_YEAR: 2023,
  });

  const { loading } = usePaginatedQuery(queryFilter);
  const { crimes: features } = useCrimesContext();

  if (!loading) {
    // filtering offence types WIP ***START
    const uniqueMCI = new Set(
      features.map((ftr) => ftr.attributes.MCI_CATEGORY)
    );

    const assaults = features.filter(
      (feature) => feature.attributes.MCI_CATEGORY === "Assault"
    ).length;
    const breaksAndEnters = features.filter(
      (feature) => feature.attributes.MCI_CATEGORY === "Break and Enter"
    ).length;
    const autoThefts = features.filter(
      (feature) => feature.attributes.MCI_CATEGORY === "Auto Theft"
    ).length;
    const robberies = features.filter(
      (feature) => feature.attributes.MCI_CATEGORY === "Robbery"
    ).length;
    const theftsOver = features.filter(
      (feature) => feature.attributes.MCI_CATEGORY === "Theft Over"
    ).length;

    console.log(uniqueMCI, features, {
      assaults,
      breaksAndEnters,
      autoThefts,
      robberies,
      theftsOver,
    });
    // filtering offence types WIP ***END
  }

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
      <MapComponent features={features} loading={loading} />
      <footer></footer>
    </div>
  );
}
export default App;
