import App from './server/components/App';

const routes = {
  path: '/:jurisdiction/:topic',
  component: App
  // ,
  // childRoutes: [
  //   {
  //     path: '//:jurisdiction/:topic',
  //     component: App
  //   }
  // ]
}

export { routes };
