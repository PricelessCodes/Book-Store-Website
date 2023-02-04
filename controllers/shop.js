const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((result) => {
            const products = result;
            //it will use the default templeting engine (ejs) and render it
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Products",
                path: "/products",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;

    console.log("getProduct" + " " + prodId);
    Product.findById(prodId)
        .then((result) => {
            let product = result;

            //console.log(product);
            if (!product) {
                throw new Error();
            }
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then((result) => {
            const products = result;
            //it will use the default templeting engine (ejs) and render it
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    Cart.findById(req.user.cartId)
        .then((cart) => {
            const prodIds = cart.products.map((prod) => prod.id);
            Product.findMultipleById(prodIds)
                .then((products) => {
                    res.render("shop/cart", {
                        path: "/cart",
                        pageTitle: "Your Cart",
                        products: products,
                        cart: cart,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.params.productId;
    Cart.addToCart(req.user.cartId, prodId);
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Cart.DeleteFromCartById(req.user.cartId, prodId)
        .then(() => {
            console.log("deleted succuss");
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    Order.findOrdersByUserId(req.user._id)
        .then((orders) => {
            const ordersSc = [];
            orders.forEach((order) => {
                const prodIds = order.products.map((prod) => prod.id);
                const prodQuantity = order.products.map((prod) => prod.quantity);
                Product.findMultipleById(prodIds)
                    .then((products) => {
                        ordersSc.push({ _id: order._id, products: products, prodQuantity: prodQuantity });
                        if (ordersSc.length === orders.length) {
                            res.render("shop/orders", {
                                path: "/orders",
                                pageTitle: "Your Orders",
                                orders: ordersSc,
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        })
        .catch((err) => {
            console.log(err);
        });
    /*res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
    });*/
};

exports.PostCheckout = (req, res, next) => {
    Cart.findById(req.user.cartId)
        .then((cart) => {
            const order = new Order(null, req.user._id, cart.products);
            order
                .save()
                .then(() => {
                    console.log("order is checked out in db");
                    res.redirect("/orders");
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};
