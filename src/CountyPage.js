import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Col, Row, Grid, ListGroup, ListGroupItem } from 'react-bootstrap';

const CountyPage = (props) => (
  <Query
    query={gql`query getPage($taxonomy: String!, $location: String!) {
      page(taxonomy: $taxonomy, location: $location) {
        location
        taxonomy
        common_content
        local_content
        common_services {
          name
          description
          url
        }
        local_services {
          name
          description
          url
        }
        localized_services{
          name
          description
          url
        }
      }
    }`}
    variables={{
      taxonomy: props.match.params.taxonomy,
      location: props.match.params.county,
    }}
  >
      {({ loading, error, data }) => {
        if (loading) return <div> Loading </div>;
        if (error) {
          console.log(error);
          return <div className="page-text">Error :( </div>;
        }
        // console.log(data.page)
        return <div
          dangerouslySetInnerHTML={{__html: data.page.common_content}}
          className="page-text"
        >
        </div>
      }}
  </Query>
)


export default CountyPage;
