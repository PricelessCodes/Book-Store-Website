const { Product, FullProduct } = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
    FullProduct.find()
        .then((products) => {
            if (!products) throw "no products found";
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Products",
                path: "/products",
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).redirect("/");
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;

    if (!prodId) return res.status(400).render("/");

    FullProduct.findById(prodId)
        .then((product) => {
            if (!product) throw new "did not find product"();

            res.status(202).render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products",
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).redirect("/");
        });
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            if (!products) throw "no products found";

            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).redirect("/");
        });
};

exports.getCart = (req, res, next) => {
    Cart.findById(req.user.cartId)
        .populate("products.product")
        .then((cart) => {
            if (!cart) throw "cart not found";

            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                cartId: cart._id,
                products: cart.products,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).redirect("/");
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.params.productId;

    if (!prodId) return res.status(400).redirect("/");

    Cart.findById(req.user.cartId)
        .then((cart) => {
            if (cart) {
                if (!cart) throw "cart not found";

                const index = cart.products.findIndex(
                    (prod) => prod.product.toString() === prodId
                );

                if (index !== -1) cart.products[index].quantity++;
                else cart.products.push({ product: prodId, quantity: 1 });

                cart.save().then((err) => {
                    res.status(201).redirect("/cart");
                }).catch((err) => {
                    throw err;
                });
            } else {
                throw "cart is not found to add inside it";
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).redirect("/");
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Cart.findByIdAndUpdate(req.user.cartId, {
        $pull: { products: { product: prodId } },
    })
        .then(() => {
            console.log("deleted succuss");
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({ userId: req.user._id })
        .populate("products.product")
        .then((orders) => {
            if (!orders) throw "orders not found";

            res.render("shop/orders", {
                path: "/orders",
                pageTitle: "Your Orders",
                orders: orders,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).render("/");
        });
};

exports.PostCheckout = (req, res, next) => {
    Cart.findById(req.user.cartId)
        .then((cart) => {
            if (!cart) throw "cart not found";

            const order = new Order({
                userId: req.user._id,
                products: cart.products,
            });
            order
                .save()
                .then(() => {
                    console.log("order is checked out in db");
                    cart.products = [];
                    cart.save()
                        .then((result) => res.redirect("/orders"))
                        .catch((err) => {
                            throw err;
                        });
                })
                .catch((err) => {
                    throw err;
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).redirect("/");
        });
};
