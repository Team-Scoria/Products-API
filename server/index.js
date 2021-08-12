/* eslint-disable camelcase */

const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./queries.js');

app.use(bodyParser.json());

var productId = 0;
var product_id = 0;

app.get('/', (req, res) => {
  res.send('Success!');
});

app.get('/products', db.getProducts);
app.get('/products/1', db.getProductInfo);
app.get('/products/1/related', db.getRelated);
app.get('/products/1/styles', db.getStyles);

// app.get('/products/' + productId, (req, res) => {
//   res.send('Success!');
// });

// app.get('/products/' + product_id + '/styles', (req, res) => {
//   res.send('Success!');
// });

// app.get('/products/' + product_id + '/related', (req, res) => {
//   res.send('Success!');
// });

app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});