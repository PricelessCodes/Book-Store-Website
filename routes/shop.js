const express = require("express");
const shopController = require("../controllers/shop");

//routers are used like we create mini express apps and then combine them to make a full express app
const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart/:productId', shopController.postCart);

router.post('/cart-delete-item/:productId', shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);

router.post('/checkout/:cartId', shopController.PostCheckout);

module.exports = router;
