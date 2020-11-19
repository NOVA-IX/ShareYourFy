const jwt = require("jsonwebtoken")

module.exports = function (req, res, next) {
    const token = req.headers["x-access-token"] || req.headers["authorization"]
    if (!token) return res.redirect('/login')

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret)
        req.user = decoded
        next()
    } catch (ex) {
        res.redirect('/login')
    }
};