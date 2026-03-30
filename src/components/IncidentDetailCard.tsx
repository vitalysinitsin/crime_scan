import { Box, Typography } from "@mui/material";
import { TorontoMCIFeatureAttributes } from "../models/feature";
import { getCategoryColor } from "../utils/categoryColors";
import { formatCoord, formatOccurrenceDisplay } from "../utils/incidentDisplay";

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <Box className="py-0.5">
      <Typography variant="caption" className="block text-white/60">
        {label}
      </Typography>
      <Typography variant="body2" className="text-white">
        {value}
      </Typography>
    </Box>
  );
}

interface IncidentDetailCardProps {
  attributes: TorontoMCIFeatureAttributes;
  categoryColorMap: Record<string, string>;
}

function IncidentDetailCard({
  attributes,
  categoryColorMap,
}: IncidentDetailCardProps) {
  const category = attributes.CSI_CATEGORY?.trim() || "Unknown";
  const color = getCategoryColor(categoryColorMap, category);
  const whenText = formatOccurrenceDisplay(attributes);
  const neighbourhood =
    attributes.NEIGHBOURHOOD_158?.trim() ||
    attributes.NEIGHBOURHOOD_140?.trim() ||
    "";
  const ucr =
    [attributes.UCR_CODE, attributes.UCR_EXT].filter(Boolean).join(" / ") || "";
  const coords = formatCoord(attributes.LAT_WGS84, attributes.LONG_WGS84);

  return (
    <Box className="w-76 shrink-0 py-2">
      <Box className="mb-2 flex gap-2 items-center ">
        <Box
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <Typography variant="subtitle1" className="leading-tight text-white">
          {category}
        </Typography>
      </Box>

      <Box className="space-y-1 border-t border-white/10 pt-2">
        <Row label="Offence" value={attributes.OFFENCE} />
        <Row label="UCR" value={ucr} />
        <Row label="Occurred" value={whenText} />
        <Row label="Location type" value={attributes.LOCATION_TYPE} />
        <Row label="Premises" value={attributes.PREMISES_TYPE} />
        <Row label="Neighbourhood" value={neighbourhood} />
        <Row label="Coordinates" value={coords} />
        <Row label="Event ID" value={attributes.EVENT_UNIQUE_ID} />
        <Row label="Division" value={attributes.DIVISION} />
      </Box>
    </Box>
  );
}

export default IncidentDetailCard;
