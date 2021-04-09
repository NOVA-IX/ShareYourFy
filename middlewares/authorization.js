module.exports.checkUser = (req, res, next) => {
    const nextLink = req.originalUrl;
    if (req.session.user && req.session.user._id) {
      next();
    } else {
      req.flash('error', 'You must log in to continue');
      res.redirect(`/login`);
    }
}