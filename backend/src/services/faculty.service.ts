import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import createPool from '../db.js';
import { FacultyProps } from '../types/faculty.type.js';
import { snakeToCamelArray, invalidArray } from '../utils/array.util.js';
import { makeResponse } from '../utils/response.util.js';

// Create the pool once and reuse
const pool = createPool();

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
    const sql = `
        INSERT INTO faculty
        (
            address,
            age,
            department,
            email,
            faculty_number,
            first_name,
            last_name,
            sex
        )
        VALUES ?
    `;

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

    try {
        const values = facultyList.map(s => [
            s.address,
            s.age,
            s.department,
            s.email,
            s.facultyNumber,
            s.firstName,
            s.lastName,
            s.sex,
        ]);

        await pool.query(sql, [values]);

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
