// import Layout from './components/Layout.jsx';
import { Provider } from 'react-redux';
import App from './components/App.jsx';

// const routes = {
//   path: '',
//   component: Layout,
//   childRoutes: [
//     {
//       path: '/:jurisdiction/:topic',
//       component: App,
//     },
//   ],
// };

const routes = {
  path: '/:jurisdiction/:topic',
  component: App
};

// const routes = ({store}) => (
//   <Provider store={store}>
//     <Router>
//       <Route path='/:jurisdiction/:topic' component={App} />
//     </Router>
//   </Provider>
// )

export { routes };
