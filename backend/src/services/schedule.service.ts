import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import createPool from '../db.js';
import { ScheduleProps } from '../types/common-management.type.js';
import { snakeToCamelArray, invalidArray } from '../utils/array.util.js';
import { makeResponse } from '../utils/response.util.js';

// Create the pool once and reuse
const pool = createPool();

export async function getSchedules(req: Request, res: Response) {
    const status = req.query.status;
    const sqlAll = `
        SELECT *
        FROM schedule
        ORDER BY schedule_id ASC;
    `;
    const sqlActive = `
        SELECT
            academic_year,
            course_id,
            faculty_id,
            program_id,
            schedule_code,
            schedule_days,
            schedule_end_time,
            schedule_id,
            schedule_start_time,
            semester,
            year_level
        FROM schedule
        WHERE deleted_at IS NULL
        ORDER BY schedule_id ASC;
    `;
    const sql = status === 'active' ? sqlActive : sqlAll;

    try {
        const [rows] = await pool.query<RowDataPacket[]>(sql);
        const scheduleList = snakeToCamelArray(rows) as ScheduleProps[];

        res.json(makeResponse({ result: scheduleList }));
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

export async function addSchedules(req: Request, res: Response) {
    const scheduleList: ScheduleProps[] = req.body;

    const addSql = `
        INSERT INTO schedule (
            academic_year,
            course_id,
            faculty_id,
            program_id,
            schedule_code,
            schedule_days,
            schedule_end_time,
            schedule_start_time,
            semester,
            year_level
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const restoreSql = `
        UPDATE schedule
        SET deleted_at = NULL
        WHERE schedule_code = ?
    `;

    if (invalidArray(scheduleList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No schedule list provided',
                status: 400,
            })
        );
    }

    try {
        const addOrRestorePromises = scheduleList.map(async (s) => {
            if (s.deletedAt !== null && s.scheduleId) {
                await pool.query(restoreSql, [s.scheduleCode]);
            } else {
                const addVals = [
                    s.academicYear,
                    s.courseId,
                    s.facultyId,
                    s.programId,
                    s.scheduleCode,
                    s.scheduleDays,
                    s.scheduleEndTime,
                    s.scheduleStartTime,
                    s.semester,
                    s.yearLevel,
                ];
                await pool.query(addSql, addVals);
            }
        });

        await Promise.all(addOrRestorePromises);

        res.json(
            makeResponse({
                result: scheduleList,
                retCode: 'SUCCESS',
                retMsg: 'Schedules added/restored successfully',
                status: 200,
            })
        );
    } catch (err) {
        console.error('Error adding/restoring schedules:', err);
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

export async function updateSchedules(req: Request, res: Response) {
    const scheduleList: ScheduleProps[] = req.body;
    const updateSql = `
        UPDATE schedule
        SET
            academic_year = ?,
            course_id = ?,
            faculty_id = ?,
            program_id = ?,
            schedule_code = ?,
            schedule_days = ?,
            schedule_end_time = ?,
            schedule_start_time = ?,
            semester = ?,
            year_level = ?
        WHERE schedule_id = ?
    `;
    const emptySql = `
        UPDATE schedule
        SET schedule_code = ?
        WHERE schedule_code = ? AND schedule_id <> ?
        LIMIT 1
    `
    const deleteSql = `
        UPDATE schedule
        SET deleted_at = NOW()
        WHERE schedule_id = ?
    `
    const restoreSql = `
        UPDATE schedule
        SET deleted_at = NULL
        WHERE schedule_code = ?
    `;
    let connection;

    if (invalidArray(scheduleList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No schedule IDs provided',
                status: 400,
            })
        );
    }

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        for (const [idx, s] of scheduleList.entries()) {
            const [rows]: any = await connection.query(
                `SELECT schedule_code, deleted_at FROM schedule WHERE schedule_code = ? AND schedule_id <> ? LIMIT 1`,
                [s.scheduleCode, s.scheduleId]
            );
            const inactiveRow = rows[0];

            if (rows.length > 0 && inactiveRow.deleted_at !== null) {
                const restoreVals = [inactiveRow.schedule_code];
                const deleteVals = [s.scheduleId];

                await connection.query(deleteSql, deleteVals);
                await connection.query(restoreSql, restoreVals);
            } else {
                const emptyVals = [
                    idx,
                    s.scheduleCode,
                    s.scheduleId
                ]
                const updateVals = [
                    s.academicYear,
                    s.courseId,
                    s.facultyId,
                    s.programId,
                    s.scheduleCode,
                    s.scheduleDays,
                    s.scheduleEndTime,
                    s.scheduleStartTime,
                    s.semester,
                    s.yearLevel,
                    s.scheduleId,
                ];
                await connection.query(emptySql, emptyVals);
                await connection.query(updateSql, updateVals);
            }
        }

        await connection.commit();

        res.json(
            makeResponse({
                result: scheduleList,
                retCode: 'SUCCESS',
                retMsg: 'Schedules added/restored successfully',
                status: 200,
            })
        );
    } catch (err) {
        if (connection) {
            await connection.rollback()
        }

        res.status(500).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: String(err),
                status: 500,
            })
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

export async function deleteSchedule(req: Request, res: Response) {
    const idList: string[] = req.body.data;
    const sql = `
        UPDATE schedule
        SET deleted_at = NOW()
        WHERE schedule_id IN (?)
    `;

    if (invalidArray(idList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No schedule IDs provided',
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
                retMsg: 'Failed to delete schedules',
                status: 500,
            })
        );
    }
}
