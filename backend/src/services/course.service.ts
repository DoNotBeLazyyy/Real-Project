import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import createPool from '../db.js';
import { CourseProps } from '../types/course.type.js';
import { snakeToCamelArray, invalidArray } from '../utils/array.util.js';
import { makeResponse } from '../utils/response.util.js';

// Create the pool once and reuse
const pool = createPool();

export async function getCourses(req: Request, res: Response) {
    const status = req.query.status;
    const sqlAll = `
        SELECT *
        FROM course
        ORDER BY course_id ASC;
    `;
    const sqlActive = `
        SELECT
            course_id,
            course_code,
            course_name,
            course_description,
            course_unit
        FROM course
        WHERE deleted_at IS NULL
        ORDER BY course_id ASC;
    `;
    const sql = status === 'active' ? sqlActive : sqlAll;

    try {
        const [rows] = await pool.query<RowDataPacket[]>(sql);
        const courseList = snakeToCamelArray(rows) as CourseProps[];

        res.json(makeResponse({ result: courseList }));
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

export async function addCourses(req: Request, res: Response) {
    const courseList: CourseProps[] = req.body;

    const addSql = `
        INSERT INTO course (
            course_code,
            course_name,
            course_description,
            course_unit
        )
        VALUES (?, ?, ?, ?)
    `;

    const restoreSql = `
        UPDATE course
        SET deleted_at = NULL
        WHERE course_code = ?
    `;

    if (invalidArray(courseList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No course list provided',
                status: 400,
            })
        );
    }

    try {
        const addOrRestorePromises = courseList.map(async (c) => {
            if (c.deletedAt !== null && c.courseId) {
                await pool.query(restoreSql, [c.courseCode]);
            } else {
                const addVals = [
                    c.courseCode,
                    c.courseName,
                    c.courseDescription,
                    c.courseUnit,
                ];
                await pool.query(addSql, addVals);
            }
        });

        await Promise.all(addOrRestorePromises);

        res.json(
            makeResponse({
                result: courseList,
                retCode: 'SUCCESS',
                retMsg: 'Courses added/restored successfully',
                status: 200,
            })
        );
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

export async function updateCourses(req: Request, res: Response) {
    const courseList: CourseProps[] = req.body;

    const updateSql = `
        UPDATE course
        SET
            course_code = ?,
            course_name = ?,
            course_description = ?,
            course_unit = ?
        WHERE course_id = ?
    `;

    const emptySql = `
        UPDATE course
        SET course_code = ?
        WHERE course_code = ? AND course_id <> ?
        LIMIT 1
    `;

    const deleteSql = `
        UPDATE course
        SET deleted_at = NOW()
        WHERE course_id = ?
    `;

    const restoreSql = `
        UPDATE course
        SET deleted_at = NULL
        WHERE course_code = ?
    `;

    let connection;

    if (invalidArray(courseList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No course IDs provided',
                status: 400,
            })
        );
    }

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        for (const [idx, c] of courseList.entries()) {
            const [rows]: any = await connection.query(
                `SELECT course_code, deleted_at FROM course WHERE course_code = ? AND course_id <> ? LIMIT 1`,
                [c.courseCode, c.courseId]
            );
            const inactiveRow = rows[0];

            if (rows.length > 0 && inactiveRow.deleted_at !== null) {
                // Restore deleted course
                await connection.query(deleteSql, [c.courseId]);
                await connection.query(restoreSql, [inactiveRow.course_code]);
            } else {
                // Handle potential duplicate code
                await connection.query(emptySql, [idx, c.courseCode, c.courseId]);

                // Update course
                const updateVals = [
                    c.courseCode,
                    c.courseName,
                    c.courseDescription ?? null,
                    c.courseUnit ?? null,
                    c.courseId,
                ];
                await connection.query(updateSql, updateVals);
            }
        }

        await connection.commit();

        res.json(
            makeResponse({
                result: courseList,
                retCode: 'SUCCESS',
                retMsg: 'Courses updated/restored successfully',
                status: 200,
            })
        );
    } catch (err) {
        if (connection) await connection.rollback();

        res.status(500).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: String(err),
                status: 500,
            })
        );
    } finally {
        if (connection) connection.release();
    }
}

export async function deleteCourse(req: Request, res: Response) {
    const idList: string[] = req.body.data;
    const sql = `
        UPDATE course
        SET deleted_at = NOW()
        WHERE course_id IN (?)
    `;

    if (invalidArray(idList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No course IDs provided',
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
                retMsg: 'Failed to delete courses',
                status: 500,
            })
        );
    }
}