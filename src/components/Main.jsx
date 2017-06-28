import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

class Main extends React.Component {
  render() {
    const data = this.props.data;
    console.log(this.props.data);
    return (
      <div>
        
        <Row>
          <Col md={2}></Col>
          <Col xs={12} md={8}>
            {console.log('Main Component')}
            <h1>Home</h1>
            <h2>Master Homepage for the NC Reentry Resources Hub</h2>
            <h3>Placeholder for site introduction and instructions</h3>
          </Col>
          <Col md={2}></Col>
        </Row>
        <Footer />
      </div>
    );
  }
}

module.exports = Main;
