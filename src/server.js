/* eslint no-console: 0 */
const React = require('react');
const { Provider } = require('react-redux');
const { renderToString } = require('react-dom/server');
const { match, RouterContext } = require('react-router');
const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const { compose, mainCompose } = require('./server/compose');

const app = express();
require('node-jsx').install();

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.set('port', (process.env.PORT || 3001));

app.get('/api/main', (req, res) => {
  mainCompose((mainContent) => {
    res.json(mainContent);
  });
});

// Content is an object of the form:
// {
//   config: {Merge of all the config files} ,
//   common: {All the common topic info},
//   jurisdiction: {All the topic info for the specified jurisdiction (county)}
// }
app.get('/api/:jurisdiction/:topic', (req, res) => {
  compose(req.params.jurisdiction, req.params.topic, (content) => {
    res.json(content);
  });
});

app.use(express.static(path.join(__dirname, '../build')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// const { routes } = require('./routes');
// const configureStore = require('./store/configureStore');
// app.get('*', (req, res) => {
//   // routes is our object of React routes defined above
//   match({ routes, location: req.url }, (err, redirectLocation, props) => {
//     if (err) {
//       // something went badly wrong, so 500 with a message
//       res.status(500).send(err.message);
//     } else if (redirectLocation) {
//       // we matched a ReactRouter redirect, so redirect from the server
//       console.log('***Redirect***');
//       res.redirect(302, redirectLocation.pathname + redirectLocation.search);
//     } else if (props) {
//       if (props.params.jurisdiction && props.params.topic) {
//         compose(props.params.jurisdiction, props.params.topic, (content) => {
//           const preloadedState = { content };
//           preloadedState.stringify = JSON.stringify(preloadedState);

//           const store = configureStore(preloadedState);

//           const markup = renderToString(
//             React.createElement(Provider, {store},
//               React.createElement(RouterContext, content)));

//           // render `/view/main.handlebars`, but pass in the markup we want it to display
//           res.render('main', { app: markup, preloadedState: preloadedState });
//         });
//       }
//       else {
//         // TODO: Include and call mainCompose from compose.js to handle home and contact us routes.
//         // globalCompose(props.location.pathname, (content) => {
//           // const preloadedState = { content };
//         mainCompose((content) => {
//           const preloadedState = { content };
//           preloadedState.stringify = JSON.stringify(preloadedState);

//           const store = configureStore(preloadedState);

//           const markup = renderToString(
//             React.createElement(Provider, {store},
//               React.createElement(RouterContext, content)));

//           // render `/view/main.handlebars`, but pass in the markup we want it to display
//           res.render('main', { app: markup, preloadedState: preloadedState });
//         });
//       }
//     }
//     else {
//       // no route match, so 404. In a real app you might render a custom
//       // 404 view here
//       console.log(`***404 - ${req.url} ***`);
//       res.sendStatus(404);
//     }
//   });
// });

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
