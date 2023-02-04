const { getDb, ObjectId } = require("../util/mongodb");

module.exports = class Order {
    constructor(id, userId, products) {
        this._id = new ObjectId(id);
        this.userId = userId;
        this.products = products;
    }

    save() {
        const db = getDb();
        return db
            .collection("orders")
            .insertOne(this)
            .then((order) => {
                console.log(order + " order is checked out in db");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static findOrdersByUserId(uId) {
        const db = getDb();
        return db
            .collection("orders")
            .find({userId: uId}).toArray()
            .then((orders) => {
                console.log("User Orders");
                return orders;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}