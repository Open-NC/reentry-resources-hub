/* eslint no-console: 0 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();
const { compose } = require('./compose');
const dbCompose = require('./db_compose').compose;
const controller = require('./controller');
console.log(process.env.dbhost);

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

const doDb = true;
app.get('/api/:jurisdiction/:topic', (req, res) => {
  let contentDirectory = '../nc-reentry-resources-content';
  if (process.env.content_directory) {
    contentDirectory = process.env.content_directory;
  }
  contentDirectory = '.';
  if (!doDb) {
    compose(req.params.jurisdiction, req.params.topic,
      contentDirectory, (content) => {
        console.log(JSON.stringify(content));
        res.json(content);
      });
  } else {
    console.log('Calling dbCompose');
    dbCompose(req.params.jurisdiction, req.params.topic,
    contentDirectory, (content) => {
      res.json(content);
    });
  }
});

app.post('/api/sendEmail', controller.sendEmail);

app.listen(app.get('port'), () => console.log(`Find the server at: http://localhost:${app.get('port')}/`));
