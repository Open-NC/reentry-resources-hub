import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router'
import gql from 'graphql-tag';
import { Col, Row, Grid, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Navbar, NavItem } from 'react-bootstrap';

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
          return <div className="page-text">Error :( </div>;
        }
        const splitPath = location.pathname.split('/')
        if (splitPath[splitPath.length - 1] === '') {
          return <Navbar/>
        }
        return <Navbar>
          {data.taxonomies.map(taxonomy => (
            <NavItem key={taxonomy.name} href="#">
              <Link to={`/${splitPath[1]}/${taxonomy.name}`}>{taxonomy.name}</Link>
            </NavItem>
          ))}
        </Navbar>
      }}
  </Query>
)


export default withRouter(TaxonomiesNav);
