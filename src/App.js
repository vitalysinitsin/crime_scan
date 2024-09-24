import React from "react";
import OlMap from "./components/OlMap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

function App() {
  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">Cluster Playground</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link href="https://github.com/hungryvito/cluster_test">
              github
            </Nav.Link>
            <Nav.Link href="https://github.com/google-map-react/google-map-react">
              google-map-react
            </Nav.Link>
            <Nav.Link href="https://github.com/leighhalliday/use-supercluster">
              use-supercluster
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <OlMap />
    </div>
  );
}

export default App;
