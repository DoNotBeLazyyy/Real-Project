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
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = '1h';

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
            'SELECT username, password, user_role FROM account WHERE username = ?',
            [username]
        );

        if (!rows.length) {
            return res.status(401).json(
                makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Invalid credentials', status: 401 })
            );
        }

        const account: AccountProps = {
            username: rows[0].username,
            password: rows[0].password,
            userRole: rows[0].user_role,
        };

        const isValid = await bcrypt.compare(password, account.password);
        if (!isValid) {
            return res.status(401).json(
                makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Invalid credentials', status: 401 })
            );
        }

        const token = jwt.sign({ username: account.username, role: account.userRole }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json(makeResponse({ result: { username: account.username, userRole: account.userRole, token } }));
    } catch (err) {
        console.error(err);
        res.status(500).json(makeResponse({ result: [], retCode: 'ERROR', retMsg: String(err), status: 500 }));
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
    'UPDATE account SET password = ? WHERE username = ?',
    [hashed, username]
);

res.json(
    makeResponse({
        result: result.affectedRows > 0 ? 'Password updated' : 'No user found',
    })
);
    } catch (err) {
        console.error(err);
        res.status(500).json(makeResponse({ result: [], retCode: 'ERROR', retMsg: String(err), status: 500 }));
    }
}
