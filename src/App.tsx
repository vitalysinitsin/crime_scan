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
      <AppBar sx={{ position: "static" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography sx={{ mr: 4 }} variant="h6" component="div">
              crime_scan
            </Typography>
            <Button onClick={toggleSummaryOnClick}>Summary</Button>
          </Box>
          <Typography variant="body1" component="span">
            Toronto Crimes in: {queryFilter.OCC_YEAR}
          </Typography>
        </Toolbar>
      </AppBar>
      <MapComponent queryFilter={queryFilter} />
      <SummaryPanel open={openSummary} handleClick={toggleSummaryOnClick} />
    </div>
  );
}
export default App;
