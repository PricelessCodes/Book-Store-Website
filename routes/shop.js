const express = require("express");

const authShop = require("./auth-shop");
const unauthShop = require("./unauth-shop");

//routers are used like we create mini express apps and then combine them to make a full express app
const router = express.Router();

router.use(unauthShop);

router.use(authShop);

module.exports = router;
