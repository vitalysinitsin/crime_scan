import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import useCrimesContext from "../context/CrimesContext";
import { ChevronLeft } from "@mui/icons-material";
import { TorontoMCIFeature } from "../models/feature";
import { useCallback } from "react";

interface SummaryPanelProps {
  open: boolean;
  handleClick: () => void;
}

type SummaryList = {
  [key: string]: number;
};

function SummaryDrawer({ open, handleClick }: SummaryPanelProps) {
  const { crimes } = useCrimesContext();

  const renderCrimesByCategory = useCallback((crimes: TorontoMCIFeature[]) => {
    const crimesByCategory = crimes.reduce((acc: SummaryList, current) => {
      const currentMciCategory = current.attributes.MCI_CATEGORY;

      return {
        ...acc,
        [currentMciCategory]: acc[currentMciCategory]
          ? acc[currentMciCategory] + 1
          : 1,
      };
    }, {});

    return Object.keys(crimesByCategory)
      .sort()
      .map((mciCategory) => {
        return (
          <ListItem key={mciCategory}>
            <ListItemButton
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography variant="h6">{mciCategory}</Typography>
              <Typography>{crimesByCategory[mciCategory]}</Typography>
            </ListItemButton>
          </ListItem>
        );
      });
  }, []);

  return (
    <Drawer variant="persistent" open={open} sx={{ zIndex: 500 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mr: 1,
          mt: 8,
          padding: "1em",
          width: "20em",
        }}
      >
        <IconButton onClick={handleClick}>
          <ChevronLeft></ChevronLeft>
        </IconButton>
      </Box>
      <Box>
        <List sx={{ width: "100%" }}>{renderCrimesByCategory(crimes)}</List>
      </Box>
    </Drawer>
  );
}

export default SummaryDrawer;
