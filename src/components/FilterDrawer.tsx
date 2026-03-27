import { ChevronRight } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { QueryFilter } from "../App";
import useCrimesContext from "../context/CrimesContext";
import { getCategoryColor } from "../utils/categoryColors";

interface FilterDrawerProps {
  open: boolean;
  handleClick: () => void;
  setQueryFilter: React.Dispatch<React.SetStateAction<QueryFilter>>;
  queryFilter: QueryFilter;
  selectedMarkerTypes: string[];
  setSelectedMarkerTypes: React.Dispatch<React.SetStateAction<string[]>>;
}

function FilterDrawer({
  open,
  handleClick,
  queryFilter,
  setQueryFilter,
  selectedMarkerTypes,
  setSelectedMarkerTypes,
}: FilterDrawerProps) {
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

  const crimeCountsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const crime of crimes) {
      const category = crime.attributes.CSI_CATEGORY?.trim() || "Unknown";
      counts[category] = (counts[category] ?? 0) + 1;
    }

    return counts;
  }, [crimes]);

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={open}
      PaperProps={{ className: "!z-[500]" }}
    >
      <Box className="ml-2 mt-16 flex w-[20em] justify-start p-[1em]">
        <IconButton onClick={handleClick} aria-label="Close filters">
          <ChevronRight />
        </IconButton>
      </Box>
      <Box className="p-[1em]">
        <FormControl fullWidth>
          <InputLabel id="filter-year-select-label">Year</InputLabel>
          <Select
            labelId="filter-year-select-label"
            id="filter-year-select"
            label="Year"
            value={queryFilter.OCC_YEAR}
            onChange={(e) =>
              setQueryFilter((current) => ({
                ...current,
                OCC_YEAR: Number(e.target.value),
              }))
            }
          >
            <MenuItem value={2013}>2013</MenuItem>
            <MenuItem value={2014}>2014</MenuItem>
            <MenuItem value={2015}>2015</MenuItem>
            <MenuItem value={2016}>2016</MenuItem>
            <MenuItem value={2017}>2017</MenuItem>
            <MenuItem value={2018}>2018</MenuItem>
            <MenuItem value={2019}>2019</MenuItem>
            <MenuItem value={2020}>2020</MenuItem>
            <MenuItem value={2021}>2021</MenuItem>
            <MenuItem value={2022}>2022</MenuItem>
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
          </Select>
        </FormControl>
        <List dense className="mt-4 w-full">
          {categories.map((category) => {
            const isSelected = selectedMarkerTypes.includes(category);
            const color = getCategoryColor(categoryColorMap, category);
            const count = crimeCountsByCategory[category] ?? 0;

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
                  <Box className="flex items-center">
                    <Typography variant="body1">{category}</Typography>
                    <span className="mx-2">-</span>
                    <Typography variant="body1" className="font-bold!">
                      {count}
                    </Typography>
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
    </Drawer>
  );
}

export default FilterDrawer;
