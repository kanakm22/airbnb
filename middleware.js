module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // redirect url to be saved
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if (res.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
}