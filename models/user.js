const mongoose = require("mongoose");

const Schema = mongoose.Schema;
//Schema used to define how ur data look like
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cartId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});

module.exports = mongoose.model("User", userSchema);
