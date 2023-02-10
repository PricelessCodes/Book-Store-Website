const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
//connect-mongodb-session gives u a function which should execute to wich you pass your session
const MongodbStore = require("connect-mongodb-session")(session);
// csurf is creating csrf token to protect users from csrf attacks
//csrf attacks happen when a hacker trick user with a fake site look like the real site
//and take the user request and manipulate with it. so now the hacker has stolen user input and the session
//csurf token r embed into our forms for example, so for every request that does something on the backend
//that changes the users state, we can include token in our views then and on the server. this package will check
//if the incoming request does have that valid token. fake sites when send request they will be missing the token
//and token can not be guessed because it is random hashed value and new token is generated for every page we render
//depracated
//const csrf = require('csurf');
const { doubleCsrf } = require("csrf-csrf");
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');


const mongoose = require("mongoose");
const User = require("./models/user");
const Cart = require("./models/cart");

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const isAuthMiddleware = require("./middleware/is-auth");

const port = 3000;
const uri =
    "mongodb+srv://yahia:klBaU456OD9NHraM@cluster0.tx4rcfc.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();
const store = new MongodbStore({
    uri: uri,
    collection: "sessions",
});
const doubleCsrfUtilities = doubleCsrf({
    getSecret: () => "Secret", // A function that optionally takes the request and returns a secret
    cookieName: "__Host-psifi.x-csrf-token", // The name of the cookie to be used, recommend using Host prefix.
    cookieOptions: {
        httpOnly: true,
        sameSite: "lax", // Recommend you make this strict if posible
        path: "/",
        secure: true,
        //  ...remainingCOokieOptions // Additional options supported: domain, maxAge, expires
    },
    size: 64, // The size of the generated tokens in bits
    ignoredMethods: ["GET", "HEAD", "OPTIONS"], // A list of request methods that will not be protected.
    getTokenFromRequest: (req) => req.headers["x-csrf-token"], // A function that returns the token from the request
});
const {
    invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
    generateToken, // Use this in your routes to provide a CSRF hash cookie and token.
    validateRequest, // Also a convenience if you plan on making your own middleware.
    doubleCsrfProtection, // This is the default CSRF protection middleware.
} = doubleCsrf(doubleCsrfUtilities);

//telling express that we want to compile dynamic templates with the pug engine and set confiq globaly using
// app.set
//(key, value)
app.set("view engine", "ejs");
//the location of these templates (our main directory + views)
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
//used for css files to be static and get them with a link
app.use(express.static(path.join(__dirname, "public")));
//resave = false means that the session will not be saved on every request that is done but only if something
//changed in session (to improve performance).
//saveUninitialized to false to ensure that no session gets saved for a request where it does not need to be
//saved because nothing was changed about it
//can confiqure a cookie insied session too
//store is used to link with the store database (mongodb using connect mongodb session)
app.use(
    session({
        secret: "my secret",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);
/* app.use(cookieParser());
app.use(doubleCsrfProtection); */
//app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.user;
    //res.locals.doubleCsrfToken = generateToken(res);
    next();
});

app.use("/admin", isAuthMiddleware, adminRoutes);

app.use(authRoutes);

app.use(shopRoutes);

app.use(errorController.get404);

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
    })
    .catch((err) => {
        console.log(err);
    });
