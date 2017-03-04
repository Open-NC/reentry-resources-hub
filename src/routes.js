import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './components/App';
import Home from './components/Home';
import Content from './components/Content';

const routes = (
  <Route path="/:jurisdiction/:topic" component={App}>
  </Route>
);

export default routes;


// const routes = {
//   path: '/:jurisdiction/:topic',
//   component: App
//   // ,
//   // childRoutes: [
//   //   {
//   //     path: '//:jurisdiction/:topic',
//   //     component: App
//   //   }
//   // ]
// }
//
// export { routes };
