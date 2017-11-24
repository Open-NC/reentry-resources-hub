import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import get from 'lodash.get';

class Content extends Component {
  static _getUniqueCategory(array) {
    const allCategories = array.map(itm => itm.category);
    const uniqueCategories = allCategories.filter((item, i, ar) => ar.indexOf(item) === i);
    return uniqueCategories;
  }

  static jurisdictionResources(localResources) {
    const categories = Content._getUniqueCategory(localResources);

    return (
      <ul>
        {categories.map(category =>
          (
            <li key={category}>
              {category}
              <ul>
                {localResources.filter(resource => resource.category === category).map(({ url, name, description }) => (
                  <li key={url}>
                    <a href={url}>{name}</a><p dangerouslySetInnerHTML={{ __html: description }} />
                  </li>
                ))}
              </ul>
            </li>
          )
        )}
      </ul>
    );
  }

  render() {
    const { data } = this.props;
    const commonJ = get(data, ['config', 'common_jurisdiction'], '');
    const localJ = get(data, ['config', 'local_jurisdiction'], '');
    const pageName = get(data, ['config', 'page_name'], '');

    return (
      <div className="content-body">
        <Row>
          <Col xs={1} sm={2} md={2}></Col>
          <Col xs={10} sm={8} md={8}>
            <h1>{pageName}</h1>

            {/* Common Description */}
            <div dangerouslySetInnerHTML={{ __html: get(this.props, ['data', 'common', 'description'], '') }} />

            { this.props.data.jurisdiction.resources.length > 0 ?
            <div>
              <h2>Local Information</h2>
              {/* Local Description */}
              <div dangerouslySetInnerHTML={{ __html: get(this.props, ['data', 'jurisdiction', 'description'], '') }} />
            </div>: null }

            <h1>Resources</h1>
            <h2>National, State, and General Resources</h2>
            {/* Common Resources */}
            <ul>
              {get(this.props, ['data', 'common', 'resources'], []).map((resource) => {
                const tag = <li key={resource.url}><a href={resource.url}>{resource.name}</a><p dangerouslySetInnerHTML={{ __html: resource.description }} /></li>;
                return tag;
              })}
            </ul>
            <h2>Local and Regional Resources</h2>
            {/* Local Resources */}
            {Content.jurisdictionResources(get(this.props, ['data', 'jurisdiction', 'resources'], []))}

            <h4>Local Resources from 211</h4>
            {/* Common Local Resources */}
            <ul>
              {get(this.props, ['data', 'common', 'local', 'resources'], []).map((resource) => {
                const url = resource.url.replace(/{{common_jurisdiction}}/g, commonJ).replace(/{{local_jurisdiction}}/g, localJ);

                const tag = <li key={url}><a href={url}>{resource.name}</a><p dangerouslySetInnerHTML={{ __html: resource.description }} /></li>;
                return tag;
              })}
            </ul>
          </Col>
        </Row>
      </div>
    );
  }
}

Content.propTypes = {
  data: React.PropTypes.object,
};

export default Content;
