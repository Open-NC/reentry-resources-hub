/* eslint no-console: 0 */
import React from 'react';
import fetch from 'isomorphic-fetch';
require('es6-promise').polyfill();

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this._fetchContent(this.props.params.jurisdiction, this.props.params.topic);
  }

  componentWillReceiveProps(nextProps) {
    console.log('Layout nextProps');
    console.log(nextProps);
    if (this.props !== nextProps) {
      if (nextProps.jurisdiction === this.props.params.jurisdiction) {
        this.props.params.topic = nextProps.params.topic;
      } else {
        this.props.params.jurisdiction = nextProps.params.jurisdiction;
        this.props.params.topic = nextProps.params.topic;
      }
      this._fetchContent(this.props.params.jurisdiction, this.props.params.topic);
    }
  }

  _fetchContent(jurisdiction, topic) {
    fetch(`/api/${jurisdiction}/${topic}`)
    .then((response) => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
      console.log('Layout response');
      console.log(response);
      return response.json();
    })
    .then((content) => {
      console.log('Layout content');
      console.log(content);
      this.setState({ data: content });
    });
  }

  render() {
    if (this.state.data) {
      console.log('Layout this.state.data inside render if');
      console.log(this.state.data);
      const children = React.Children.map(this.props.children, child =>
        React.cloneElement(child, { data: this.state.data })
      );

      return (
        <div>
          <div>{children}</div>
        </div>
      );
    }
    return (<div>Loading...</div>);
  }
}

Layout.propTypes = {
  params: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types,
  children: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types,
};

module.exports = Layout;
