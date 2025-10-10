import bcrypt from 'bcrypt';
// account.service.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ResultSetHeader } from 'mysql2';
import { RowDataPacket } from 'mysql2/promise';
import createPool from '../db.js';
import { AccountProps } from '../types/account.type.js';
import { invalidArray } from '../utils/array.util.js';
import { makeResponse } from '../utils/response.util.js';

const pool = createPool();
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = '1hr';

// Login user
export async function loginAccount(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'Username and password are required',
                status: 400,
            })
        );
    }

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT username, password, initial_password, user_role FROM account WHERE username = ?',
            [username]
        );

        if (!rows.length) {
            return res.status(401).json(
                makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Invalid credentials', status: 401 })
            );
        }

        const account: AccountProps = {
            initialPassword: rows[0].initial_password,
            password: rows[0].password,
            userRole: rows[0].user_role,
            username: rows[0].username,
        };
        const isInitial = account.password === account.initialPassword;

        // const isValid = await bcrypt.compare(password, account.password);
        // if (!isValid) {
        //     return res.status(401).json(
        //         makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Invalid credentials', status: 401 })
        //     );
        // }

        const token = jwt.sign({ username: account.username, role: account.userRole }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json(makeResponse({ result: { username: account.username, isInitial: isInitial, password: account.initialPassword, userRole: account.userRole, token } }));
    } catch (err) {
        res.status(500).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: String(err),
                status: 500,
            })
        );
    }
}

export async function changePassword(req: Request, res: Response) {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
        return res.status(400).json(
            makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Username and new password required', status: 400 })
        );
    }

    try {
        const hashed = await bcrypt.hash(newPassword, 10);
        const sql = 'UPDATE account SET password = ? WHERE username = ?';
        const [result] = await pool.query<ResultSetHeader>(
            sql,
            [hashed, username]
        );
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT username, password, initial_password, user_role FROM account WHERE username = ?',
            [username]
        );

        if (!rows.length) {
            return res.status(401).json(
                makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Invalid credentials', status: 401 })
            );
        }

        const account = {
            initialPassword: rows[0].initial_password,
            password: rows[0].password,
        };

        const isValid = await bcrypt.compare(newPassword, account.password);
        if (!isValid) {
            return res.status(401).json(
                makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Invalid credentials', status: 401 })
            );
        }

        const isInitial = account.initialPassword === account.password

        if (result.affectedRows < 1) {
            throw new Error('Something went wrong')
        }

        res.json(
            makeResponse({
                result: {
                    isInitial,
                    message: 'Password updated successfully.'
                }
            })
        );
    } catch (err) {
        console.error(err);
        res.status(500).json(makeResponse({ result: [], retCode: 'ERROR', retMsg: String(err), status: 500 }));
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
