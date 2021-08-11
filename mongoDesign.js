// Mongo Schema Design

var mongoSchema =
{
  'bsonType': 'object',
  'required': ['id', 'name', 'slogan', 'description', 'category', 'default_price', 'features', 'styles', 'related'],
  'properties': {
    'id': { 'bsonType': 'int' },
    'name': { 'bsonType': 'string' },
    'slogan': { 'bsonType': 'string' },
    'description': { 'bsonType': 'string' },
    'category': { 'bsonType': 'string' },
    'default_price': { 'bsonType': 'int' },
    'slogan': { 'bsonType': 'string' },
    'features': {
      'bsonType': 'array',
      'items': {
        'bsonType': 'object',
        'properties': {
          'feature': { 'bsonType': 'string' },
          'value': { 'bsonType': 'string' }
        }
      }
    },
    'styles': {
      'bsonType': 'object',
      'required': ['id', 'name', 'sale_price', 'original_price', 'default_style', 'photos', 'skus'],
      'properties': {
        'product_id': { 'bsonType': 'int' },
        'bsonType': 'object',
        'id': { 'bsonType': 'int' },
        'name': { 'bsonType': 'string' },
        'sale_price': { 'bsonType': 'string' },
        'deafult_style': { 'bsonType': 'int' },
        'photos': {
          'bsonType': 'array',
          'items': {
            'bsonType': 'object',
            'thumnbnail_url': { 'bsonType': 'string' },
            'url': { 'bsonType': 'string' }
          },
          'skus': {
            'bsonType': 'object',
            'sku': {
              'bsonType': 'object',
              'quantity': { 'bsonType': 'int' },
              'size': { 'bsonType': 'string' }
            }
          }
        }
      }
    },
    'related': {
      'bsonType': 'array',
      'items': {
        'bsonType': { 'bsonType': 'int' },
        'related_product_id': { 'bsonType': 'int' }
      }
    }
  },
};