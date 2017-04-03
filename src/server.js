/* eslint no-console: 0 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match } from 'react-router';
import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import compose from './server/compose';
import { routes } from './routes';
//import { createStore } from 'redux';
import configureStore from './store/configureStore';
import { loadServerContent } from './actions/contentActions';
import { Provider } from 'react-redux';
import App from './components/App.jsx';

const app = express();
require('node-jsx').install();

// TODO: Research the handlebars()... Probably don't really need it anymore.
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.set('port', (process.env.PORT || 3001));

// Originally Express only served static assets in production. Now always?
if (true || process.env.NODE_ENV === 'production') { // eslint-disable-line no-constant-condition
  app.use(express.static(path.join(__dirname, '/static')));
}

app.get('/api/:jurisdiction/:topic', (req, res) => {
  compose(req.params.jurisdiction, req.params.topic, (result) => {
    // Result is an object of the form:
    // {
    //   config: {Merge of all the config files} ,
    //   common: {All the common topic info},
    //   jurisdiction: {All the topic info for the specified jurisdiction (county)}
    // }
    res.send(result);
  });
});

app.get('*', (req, res) => {
  // routes is our object of React routes defined above
  match({ routes, location: req.url }, (err, redirectLocation, props) => {
    if (err) {
      // something went badly wrong, so 500 with a message
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      // we matched a ReactRouter redirect, so redirect from the server
      console.log('***Redirect***');
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (props) {
      console.log('************** I am the props on the server! ***************');
      console.log(props);
      console.log('************** I am the end of the props on the server! ***************');
      if (props.params.jurisdiction && props.params.topic) {
        compose(props.params.jurisdiction, props.params.topic, (result) => {
          console.log("************** I am the server side content! ***************");
          console.log(result);
          console.log("************** I am the end of server side content! ***************");

          const preloadedState = result;
          console.log('preloadedState');
          console.log(preloadedState);
          const store = configureStore(preloadedState);
          console.log('store');
          console.log(store.getState());
          //store.dispatch(loadServerContent(result));

          const markup = renderToString(
            <Provider store = { store }>
              <App />
            </Provider>
          );

          // Grab the initial state from our Redux store
          const finalState = store.getState();

          //const preloadedState = store.getState();

          res.render('main', {
                                app: markup,
                                preloadedstate: finalState
                              });
        });
      }
    // !! Note: Killed import of RouterContext from react-router. Restore if you uncomment below.
    //   else {
    //     const markup = renderToString(<RouterContext {...props} />);
    //     console.log("RouterContext");
    //     // render `index.ejs`, but pass in the markup we want it to display
    //     res.render('main', { markup })
    // }
    } else {
      // no route match, so 404. In a real app you might render a custom
      // 404 view here
      console.log('***404***');
      res.sendStatus(404);
    }
  });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
