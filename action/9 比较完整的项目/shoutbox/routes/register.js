const User = require('../lib/user');

exports.form = function (req, res) {
    res.render("register", {title: "Register"})
};


exports.submit = function (req, res, next) {

    const data = {
        pass: req.body.pass,
        name: req.body.name
    };
    User.getByName(data.name, function (err, user) {
        if (err) return next(err);

        // redis will default it
        if (user.id) {
            console.log("Username already taken");
            res.error("Username already taken");
            res.redirect("back");
        } else {
            user = new User({
                name: data.name,
                pass: data.pass
            });

            user.save(function (err) {
                if (err) return next(err);
                req.session.uid = user.id;
                res.redirect("/");

            });
        }
    });
};

