import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Col, Row, Grid } from 'react-bootstrap';

const CountiesIndex = () => (
  <Query
    query={gql`query getCounties($type: String!) {
      locations(type: $type) {
        name
        alternate_name
      }
    }`}
    variables={{ type: 'county' }}
  >
      {({ loading, error, data }) => {
        if (loading) return <div> Loading </div>;
        if (error) {
          console.log(error);
          return <div className="page-text">Error :( </div>;
        }
        const sortedLocations = data.locations
          .map(d => Object.assign(d))
          .sort((a, b) => {
            if(a.alternate_name < b.alternate_name) return -1;
            if(a.alternate_name > b.alternate_name) return 1;
            return 0;
          })
        // eslint-disable-next-line
        const dedupedFirstLetters = sortedLocations
          .map(location => location.alternate_name.slice(0, 1))
          .filter((letter, index, array) => array.indexOf(letter) === index)
        // TODO: IS IT BETTER TO HAVE A LIST OF LETTERS TO CLICK???
        const dataGroupLength = sortedLocations.length / 4;
        const dataGroups = [
          sortedLocations.slice(0, dataGroupLength),
          sortedLocations.slice(dataGroupLength, dataGroupLength * 2),
          sortedLocations.slice(dataGroupLength * 2, dataGroupLength * 3),
          sortedLocations.slice(dataGroupLength * 3, sortedLocations.length)
        ]

        return (<Grid>
          <p>Select your county to find local resources</p>
          <Row>
          {dataGroups.map((group, groupIndex) => (
            <Col xs={12} sm={3} md={3} key={groupIndex}>
              <div className="county-list">
                {group.map(county => (
                  <Link
                    to={`/${county.name}/home`}
                    className="county-button"
                    key={county.name}
                    style={{ width: '100%'}}
                  >
                    <div key={county.name} className="county-item">
                      {county.alternate_name}
                    </div>
                  </Link>
                ))}
              </div>
            </Col>
          ))}
          </Row>
        </Grid>);
      }}
  </Query>
)


export default CountiesIndex;
