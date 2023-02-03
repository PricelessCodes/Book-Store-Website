const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const {mongoConnect} = require("./util/mongodb");

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();
const port = 3000;

//telling express that we want to compile dynamic templates with the pug engine and set confiq globaly using
// app.set
//(key, value)
app.set("view engine", "ejs");
//the location of these templates (our main directory + views)
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
//used for css files to be static and get them with a link
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(port);
});
