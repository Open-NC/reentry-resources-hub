import React from 'react';
import { Col, Navbar, Nav, NavItem, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Header extends React.Component {
  render() {
    return(
      <div>
        <div className="site-header">
          <div className="header-background-image">
            <div className="title-box">
              <h1>Reentry Resources Hub</h1>
              <h1>{this.props.data.config.common_jurisdiction_name} Reentry Resources Hub</h1>
              <h1>{this.props.data.config.local_jurisdiction_name} County</h1>
              <h4>Resources & assistance for those with criminal convictions or returning to the community after incarceration</h4>
            </div>
          </div>
        </div>
        <Navbar default collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Choose County</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to={`/${this.props.data.config.local_jurisdiction}/home`}>
                <NavItem eventKey={1}>Home</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${this.props.data.config.local_jurisdiction}/housing`}>
                <NavItem eventKey={2}>Housing</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${this.props.data.config.local_jurisdiction}/jobs`}>
                <NavItem eventKey={3}>Jobs</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${this.props.data.config.local_jurisdiction}/benefits`}>
                <NavItem eventKey={4}>Public Benefits</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${this.props.data.config.local_jurisdiction}/health`}>
                <NavItem eventKey={5}>Health Care</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${this.props.data.config.local_jurisdiction}/education`}>
                <NavItem eventKey={6}>Education</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${this.props.data.config.local_jurisdiction}/legal`}>
                <NavItem eventKey={7}>Legal</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${this.props.data.config.local_jurisdiction}/support`}>
                <NavItem eventKey={8}>Supporting Programs</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${this.props.data.config.local_jurisdiction}/other`}>
                <NavItem eventKey={9}>Other Resources</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${this.props.data.config.local_jurisdiction}/contact`}>
                <NavItem eventKey={10}>Contact Us</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
};

module.exports = Header;
