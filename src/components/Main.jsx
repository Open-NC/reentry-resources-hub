import React from 'react';
import { Col, Row } from 'react-bootstrap';
import renderHTML from 'react-render-html';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as contentActions from '../actions/contentActions';

class Main extends React.Component {

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps nextProps');
    console.log(nextProps);
    if (this.props.params !== nextProps.params) {
      this.props.actions.loadMainContent(nextProps.params);
    }
  }

  render() {
    const data = this.props.content;
    console.log('I am the Main conponent data');
    console.log(this.props.data);
    return (
      <div>
        <Header data={data} />
        <Row>
          <Col md={2}></Col>
          <Col xs={12} md={8}>
            {console.log('Main Component')}
            <div className='content-body'>
              {data.common.description.map((element) => {
                return (
                  <div>
                    {renderHTML(element)}
                  </div>
                );
              })}
            </div>
          </Col>
          <Col md={2}></Col>
        </Row>
        <Footer />
      </div>
    );
  }
}

Main.propTypes = {
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
export default connect(mapStateToProps, mapDispatchToProps)(Main);
//module.exports = Main;
