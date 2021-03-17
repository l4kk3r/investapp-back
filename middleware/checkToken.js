const jwt = require('jsonwebtoken');
const {JWTOKEN, } = require('../secret');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token')
    if (!token) {
        return res.status(401).json({ message: 'No token' })
    }
    try {
        const decoded = jwt.verify(token, JWTOKEN)
        req.user = decoded;
        next()
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid' })
    }
}