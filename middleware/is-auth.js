module.exports = (req, res, next) => {
    console.log(!req.session.user, "a7a");
    if (!req.session.user) {
        console.log("redir");
        return res.status(200).redirect("/login");
    }
    console.log("pass");
    next();
};
