import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout';
import App from './components/App';

const routes = (
  <Route path="" component={Layout}>
    <Route path="/:jurisdiction/:topic" component={App}/>
  </Route>
);

export default routes;
