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
import { getCategoryColor } from "../utils/categoryColors";

interface SummaryPanelProps {
  open: boolean;
  handleClick: () => void;
}

type SummaryList = {
  [key: string]: number;
};

function SummaryDrawer({ open, handleClick }: SummaryPanelProps) {
  const { crimes, categoryColorMap } = useCrimesContext();

  const renderCrimesByCategory = useCallback(
    (crimes: TorontoMCIFeature[]) => {
      const crimesByCategory = crimes.reduce((acc: SummaryList, current) => {
        const category = current.attributes.CSI_CATEGORY?.trim() || "Unknown";
        return {
          ...acc,
          [category]: acc[category] ? acc[category] + 1 : 1,
        };
      }, {});

      return Object.keys(crimesByCategory)
        .sort()
        .map((category) => {
          const color = getCategoryColor(categoryColorMap, category);
          return (
            <ListItem key={category}>
              <ListItemButton className="flex flex-row items-center gap-3">
                <Box
                  className="h-3.5 w-3.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <Box className="flex flex-col items-start">
                  <Typography variant="h6">{category}</Typography>
                  <Typography>{crimesByCategory[category]}</Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          );
        });
    },
    [categoryColorMap]
  );

  return (
    <Drawer
      variant="persistent"
      open={open}
      PaperProps={{ className: "!z-[500]" }}
    >
      <Box className="mr-2 mt-16 flex w-[20em] justify-end p-[1em]">
        <IconButton onClick={handleClick}>
          <ChevronLeft></ChevronLeft>
        </IconButton>
      </Box>
      <Box>
        <List className="w-full">{renderCrimesByCategory(crimes)}</List>
      </Box>
    </Drawer>
  );
}

export default SummaryDrawer;
