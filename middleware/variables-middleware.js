module.exports = function (req, res, next) {
    res.locals.url = req.url;
    res.locals.errors = null;
    res.locals.msg = null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.form = {};
    res.locals.query = req.query;
    next();
};