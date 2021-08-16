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

app.get('/products', db.getProducts);
app.get('/products/:product_id', db.getProductInfo);
app.get('/products/:product_id/related', db.getRelated);
app.get('/products/:product_id/styles', db.getStyles);

app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});