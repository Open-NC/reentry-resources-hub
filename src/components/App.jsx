/* eslint no-console: 0 */
import React from 'react';
import Header from './Header.jsx';
import Content from './Content.jsx';
import Footer from './Footer.jsx';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import * as contentActions from '../actions/contentActions';
require('es6-promise').polyfill();

class App extends React.Component {
  // constructor(props, context) {
  //   super(props, context);
  // }

  // _fetchContent(jurisdiction, topic) {
  //   fetch(`/api/${jurisdiction}/${topic}`)
  //   .then((response) => {
  //     if (response.status >= 400) {
  //       throw new Error('Bad response from server');
  //     }
  //     console.log('Layout response');
  //     console.log(response);
  //     return response.json();
  //   })
  //   .then((content) => {
  //     console.log('Layout content');
  //     console.log(content);
  //     //this.setState({ data: content });
  //     this.props.actions.createContent(this.state.content);
  //   });
  // }

  // componentDidMount() {
  //   console.log('this.props.actions');
  //   console.log(this.props.actions);
  //   this.props.actions.loadContent(this.props.params.jurisdiction, this.props.params.topic);
  // }

  render() {
    return (
      <div>
        <Header data={this.props.content} />
        {console.log('App this.props.content')}
        {console.log(this.props)}
        <Content data={this.props.content} />
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  //data: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  content: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
      content: state.content
    };
}

function mapDispatchToProps(dispatch) {
  return {
    // createContent: content => dispatch(contentActions.createContent(content))
    actions: bindActionCreators(contentActions, dispatch)
  };
}

// Connect function from react-redux function allows components to interact with redux.
// These components are called 'container components'.
// Connect returns a function that is called immediately with the 'App' parameter.
export default connect(mapStateToProps, mapDispatchToProps)(App);
