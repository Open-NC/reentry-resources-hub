/* eslint no-console: 0 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { compose } = require('./compose');
const controller = require('./controller');
require('dotenv').config();

const app = express();

// Checking for if in dev mode or in prod.
// Better way of doing this would to be setting a NODE_ENV variable on app load.
if (!process.env.AWS_KEY) {
  dotenv.config();
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.set('port', (process.env.PORT || 3001));

// Content is an object of the form:
// {
//   config: {Merge of all the config files} ,
//   common: {All the common topic info},
//   jurisdiction: {All the topic info for the specified jurisdiction (county)}
// }

app.get('/api/:jurisdiction/:topic', (req, res) => {
  let contentDirectory = '../nc-reentry-resources-content';
  if (process.env.content_directory) {
    contentDirectory = process.env.content_directory;
  }
  compose(req.params.jurisdiction, req.params.topic,
    contentDirectory, (content) => {
      res.json(content);
    });
});

app.post('/api/sendEmail', controller.sendEmail);

app.listen(app.get('port'), () => console.log(`Find the server at: http://localhost:${app.get('port')}/`));
