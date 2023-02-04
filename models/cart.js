const { getDb, ObjectId } = require("../util/mongodb");

module.exports = class Cart {
    constructor(id, products) {
        this._id = new ObjectId(id);
        this.products = products;
    }

    static findById(id) {
        const db = getDb();
        return db
            .collection("carts")
            .findOne({ _id: new ObjectId(id) })
            .then((cart) => {
                console.log("findById cart " + cart);
                return cart;
            })
            .catch((err) => {
                console.log("at findById cart " + err);
            });
    }

    static addToCart(id, productId) {
        console.log(id, productId);
        Cart.findById(id)
            .then((cart) => {
                const index = cart.products.findIndex(
                    (prod) => prod.id.toString() === productId
                );
                console.log(cart.products, productId, index);
                if (index !== -1) {
                    cart.products[index].quantity++;
                } else {
                    const prodId = new ObjectId(productId);
                    cart.products.push({ id: prodId, quantity: 1 });
                }
                const db = getDb();
                return db
                    .collection("carts")
                    .updateOne({ _id: cart._id }, { $set: cart })
                    .then((cart) => {
                        console.log("cart is updated: " + cart);
                    })
                    .catch((err) => {
                        console.log("cart failed to update: " + err);
                    });
            })
            .catch((err) => {
                console.log("at findById cart " + err);
            });
    }

    static DeleteFromCartById(cId, pId) {
        const db = getDb();
        console.log(cId, new ObjectId(pId));
        return db
            .collection("carts")
            .updateOne({ _id: cId }, { $pull: { products: { id: new ObjectId(pId) } } })
            .then((product) => {
                console.log("DeleteFromCartById product: " + product);
            })
            .catch((err) => {
                console.log("at DeleteFromCartById " + err);
            });
    }
};
