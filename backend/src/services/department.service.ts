import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import createPool from '../db.js';
import { DepartmentProps } from '../types/department.type.js';
import { snakeToCamelArray, invalidArray } from '../utils/array.util.js';
import { makeResponse } from '../utils/response.util.js';

// Create the pool once and reuse
const pool = createPool();

export async function getDepartments(req: Request, res: Response) {
    const status = req.query.status;
    const sqlActive = `
        SELECT
            department_id,
            department_code,
            department_name
        FROM department
        WHERE deleted_at IS NULL
        ORDER BY department_id ASC;
    `;
    const sqlAll = `
        SELECT
            department_id,
            department_code,
            department_name
        FROM department
        ORDER BY department_id ASC;
    `;
    const sql = status === 'active' ? sqlActive : sqlAll;

    try {
        const [rows] = await pool.query<RowDataPacket[]>(sql);
        const departmentList = snakeToCamelArray(rows) as DepartmentProps[];

        res.json(makeResponse({ result: departmentList }));
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

export async function addDepartments(req: Request, res: Response) {
    const departmentList: DepartmentProps[] = req.body;
    const sql = `
        INSERT INTO department
        (
            department_code,
            department_name
        )
        VALUES ?
    `;

    if (invalidArray(departmentList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No department list provided',
                status: 400,
            })
        );
    }

    try {
        const values = departmentList.map(d => [
            d.departmentCode,
            d.departmentName ?? null,
        ]);

        await pool.query(sql, [values]);

        res.json(makeResponse({ result: departmentList }));
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

export async function updateDepartments(req: Request, res: Response) {
    const departmentList: DepartmentProps[] = req.body;
    const sql = `
        UPDATE department
        SET
            department_code = ?,
            department_name = ?
        WHERE department_id = ?
    `;

    if (invalidArray(departmentList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No department IDs provided',
                status: 400,
            })
        );
    }

    try {
        const updatePromises = departmentList.map(d => {
            const values = [
                d.departmentCode,
                d.departmentName ?? null,
                d.departmentId,
            ];
            return pool.query(sql, values);
        });

        await Promise.all(updatePromises);

        res.json(makeResponse({ result: departmentList }));
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

export async function deleteDepartment(req: Request, res: Response) {
    const idList: string[] = req.body.data;
    const sql = `
        UPDATE department
        SET deleted_at = NOW()
        WHERE department_id IN (?)
    `;

    if (invalidArray(idList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No department IDs provided',
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
                retMsg: 'Failed to delete departments',
                status: 500,
            })
        );
    }
}