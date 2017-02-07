import React from 'react';
import { Col, Navbar, Nav, NavItem, Row } from 'react-bootstrap';

class Header extends React.Component {
  render() {
    return(
      <div>
        <h1>{this.props.data.config.common_jurisdiction_name} Reentry Resources Hub</h1>
        <h1>{this.props.data.config.local_jurisdiction_name} County</h1>
        <h4>Resources & assistance for those with criminal convictions or returning to the community after incarceration</h4>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="#">Home</NavItem>
              <NavItem eventKey={2} href="#">Housing</NavItem>
              <NavItem eventKey={3} href="#">Jobs</NavItem>
              <NavItem eventKey={4} href="#">Public Benefits</NavItem>
              <NavItem eventKey={5} href="#">Health Care</NavItem>
              <NavItem eventKey={6} href="#">Education</NavItem>
              <NavItem eventKey={7} href="#">Legal</NavItem>
              <NavItem eventKey={8} href="#">Supporting Programs</NavItem>
              <NavItem eventKey={9} href="#">Other Resources</NavItem>
              <NavItem eventKey={10} href="#">Contact Us</NavItem>
            </Nav>
            <Nav pullRight></Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
};

module.exports = Header;
