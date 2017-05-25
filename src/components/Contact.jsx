import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Footer from './Footer.jsx';

class Contact extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Col md={2}></Col>
          <Col xs={12} md={8}>
            {console.log('Contact Us Component')}
            <p>Contact Us</p>
            <Footer />
          </Col>
          <Col md={2}></Col>
        </Row>
      </div>
    );
  }
}

module.exports = Contact;
