import React from 'react';

class Content extends React.Component {
  render() {

    return(
      <div>
        <a href={this.props.data.common.local.resources[0].link}>{this.props.data.common.local.resources[0].name}</a>
      </div>
    );
  }
};

module.exports = Content;
