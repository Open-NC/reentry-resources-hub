import React from 'react';
import { renderToString } from 'react-dom/server';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import { Col, Row } from 'react-bootstrap';

//require('es6-promise').polyfill();
//import fetch from 'isomorphic-fetch';



class App extends React.Component {


  render() {

    return(
      <div>
        <Row>
          <Col md={2}></Col>
          <Col xs={12} md={8}>
            <Header data={this.props.data} />
              {console.log("this.props.data from App Component")}
              {console.log(this.props.data)}
              <h1>{this.props.data.config.page_name}</h1>
              <Content data={this.props.data} />
            <Footer />
          </Col>
          <Col md={2}></Col>
        </Row>
      </div>
    );
  }
};

module.exports = App;
