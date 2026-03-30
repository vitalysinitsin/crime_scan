import { ChevronLeft } from "@mui/icons-material";
import { Box, Button, Drawer, Typography } from "@mui/material";
import { TorontoMCIFeatureAttributes } from "../models/feature";
import useCrimesContext from "../context/CrimesContext";
import IncidentDetailCard from "./IncidentDetailCard";

interface IncidentDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  incidents: TorontoMCIFeatureAttributes[] | null;
}

function IncidentDetailDrawer({
  open,
  onClose,
  incidents,
}: IncidentDetailDrawerProps) {
  const { categoryColorMap } = useCrimesContext();
  const list = incidents ?? [];

  return (
    <Drawer
      anchor="left"
      variant="persistent"
      open={open}
      PaperProps={{
        className: "!z-[500] bg-[#121212] w-full max-w-[21rem]",
      }}
    >
      <Box className="fixed top-14 left-80 z-501 h-max w-max bg-[#121212] p-1">
        <Button onClick={onClose} aria-label="Close incident details">
          <ChevronLeft className="text-white" />
        </Button>
      </Box>
      <Box className="flex h-full flex-col overflow-hidden p-4 pt-24">
        <Typography variant="h6" className="mb-3 text-white">
          Incident details ({list.length})
        </Typography>
        {list.length === 0 ? (
          <Typography variant="body2" className="text-white/60">
            No incident selected.
          </Typography>
        ) : (
          <Box className="min-h-0 overflow-x-auto overflow-y-auto flex">
            {list.map((attrs, index) => (
              <IncidentDetailCard
                key={
                  attrs.EVENT_UNIQUE_ID ||
                  `incident-${index}-${attrs.LAT_WGS84}-${attrs.LONG_WGS84}-${attrs.OCC_DATE}`
                }
                attributes={attrs}
                categoryColorMap={categoryColorMap}
              />
            ))}
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

export default IncidentDetailDrawer;
