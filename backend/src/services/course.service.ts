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
    const sqlAll = `
        SELECT
            course_id,
            course_code,
            course_name,
            course_description,
            course_unit
        FROM course
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
    const sql = `
        INSERT INTO course
        (
            course_code,
            course_name,
            course_description,
            course_unit
        )
        VALUES ?
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
        const values = courseList.map(c => [
            c.courseCode,
            c.courseName,
            c.courseDescription ?? null,
            c.courseUnit ?? null,
        ]);

        await pool.query(sql, [values]);

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

export async function updateCourses(req: Request, res: Response) {
    const courseList: CourseProps[] = req.body;
    const sql = `
        UPDATE course
        SET
            course_code = ?,
            course_name = ?,
            course_description = ?,
            course_unit = ?
        WHERE course_id = ?
    `;

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
        const updatePromises = courseList.map(c => {
            const values = [
                c.courseCode,
                c.courseName,
                c.courseDescription ?? null,
                c.courseUnit ?? null,
                c.courseId,
            ];
            return pool.query(sql, values);
        });

        await Promise.all(updatePromises);

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