import { useState } from "react";
import MapComponent from "./components/MapComponent";
import SummaryPanel from "./components/SummaryPanel";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";

// may update later when I'll add new UI components to filter the data
export interface QueryFilter {
  OCC_YEAR: number;
  DIVISION?: string | null;
}

function App() {
  const [queryFilter] = useState<QueryFilter>({
    OCC_YEAR: 2023,
  });

  const [openSummary, setOpenSummary] = useState(false);

  const toggleSummaryOnClick = () => {
    setOpenSummary(!openSummary);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            crime_scan
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button onClick={toggleSummaryOnClick}>Summary</Button>
          </Box>
          <Typography variant="body1" component="span">
            Currently displays all crimes commited in Toronto in:{" "}
            {queryFilter.OCC_YEAR}
          </Typography>
        </Toolbar>
      </AppBar>
      <MapComponent queryFilter={queryFilter} />
      <SummaryPanel open={openSummary} handleClick={toggleSummaryOnClick} />
      <footer></footer>
    </div>
  );
}
export default App;
