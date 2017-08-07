import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header.jsx';
import Content from './Content.jsx';
import Footer from './Footer.jsx';
import fetch from 'isomorphic-fetch';
import { snapshot } from 'react-snapshot';

export default class App extends Component {
  state = {
    content: null
  };

  updateContent({params}) {
    const p = snapshot(() =>
      fetch(`/api/${params.jurisdiction}/${params.topic}`).then(response => response.json())
    ).then((content) => this.setState({content}));

    // this works around a bug in snapshot where it doesn't return a promise with a .catch() method
    p && p.catch(e => console.log(e));
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
