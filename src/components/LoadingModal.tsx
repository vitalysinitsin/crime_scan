import { Box, CircularProgress, Modal, Typography } from "@mui/material";

function LoadingModal({ open }: { open?: boolean }) {
  return (
    <Modal open={!!open}>
      <Box
        className="absolute left-1/2 top-1/2 mx-auto flex w-[250px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8 bg-[#222222] p-10 text-center text-white"
      >
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    </Modal>
  );
}

export default LoadingModal;
