const {getDb, ObjectId} = require('../util/mongodb');

class User {
    constructor(id, username, email, cartId) {
        this._id = new ObjectId(id);
        this.username = username;
        this.email = email;
        this.cartId = cartId;
    }

    save(){
        const db = getDb();

        db.collection("users").insertOne(this);
    }

    static findById(userId){
        const db = getDb();
        const id = new ObjectId(userId);
        return db.collection("users").findOne({_id: id}).then((user) => {
            console.log("user " + user);
            return user;
        }).catch((err) => {
            console.log("at user "+err);
        });
    }
}

module.exports = User;