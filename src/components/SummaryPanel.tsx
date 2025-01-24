import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import useCrimesContext from "../context/CrimesContext";
import {
  AttachMoney,
  CarCrash,
  ChevronLeft,
  DirectionsRun,
  DoNotStep,
  SportsKabaddi,
} from "@mui/icons-material";
import {
  TorontoMCIFeature,
  TorontoMCIFeatureAttributes,
} from "../models/feature";

interface SummaryPanelProps {
  open: boolean;
  handleClick: () => void;
}

type SummaryList = {
  [key: string]: TorontoMCIFeature[];
};

function SummaryPanel({ open, handleClick }: SummaryPanelProps) {
  const { crimes } = useCrimesContext();

  const mcis: SummaryList = crimes.reduce((acc: SummaryList, current) => {
    const currentMciCategory = current.attributes.MCI_CATEGORY;

    return {
      ...acc,
      [currentMciCategory]: [...(acc[currentMciCategory] ?? []), current],
    };
  }, {});

  console.log({ mcis });

  // filtering offence types WIP clean up inc***START
  const uniqueMCI = new Set(crimes.map((ftr) => ftr.attributes.MCI_CATEGORY));

  const assaults = crimes.filter(
    (feature) => feature.attributes.MCI_CATEGORY === "Assault"
  ).length;
  const breaksAndEnters = crimes.filter(
    (feature) => feature.attributes.MCI_CATEGORY === "Break and Enter"
  ).length;
  const autoThefts = crimes.filter(
    (feature) => feature.attributes.MCI_CATEGORY === "Auto Theft"
  ).length;
  const robberies = crimes.filter(
    (feature) => feature.attributes.MCI_CATEGORY === "Robbery"
  ).length;
  const theftsOver = crimes.filter(
    (feature) => feature.attributes.MCI_CATEGORY === "Theft Over"
  ).length;

  console.log(uniqueMCI, crimes, {
    assaults,
    breaksAndEnters,
    autoThefts,
    robberies,
    theftsOver,
  });
  // filtering offence types WIP ***END

  return (
    <Drawer variant="persistent" open={open} sx={{ zIndex: 500 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mr: 1, mt: 8 }}>
        <IconButton onClick={handleClick}>
          <ChevronLeft></ChevronLeft>
        </IconButton>
      </Box>
      <Box>
        <List>
          <ListItem>
            <ListItemIcon>
              <SportsKabaddi></SportsKabaddi>
            </ListItemIcon>
            <ListItemText>Assault: {assaults}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DoNotStep></DoNotStep>
            </ListItemIcon>
            <ListItemText>Break and Enter: {breaksAndEnters}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CarCrash></CarCrash>
            </ListItemIcon>
            <ListItemText>Auto Theft: {autoThefts}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DirectionsRun></DirectionsRun>
            </ListItemIcon>
            <ListItemText>Robbery: {robberies}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AttachMoney></AttachMoney>
            </ListItemIcon>
            <ListItemText>Theft Over: {theftsOver}</ListItemText>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default SummaryPanel;
