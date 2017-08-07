import React, { Component } from 'react';
import { render } from 'react-snapshot';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Main from './components/Main.jsx';
import App from './components/App.jsx';
import Contact from './components/Contact.jsx';

import './style.css';

class AppRoutes extends Component {
  render() {
    return (
      <Router basename="/reentry-resources-hub">
        <Switch>
          <Route path="/" exact component={Main} />
          <Route path="/:jurisdiction/:topic/" component={App} />
          <Route path="/contact/" exact component={Contact} />
          {/* TODO create a not found page */}
        </Switch>
      </Router>
    );
  }
}

render(<AppRoutes />, document.getElementById('app'));
