import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import fs from 'fs';
import { routes } from './routes';
import compose from './server/compose';
import App from './components/App.jsx';

const app = express();
require('node-jsx').install();

// TODO: Research the handlebars()...
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
//if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/static'));
//}

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
      console.log("***Redirect***");
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (props) {
      console.log("************** I am the props on the server! ***************");
      console.log(props);
      console.log("************** I am the end of the props on the server! ***************");
      if (props.params.jurisdiction && props.params.topic) {
        compose(props.params.jurisdiction, props.params.topic, (result) => {
          console.log("************** I am the server side render! ***************");
          console.log(result);
          console.log("************** I am the end of server side render! ***************");
          const markup = renderToString( <App data={result} />);
          res.render('main', { app: markup });
        });
      }
    //   else {
    //     const markup = renderToString(<RouterContext {...props} />);
    //     console.log("RouterContext");
    //     // render `index.ejs`, but pass in the markup we want it to display
    //     res.render('main', { markup })
    // }
  } else {
      // no route match, so 404. In a real app you might render a custom
      // 404 view here
      console.log("***404***");
      res.sendStatus(404);
    }
  });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
