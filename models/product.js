
const {getDb, ObjectId} = require("../util/mongodb");

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this._id = new ObjectId(id);
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        const db = getDb();
        return db.collection("products").insertOne(this).then((result) => {
            console.log(result + " in save");
        }).catch((err) => {
            console.log(err);
        });
    }

    Update() {
        //return db.execute("UPDATE products SET title = ?, price = ?, image = ?, description = ? where products.id = ?", [this.title, this.price, this.imageUrl, this.description, this.id]);
        const db = getDb();
        return db.collection("products").updateOne({_id: this._id}, {$set: this}).then((result) => {
            console.log(result + " in update");
        }).catch((err) => {
            console.log(err);
        });
    }

    static fetchAll() {
        //getProductsFromFile(cb);
        const db = getDb();
        return db.collection("products").find().toArray().then((products) => {
            //console.log(products);
            return products;
        }).catch((err) => {
            console.log("at fetchAll "+err);
        });
    }

    static findById(id) {
        //console.log("findById " + id);
        //return db.execute("SELECT * FROM products where products.id = ?", [id]);
        const db = getDb();
        return db.collection("products").findOne({_id: new ObjectId(id)}).then((product) => {
            console.log("findById " + product);
            return product;
        }).catch((err) => {
            console.log("at findById "+err);
        });
    }

    static DeleteById(pId) {
        //return db.execute("DELETE FROM products where products.id = ?", [pId]);
        const db = getDb();
        return db.collection("products").deleteOne({_id: new ObjectId(pId)}).then((product) => {
            console.log("DeleteById product: " + product);
        }).catch((err) => {
            console.log("at DeleteById "+err);
        });
    }
};
