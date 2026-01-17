import jwt from 'jsonwebtoken';
export function logger(req, _res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}
export function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!token)
        return res.status(401)
            .json({ retCode: 'UNAUTHORIZED', retMsg: 'Token missing' });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET ?? '');
        req.user = payload; // attach payload to request
        next();
    }
    catch (err) {
        return res.status(403)
            .json({ retCode: 'FORBIDDEN', retMsg: 'Invalid token' });
    }
}
