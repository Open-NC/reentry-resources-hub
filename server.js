const React = require('react');
const ReactDOMServer = require('react-dom/server');
const express = require('express');
const expressHandlebars  = require('express-handlebars');
const browserify = require('connect-browserify');

const fs = require('fs');
const compose = require('./server/compose');

const app = express();
app.set('views', __dirname);
// app.engine('ejs', ejs.renderFile);

app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

require('node-jsx').install();

var Home = require('./server/home.jsx');

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use('/server.js', browserify({
  entry: '',
  transforms: ['reactify']
}));

app.get('/', (req, res) => {
  // compose('buncombe', 'home', (result) => {
  //   res.send(result);
  // });
  var home = ReactDOMServer.renderToString(
     <div>
       <h1>I am rendered from the server!</h1>
     </div>
    //<Home />
  );

  // res.render('template', {
  //     home: home
  // });
  res.send(home);
  // res.render('./server/index.js', {
  //     main: home
  //   });
});

app.get('/:jurisdiction/:topic', (req, res) => {
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

// this is from the original example - delete when the new admin interface is done.
app.get('/api/food', (req, res) => {
  const param = req.query.q;

  if (!param) {
    res.json({
      error: 'Missing required parameter `q`',
    });
    return;
  }

  res.json({title: "NC Reentry Resources Hub"});

});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
