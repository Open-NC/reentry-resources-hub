import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

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
        // TODO: "about home in whatever county" makes no sense
        if (loading) return <div> Loading </div>;
        if (error) {
          console.log(error);
          return <div className="page-text"> Error :( </div>;
        }
        let header_common = `${data.page.taxonomy}`
        let header_local = `${data.page.taxonomy} in ${data.page.location} County`
        if (data.page.taxonomy === 'Home') {
          header_common = `${data.page.location} County`;
        }
        return <div className="page-text" >
          {header_common && <h1>{header_common}</h1>}
          <div dangerouslySetInnerHTML={{__html: data.page.common_content}}></div>
          {header_local && data.page.local_content && <h2>{header_local}</h2>}
          <div dangerouslySetInnerHTML={{__html: data.page.local_content}}></div>
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
        </div>
      }}
  </Query>
)


export default CountyPage;
