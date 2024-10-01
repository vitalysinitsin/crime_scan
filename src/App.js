import React from "react";
import OlMap from "./components/OlMap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import usePaginatedQuery from "./utility/paginatedQuery";

function App() {
  // pull features. TODO: move one layer below, data shouldn't be here
  const options = {
    where: "OCC_YEAR = 2023",
  };
  const { data: yearlyMarkersObj, loading } = usePaginatedQuery(options);

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand className="ms-4">crime_scan</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav></Nav>
        </Navbar.Collapse>
      </Navbar>
      <OlMap yearlyMarkersObj={yearlyMarkersObj} />
      <div>{loading ? "loading ok" : "no loading"}</div>
    </div>
  );
}

export default App;
