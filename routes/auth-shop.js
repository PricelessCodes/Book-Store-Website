const express = require("express");
const shopController = require("../controllers/shop");

const isAuthMiddleware = require('../middleware/is-auth');

//routers are used like we create mini express apps and then combine them to make a full express app
const router = express.Router();

router.get('/cart', isAuthMiddleware, shopController.getCart);

router.post('/cart/:productId', isAuthMiddleware, shopController.postCart);

router.post('/cart-delete-item/:productId', isAuthMiddleware, shopController.postCartDeleteProduct);

router.get('/orders', isAuthMiddleware, shopController.getOrders);

router.post('/checkout/:cartId', isAuthMiddleware, shopController.PostCheckout);

module.exports = router;