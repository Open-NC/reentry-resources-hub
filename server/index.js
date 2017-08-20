/* eslint no-console: 0 */
const express = require('express');
const { compose } = require('./compose');

const app = express();

app.set('port', (process.env.PORT || 3001));

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

app.listen(app.get('port'), () => console.log(`Find the server at: http://localhost:${app.get('port')}/`));
