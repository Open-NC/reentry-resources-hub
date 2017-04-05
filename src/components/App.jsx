/* eslint no-console: 0 */
import React from 'react';
import Header from './Header.jsx';
import Content from './Content.jsx';
import Footer from './Footer.jsx';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as contentActions from '../actions/contentActions';

class App extends React.Component {

  componentWillReceiveProps(nextProps) {
      console.log('componentWillReceiveProps nextProps');
      console.log(nextProps);
      if (this.props.params !== nextProps.params) {
        this.props.actions.loadContent(nextProps.params.jurisdiction, nextProps.params.topic);
      }
    }

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
  content: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

function mapStateToProps(state, ownProps) {
    return {
      content: state.content
    };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(contentActions, dispatch)
  };
}

// Connect function from react-redux function allows components to interact with redux.
// These components are called 'container components'.
// Connect returns a function that is called immediately with the 'App' parameter.
export default connect(mapStateToProps, mapDispatchToProps)(App);
