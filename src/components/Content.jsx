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
                  <li>
                    <a href={url}>{name}</a><p>{description}</p>
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
    const urlTemplate = get(this.props, ['data', 'common', 'local', 'resources', 0, 'url'], '/');
    const commonJ = get(data, ['config', 'common_jurisdiction'], '');
    const localJ = get(data, ['config', 'local_jurisdiction'], '');
    const pageName = get(data, ['config', 'page_name'], '');
    const url = urlTemplate.replace(/{{common_jurisdiction}}/g, commonJ).replace(/{{local_jurisdiction}}/g, localJ);

    return (
      <div className="content-body">
        <Row>
          <Col xs={1} sm={2} md={2}></Col>
          <Col xs={10} sm={8} md={8}>
            <h1>{pageName}</h1>

            {/* Common Description */}
            <div dangerouslySetInnerHTML={{ __html: get(this.props, ['data', 'common', 'description'], '') }} />

            <h2>Local Information</h2>
            {/* Local Description */}
            <div dangerouslySetInnerHTML={{ __html: get(this.props, ['data', 'jurisdiction', 'description'], '') }} />

            <h2>Resources</h2>
            <h3>National, State, and General Resources</h3>
            {/* Common Resources */}
            <ul>
              {get(this.props, ['data', 'common', 'resources'], []).map((resource) => {
                const tag = <li key={resource.url}><a href={resource.url}>{resource.name}</a><p>{resource.description}</p></li>;
                return tag;
              })}
            </ul>
            <h3>Local and Regional Resources</h3>
            {/* Local Resources */}
            {Content.jurisdictionResources(get(this.props, ['data', 'common', 'local', 'resources'], []))}

            <h4>Local Resources from 211</h4>
            {/* Common Local Resources */}
            <ul>
              {get(this.props, ['data', 'common', 'local', 'resources'], []).map((resource) => {
                const tag = <li key={url}><a href={url}>{resource.name}</a><p>{resource.description}</p></li>;
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
