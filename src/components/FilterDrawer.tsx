import { ChevronLeft } from "@mui/icons-material";
import {
  Box,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { QueryFilter } from "../App";

interface FilterDrawerProps {
  open: boolean;
  handleClick: () => void;
  setQueryFilter: React.Dispatch<React.SetStateAction<QueryFilter>>;
  queryFilter: QueryFilter;
}

function FilterDrawer({
  open,
  handleClick,
  queryFilter,
  setQueryFilter,
}: FilterDrawerProps) {
  return (
    <Drawer variant="persistent" open={open} sx={{ zIndex: 500 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mr: 1, mt: 8 }}>
        <IconButton onClick={handleClick}>
          <ChevronLeft></ChevronLeft>
        </IconButton>
      </Box>
      <Box>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={queryFilter.OCC_YEAR}
            label="Year"
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
          </Select>
        </FormControl>
      </Box>
    </Drawer>
  );
}

export default FilterDrawer;
