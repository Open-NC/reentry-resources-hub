import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Header from './Header.jsx';
import Content from './Content.jsx';
import Contact from './Contact.jsx';
import Footer from './Footer.jsx';


const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

const App = () =>
  (<ApolloProvider client={client}>
    <div>
      <Header {...this.props} />
      {/* I don't love doing this, but wanted to maintain visual consistency amongst views without having to render the Header + Footer components inside of Contact. */}
      {window.location.href.includes('contact') ? <Contact /> : <Content data={this.state.content} />}
      <Footer />
    </div>
  </ApolloProvider>)
