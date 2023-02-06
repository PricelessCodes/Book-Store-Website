const mongoose = require("mongoose");

const Schema = mongoose.Schema;
//Schema used to define how ur data look like
const orderSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: { type: Number, required: true },
            },
        ],
        _id: false,
        required: true,
    },
});

module.exports = mongoose.model("Order", orderSchema);
