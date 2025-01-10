import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import MapComponent from "./components/Map/MapComponent";

function App() {
  const [searchParams, setSearchParams] = useState({ year: "2023" });

  return (
    <div>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="placeholder-glow position-relative"
      >
        <Navbar.Brand className="ms-4">crime_scan</Navbar.Brand>
        <Navbar.Text>
          <span>Currently displays all crimes commited in Toronto in </span>
          {searchParams.year}
        </Navbar.Text>
      </Navbar>
      <MapComponent searchParams={searchParams} />
      <footer></footer>
    </div>
  );
}
export default App;
