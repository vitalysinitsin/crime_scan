import { AppBar, Toolbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";

interface NavbarProps {
  year: number;
  children?: React.ReactNode;
}

function Navbar({ children, year }: NavbarProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            crime_scan
          </Typography>
          <Typography variant="body1" component="span">
            Currently displays all crimes commited in Toronto in: {year}
          </Typography>
        </Toolbar>
        {children}
      </AppBar>
    </Box>
  );
}

export default Navbar;
