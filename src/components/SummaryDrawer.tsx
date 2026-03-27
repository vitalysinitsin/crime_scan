import {
  Box,
  Drawer,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Checkbox,
  Typography,
} from "@mui/material";
import useCrimesContext from "../context/CrimesContext";
import { ChevronLeft } from "@mui/icons-material";
import { TorontoMCIFeature } from "../models/feature";
import { useCallback, useMemo } from "react";
import { getCategoryColor } from "../utils/categoryColors";
import type { Dispatch, SetStateAction } from "react";

interface SummaryPanelProps {
  open: boolean;
  handleClick: () => void;
  selectedMarkerTypes: string[];
  setSelectedMarkerTypes: Dispatch<SetStateAction<string[]>>;
}

type SummaryList = {
  [key: string]: number;
};

function SummaryDrawer({
  open,
  handleClick,
  selectedMarkerTypes,
  setSelectedMarkerTypes,
}: SummaryPanelProps) {
  const { crimes, categoryColorMap } = useCrimesContext();

  const categories = useMemo(
    () => Object.keys(categoryColorMap).sort(),
    [categoryColorMap],
  );

  const toggleMarkerType = (category: string) => {
    setSelectedMarkerTypes((prev) => {
      const isSelected = prev.includes(category);
      if (isSelected) return prev.filter((c) => c !== category);
      return [...prev, category];
    });
  };

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
      <Box className="px-[1em]">
        <Typography variant="subtitle1">Marker Types</Typography>
        <List dense className="w-full">
          {categories.map((category) => {
            const isSelected = selectedMarkerTypes.includes(category);
            const color = getCategoryColor(categoryColorMap, category);

            return (
              <ListItem key={category} disablePadding>
                <ListItemButton
                  className="flex flex-row items-center gap-3 px-2"
                  selected={isSelected}
                  onClick={() => toggleMarkerType(category)}
                >
                  <Checkbox
                    edge="start"
                    checked={isSelected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleMarkerType(category)}
                    inputProps={{ "aria-label": `Select ${category}` }}
                  />
                  <Box
                    className="h-3.5 w-3.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <Box className="flex flex-col items-start">
                    <Typography variant="body2">{category}</Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {selectedMarkerTypes.length > 0 ? (
          <Typography
            variant="caption"
            className="mt-1 cursor-pointer underline"
            onClick={() => setSelectedMarkerTypes([])}
          >
            Clear selection
          </Typography>
        ) : null}
      </Box>

      <Divider />

      <Box>
        <List className="w-full">{renderCrimesByCategory(crimes)}</List>
      </Box>
    </Drawer>
  );
}

export default SummaryDrawer;
