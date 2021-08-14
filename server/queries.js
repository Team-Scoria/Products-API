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
        'value', features.value))
    ) AS info
    FROM product
    INNER JOIN features
    ON product.id = features.product_id
    WHERE product.id = ${productId}
    GROUP BY product.id
  `;

  pool.query(productQuery, (err, results) => {
    if (err) { throw err; }
    res.status(200).send(results.rows[0].info);
  });
};

// GET /products/:product_id/styles
const getStyles = (req, res) => {
  var productId = req.params.product_id || 1;
  const stylesQuery = `
    SELECT json_build_object(
      'product_id', ${productId},
      'results', array_agg(
        json_build_object(
          'style_id', styles.id,
          'name', styles.name,
          'original_price', styles.original_price,
          'sale_price', styles.sale_price,
          'default?', styles.default_style,
          'photos', array(
            SELECT json_build_object(
              'thumbnail_url', photos.thumbnail_url,
              'url', photos.url
            )
          )
        )
      )
    ) AS styles
    FROM styles
    INNER JOIN photos
    ON styles.id = photos.styleid
    WHERE styles.productid = ${productId}
    GROUP BY styles.id
  `;

  /**
   * 'skus', json_build_object(
            skus.id, json_build_object(
              'quantity', skus.quantity,
              'size', skus.size
            )
          )

              INNER JOIN skus
    ON styles.id = skus.styleid
   */

  pool.query(stylesQuery, (err, results) => {
    if (err) { throw err; }
    res.status(200).send(results.rows[0].styles);
  });
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