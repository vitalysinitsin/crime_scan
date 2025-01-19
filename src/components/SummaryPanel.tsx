import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import useCrimesContext from "../context/CrimesContext";
import {
  AttachMoney,
  CarCrash,
  DirectionsRun,
  DoNotStep,
  Home,
  SportsKabaddi,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

interface SummaryPanelProps {
  open: boolean;
  handleClick: () => void;
}

function SummaryPanel({ open, handleClick }: SummaryPanelProps) {
  const { crimes } = useCrimesContext();

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
    <Drawer
      variant="temporary"
      open={open}
      ModalProps={{ keepMounted: false }}
      onClick={handleClick}
    >
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
    </Drawer>
  );
}

export default SummaryPanel;
