import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import createPool from '../db.js';
import { FacultyProps } from '../types/faculty.type.js';
import { snakeToCamelArray, invalidArray } from '../utils/array.util.js';
import { transporter } from '../utils/mailer.js';
import { generateRandomPassword } from '../utils/password.util.js';
import { makeResponse } from '../utils/response.util.js';

// Create the pool once and reuse
const pool = createPool();

export async function getFacultyDetail(req: Request, res: Response) {
    const username = String(req.query.username);

    const sqlAll = `
        SELECT
            f.address,
            f.age,
            f.department,
            f.email,
            f.faculty_number,
            f.first_name,
            f.last_name,
            f.sex
        FROM faculty AS f
        JOIN account AS a ON f.account_id = a.account_id
        WHERE a.username = ?
        LIMIT 1
    `;

    try {
        const [rows] = await pool.query<RowDataPacket[]>(sqlAll, [username]);
        if (!rows.length) {
            return res.status(404).json(makeResponse({
                result: [],
                retCode: 'NOT_FOUND',
                retMsg: 'Faculty not found',
                status: 404
            }));
        }
        const facultyArray = snakeToCamelArray(rows) as Record<string, any>[];
        const facultyDetail = facultyArray[0] as FacultyProps;

        res.json(makeResponse({ result: facultyDetail }));
    } catch (err) {
        res.status(500).json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: String(err),
            status: 500,
        }));
    }
}

export async function getFaculties(req: Request, res: Response) {
    const status = req.query.status;
    const sqlActive = `
        SELECT
            address,
            age,
            department,
            email,
            faculty_id,
            faculty_number,
            first_name,
            last_name,
            sex
        FROM faculty
        WHERE deleted_at IS NULL
        ORDER BY faculty_id ASC;
    `;
    const sqlAll = `
        SELECT
            address,
            age,
            department,
            email,
            faculty_id,
            faculty_number,
            first_name,
            last_name,
            sex
        FROM faculty
        ORDER BY faculty_id ASC;
    `;
    const sql = status === 'active'
        ? sqlActive
        : sqlAll;

    try {
        const [rows] = await pool.query<RowDataPacket[]>(sql);
        const facultyList = snakeToCamelArray(rows) as FacultyProps[];

        res.json(makeResponse({ result: facultyList }));
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

export async function addFaculties(req: Request, res: Response) {
    const facultyList: FacultyProps[] = req.body;

    if (invalidArray(facultyList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No faculty list provided',
                status: 400,
            })
        );
    }

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        for (const f of facultyList) {
            if (!f.email) {
                continue;
            }

            const cleanFacultyNumber = f.facultyNumber.replace(/-/g, '');
            const username = `${f.lastName}${cleanFacultyNumber}`;
            const plainPassword = generateRandomPassword(cleanFacultyNumber);

            try {
                await transporter.sendMail({
                    from: process.env.MAIL_USER,
                    to: f.email,
                    subject: 'Your Faculty Account Credentials',
                    html: `
                        <h2>Welcome to the Faculty Portal</h2>
                        <p>Hello <b>${f.firstName} ${f.lastName}</b>,</p>
                        <p>Your account has been created successfully.</p>
                        <p><b>Username:</b> ${username}</p>
                        <p><b>Temporary Password:</b> ${plainPassword}</p>
                        <p>Please log in and change your password immediately.</p>
                        <br/>
                        <p>Regards,<br/>University Admin</p>
                    `,
                });
            } catch (emailError) {
                console.error(`Email failed for ${f.email}:`, emailError);
                continue;
            }

            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            const [accountResult] = await conn.query<RowDataPacket[]>(
                `
                INSERT INTO account (username, password, initial_password, user_role)
                VALUES (?, ?, ?, ?)
                `,
                [username, hashedPassword, hashedPassword, 'faculty']
            );

            const accountId = (accountResult as any).insertId;

            await conn.query(
                `
                INSERT INTO faculty
                (address, age, department, email, faculty_number, first_name, last_name, sex, account_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    f.address,
                    f.age,
                    f.department ?? null,
                    f.email,
                    f.facultyNumber,
                    f.firstName,
                    f.lastName,
                    f.sex,
                    accountId,
                ]
            );
        }

        await conn.commit();
        conn.release();

        res.json(
            makeResponse({
                result: facultyList,
                retMsg: 'Faculties with successful emails have been added',
            })
        );
    } catch (err) {
        await conn.rollback();
        conn.release();
        console.error(err);
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

export async function updateFaculties(req: Request, res: Response) {
    const facultyList: FacultyProps[] = req.body;
    const sql = `
        UPDATE faculty
        SET
            address = ?,
            age = ?,
            department = ?,
            email = ?,
            first_name = ?,
            last_name = ?,
            sex = ?
        WHERE faculty_id = ?
    `;

    if (invalidArray(facultyList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No faculty IDs provided',
                status: 400,
            })
        );
    }

    try {
        const updatePromises = facultyList.map(s => {
            const values = [
                s.address,
                s.age,
                s.department,
                s.email,
                s.firstName,
                s.lastName,
                s.sex,
                s.facultyId,
            ];
            return pool.query(sql, values);
        });

        await Promise.all(updatePromises);

        res.json(makeResponse({ result: facultyList }));
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

export async function deleteFaculties(req: Request, res: Response) {
    const idList: string[] = req.body.data;
    const sql = `
        UPDATE faculty
        SET deleted_at = NOW()
        WHERE faculty_id IN (?)
    `;

    if (invalidArray(idList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No faculty IDs provided',
                status: 400,
            })
        );
    }

    try {
        await pool.query(sql, [idList]);

        res.json(makeResponse({ result: idList }));
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
