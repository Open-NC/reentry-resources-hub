import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import fs from 'fs';
import routes from './routes';
import compose from './server/compose';
import App from './components/App';
import Layout from './components/Layout';

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
    //const data = result.json();
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
      // if (props.params.jurisdiction && props.params.topic) {
      //   compose(props.params.jurisdiction, props.params.topic, (result) => {
      //     console.log("************** I am the server side render! ***************");
      //     console.log(result);
      //     const markup = renderToString(<Layout data={result} />);
      //     res.render('main', { app: markup });
      //     console.log("************** I am the end of server side render! ***************");
      //
      //     // renderToString(<App data={result} />);
      //   });
      // }
      // else {
        const markup = renderToString(<RouterContext {...props} />);
        console.log("RouterContext");
        // render `index.ejs`, but pass in the markup we want it to display
        res.render('main', { app: markup })
      //}
      // console.log(props);
      // if we got props, that means we found a valid component to render
      // for the given route

      //const markup = renderToString(<RoutingContext {...props} />);

      //const markup = renderToString(<RoutingContext {...props} />);

      // render `index.ejs`, but pass in the markup we want it to display

      // compose(props.params.jurisdiction, props.params.topic, (result) => {
      //   //console.log(result);
      //   const markup = renderToString(<App data={result} />);
      //   res.render('main', { app: markup });
      //   // renderToString(<App data={result} />);
      // });

      // if we got props, that means we found a valid component to render
      // for the given route
      //const markup = renderToString(<RouterContext {...props} />);

      // render `index.ejs`, but pass in the markup we want it to display
      //res.render('main', { markup })
      //res.render('main', { markup })

      //const markup = renderToString(<App data= {...props} />);
      // compose(props.params.jurisdiction, props.params.topic, (result) => {
      //   res.send(renderToString(<App data={result} />));
      // });

      // render `index.ejs`, but pass in the markup we want it to display
      //res.render('index', { markup })

    } else {
      // no route match, so 404. In a real app you might render a custom
      // 404 view here
      console.log("***404***");
      res.sendStatus(404);
    }
  });
});

// app.get('/', (req, res) => {
//   compose('buncombe', 'health', (result) => {
//     res.send(result);
//   });
// });
//
// app.get('/:jurisdiction/:topic', (req, res) => {
//   compose(req.params.jurisdiction, req.params.topic, (result) => {
//     res.send(ReactDOMServer.renderToString(<App data={result} />));
//     // Result is an object of the form:
//     // {
//     //   config: {Merge of all the config files} ,
//     //   common: { // Content applicable to all counties
//     //     description: common HTML content,
//     //     common: list of resources that apply to all jurisdictions
//     //     local:  list of resources that are parameterized for local jurisdiction
//     //   },
//     //   jurisdiction: { // Content applicable to the specific jurisdiction (county)
//     //     description: jurisdiction-specific HTML content,
//     //     local: list of resources specific to the county
//     //   }
//     // }
//   });
// });

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
