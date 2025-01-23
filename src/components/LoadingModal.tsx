import { Box, CircularProgress, Modal, Typography } from "@mui/material";

function LoadingModal({ open }: { open?: boolean }) {
  return (
    <Modal open={!!open}>
      <Box
        className="text-center text-white"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          position: "absolute",
          width: 250,
          p: 5,
          margin: "auto",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#222222",
        }}
      >
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    </Modal>
  );
}

export default LoadingModal;
