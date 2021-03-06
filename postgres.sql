-- ---
-- Globals
-- ---

-- SET SQL_MODE=NO_AUTO_VALUE_ON_ZERO;
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table Product
--
-- ---

DROP TABLE IF EXISTS Product CASCADE;
DROP TABLE IF EXISTS Features CASCADE;
DROP TABLE IF EXISTS Photos CASCADE;
DROP TABLE IF EXISTS SKUs CASCADE;
DROP TABLE IF EXISTS styles CASCADE;
DROP TABLE IF EXISTS related CASCADE;



CREATE TABLE Product (
  id SERIAL PRIMARY KEY,
  name VARCHAR NULL DEFAULT NULL,
  slogan VARCHAR NULL DEFAULT NULL,
  description VARCHAR NULL DEFAULT NULL,
  category VARCHAR NULL DEFAULT NULL,
  default_price VARCHAR NULL DEFAULT NULL
);

-- ---
-- Table Features
--
-- ---


CREATE TABLE Features (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NULL DEFAULT NULL,
  feature VARCHAR NULL DEFAULT NULL,
  value VARCHAR NULL DEFAULT NULL
);

-- ---
-- Table Photos
--
-- ---


CREATE TABLE Photos (
  id SERIAL PRIMARY KEY,
  styleId INTEGER NULL DEFAULT NULL,
  thumbnail_url TEXT NULL DEFAULT NULL,
  url TEXT NULL DEFAULT NULL
);

-- ---
-- Table SKUs
--
-- ---


CREATE TABLE SKUs (
  id SERIAL PRIMARY KEY,
  styleId INTEGER NULL DEFAULT NULL,
  size VARCHAR NULL DEFAULT NULL,
  quantity INTEGER NULL DEFAULT NULL
);

-- ---
-- Table styles
--
-- ---


CREATE TABLE styles (
  id SERIAL PRIMARY KEY,
  productId INTEGER NULL DEFAULT NULL,
  name VARCHAR NULL DEFAULT NULL,
  sale_price VARCHAR NULL DEFAULT NULL,
  original_price INTEGER NULL DEFAULT NULL,
  default_style INTEGER NULL DEFAULT NULL
);

-- ---
-- Table related
--
-- ---


CREATE TABLE related (
  id SERIAL PRIMARY KEY,
  current_product_id INTEGER NULL DEFAULT NULL,
  related_product_id INTEGER NULL DEFAULT NULL
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE Features ADD FOREIGN KEY (product_id) REFERENCES Product (id);
ALTER TABLE Photos ADD FOREIGN KEY (styleId) REFERENCES styles (id);
ALTER TABLE SKUs ADD FOREIGN KEY (styleId) REFERENCES styles (id);
ALTER TABLE styles ADD FOREIGN KEY (productId) REFERENCES Product (id);
ALTER TABLE related ADD FOREIGN KEY (current_product_id) REFERENCES Product (id);


-- --
-- Import CSV Files into Tables
-- --

COPY product(id,name,slogan,description,category,default_price)
FROM '/Users/seijimatsumoto/Documents/Hack\ Reactor/RFE4/SDC/Products-API/data/product.csv'
DELIMITER ','
CSV HEADER;

COPY related(id,current_product_id,related_product_id)
FROM '/Users/seijimatsumoto/Documents/Hack\ Reactor/RFE4/SDC/Products-API/data/related.csv'
DELIMITER ','
CSV HEADER;

COPY features(id,product_id,feature,value)
FROM '/Users/seijimatsumoto/Documents/Hack\ Reactor/RFE4/SDC/Products-API/data/features.csv'
DELIMITER ','
CSV HEADER;

COPY styles(id,productId,name,sale_price,original_price,default_style)
FROM '/Users/seijimatsumoto/Documents/Hack\ Reactor/RFE4/SDC/Products-API/data/styles.csv'
DELIMITER ','
CSV HEADER;

COPY skus(id,styleId,size,quantity)
FROM '/home/ubuntu/Products-API/data/skus.csv'
DELIMITER ','
CSV HEADER;

COPY photos(id,styleId,url,thumbnail_url)
FROM '/home/ubuntu/Products-API/data/photos.csv'
DELIMITER ','
CSV HEADER;

DROP INDEX IF EXISTS product_id_index;
DROP INDEX IF EXISTS styles_id_index;
DROP INDEX IF EXISTS features_product_id_index;
DROP INDEX IF EXISTS photos_styleid_index;
DROP INDEX IF EXISTS skus_styleid_index;
DROP INDEX IF EXISTS current_product_id_index;

CREATE INDEX product_id_index ON product (id);
CREATE INDEX styles_id_index ON styles (productId);
CREATE INDEX features_product_id_index ON features (product_id);
CREATE INDEX photos_styleid_index ON photos (styleId);
CREATE INDEX skus_styleid_index ON skus (styleId);
CREATE INDEX current_product_id_index ON related (current_product_id);