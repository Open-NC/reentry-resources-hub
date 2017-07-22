import React, { Component } from 'react';
import {
  Col,
  Row,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
} from 'react-bootstrap';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

class Contact extends Component {
  static initialState = {
    name: '',
    message: '',
    email: '',
  };

  state = {
    ...Contact.initialState,
    formSubmitted: false,
  };

  handleChange = (event) => {
    const { name, value } = event.currentTarget;

    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({
      ...Contact.initialState,
      formSubmitted: true,
    });

    // TODO: Build out a createMessage action that will send form data to the API for email processing.
    // this.props.createMessage(this.state)
    //   .then(() => {
    //     this.setState({
    //       ...Contact.initialState,
    //       formSubmitted: true,
    //     });
    //   })
    //   .catch(err => console.error(err));
  }

  render() {
    const renderSuccess = () =>
      <div className="alert alert-success" role="alert">
        Form submitted successfully. Thank you for your feedback.
      </div>;

    return (
      <div>
        <Header />
        <Row>
          <Col xs={1} md={2} />
          <Col xs={10} md={8}>
            <form>
              {this.state.formSubmitted && renderSuccess()}
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  value={this.state.name}
                  type="text"
                  name="name"
                  onChange={this.handleChange}
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Email Address</ControlLabel>
                <FormControl
                  value={this.state.email}
                  type="text"
                  name="email"
                  onChange={this.handleChange}
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Message</ControlLabel>
                <FormControl
                  value={this.state.message}
                  componentClass="textarea"
                  name="message"
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Button onClick={this.handleSubmit} type="submit">
                  Submit
                </Button>
              </FormGroup>
            </form>
          </Col>
          <Col xs={1} md={2} />
        </Row>
        <Footer />
      </div>
    );
  }
}

module.exports = Contact;
