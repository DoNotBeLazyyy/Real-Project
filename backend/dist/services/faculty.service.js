import { invalidArray } from '../utils/array.util.js';
import { transporter } from '../utils/mailer.js';
import { generateRandomPassword } from '../utils/password.util.js';
import { makeResponse } from '../utils/response.util.js';
import bcrypt from 'bcrypt';
import createPool from 'src/createPool.js';
// Create the pool once and reuse
const pool = createPool();
export async function getFacultyDetail(req, res) {
    const username = String(req.query.username);
    const sqlAll = `
        SELECT
            f.address,
            f.age,
            f.email,
            f.faculty_number,
            f.firstName,
            f.lastName,
            f.sex,
            d.departmentCode,
            d.departmentName
        FROM faculty AS f
        JOIN account AS a ON f.accountId = a.accountId
        JOIN department AS d ON f.department = d.departmentId
        WHERE a.username = ?
        LIMIT 1;
    `;
    try {
        const [facultyArray] = await pool.query(sqlAll, [username]);
        if (!facultyArray.length) {
            return res.status(404)
                .json(makeResponse({
                result: [],
                retCode: 'NOT_FOUND',
                retMsg: 'Faculty not found',
                status: 404
            }));
        }
        const facultyDetail = facultyArray[0];
        res.json(makeResponse({ result: facultyDetail }));
    }
    catch (err) {
        res.status(500)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: String(err),
            status: 500
        }));
    }
}
export async function getFaculties(req, res) {
    const status = req.query.status;
    const sqlActive = `
        SELECT
            address,
            age,
            department,
            email,
            facultyId,
            faculty_number,
            firstName,
            lastName,
            sex
        FROM faculty
        WHERE deletedAt IS NULL
        ORDER BY facultyId ASC;
    `;
    const sqlAll = `
        SELECT
            address,
            age,
            department,
            email,
            facultyId,
            faculty_number,
            firstName,
            lastName,
            sex
        FROM faculty
        ORDER BY facultyId ASC;
    `;
    const sql = status === 'active' ? sqlActive : sqlAll;
    try {
        const [facultyList] = await pool.query(sql);
        res.json(makeResponse({ result: facultyList }));
    }
    catch (err) {
        res.status(500)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: String(err),
            status: 500
        }));
    }
}
export async function addFaculties(req, res) {
    const facultyList = req.body;
    if (invalidArray(facultyList)) {
        return res.status(400)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: 'No faculty list provided',
            status: 400
        }));
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
                    `
                });
            }
            catch (emailError) {
                console.error(`Email failed for ${f.email}:`, emailError);
                continue;
            }
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            const [accountResult] = await conn.query(`
                INSERT INTO account (username, password, initialPassword, userRole)
                VALUES (?, ?, ?, ?)
                `, [username, hashedPassword, hashedPassword, 'faculty']);
            const accountId = accountResult.insertId;
            await conn.query(`
                INSERT INTO faculty
                (address, age, department, email, faculty_number, firstName, lastName, sex, accountId)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [f.address, f.age, f.department ?? null, f.email, f.facultyNumber, f.firstName, f.lastName, f.sex, accountId]);
        }
        await conn.commit();
        conn.release();
        res.json(makeResponse({
            result: facultyList,
            retMsg: 'Faculties with successful emails have been added'
        }));
    }
    catch (err) {
        await conn.rollback();
        conn.release();
        console.error(err);
        res.status(500)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: String(err),
            status: 500
        }));
    }
}
export async function updateFaculties(req, res) {
    const facultyList = req.body;
    const sql = `
        UPDATE faculty
        SET
            address = ?,
            age = ?,
            department = ?,
            email = ?,
            firstName = ?,
            lastName = ?,
            sex = ?
        WHERE facultyId = ?
    `;
    if (invalidArray(facultyList)) {
        return res.status(400)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: 'No faculty IDs provided',
            status: 400
        }));
    }
    try {
        const updatePromises = facultyList.map((s) => {
            const values = [s.address, s.age, s.department, s.email, s.firstName, s.lastName, s.sex, s.facultyId];
            return pool.query(sql, values);
        });
        await Promise.all(updatePromises);
        res.json(makeResponse({ result: facultyList }));
    }
    catch (err) {
        res.status(500)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: String(err),
            status: 500
        }));
    }
}
export async function deleteFaculties(req, res) {
    const idList = req.body.data;
    const sql = `
        UPDATE faculty
        SET deletedAt = NOW()
        WHERE facultyId IN (?)
    `;
    if (invalidArray(idList)) {
        return res.status(400)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: 'No faculty IDs provided',
            status: 400
        }));
    }
    try {
        await pool.query(sql, [idList]);
        res.json(makeResponse({ result: idList }));
    }
    catch (err) {
        res.status(500)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: String(err),
            status: 500
        }));
    }
}
