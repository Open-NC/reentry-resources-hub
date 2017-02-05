const React = require('react');
const compose = require('./compose');
const Content = require('./content');

class Home extends React.Component {
  constructor() {
    super();
  };

  render() {
    return(
      <div>
        <h1>I am a react component rendered from the server. Hot damn!</h1>
        <h1>Home</h1>
        <Content localResource={this.props.data.common.local.resources[0].name} localDesc={this.props.data.common.local.resources[0].link} />
      </div>
    );
  }
};

module.exports = Home;
