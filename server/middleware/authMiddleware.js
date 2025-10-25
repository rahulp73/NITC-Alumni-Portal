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
