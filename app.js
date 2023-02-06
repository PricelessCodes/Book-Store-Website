const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const mongoose = require("mongoose");
const User = require("./models/user");
const Cart = require("./models/cart");

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const app = express();
const port = 3000;

let currentUser; 

//telling express that we want to compile dynamic templates with the pug engine and set confiq globaly using
// app.set
//(key, value)
app.set("view engine", "ejs");
//the location of these templates (our main directory + views)
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
//used for css files to be static and get them with a link
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("63e010f087b7db9e7bf36b94")
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log("at use user: " + err);
        });
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.use(errorController.get404);

const uri =
    "mongodb+srv://yahia:klBaU456OD9NHraM@cluster0.tx4rcfc.mongodb.net/shop?retryWrites=true&w=majority";
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

//the `strictQuery` option will be switched back to `false` by default in Mongoose 7.
//Use `mongoose.set('strictQuery', false);` if you want to prepare for this change.
//Or use `mongoose.set('strictQuery', true);` to suppress this warning.
//When strict option is set to true,
//Mongoose will ensure that only the fields that are specified in your Schema will be saved in the database.
mongoose.set("strictQuery", false);

mongoose
    .connect(uri, options)
    .then((result) => {
        console.log("Connected");
        app.listen(port);
        /* const user = new User({
            username: "Yahia",
            email: "yahia@test.com",
        });
        const cart = new Cart({
            products: [],
        });
        cart.save()
            .then((cart) => {
                user.cartId = cart._id;
                user.save()
                    .then((user) => {
                        currentUser = user;
                        app.listen(port);
                    })
                    .catch((err) => {});
            })
            .catch((err) => {}); */
    })
    .catch((err) => {
        console.log(err);
    });
