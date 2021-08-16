/* eslint-disable camelcase */

const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./queries.js');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Success!');
});

app.get('/loaderio-45c89ab07b8e3d10340bae02ffc186e4', (req, res) => {
  res.send('./loaderio-89365e86046e9af01accf031f7daa29a.txt');
});

app.get('/products/:page/:count', db.getProducts);
// Response time: Maximum response size reached
app.get('/products/:product_id', db.getProductInfo);
// JS Response time: 92ms
// Query Response time: 70ms
app.get('/products/:product_id/related', db.getRelated);
// Response time: 701ms
// Query Response time: 100ms
app.get('/products/:product_id/styles', db.getStyles);
// Response time: 38.11s
// Query Response time before index: 8s
// Query Response time after index: 50ms

app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});