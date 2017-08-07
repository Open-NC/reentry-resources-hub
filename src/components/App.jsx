import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header.jsx';
import Content from './Content.jsx';
import Footer from './Footer.jsx';
import { snapshot } from 'react-snapshot';
import fetch from 'isomorphic-fetch';

export default class App extends Component {
  state = {
    content: null
  };

  updateContent({params}) {
    snapshot(() =>
      fetch(`/api/${params.jurisdiction}/${params.topic}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response from server');
        }

        return response.json();
      }).catch(e => console.error(e))
    ).then((content) => this.setState({content}));
  }

  componentWillMount() {
    this.updateContent(this.props.match);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match !== nextProps.match) {
      this.updateContent(nextProps.match);
    }
  }

  render() {
    return (
      this.state.content ?
        <div>
          <Header {...this.props} data={this.state.content} />
          <Content data={this.state.content} />
          <Footer />
        </div> : null
    );
  }
}

App.propTypes = {
  match: PropTypes.object.isRequired,
};
