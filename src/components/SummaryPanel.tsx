import useCrimesContext from "../context/CrimesContext";

function SummaryPanel() {
  const { crimes } = useCrimesContext();

  // filtering offence types WIP ***START
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

  return <div></div>;
}

export default SummaryPanel;
