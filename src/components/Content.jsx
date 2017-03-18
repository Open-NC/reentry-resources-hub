import React from 'react';
import renderHTML from 'react-render-html';
import { Col, Row } from 'react-bootstrap';

class Content extends React.Component {

  _getUniqueCategory(array) {
    const allCategories = array.map(function(array) {return array.category;});
    const uniqueCategories = allCategories.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
    return uniqueCategories;
  }

  _formatJurisdictionResources(localResources) {
    let categories = this._getUniqueCategory(localResources);
    let resourcesHtml = "";
    categories.forEach(function(category) {
      resourcesHtml += "<li>" + category + "</li>";
      resourcesHtml += "<ul>";
      localResources.map(function(resource) {
        if(resource.category === category) {
          resourcesHtml += "<li>" + "<a href=" + resource.url + ">" + resource.name + "</a><p>" + resource.description + "</p></li>";
        }
      });
      resourcesHtml += "</ul>";
    });
    return renderHTML(resourcesHtml);
  }

  render() {
    const urlTemplate = this.props.data.common.local.resources[0].url;
    const commonJ = this.props.data.config.common_jurisdiction;
    const localJ = this.props.data.config.local_jurisdiction;
    const url = urlTemplate.replace(/{{common_jurisdiction}}/g, commonJ).replace(/{{local_jurisdiction}}/g, localJ);
    return (
      <div className="content-body">
        <Row>
          <Col md={3}></Col>
            <Col xs={12} md={6}>
              <h1>{this.props.data.config.page_name}</h1>

              {/* Common Description */}
              {renderHTML(this.props.data.common.description)}

              <h2>Local Information</h2>
              {/* Local Description */}
              {renderHTML(this.props.data.jurisdiction.description)}

              <h2>Resources</h2>
              <h3>National, State, and General Resources</h3>
              {/* Common Resources */}
              <ul>
                {this.props.data.common.common.resources.map(function(resource) {
                    return <li key={resource.url}><a href={url}>{resource.name}</a><p>{resource.description}</p></li>
                })}
              </ul>
              <h3>Local and Regional Resources</h3>
              {/* Local Resources */}
              <ul>
                {this._formatJurisdictionResources(this.props.data.jurisdiction.local.resources)}
              </ul>

              <h4>Local Resources from 211</h4>
              {/* Common Local Resources */}
              <ul>
                {this.props.data.common.local.resources.map(function(resource) {
                    return <li key={resource.url}><a href={url}>{resource.name}</a><p>{resource.description}</p></li>
                })}
              </ul>
            </Col>
          <Col md={3}></Col>
        </Row>
      </div>
    );
  }
};

module.exports = Content;
