import React from 'react';
import { Col, Navbar, Nav, NavItem, Row } from 'react-bootstrap';

class Header extends React.Component {
  render() {
    return(
      <div>
        <h1>Reentry Resources Hub</h1>
        <h1>{this.props.data.config.common_jurisdiction_name} Reentry Resources Hub</h1>
        <h1>{this.props.data.config.local_jurisdiction_name} County</h1>
        <h4>Resources & assistance for those with criminal convictions or returning to the community after incarceration</h4>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Choose County</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="./home">Home</NavItem>
              <NavItem eventKey={2} href="./housing">Housing</NavItem>
              <NavItem eventKey={3} href="./jobs">Jobs</NavItem>
              <NavItem eventKey={4} href="./benefits">Public Benefits</NavItem>
              <NavItem eventKey={5} href="./health">Health Care</NavItem>
              <NavItem eventKey={6} href="./education">Education</NavItem>
              <NavItem eventKey={7} href="./legal">Legal</NavItem>
              <NavItem eventKey={8} href="./support">Supporting Programs</NavItem>
              <NavItem eventKey={9} href="./other">Other Resources</NavItem>
              <NavItem eventKey={10} href="./contact">Contact Us</NavItem>
            </Nav>
            <Nav pullRight></Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
};

module.exports = Header;
