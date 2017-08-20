import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, Button, Glyphicon } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Helmet from 'react-helmet';
import get from 'lodash.get';

export default class Header extends Component {
  render() {
    const jurisdiction = get(this.props, ['match', 'params', 'jurisdiction']);

    return (
      <div>
        <Helmet title={jurisdiction ? `${jurisdiction} County – NC Reentry Resources Hub` : `NC Reentry Resources Hub`} />
        <div className="site-header">
          <div className="header-background-image">
            <div className="title-box">
              <h1>NC Reentry Resources Hub</h1>
              {jurisdiction && <h2>{jurisdiction}</h2>}
              <h4>Resources & assistance for those with criminal convictions or returning to the community after incarceration</h4>
            </div>
          </div>
        </div>
        <Navbar default collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Reentry Hub</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            {jurisdiction && <Nav>
              <LinkContainer to={`/${jurisdiction}/home/`}>
                <NavItem eventKey={1}>Home</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${jurisdiction}/housing/`}>
                <NavItem eventKey={2}>Housing</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${jurisdiction}/jobs/`}>
                <NavItem eventKey={3}>Jobs</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${jurisdiction}/benefits/`}>
                <NavItem eventKey={4}>Benefits</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${jurisdiction}/health/`}>
                <NavItem eventKey={5}>Healthcare</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${jurisdiction}/education/`}>
                <NavItem eventKey={6}>Education</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${jurisdiction}/legal/`}>
                <NavItem eventKey={7}>Legal</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${jurisdiction}/support/`}>
                <NavItem eventKey={8}>Support Programs</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${jurisdiction}/other/`}>
                <NavItem eventKey={9}>Other Resources</NavItem>
              </LinkContainer>

              <LinkContainer to="/contact/">
                <NavItem eventKey={10}>Contact Us</NavItem>
              </LinkContainer>
            </Nav>}
            <Nav pullRight>
              <Navbar.Form>
                <Button type="button">
                  <Glyphicon glyph="search" />
                </Button>
              </Navbar.Form>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
