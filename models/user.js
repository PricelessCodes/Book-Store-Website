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
    password: {
        type: String,
        required: true,
    },
    cartId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
