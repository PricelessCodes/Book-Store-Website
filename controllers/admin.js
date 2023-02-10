const { Product, FullProduct } = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.status(202).render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editMode: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const quantity = req.body.quantity;
    const userId = req.user._id;
    const product = new FullProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        quantity: quantity,
        userId: userId,
    });
    product
        .save()
        .then((result) => {
            console.log("New product is added");
            res.status(201).redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
            res.status(400).redirect("/admin/products");
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.editMode;
    const prodId = req.params.productId;

    if (editMode !== "true" || !prodId)
        return res.status(400).redirect("/admin/products");

    Product.findById(prodId)
        .then((product) => {
            if (!product) throw new Error();

            res.status(202).render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editMode: true,
                product: product,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(202).redirect("/admin/products");
        });
};

exports.postEditProduct = (req, res, next) => {
    const id = req.params.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const quantity = req.body.quantity;
    const userId = req.user._id;

    FullProduct.findById(id)
        .then((product) => {
            product.title = title;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            product.quantity = quantity;
            product.userId = userId;
            return product.save();
        })
        .then((result) => {
            console.log("Product is updated");
            res.status(201).redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
            res.status(400).redirect("/admin/products");
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.params.productId;

    if (!id) return res.status(400).redirect("/admin/products");

    FullProduct.findByIdAndDelete(id)
        .then(() => {
            console.log("product is deleted");
            res.status(201).redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
            res.status(400).redirect("/admin/products");
        });
};

exports.getProducts = (req, res, next) => {
    //we use path join because each operating system has its own path structure linux (/home/folder) and windows (\home\folder)
    //res.sendFile(path.join(rootDir, "views", "shop.html"));
    FullProduct.find()
        .then((result) => {
            const products = result;
            //it will use the default templeting engine (ejs) and render it
            res.status(201).render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).redirect("/");
        });
};
