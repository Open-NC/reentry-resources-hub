var React = require('react');

var Home = React.createClass({
  render: function() {
    return (
      <div>
        <h1>I am rendered from the server. Hot damn!</h1>
      </div>
    );
  }
});

module.exports = Home;
