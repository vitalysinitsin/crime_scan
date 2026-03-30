import { useCallback, useState } from "react";
import MapComponent from "./components/MapComponent";
import Navbar from "./components/Navbar";
import FilterDrawer from "./components/FilterDrawer";
import IncidentDetailDrawer from "./components/IncidentDetailDrawer";
import { TorontoMCIFeatureAttributes } from "./models/feature";
export interface QueryFilter {
  OCC_YEAR: number;
  DIVISION?: string | null;
}

function App() {
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openIncidentDrawer, setOpenIncidentDrawer] = useState(false);
  const [selectedIncidents, setSelectedIncidents] = useState<
    TorontoMCIFeatureAttributes[] | null
  >(null);
  const [selectedMarkerTypes, setSelectedMarkerTypes] = useState<string[]>([]);
  const [queryFilter, setQueryFilter] = useState<QueryFilter>({
    OCC_YEAR: 2025,
  });

  const toggleFilterDrawer = () => {
    setOpenFilterDrawer((current) => !current);
  };

  const handleIncidentSelect = useCallback(
    (incidents: TorontoMCIFeatureAttributes[] | null) => {
      if (incidents == null || incidents.length === 0) {
        setSelectedIncidents(null);
        setOpenIncidentDrawer(false);
      } else {
        setSelectedIncidents(incidents);
        setOpenIncidentDrawer(true);
      }
    },
    [],
  );

  const closeIncidentDrawer = useCallback(() => {
    setOpenIncidentDrawer(false);
    setSelectedIncidents(null);
  }, []);

  return (
    <div>
      <Navbar toggleFilterDrawer={toggleFilterDrawer} />
      <MapComponent
        queryFilter={queryFilter}
        selectedMarkerTypes={selectedMarkerTypes}
        selectedIncidents={selectedIncidents}
        onIncidentSelect={handleIncidentSelect}
      />
      <IncidentDetailDrawer
        open={openIncidentDrawer}
        onClose={closeIncidentDrawer}
        incidents={selectedIncidents}
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
