import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header.jsx';
import Content from './Content.jsx';
import Contact from './Contact.jsx';
import Footer from './Footer.jsx';

export default class App extends Component {
  state = {
    content: null,
  };

  componentWillMount() {
    this.updateContent(this.props.match);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match !== nextProps.match) {
      this.updateContent(nextProps.match);
    }
  }

  updateContent({ params }) {
      const url = `http://localhost:3001/api/${params.jurisdiction}/${params.topic}`;
      return fetch(url)
        .then(response => response.json())
        .then(content => this.setState({ content: content }, () => console.log(this.state.content)));
  }

  render() {
    return (
      this.state.content ?
        <div>
          <Header {...this.props} data={this.state.content} />
          {/* I don't love doing this, but wanted to maintain visual consistency amongst views without having to render the Header + Footer components inside of Contact. */}
          {window.location.href.includes('contact') ? <Contact /> : <Content data={this.state.content} />}
          <Footer />
        </div> : null
    );
  }
}

App.propTypes = {
  match: PropTypes.object.isRequired,
};
