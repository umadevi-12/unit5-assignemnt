const jwt = require('jsonwebtoken');

module.exports = async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message:'Authorization header missing or malformed'});
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, email: decoded.email, name: decoded.name };
        next();
    } catch(err) {
        return res.status(401).json({message:'Invalid or expired token'});
    }
};
