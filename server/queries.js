/* eslint-disable camelcase */
const { myPassword } = require('../password.js');

const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'seijimatsumoto',
  host: 'localhost',
  database: 'postgres',
  password: myPassword,
  port: 5432,
  idleTimeoutMillis: 60000
});

// GET /products
const getProducts = (req, res) => {
  pool.query('SELECT * FROM product', (err, results) => {
    if (err) { throw err; }
    res.status(200).json(results.rows);
  });
};

// GET /products/:product_id
const getProductInfo = (req, res) => {
  var productId = req.params.product_id || 1;
  const productQuery = `
    SELECT json_build_object(
      'id', product.id,
      'name', product.name,
      'slogan', product.slogan,
      'description', product.description,
      'category', product.category,
      'default_price', product.default_price,
      'features', array_agg(json_build_object(
        'feature', features.feature,
        'value', features.value))) AS productinfo
    FROM product
    INNER JOIN features
    ON product.id = features.product_id
    WHERE product.id = ${productId}
    GROUP BY product.id
  `;

  pool.query(productQuery, (err, results) => {
    if (err) { throw err; }
    res.status(200).send(results.rows[0].productinfo);
  });
};

// GET /products/:product_id/styles
const getStyles = (req, res) => {
  var productId = req.params.product_id || 1;
};

// GET all related ids for specific product
const getRelated = (req, res) => {
  var productId = req.params.product_id || 1;
  pool.query(`SELECT * FROM related WHERE current_product_id = ${productId}`, (err, results) => {
    if (err) { throw err; }
    res.status(200).json([results.rows[0].related_product_id]);
  });
};

module.exports = {
  getProducts,
  getProductInfo,
  getStyles,
  getRelated
};