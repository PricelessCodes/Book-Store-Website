const express = require("express");
const adminController = require("../controllers/admin");
//routers are used like we create mini express apps and then combine them to make a full express app
const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

// /admin/products => GET
router.post('/edit-product/:productId', adminController.postEditProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

router.post('/delete-product/:productId', adminController.postDeleteProduct);

module.exports = router;
