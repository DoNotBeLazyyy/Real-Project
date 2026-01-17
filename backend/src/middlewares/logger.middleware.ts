import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function logger(req: Request, _res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401)
        .json({ retCode: 'UNAUTHORIZED', retMsg: 'Token missing' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET ?? '');
        (req as any).user = payload; // attach payload to request
        next();
    } catch (err) {
        return res.status(403)
            .json({ retCode: 'FORBIDDEN', retMsg: 'Invalid token' });
    }
}