import React from 'react';

class Content extends React.Component {
  render() {
    const urlTemplate = this.props.data.common.local.resources[0].url;
    const commonJ = this.props.data.config.common_jurisdiction;
    const localJ = this.props.data.config.local_jurisdiction;
    const url = urlTemplate.replace(/{{common_jurisdiction}}/g, commonJ).replace(/{{local_jurisdiction}}/g, localJ);
    return (
      <div>
        <a href={url}>{this.props.data.common.local.resources[0].name}</a>
      </div>
    );
  }
}

module.exports = Content;
