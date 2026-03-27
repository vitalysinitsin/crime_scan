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
  toggleFilterDrawer: () => void;
}

function Navbar({ toggleFilterDrawer }: NavbarProps) {
  const [openHamburgerMenu, setOpenHamburgerMenu] =
    useState<null | HTMLElement>(null);

  const handleBarMenuClose = () => {
    setOpenHamburgerMenu(null);
  };

  const handleBarMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpenHamburgerMenu(event.currentTarget);
  };

  return (
    <AppBar className="static!">
      <Toolbar className="justify-between gap-4" disableGutters sx={{ px: 2 }}>
        <Typography className="min-w-0 shrink" variant="h6" component="div">
          crime_scan
        </Typography>

        <Box className="flex shrink-0 items-center">
          <Box className="lg:hidden">
            <IconButton
              size="large"
              edge="end"
              aria-label="Open menu"
              onClick={handleBarMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              open={!!openHamburgerMenu}
              anchorEl={openHamburgerMenu}
              slotProps={{ paper: { className: "lg:hidden" } }}
              onClose={handleBarMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  toggleFilterDrawer();
                  handleBarMenuClose();
                }}
              >
                Filter
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  More
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Button className="hidden! lg:flex!" onClick={toggleFilterDrawer}>
            Filter
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
