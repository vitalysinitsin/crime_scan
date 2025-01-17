function LoadingModal({ show }: { show?: boolean }) {
  return (
    <div>
      <div className="text-center text-white" style={{ background: "#212529" }}>
        <div style={{ width: "3rem", height: "3rem", borderWidth: ".5rem" }} />
        <div>Loading...</div>
      </div>
    </div>
  );
}

export default LoadingModal;
