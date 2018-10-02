import React from 'react';
import { NavLink } from 'react-router-dom';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router'
import gql from 'graphql-tag';
import { Navbar, Nav } from 'react-bootstrap';

// If the current URL does not have a county, return an empty Navbar
// If the current URL is a county, return the taxonomies as links with that county filled in

const TaxonomiesNav = ({ location }) => (
  <Query
    query={gql`query getTaxonomies {
      taxonomies {
        name
      }
    }`}
  >
      {({ loading, error, data }) => {
        if (loading) {
          return <Navbar/>
        }
        if (error) {
          console.log(error);
          return <div className="page-text"> Error :( </div>;
        }
        const splitPath = location.pathname.split('/')
        if (splitPath[splitPath.length - 1] === '') {
          return <Navbar/>
        }
        return <Navbar.Collapse>
          <Nav pullRight>
          {data.taxonomies.map(taxonomy => (
            <li key={taxonomy.name}>
              <NavLink
                to={`/${splitPath[1]}/${taxonomy.name}`}
                className="nav navbar-nav navbar-right"
                activeClassName="selected"
              >
                {taxonomy.name}
              </NavLink>
            </li>
          ))}
          </Nav>
        </Navbar.Collapse>
      }}
  </Query>
)


export default withRouter(TaxonomiesNav);
