const express = require("express");
const shopController = require("../controllers/shop");

//routers are used like we create mini express apps and then combine them to make a full express app
const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

module.exports = router;