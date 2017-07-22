import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from './Header.jsx';
import Search from './Search.jsx';
import Content from './Content.jsx';
import Footer from './Footer.jsx';
import * as contentActions from '../actions/contentActions';

class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.params !== nextProps.params) {
      this.props.actions.loadContent(nextProps.params.jurisdiction, nextProps.params.topic);
    }
  }

  render() {
    return (
      <div>
        <Header data={this.props.content} />
        <Search />
        {console.log('App this.props.content')}
        {console.log(this.props)}
        <Content data={this.props.content} />
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  content: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  console.log('content : ', state.content);
    return {
      content: state.content,
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
