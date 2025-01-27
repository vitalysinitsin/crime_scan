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
import { useState } from "react";

interface NavbarProps {
  toggleSummaryDrawer: () => void;
  toggleFilterDrawer: () => void;
  year: number;
}

function Navbar({
  toggleFilterDrawer,
  toggleSummaryDrawer,
  year,
}: NavbarProps) {
  const [openHamburgerMenu, setOpenHamburgerMenu] =
    useState<null | HTMLElement>(null);

  const handleBarMenuClose = () => {
    setOpenHamburgerMenu(null);
  };

  const handleBarMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpenHamburgerMenu(event.currentTarget);
  };

  return (
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
            open={!!openHamburgerMenu}
            anchorEl={openHamburgerMenu}
            sx={{ display: { xs: "block", md: "none" } }}
            onClose={handleBarMenuClose}
          >
            <MenuItem
              onClick={() => {
                toggleSummaryDrawer();
                handleBarMenuClose();
              }}
            >
              <Typography>Summary</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                toggleFilterDrawer();
                handleBarMenuClose();
              }}
            >
              <Typography>Filter</Typography>
            </MenuItem>
          </Menu>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Typography sx={{ mr: 4 }} variant="h6" component="div">
            crime_scan
          </Typography>
          <Button onClick={toggleSummaryDrawer}>Summary</Button>
          <Button onClick={toggleFilterDrawer}>Filter</Button>
        </Box>
        <Typography variant="body1" component="span">
          Toronto Crimes in: {year}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
