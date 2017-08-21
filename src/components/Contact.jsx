import React, { Component } from 'react';
import {
  Col,
  Row,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
} from 'react-bootstrap';

class Contact extends Component {
  // Easy to create an initialState static prop on Contact for resetting the state after the form has been submitted.
  static initialState = {
    name: '',
    message: '',
    email: '',
    error: '',
  };

  state = {
    ...Contact.initialState,
    formSubmitted: false,
  };

  setFormSubmittedState = () => {
    this.setState({
      ...Contact.initialState,
      formSubmitted: true,
    });
  }

  handleChange = (event) => {
    const { name, value } = event.currentTarget;

    this.setState({
      [name]: value,
      formSubmitted: false, // Clear out the formSubmitted feedback if the user interacts w/ form.
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    // Run some basic validation.
    if (!this.state.name) {
      this.setState({ error: 'Name is required.' });

      return null;
    }

    // TODO: Add in regex to check for proper email.
    if (!this.state.email) {
      this.setState({ error: 'Email is required.' });

      return null;
    }

    if (!this.state.message) {
      this.setState({ error: 'Message is required.' });

      return null;
    }

    // Prepare fetch API options.
    // API expects application/json
    const opts = {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    };

    // this url needs to be wherever the server is getting hosted. Obviously localhost:3001 will not work on a production build.
    const url = process.env.API_URL || 'http://localhost:3001';

    return fetch(`${url}/api/sendEmail`, opts) // Make Request
      .then(data => data.json()) // Blob the response
      .then((response) => {
        // If something went wrong on the API.
        if (response.code === 500) {
          this.setState({
            error: 'Something went wrong.',
            formSubmitted: false,
          });
        } else {
          // Clear out the form and give feedback.
          this.setFormSubmittedState();
        }
      });
  }

  render() {
    const renderSuccess = () =>
      <div className="alert alert-success" role="alert">
        Form submitted successfully. Thank you for your feedback.
      </div>;

    const renderError = () =>
      <div className="alert alert-danger" role="alert">
        {this.state.error}
      </div>;

    return (
      <div>
        <Row>
          <Col xs={1} md={2} />
          <Col xs={10} md={8}>
            <form>
              {this.state.error && renderError()}
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
      </div>
    );
  }
}

module.exports = Contact;
