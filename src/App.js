import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom'
import { Navbar } from 'react-bootstrap';
import TaxonomiesNav from './TaxonomiesNav';
import CountiesIndex from './CountiesIndex';
import CountyPage from './CountyPage';

const client = new ApolloClient({
  // TODO: ACTUAL URL
  uri: "http://localhost:4000/graphql"
});

class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <ApolloProvider client={client}>
        <Router basename="/reentry-resources-hub">
          <div className="App">
            <header className="site-header">
              <Navbar
                collapseOnSelect
                className="header-background-image"
              >
                <Navbar.Header>
                  <Navbar.Brand>
                    <Link to="/">
                      NC Reentry Resources Hub
                    </Link>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                  <TaxonomiesNav />
                </Navbar.Header>
              </Navbar>
            </header>
            <main className="content-body">
              <Switch>
                <Route path="/:county/:taxonomy" component={CountyPage} />
                <Route path="/" component={CountiesIndex}/>
              </Switch>
            </main>
            <footer className="site-footer">
              <p>© 2016 All Rights Reserved.</p>
              <p>Legal Disclaimer: The site DOES NOT provide any legal advice, only information. Users of this web site should consult with their own lawyer for legal advice.</p>
              <p>Content provided by this web site and any linked sites is not necessarily an endorsement and the administrators of this site do not assume any responsibility for the interpretation or application of any information originating from such sites.</p>
            </footer>
          </div>
          </Router>
      </ApolloProvider>
    );
  }
}

export default App;
