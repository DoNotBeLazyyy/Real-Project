import { ChangePasswordReqDto } from '@dtos/account/accounReq.dto.js';
import { makeResponse } from '@utils/response.util.js';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import createPool from 'src/createPool.js';

const pool = createPool();

export async function changePassword(req: Request, res: Response) {
    const { username, newPassword } = req.body as ChangePasswordReqDto;

    if (!username || !newPassword) {
        return res.status(400)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: 'Username and new password required',
                    status: 400
                })
            );
    }

    try {
        const hashed = await bcrypt.hash(newPassword, 10);
        const sql = 'UPDATE account SET password = ? WHERE username = ?';
        const [result] = await pool.query<ResultSetHeader>(sql, [hashed, username]);
        const [rows] = await pool.query<RowDataPacket[]>('SELECT username, password, initialPassword, userRole FROM account WHERE username = ?', [username]);

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

        const account = {
            initialPassword: rows[0].initialPassword,
            password: rows[0].password
        };

        const isValid = await bcrypt.compare(newPassword, account.password);
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

        const isInitial = account.initialPassword === account.password;

        if (result.affectedRows < 1) {
            throw new Error('Something went wrong');
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