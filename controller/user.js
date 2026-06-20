let User = require("../models/user");

module.exports.toSignUp = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let registerdUser = await User.register(newUser, password);
        req.login(registerdUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Registerd Successfully");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.toLogin=(req, res) => {
    res.render("users/login.ejs");
};

module.exports.login=async (req, res) => {
    req.flash("success", "Login successfully");
    if(res.locals.redirectUrl){
    return res.redirect(res.locals.redirectUrl);
    }
    res.redirect("/listings");
};

module.exports.logout=(req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);

        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");

    });
};