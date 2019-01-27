import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import TaxonomiesNav from './TaxonomiesNav';
import CountiesIndex from './CountiesIndex';
import CountyPage from './CountyPage';

const client = new ApolloClient({
  // TODO: ACTUAL URL
  uri: `${process.env.REACT_APP_DB_HOST}:${process.env.REACT_APP_DB_PORT}/graphql"
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router basename="/reentry-resources-hub">
          <div className="App">
            <header className="site-header">
              <TaxonomiesNav/>
            </header>
            <main className="content-body">
              <Switch>
                <Route path="/:county/:taxonomy" component={CountyPage} />
                <Route path="/" component={CountiesIndex}/>
              </Switch>
            </main>
            <footer className="site-footer">
              <p>© 2018 All Rights Reserved.</p>
              <p>Legal Disclaimer: The site DOES NOT provide any legal advice, only information. Users of this web site should consult with their own lawyer for legal advice.</p>
              <p>Content provided by this web site and any linked sites is not necessarily an endorsement and the administrators of this site do not assume any responsibility for the interpretation or application of any information originating from such sites.</p>
              <p><a href="https://docs.google.com/forms/d/e/1FAIpQLSecfqydBgi7T3yH1qXCGZAykRfwof_pBhxRtYbEMXG82C_zZg/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer">Contact</a> the creator of this site</p>
            </footer>
          </div>
          </Router>
      </ApolloProvider>
    );
  }
}

export default App;
