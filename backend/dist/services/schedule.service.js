import { invalidArray } from '../utils/array.util.js';
import { makeResponse } from '../utils/response.util.js';
import { formatTime } from '../utils/string.util.js';
import createPool from 'src/createPool.js';
// Create the pool once and reuse
const pool = createPool();
export async function getSchedules(req, res) {
    const status = req.query.status;
    const sqlAll = `
        SELECT *
        FROM schedule
        ORDER BY scheduleId ASC;
    `;
    const sqlActive = `
        SELECT
            academicYear,
            courseId,
            facultyId,
            programId,
            schedule_code,
            schedule_days,
            schedule_end_time,
            scheduleId,
            schedule_start_time,
            semester,
            yearLevel
        FROM schedule
        WHERE deletedAt IS NULL
        ORDER BY scheduleId ASC;
    `;
    const sql = status === 'active' ? sqlActive : sqlAll;
    try {
        const [scheduleList] = await pool.query(sql);
        res.json(makeResponse({ result: scheduleList }));
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
export async function getFacultySchedule(req, res) {
    const facultyNumber = req.query.facultyNumber;
    if (!facultyNumber) {
        return res.status(400)
            .json(makeResponse({
            result: [],
            retCode: 'INVALID_REQUEST',
            retMsg: 'facultyNumber is required',
            status: 400
        }));
    }
    const sql = `
        SELECT
            c.courseCode,
            c.courseName,
            s.schedule_days,
            s.schedule_end_time,
            s.scheduleId,
            s.schedule_start_time
        FROM schedule AS s
        JOIN faculty AS f ON s.facultyId = f.facultyId
        JOIN course AS c ON s.courseId = c.courseId
        WHERE
            f.faculty_number = ? AND
            s.deletedAt IS NULL
        ORDER BY s.scheduleId ASC;
    `;
    try {
        const [rows] = await pool.query(sql, [facultyNumber]);
        const result = rows.map((row) => {
            const schedule = `${row.schedule_days} ${formatTime(row.schedule_start_time)} - ${formatTime(row.schedule_end_time)}`;
            return {
                courseCode: row.courseCode,
                courseName: row.courseName,
                schedule,
                scheduleId: row.scheduleId
            };
        });
        res.json(makeResponse({ result }));
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
export async function addSchedules(req, res) {
    const scheduleList = req.body;
    const addSql = `
        INSERT INTO schedule (
            academicYear,
            courseId,
            facultyId,
            programId,
            schedule_code,
            schedule_days,
            schedule_end_time,
            schedule_start_time,
            semester,
            yearLevel
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const restoreSql = `
        UPDATE schedule
        SET deletedAt = NULL
        WHERE schedule_code = ?
    `;
    if (invalidArray(scheduleList)) {
        return res.status(400)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: 'No schedule list provided',
            status: 400
        }));
    }
    try {
        const addOrRestorePromises = scheduleList.map(async (s) => {
            if (s.deletedAt !== null && s.scheduleId) {
                await pool.query(restoreSql, [s.scheduleCode]);
            }
            else {
                const addVals = [s.academicYear, s.courseId, s.facultyId, s.programId, s.scheduleCode, s.scheduleDays, s.scheduleEndTime, s.scheduleStartTime, s.semester, s.yearLevel];
                await pool.query(addSql, addVals);
            }
        });
        await Promise.all(addOrRestorePromises);
        res.json(makeResponse({
            result: scheduleList,
            retCode: 'SUCCESS',
            retMsg: 'Schedules added/restored successfully',
            status: 200
        }));
    }
    catch (err) {
        console.error('Error adding/restoring schedules:', err);
        res.status(500)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: String(err),
            status: 500
        }));
    }
}
export async function updateSchedules(req, res) {
    const scheduleList = req.body;
    const updateSql = `
        UPDATE schedule
        SET
            academicYear = ?,
            courseId = ?,
            facultyId = ?,
            programId = ?,
            schedule_code = ?,
            schedule_days = ?,
            schedule_end_time = ?,
            schedule_start_time = ?,
            semester = ?,
            yearLevel = ?
        WHERE scheduleId = ?
    `;
    const emptySql = `
        UPDATE schedule
        SET schedule_code = ?
        WHERE schedule_code = ? AND scheduleId <> ?
        LIMIT 1
    `;
    const deleteSql = `
        UPDATE schedule
        SET deletedAt = NOW()
        WHERE scheduleId = ?
    `;
    const restoreSql = `
        UPDATE schedule
        SET deletedAt = NULL
        WHERE schedule_code = ?
    `;
    let connection;
    if (invalidArray(scheduleList)) {
        return res.status(400)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: 'No schedule IDs provided',
            status: 400
        }));
    }
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        for (const [idx, s] of scheduleList.entries()) {
            const [rows] = await connection.query('SELECT schedule_code, deletedAt FROM schedule WHERE schedule_code = ? AND scheduleId <> ? LIMIT 1', [s.scheduleCode, s.scheduleId]);
            const inactiveRow = rows[0];
            if (rows.length > 0 && inactiveRow.deletedAt !== null) {
                const restoreVals = [inactiveRow.schedule_code];
                const deleteVals = [s.scheduleId];
                await connection.query(deleteSql, deleteVals);
                await connection.query(restoreSql, restoreVals);
            }
            else {
                const emptyVals = [idx, s.scheduleCode, s.scheduleId];
                const updateVals = [s.academicYear, s.courseId, s.facultyId, s.programId, s.scheduleCode, s.scheduleDays, s.scheduleEndTime, s.scheduleStartTime, s.semester, s.yearLevel, s.scheduleId];
                await connection.query(emptySql, emptyVals);
                await connection.query(updateSql, updateVals);
            }
        }
        await connection.commit();
        res.json(makeResponse({
            result: scheduleList,
            retCode: 'SUCCESS',
            retMsg: 'Schedules added/restored successfully',
            status: 200
        }));
    }
    catch (err) {
        if (connection) {
            await connection.rollback();
        }
        res.status(500)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: String(err),
            status: 500
        }));
    }
    finally {
        if (connection) {
            connection.release();
        }
    }
}
export async function deleteSchedule(req, res) {
    const idList = req.body.data;
    const sql = `
        UPDATE schedule
        SET deletedAt = NOW()
        WHERE scheduleId IN (?)
    `;
    if (invalidArray(idList)) {
        return res.status(400)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: 'No schedule IDs provided',
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
            retMsg: 'Failed to delete schedules',
            status: 500
        }));
    }
}
