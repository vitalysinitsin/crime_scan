import { Modal, Spinner } from "react-bootstrap";

const LoadingModal = ({ show }) => {
  return (
    <Modal size="sm" show={show} backdrop="static" keyboard="false" centered>
      <Modal.Body
        className="text-center text-white"
        bg="dark"
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
