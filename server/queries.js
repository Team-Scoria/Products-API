/* eslint-disable camelcase */
// const { myPassword } = require('../password.js');

const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'seijimatsumoto',
  host: 'ec2-3-92-187-204.compute-1.amazonaws.com',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

// GET /products
const getProducts = (req, res) => {
  var page = parseInt(req.query.page) || 1;
  var count = parseInt(req.query.count) || 5;

  var endingId = page * count;
  var startingId = endingId - count + 1;
  const productQuery = `
    SELECT array_agg(
      json_build_object(
        'id', product.id,
        'name', product.name,
        'slogan', product.slogan,
        'description', product.description,
        'category', product.category,
        'default_price', CAST(product.default_price AS varchar)
      )
    )
    FROM product
    WHERE id BETWEEN ${startingId} AND ${endingId}
  `;

  pool.query(productQuery, (err, results) => {
    if (err) { throw err; }
    res.status(200).send(results.rows);
  });
};

// GET /products/:product_id
const getProductInfo = (req, res) => {
  var productId = req.params.product_id;
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
    WHERE product.id = $1
    GROUP BY product.id
  `;

  pool.query(productQuery, [productId], (err, results) => {
    if (err) { throw err; }
    res.status(200).send(results.rows[0].info);
  });
};

// GET /products/:product_id/styles
const getStyles = (req, res) => {
  var productId = req.params.product_id;
  const stylesQuery = `
    SELECT styles.id as style_id, name, original_price, sale_price,
    CASE default_style WHEN 1 THEN true ELSE false END "default?",
    array_agg(
      DISTINCT jsonb_build_object(
        'thumbnail_url', photos.thumbnail_url,
        'url', photos.url
      )
    ) as photos,
    json_object_agg(
      skus.id, json_build_object(
        'quantity', quantity,
        'size', size
      )
    ) as skus
    FROM styles
    LEFT JOIN photos ON styles.id = photos.styleId
    LEFT JOIN skus ON styles.id = skus.styleId
    WHERE styles.productid = $1
    GROUP BY styles.id
  `;

  pool.query(stylesQuery, [productId], (err, results) => {
    if (err) { throw err; }

    var output = {
      'product_id': productId,
      'results': results.rows
    };

    res.status(200).send(output);
  });
};

// GET all related ids for specific product
const getRelated = (req, res) => {
  var productId = req.params.product_id;
  const relatedQuery = `
    SELECT array_agg(
      related.related_product_id
    ) AS relatedarr
    FROM related
    WHERE current_product_id = $1
  `;

  pool.query(relatedQuery, [productId], (err, results) => {
    if (err) { throw err; }
    res.status(200).json(results.rows[0].relatedarr);
  });
};

module.exports = {
  getProducts,
  getProductInfo,
  getStyles,
  getRelated
};