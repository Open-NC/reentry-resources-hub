import React from 'react';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import { Col, Row } from 'react-bootstrap';

class App extends React.Component {
  render() {
    return(
      <div>
      <Row>
      <Col md={2}>
      </Col>
      <Col xs={12} md={8}>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css" />
        <Header data={this.props.data} />
        <h1>{this.props.data.config.page_name}</h1>
        <Content data={this.props.data} />
        <Footer />
        </Col>
        <Col md={2}>
        </Col>
        </Row>
      </div>
    );
  }
};

module.exports = App;
