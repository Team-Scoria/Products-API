# ProductsAPI
Custom API built with PostgreSQL designed to handle thousands of requests for data by many users at once.

#### SQL Schema
![](https://i.imgur.com/Qh47Vbp.png) 

### Tech Stack
 
**Server:** Node, Express
 
**Database:** PostgreSQL


### Get all products
Returns products and basic information (default 5 products per request).
Can pass in request parameters to get more than 5 products at once and/or specify which page to retrieve data from
```http
  GET /products
```

| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `page`| `number` | `page number` |
| `count` | `number` | `number of products per page` |

### Get product info
Returns specific product information given a specified product ID
```http
  GET /products/:product_id
```
| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `product_id`| `number` | `information about a product` |

### Get related products
Returns all related products based on the specified product ID
```http
  GET /products/:product_id/related
```

| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `product_id`| `number` | `information about a product` |

### Get styles for product
Returns all of the different styles of the specified product ID
```http
  GET /products/:product_id/styles
```

| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `product_id`| `number` | `information about a product` |
