import React from 'react';
import Content from './Content';

class App extends React.Component {
  render() {
    return(
      <div>
        <h1>{this.props.data.config.local_jurisdiction_name} County, {this.props.data.config.common_jurisdiction_name}</h1>
        <h1>{this.props.data.config.page_name}</h1>
        <Content data={this.props.data} />
      </div>
    );
  }
};

module.exports = App;
