// account.service.ts
import { AccountProps } from '@app-types/account.type.js';
import { LoginReqDto } from '@dtos/account/accounReq.dto.js';
import { makeResponse } from '@utils/response.util.js';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2/promise';
import createPool from 'src/createPool.js';

const pool = createPool();
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = '1hr';

// Login user
export async function login(req: Request, res: Response) {
    const { username, password } = req.body as LoginReqDto;
    console.log({ username, password });
    if (!username || !password) {
        return res.status(400)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: 'Username and password are required',
                    status: 400
                })
            );
    }

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT
                username,
                password,
                initialPassword,
                userRole
            FROM account
            WHERE username = ?
            LIMIT 1`,
            [username]
        );

        if (!rows.length) {
            return res.status(401)
                .json(
                    makeResponse({
                        result: [],
                        retCode: 'ERROR',
                        retMsg: 'Invalid credentials',
                        status: 401
                    })
                );
        }

        const accountDetails = rows[0] as AccountProps;
        const isInitial = accountDetails.password === accountDetails.initialPassword;
        const isValid = await bcrypt.compare(password, accountDetails.password);

        if (!isValid) {
            return res.status(401)
                .json(
                    makeResponse({
                        result: [],
                        retCode: 'ERROR',
                        retMsg: 'Invalid credentials',
                        status: 401
                    })
                );
        }

        const token = jwt.sign(
            {
                username: accountDetails.username,
                role: accountDetails.userRole
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json(
            makeResponse({
                result: {
                    username: accountDetails.username,
                    isInitial,
                    userRole: accountDetails.userRole,
                    token
                }
            })
        );
    } catch (err) {
        res.status(500)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: String(err),
                    status: 500
                })
            );
    }
}

// export async function refreshToken(req: Request, res: Response) {
//     const refreshToken = req.cookies.refreshToken; // HTTP-only cookie

//     if (!refreshToken) {
//         return res.status(401).json({ retCode: 'UNAUTHORIZED', retMsg: 'No refresh token' });
//     }

//     try {
//         const payload = jwt.verify(refreshToken, 'superRefresh');
//         const newAccessToken = jwt.sign({ username: payload.username, role: payload.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

//         res.json({ accessToken: newAccessToken });
//     } catch (err) {
//         res.status(403).json({ retCode: 'FORBIDDEN', retMsg: 'Invalid refresh token' });
//     }
// }