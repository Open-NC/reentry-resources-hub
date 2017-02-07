import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import fs from 'fs';
import compose from './server/compose';
import App from './server/components/App.jsx';

const app = express();
require('node-jsx').install();

app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/', (req, res) => {
  compose('buncombe', 'health', (result) => {
    res.send(result);
  });
});

app.get('/:jurisdiction/:topic', (req, res) => {
  compose(req.params.jurisdiction, req.params.topic, (result) => {
    res.send(ReactDOMServer.renderToString(<App data={result} />));
    // Result is an object of the form:
    // {
    //   config: {Merge of all the config files} ,
    //   common: { // Content applicable to all counties
    //     description: common HTML content,
    //     common: list of resources that apply to all jurisdictions
    //     local:  list of resources that are parameterized for local jurisdiction
    //   },
    //   jurisdiction: { // Content applicable to the specific jurisdiction (county)
    //     description: jurisdiction-specific HTML content,
    //     local: list of resources specific to the county
    //   }
    // }
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
