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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            // Check if schedule already exists in DB (even soft-deleted)
            const [rows]: any = await pool.query(
                `SELECT deleted_at FROM schedule WHERE schedule_code = ? LIMIT 1`,
                [s.scheduleCode]
            );

            if (rows.length > 0) {
                const existing = rows[0];

                // If soft-deleted, restore it
                if (existing.deleted_at !== null) {
                    console.log('Restoring schedule:', s.scheduleCode);
                    await pool.query(restoreSql, [s.scheduleCode]);
                } else {
                    console.log('Already active, skipping:', s.scheduleCode);
                }
            } else {
                // Insert new record
                console.log('Adding new schedule:', s.scheduleCode);
                const addVals = [
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
        const updatePromises = scheduleList.map(async (s) => {
            if (s.deletedAt === null) {
                const restoreVals = [s.scheduleCode];
                const deleteVals = [s.scheduleId];

                await pool.query(deleteSql, deleteVals);
                await pool.query(restoreSql, restoreVals);
            } else {
                const updateVals = [
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
                await pool.query(updateSql, updateVals);
            }
        });

    await Promise.all(updatePromises);

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
