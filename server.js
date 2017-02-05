const React = require('react');
const ReactDOMServer = require('react-dom/server');
const express = require('express');

//const expressHandlebars  = require('express-handlebars');

require('node-jsx').install();

const fs = require('fs');
const compose = require('./server/compose');

const app = express();


/**** For Handlebars ****/
//app.set('view engine', 'handlebars');
//app.set('views', './server/views');
//app.engine('handlebars', expressHandlebars({defaultLayout: 'home'}));

var App = require('./server/components/App.jsx');

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/', (req, res) => {
  compose('buncombe', 'home', (result) => {
    res.send(result);
    //res.send(ReactDOMServer.renderToString( <Home data={result}/> ));
  });

  /**** Use this if we decide to use Handlebars ****/
  //var home = ReactDOMServer.renderToString( <Home /> );
  // res.render('home', {
  //     layout: false,
  //     home: home
  // });

  // res.send(ReactDOMServer.renderToString( <Home /> ));
});

app.get('/:jurisdiction/:topic', (req, res) => {
  compose(req.params.jurisdiction, req.params.topic, (result) => {
    // Result is an object of the form:
    // {
    //   config: {Merge of all the config files} ,
    //   common: {All the common topic info},
    //   jurisdiction: {All the topic info for the specified jurisdiction (county)}
    // }
    //res.send(result);

    res.send(ReactDOMServer.renderToString( <App data={result}/> ));

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
