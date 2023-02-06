const mongoose = require("mongoose");

const Schema = mongoose.Schema;
//Schema used to define how ur data look like
const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

const fullProductSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

productSchema.set("toObject", {
    transform: function (doc, ret, options) {
        delete ret.userId;
        delete ret.quantity;
    },
});

productSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.userId;
        delete ret.quantity;
    },
});

const Product = mongoose.model("Product", productSchema);
const FullProduct = Product.discriminator("FullProduct", fullProductSchema);

module.exports = { Product, FullProduct };
