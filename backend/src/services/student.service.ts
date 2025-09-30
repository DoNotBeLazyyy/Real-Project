import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import createPool from '../db.js';
import { StudentProps } from '../types/student.type.js';
import { snakeToCamelArray, invalidArray } from '../utils/array.util.js';
import { makeResponse } from '../utils/response.util.js';

// Create the pool once and reuse
const pool = createPool();

export async function getAllStudents(_req: Request, res: Response) {
    const sql = `
        SELECT *
        FROM student
        WHERE is_deleted IS NULL;
    `;

    try {
        const [rows] = await pool
            .query<RowDataPacket[]>(sql);
        const studentList = snakeToCamelArray(rows) as StudentProps[];

        res.json(
            makeResponse(
                200,
                studentList,
                'Students fetched successfully',
                'SUCCESS'
            )
        );
    } catch (err) {
        res.status(500).json(
            makeResponse(
                500,
                [],
                'Failed to fetch students',
                'ERROR'
            )
        );
    }
}

export async function addStudents(req: Request, res: Response) {
    const studentList: StudentProps[] = req.body;
    const sql = `
        INSERT INTO student
        (
            id,
            address,
            age,
            email,
            first_name,
            last_name,
            program,
            sex,
            year_level
        )
        VALUES ?
    `;


    if (invalidArray(studentList)) {
        return res.status(400).json(
            makeResponse(
                400,
                [],
                'No student list provided',
                'ERROR'
            )
        );
    }

    try {
        const values = studentList.map(s => [
            s.id,
            s.address,
            s.age,
            s.email,
            s.firstName,
            s.lastName,
            s.program,
            s.sex,
            s.yearLevel
        ]);

        await pool.query(sql, [values]);

        res.json(
            makeResponse(
                200,
                studentList,
                `${studentList.length} students added successfully`,
                'SUCCESS'
            )
        );
    } catch (err) {
        res.status(500).json(
            makeResponse(
                500,
                [],
                'Failed to add students',
                'ERROR'
            )
        );
    }
}

export async function updateStudents(req: Request, res: Response) {
    const studentList: StudentProps[] = req.body;
    const sql = `
        UPDATE student
        SET
            first_name = ?,
            last_name = ?,
            sex = ?,
            email = ?,
            age = ?,
            address = ?,
            program = ?,
            year_level = ?
        WHERE id = ?
    `;

    if (invalidArray(studentList)) {
        return res.status(400).json(
            makeResponse(
                400,
                [],
                'No student IDs provided',
                'ERROR'
            )
        );
    }

    try {
        const updatePromises = studentList.map(s => {
            const values = [
                s.firstName,
                s.lastName,
                s.sex,
                s.email,
                s.age,
                s.address,
                s.program,
                s.yearLevel,
                s.id
            ];
            return pool.query(sql, values);
        });

        await Promise.all(updatePromises);

        res.json(
            makeResponse(
                200,
                studentList,
                'Students updated successfully',
                'SUCCESS'
            )
        );
    } catch (err) {
        res.status(500).json(
            makeResponse(
                500,
                [],
                'Failed to update students',
                'ERROR'
            )
        );
    }
}

export async function deleteStudent(req: Request, res: Response) {
    const idList: string[] = req.body.data;
    const sql = `
        UPDATE student
        SET is_deleted = NOW()
        WHERE id IN (?)
    `;

    console.log(invalidArray(idList));

    if (invalidArray(idList)) {
        return res.status(400).json(
            makeResponse(
                400,
                [],
                'No student IDs provided',
                'ERROR'
            )
        );
    }

    try {
        await pool.query(sql, [idList]);

        res.json(
            makeResponse(
                200,
                idList,
                'Students deleted successfully',
                'SUCCESS'
            )
        );
    } catch (err) {
        res.status(500).json(
            makeResponse(
                500,
                [],
                'Failed to delete students',
                'ERROR'
            )
        );
    }
}
