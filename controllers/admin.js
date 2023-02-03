const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.status(201).render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editMode: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    console.log(req.params + " pramas");
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, description, price);
    //console.log(product);
    product
        .save()
        .then((result) => {
            console.log(result + "in post");
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.editMode;
    console.log(editMode);
    if (editMode !== "true") return res.status(400).redirect("/");

    const prodId = req.params.productId;
    Product.findById(prodId).then((result) => {
        let product = result;
        if (!product) {
            throw new Error();
        }
        //console.log(product);
        res.status(201).render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editMode: true,
            product: product,
        });
    })
    .catch((err) => {
        console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
    const id = req.params.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(id, title, imageUrl, description, price);

    product.Update().then((result) => {
        console.log("postEditProduct, update : " + result);
        res.status(201).redirect("/");
    })
    .catch((err) => {
        console.log(err);
    });
    
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.params.productId;

    Product.DeleteById(id).then(() => {
        console.log("product is deleted");
        res.status(201).redirect("/");
    })
    .catch((err) => {
        console.log(err);
    });
    
};

exports.getProducts = (req, res, next) => {
    //we use path join because each operating system has its own path structure linux (/home/folder) and windows (\home\folder)
    //res.sendFile(path.join(rootDir, "views", "shop.html"));
    Product.fetchAll()
        .then((result) => {
            const products = result;
            //it will use the default templeting engine (ejs) and render it
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
