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

// GET all products
// GET /products
const getProducts = (req, res) => {
  pool.query('SELECT * FROM product', (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json(results.rows);
  });
};

// GET product information for specific product
// GET /products/:product_id
const getProductInfo = (req, res) => {
  var productInfo = {};
  var productId = Object.values(req.params)[0] || 1;
  pool.query(`SELECT * FROM product WHERE id = ${productId}`, (err, results) => {
    if (err) {
      throw err;
    }
    productInfo = results.rows[0];
  });
  pool.query(`SELECT * FROM features WHERE product_id = ${productId}`, (err, results) => {
    if (err) {
      throw err;
    }
    results.rows.forEach(row => {
      delete row.id;
      delete row.product_id;
    });
    productInfo.features = results.rows;
    // console.log(productInfo);
    res.status(200).json(productInfo);
  });
};

// GET product style for specific product
// GET /products/:product_id/styles
const getStyles = (req, res) => {
  var productId = Object.values(req.params)[0] || 1;
  var styles = {};
  var productStyles = { product_id: productId, results: [] };
  pool.query(`SELECT * FROM styles WHERE productId = ${productId}`, (err, results) => {
    if (err) {
      throw err;
    }
    styles = results.rows;

    var recurse = (styles) => {
      if (!styles.length) {
        console.log('getStyles request complete');
        res.status(200).json(productStyles);
        return;
      }
      var style = styles[0];
      var oneStyle = { style_id: 0, name: '', original_price: '', sale_price: '0', 'default?': false, photos: [], skus: {} };
      oneStyle.style_id = style.id;
      oneStyle.name = style.name;
      if (style.sale_price === null) { style.sale_price = 0; }
      oneStyle.sale_price = style.sale_price;
      style['default?'] === productId ? style['default?'] = true : style['default?'] = false;
      oneStyle['default?'] = style['default?'];
      getPhotos(style.id)
        .then((photoRes) => {
          getSkus(style.id)
            .then(skuRes => {
              oneStyle.photos = photoRes;
              oneStyle.skus = skuRes;
              productStyles.results.push(oneStyle);
              recurse(styles.splice(1));
            });
        });
    };

    recurse(styles);
  });
};

// GET photos for current style id
const getPhotos = (styleId) => {
  var photos;
  return pool
    .query(`SELECT * FROM photos WHERE styleId = ${styleId}`)
    .then(results => {
      photos = results.rows;
      photos.forEach(photo => {
        delete photo.id;
        delete photo.styleid;
      });

      // console.log(photos);
      return photos;
    });
};

// GET skus for current style id
const getSkus = (styleId) => {
  var skus;
  var response = {};
  return pool
    .query(`SELECT * FROM skus WHERE styleId = ${styleId}`)
    .then(results => {
      skus = results.rows;
      skus.forEach(sku => {
        response[sku.id] = {
          quantity: sku.quantity,
          size: sku.size
        };
      });

      // console.log(response);
      return response;
    });
};

// GET all related ids for specific product
const getRelated = (req, res) => {
  var productId = Object.values(req.params)[0] || 1;
  pool.query(`SELECT * FROM related WHERE current_product_id = ${productId}`, (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json([results.rows[0].related_product_id]);
  });
};

module.exports = {
  getProducts,
  getProductInfo,
  getStyles,
  getRelated
};