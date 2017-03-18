import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout.jsx';
import App from './components/App.jsx';

const routes = {
  path: '',
  component: Layout,
  childRoutes: [
    {
      path: '/:jurisdiction/:topic',
      component: App
    }
  ]
}

export { routes };
