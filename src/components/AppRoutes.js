import React from 'react';
import { Router, browserHistory } from 'react-router';
import routes from '../routes';
import createBrowserHistory from 'history/lib/createBrowserHistory';


export default class AppRoutes extends React.Component {
  render() {
    return (
      <Router history={createBrowserHistory()} routes={routes} onUpdate={() => window.scrollTo(0, 0)}/>
    );
  }
}
