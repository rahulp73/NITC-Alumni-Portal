// Role-based middleware
import User from '../schemas/users.js';

export const requireRole = (roles) => async (req, res, next) => {
    try {
        if (!req._id) return res.status(401).json({ message: 'Unauthorized' });
        const user = await User.findById(req._id);
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
import JWT from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
    try {
        if (!req.cookies.token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }
        const verified = JWT.verify(req.cookies.token, process.env.JWT_SECRET)
        req._id = verified._id
        next()
    } catch (err) {
        console.log(err)
        console.log('Invalid Token')
        res.status(400).json({ message: 'Invalid Token' })
    }
}
