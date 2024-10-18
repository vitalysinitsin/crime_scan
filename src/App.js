import React from "react";
import Navbar from "react-bootstrap/Navbar";
import MapComponent from "./components/MapComponent";

function App() {
  return (
    <div>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="placeholder-glow position-relative"
      >
        <Navbar.Brand className="ms-4">crime_scan</Navbar.Brand>
        <Navbar.Brand className="ms-4">
          <span>WIP. next step: add clusters ASAP</span>
        </Navbar.Brand>
      </Navbar>
      <MapComponent />
      <footer>hungryvito</footer>
    </div>
  );
}
export default App;
