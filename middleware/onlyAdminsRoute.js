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
        req.sendingUser = decoded;
        if (!decoded.acctype === 'admin') {
            res.status(403).json({ message: 'Forbidden' })
        }
        next()
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid' })
    }
}