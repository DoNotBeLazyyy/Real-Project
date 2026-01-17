import { StudentProps } from '@app-types/student.type.js';
import { invalidArray } from '@utils/array.util.js';
import { transporter } from '@utils/mailer.js';
import { generateRandomPassword } from '@utils/password.util.js';
import { makeResponse } from '@utils/response.util.js';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import createPool from 'src/createPool.js';

// Create the pool once and reuse
const pool = createPool();

export async function getStudents(req: Request, res: Response) {
    const status = req.query.status;
    const sqlActive = `
        SELECT
            address,
            age,
            email,
            firstName,
            lastName,
            program,
            sex,
            studentId,
            studentNumber,
            yearLevel
        FROM student
        WHERE deletedAt IS NULL
        ORDER BY studentId ASC;
    `;
    const sqlAll = `
        SELECT
            address,
            age,
            email,
            firstName,
            lastName,
            program,
            sex,
            studentId,
            studentNumber,
            yearLevel
        FROM student
        ORDER BY studentId ASC`;
    const sql = status === 'active' ? sqlActive : sqlAll;

    try {
        const [studentList] = await pool.query<RowDataPacket[]>(sql);

        res.json(makeResponse({ result: studentList }));
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

export async function addStudents(req: Request, res: Response) {
    const studentList: StudentProps[] = req.body;

    if (invalidArray(studentList)) {
        return res.status(400)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: 'No student list provided',
                    status: 400
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
                    `
                });
            } catch (emailError) {
                console.error(`Email failed for ${s.email}:`, emailError);
                continue;
            }

            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            const [accountResult] = await conn.query<RowDataPacket[]>(
                `
                INSERT INTO account (username, password, initialPassword, userRole)
                VALUES (?, ?, ?, ?)
                `,
                [username, hashedPassword, hashedPassword, 'student']
            );

            const accountId = (accountResult as any).insertId;

            await conn.query(
                `
                INSERT INTO student
                (address, age, email, firstName, lastName, program, sex, studentNumber, yearLevel, accountId)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [s.address, s.age, s.email, s.firstName, s.lastName, s.program, s.sex, s.studentNumber, s.yearLevel, accountId]
            );
        }

        await conn.commit();
        conn.release();

        res.json(
            makeResponse({
                result: studentList,
                retMsg: 'Students with successful emails have been added'
            })
        );
    } catch (err) {
        await conn.rollback();
        conn.release();
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

export async function updateStudents(req: Request, res: Response) {
    const studentList: StudentProps[] = req.body;
    const sql = `
        UPDATE student
        SET
            address = ?,
            age = ?,
            email = ?,
            firstName = ?,
            lastName = ?,
            program = ?,
            sex = ?,
            yearLevel = ?
        WHERE studentId = ?
    `;

    if (invalidArray(studentList)) {
        return res.status(400)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: 'No student IDs provided',
                    status: 400
                })
            );
    }

    try {
        const updatePromises = studentList.map((s) => {
            const values = [s.address, s.age, s.email, s.firstName, s.lastName, s.program, s.sex, s.yearLevel, s.studentId];
            return pool.query(sql, values);
        });

        await Promise.all(updatePromises);

        res.json(makeResponse({ result: studentList }));
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

export async function deleteStudent(req: Request, res: Response) {
    const idList: string[] = req.body.data;
    const sql = `
        UPDATE student
        SET deletedAt = NOW()
        WHERE studentId IN (?)
    `;

    if (invalidArray(idList)) {
        return res.status(400)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: 'No student IDs provided',
                    status: 400
                })
            );
    }

    try {
        await pool.query(sql, [idList]);

        res.json(makeResponse({ result: idList }));
    } catch (err) {
        res.status(500)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: 'Failed to delete students',
                    status: 500
                })
            );
    }
}