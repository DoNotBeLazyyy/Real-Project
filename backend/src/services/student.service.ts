import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import createPool from '../db.js';
import { StudentProps } from '../types/student.type.js';
import { snakeToCamelArray, invalidArray } from '../utils/array.util.js';
import { transporter } from '../utils/mailer.js';
import { generateRandomPassword } from '../utils/password.util.js';
import { makeResponse } from '../utils/response.util.js';

// Create the pool once and reuse
const pool = createPool();

export async function getStudents(req: Request, res: Response) {
    const status = req.query.status;
    const sqlActive = `
        SELECT
            address,
            age,
            email,
            first_name,
            last_name,
            program,
            sex,
            student_id,
            student_number,
            year_level
        FROM student
        WHERE deleted_at IS NULL
        ORDER BY student_id ASC;
    `;
    const sqlAll = `
        SELECT
            address,
            age,
            email,
            first_name,
            last_name,
            program,
            sex,
            student_id,
            student_number,
            year_level
        FROM student
        ORDER BY student_id ASC`;
    const sql = status === 'active' ? sqlActive : sqlAll;

    try {
        const [rows] = await pool.query<RowDataPacket[]>(sql);
        const studentList = snakeToCamelArray(rows) as StudentProps[];

        res.json(makeResponse({ result: studentList }));
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

export async function addStudents(req: Request, res: Response) {
    const studentList: StudentProps[] = req.body;

    if (invalidArray(studentList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No student list provided',
                status: 400,
            })
        );
    }

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        for (const s of studentList) {
            if (!s.email) continue;

            const cleanStudentNumber = s.studentNumber.replace(/-/g, '');
            const username = `${s.lastName}${cleanStudentNumber}`;
            const plainPassword = generateRandomPassword(cleanStudentNumber);

            try {
                await transporter.sendMail({
                    from: process.env.MAIL_USER,
                    to: s.email,
                    subject: 'Your Student Account Credentials',
                    html: `
                        <h2>Welcome to the Student Portal</h2>
                        <p>Hello <b>${s.firstName} ${s.lastName}</b>,</p>
                        <p>Your account has been created successfully.</p>
                        <p><b>Username:</b> ${username}</p>
                        <p><b>Temporary Password:</b> ${plainPassword}</p>
                        <p>Please log in and change your password immediately.</p>
                        <br/>
                        <p>Regards,<br/>University Admin</p>
                    `,
                });
            } catch (emailError) {
                console.error(`Email failed for ${s.email}:`, emailError);
                continue;
            }

            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            const [accountResult] = await conn.query<RowDataPacket[]>(
                `
                INSERT INTO account (username, password, initial_password, user_role)
                VALUES (?, ?, ?, ?)
                `,
                [username, hashedPassword, hashedPassword, 'student']
            );

            const accountId = (accountResult as any).insertId;

            await conn.query(
                `
                INSERT INTO student
                (address, age, email, first_name, last_name, program, sex, student_number, year_level, account_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    s.address,
                    s.age,
                    s.email,
                    s.firstName,
                    s.lastName,
                    s.program,
                    s.sex,
                    s.studentNumber,
                    s.yearLevel,
                    accountId,
                ]
            );
        }

        await conn.commit();
        conn.release();

        res.json(
            makeResponse({
                result: studentList,
                retMsg: 'Students with successful emails have been added',
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


export async function updateStudents(req: Request, res: Response) {
    const studentList: StudentProps[] = req.body;
    const sql = `
        UPDATE student
        SET
            address = ?,
            age = ?,
            email = ?,
            first_name = ?,
            last_name = ?,
            program = ?,
            sex = ?,
            year_level = ?
        WHERE student_id = ?
    `;

    if (invalidArray(studentList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No student IDs provided',
                status: 400,
            })
        );
    }

    try {
        const updatePromises = studentList.map(s => {
            const values = [
                s.address,
                s.age,
                s.email,
                s.firstName,
                s.lastName,
                s.program,
                s.sex,
                s.yearLevel,
                s.studentId,
            ];
            return pool.query(sql, values);
        });

        await Promise.all(updatePromises);

        res.json(makeResponse({ result: studentList }));
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

export async function deleteStudent(req: Request, res: Response) {
    const idList: string[] = req.body.data;
    const sql = `
        UPDATE student
        SET deleted_at = NOW()
        WHERE student_id IN (?)
    `;

    if (invalidArray(idList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No student IDs provided',
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
                retMsg: 'Failed to delete students',
                status: 500,
            })
        );
    }
}
