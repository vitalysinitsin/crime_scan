import { Box, CircularProgress, Modal, Typography } from "@mui/material";

function LoadingModal({
  open,
  customText,
}: {
  open?: boolean;
  customText?: string;
}) {
  return (
    <Modal open={!!open}>
      <Box className="h-[10rem] p-[2rem] absolute left-1/2 top-1/2 flex w-max -translate-x-1/2 -translate-y-1/2 flex-col justify-center items-center gap-8 bg-[#222222] text-white">
        <CircularProgress />
        <Typography className="text-nowrap">
          {customText ?? "Loading..."}
        </Typography>
      </Box>
    </Modal>
  );
}

export default LoadingModal;
