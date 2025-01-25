import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
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

function SummaryPanel({ open, handleClick }: SummaryPanelProps) {
  const { crimes } = useCrimesContext();

  const renderCrimesByCategory = useCallback(
    (crimes: TorontoMCIFeature[]) => {
      const crimesByCategory = crimes.reduce((acc: SummaryList, current) => {
        const currentMciCategory = current.attributes.MCI_CATEGORY;

        return {
          ...acc,
          [currentMciCategory]: acc[currentMciCategory]
            ? acc[currentMciCategory] + 1
            : 1,
        };
      }, {});

      return Object.keys(crimesByCategory).map((mciCategory) => {
        return (
          <ListItem key={mciCategory}>
            <ListItemText>
              {mciCategory}: {crimesByCategory[mciCategory]}
            </ListItemText>
          </ListItem>
        );
      });
    },
    [crimes]
  );

  return (
    <Drawer variant="persistent" open={open} sx={{ zIndex: 500 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mr: 1, mt: 8 }}>
        <IconButton onClick={handleClick}>
          <ChevronLeft></ChevronLeft>
        </IconButton>
      </Box>
      <Box>
        <List>{renderCrimesByCategory(crimes)}</List>
      </Box>
    </Drawer>
  );
}

export default SummaryPanel;
