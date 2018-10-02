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
          return <div className="page-text"> Error :( </div>;
        }
        return <div className="page-text" >
          <h1>About {data.page.taxonomy} in {data.page.location} County</h1>
          <div dangerouslySetInnerHTML={{__html: data.page.common_content}}></div>
          {(data.page.local_services.length > 0 || data.page.localized_services.length > 0)
            && (<div>
            <h2>{data.page.taxonomy} Resources in {data.page.location} County</h2>
            <ul>
              {data.page.local_services.concat(data.page.localized_services).map(localishService => (
                <li key={`local-${localishService.name}`}>
                  <a rel="noopener noreferrer" target="_blank" href={localishService.url}>{localishService.name}</a>
                </li>
              ))}
            </ul>
          </div>)}
          {data.page.common_services.length > 0 && (<div>
            <h2>{data.page.taxonomy} Resources in North Carolina</h2>
            <ul>
              {data.page.common_services.map(commonService => (
                <li key={`common-${commonService.name}`}>
                  <a rel="noopener noreferrer" target="_blank" href={commonService.url}>{commonService.name}</a>
                </li>
              ))}
            </ul>
          </div>)}

          <ul>
          </ul>
        </div>
      }}
  </Query>
)


export default CountyPage;
