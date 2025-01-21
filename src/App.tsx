import { useState } from "react";
import MapComponent from "./components/MapComponent";
import SummaryPanel from "./components/SummaryPanel";
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { Menu as MenuIcon } from "@mui/icons-material";

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
  const [openBarMenu, setOpenBarMenu] = useState<null | HTMLElement>(null);

  const toggleSummaryOnClick = () => {
    setOpenSummary(!openSummary);
  };

  const handleBarMenuClose = () => {
    setOpenBarMenu(null);
  };

  const handleBarMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpenBarMenu(event.currentTarget);
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
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" onClick={handleBarMenuOpen}>
              <MenuIcon></MenuIcon>
            </IconButton>
            <Menu
              open={!!openBarMenu}
              anchorEl={openBarMenu}
              sx={{ display: { xs: "block", md: "none" } }}
              onClose={handleBarMenuClose}
            >
              <MenuItem
                onClick={() => {
                  toggleSummaryOnClick();
                  handleBarMenuClose();
                }}
              >
                <Typography>Summary</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
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
