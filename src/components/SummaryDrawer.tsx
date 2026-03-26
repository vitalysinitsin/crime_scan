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
              <ListItemButton
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: color,
                    flexShrink: 0,
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
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
