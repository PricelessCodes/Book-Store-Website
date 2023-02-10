const mongoose = require("mongoose");
const Encryption = require("../util/encryption");
const nodemailer = require("nodemailer");

const User = require("../models/user");
const Cart = require("../models/cart");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "631448fed7477d",
        pass: "ec2411a7b82f23",
    },
});

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    mongoose
        .startSession()
        .then((session) => {
            session.startTransaction();

            let cart = new Cart({
                products: [],
            });

            let user = null;

            cart.save({ session })
                .then((savedCart) => {
                    cart = savedCart;
                    return Encryption.useBcryptjsHash(password);
                })
                .then((hashedPassword) => {
                    const newUser = new User({
                        username: email,
                        email: email,
                        password: hashedPassword,
                        cartId: cart._id,
                    });

                    return newUser.save({ session });
                })
                .then((savedUser) => {
                    user = savedUser;
                    //console.log("user: " + savedUser);
                    return session.commitTransaction();
                })
                .then(() => {
                    console.log("commitTransaction");
                    return session.endSession();
                })
                .then(() => {
                    console.log("endSession");
                    var mailOptions = {
                        from: '"Shop Website" <shop@node.com>',
                        to: user.email,
                        subject: "Signup succeeded test",
                        text: "Hey there, you successfully signed up!",
                        html: "<b>Hey there! </b><br> you successfully signed up!<br />",
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log("Message sent: %s", info.messageId);
                    });
                    res.status(201).redirect("/login");
                })
                .catch((err) => {
                    console.log("error inside transaction: " + err);
                    session
                        .abortTransaction()
                        .then(() => session.endSession())
                        .then(() => {
                            console.log("aborted");
                            res.status(400).redirect("/signup");
                        });
                });
        })
        .catch((err) => {
            console.log("error from starting transaction: " + err);
            res.status(400).redirect("/signup");
        });
};

exports.getLogin = (req, res, next) => {
    if (req.session.user) return res.status(404).redirect("/not-found");

    res.status(200).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let user;
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) throw "the email or password is not valid";
            user = savedUser;
            return Encryption.useBcryptjsCompare(password, user.password);
        })
        .then((isMathing) => {
            if (!isMathing) throw "the email or password is not valid";

            req.session.user = user;

            return req.session.save();
        })
        .then((session) => {
            res.redirect("/");
        })
        .catch((err) => {
            req.flash("error", err);
            res.redirect("/login");
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err + " at error");
        res.redirect("/");
    });
};
