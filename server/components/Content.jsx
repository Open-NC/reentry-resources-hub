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
      <div>
        {/* Common Description */}
        {renderHTML(this.props.data.common.description)}

        {/* Common Resources */}
        <ul>
          {this.props.data.common.common.resources.map(function(resource) {
              return <li key={resource.url}><a href={url}>{resource.name}</a><p>{resource.description}</p></li>
          })}
        </ul>

        {/* Common Local Resources */}
        {/* TODO: MAKE THE ICAROL URL DYNAMIC */}
        <ul>
          {this.props.data.common.local.resources.map(function(resource) {
              return <li key={resource.url}><a href={url}>{resource.name}</a><p>{resource.description}</p></li>
          })}
        </ul>

        {/* Local Description */}
        {renderHTML(this.props.data.jurisdiction.description)}

        <h2>Additional Resources</h2>
        {/* Local Resources */}
        {/* TODO: NEED TO SORT THESE RESOURCES BY CATEGORY */}
        <ul>
          {this._formatJurisdictionResources(this.props.data.jurisdiction.local.resources)}
        </ul>
      </div>
    );
  }
};

module.exports = Content;
