import { snakeToCamelArray, invalidArray } from '../utils/array.util.js';
import { makeResponse } from '../utils/response.util.js';
import createPool from 'src/createPool.js';
// Create the pool once and reuse
const pool = createPool();
export async function getCourses(req, res) {
    const status = req.query.status;
    const sqlAll = `
        SELECT *
        FROM course
        ORDER BY courseId ASC;
    `;
    const sqlActive = `
        SELECT
            courseId,
            courseCode,
            courseName,
            courseDescription,
            courseUnit
        FROM course
        WHERE deletedAt IS NULL
        ORDER BY courseId ASC;
    `;
    const sql = status === 'active' ? sqlActive : sqlAll;
    try {
        const [rows] = await pool.query(sql);
        const courseList = snakeToCamelArray(rows);
        res.json(makeResponse({ result: courseList }));
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
export async function addCourses(req, res) {
    const courseList = req.body;
    const addSql = `
        INSERT INTO course (
            courseCode,
            courseName,
            courseDescription,
            courseUnit
        )
        VALUES (?, ?, ?, ?)
    `;
    const restoreSql = `
        UPDATE course
        SET deletedAt = NULL
        WHERE courseCode = ?
    `;
    if (invalidArray(courseList)) {
        return res.status(400)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: 'No course list provided',
            status: 400
        }));
    }
    try {
        const addOrRestorePromises = courseList.map(async (c) => {
            if (c.deletedAt !== null && c.courseId) {
                await pool.query(restoreSql, [c.courseCode]);
            }
            else {
                const addVals = [c.courseCode, c.courseName, c.courseDescription, c.courseUnit];
                await pool.query(addSql, addVals);
            }
        });
        await Promise.all(addOrRestorePromises);
        res.json(makeResponse({
            result: courseList,
            retCode: 'SUCCESS',
            retMsg: 'Courses added/restored successfully',
            status: 200
        }));
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
export async function updateCourses(req, res) {
    const courseList = req.body;
    const updateSql = `
        UPDATE course
        SET
            courseCode = ?,
            courseName = ?,
            courseDescription = ?,
            courseUnit = ?
        WHERE courseId = ?
    `;
    const emptySql = `
        UPDATE course
        SET courseCode = ?
        WHERE courseCode = ? AND courseId <> ?
        LIMIT 1
    `;
    const deleteSql = `
        UPDATE course
        SET deletedAt = NOW()
        WHERE courseId = ?
    `;
    const restoreSql = `
        UPDATE course
        SET deletedAt = NULL
        WHERE courseCode = ?
    `;
    let connection;
    if (invalidArray(courseList)) {
        return res.status(400)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: 'No course IDs provided',
            status: 400
        }));
    }
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        for (const [idx, c] of courseList.entries()) {
            const [rows] = await connection.query('SELECT courseCode, deletedAt FROM course WHERE courseCode = ? AND courseId <> ? LIMIT 1', [c.courseCode, c.courseId]);
            const inactiveRow = rows[0];
            if (rows.length > 0 && inactiveRow.deletedAt !== null) {
                // Restore deleted course
                await connection.query(deleteSql, [c.courseId]);
                await connection.query(restoreSql, [inactiveRow.courseCode]);
            }
            else {
                // Handle potential duplicate code
                await connection.query(emptySql, [idx, c.courseCode, c.courseId]);
                // Update course
                const updateVals = [c.courseCode, c.courseName, c.courseDescription ?? null, c.courseUnit ?? null, c.courseId];
                await connection.query(updateSql, updateVals);
            }
        }
        await connection.commit();
        res.json(makeResponse({
            result: courseList,
            retCode: 'SUCCESS',
            retMsg: 'Courses updated/restored successfully',
            status: 200
        }));
    }
    catch (err) {
        if (connection)
            await connection.rollback();
        res.status(500)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: String(err),
            status: 500
        }));
    }
    finally {
        if (connection)
            connection.release();
    }
}
export async function deleteCourse(req, res) {
    const idList = req.body.data;
    const sql = `
        UPDATE course
        SET deletedAt = NOW()
        WHERE courseId IN (?)
    `;
    if (invalidArray(idList)) {
        return res.status(400)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: 'No course IDs provided',
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
            retMsg: 'Failed to delete courses',
            status: 500
        }));
    }
}
