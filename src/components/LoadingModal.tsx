import { Modal, Spinner } from "react-bootstrap";

const LoadingModal = ({ show }: { show?: boolean }) => {
  return (
    <Modal size="sm" show={show} keyboard={false} centered>
      <Modal.Body
        className="text-center text-white"
        style={{ background: "#212529" }}
      >
        <Spinner
          style={{ width: "3rem", height: "3rem", borderWidth: ".5rem" }}
          animation="border"
          variant="primary"
        />
        <div>Loading...</div>
      </Modal.Body>
    </Modal>
  );
};

export default LoadingModal;
