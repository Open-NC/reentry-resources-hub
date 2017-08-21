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

  resetState = () => {
    this.setState({
      ...Contact.initialState,
      formSubmitted: true,
    });
  }

  handleChange = (event) => {
    const { name, value } = event.currentTarget;

    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.state.name) {
      this.setState({ error: 'Name is required.' });

      return null;
    }

    if (!this.state.email) {
      this.setState({ error: 'Email is required.' });

      return null;
    }

    if (!this.state.message) {
      this.setState({ error: 'Message is required.' });

      return null;
    }

    const opts = {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    };

    return fetch('http://localhost:3001/api/sendEmail', opts)
      .then(data => data.json())
      .then((response) => {
        if (response.code === 500) {
          this.setState({
            error: 'Something went wrong.',
          });
        } else {
          this.resetState();
        }
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
