import Main from './components/Main.jsx';
import App from './components/App.jsx';
import Contact from './components/Contact.jsx';

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
      path: '',
      childRoutes: [
        {
          path: '/',
          component: Main
        },
        {
          path: '/:jurisdiction/:topic',
          component: App
        },
        {
          path: '/contact',
          component: Contact
        }
      ]
};

export { routes };
