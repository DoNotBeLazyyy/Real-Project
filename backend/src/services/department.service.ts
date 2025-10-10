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
    const sqlAll = `
        SELECT *
        FROM department
        ORDER BY department_id ASC;
    `;
    const sqlActive = `
        SELECT
            department_id,
            department_code,
            department_name
        FROM department
        WHERE deleted_at IS NULL
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

    const addSql = `
        INSERT INTO department (
            department_code,
            department_name
        )
        VALUES (?, ?)
    `;

    const restoreSql = `
        UPDATE department
        SET deleted_at = NULL
        WHERE department_code = ?
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
        const addOrRestorePromises = departmentList.map(async (d) => {
            if (d.deletedAt !== null && d.departmentId) {
                // restore soft-deleted department
                await pool.query(restoreSql, [d.departmentCode]);
            } else {
                const addVals = [
                    d.departmentCode,
                    d.departmentName ?? null,
                ];
                await pool.query(addSql, addVals);
            }
        });

        await Promise.all(addOrRestorePromises);

        res.json(
            makeResponse({
                result: departmentList,
                retCode: 'SUCCESS',
                retMsg: 'Departments added/restored successfully',
                status: 200,
            })
        );
    } catch (err) {
        console.error('Error adding/restoring departments:', err);
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

    const updateSql = `
        UPDATE department
        SET
            department_code = ?,
            department_name = ?
        WHERE department_id = ?
    `;

    const emptySql = `
        UPDATE department
        SET department_code = ?
        WHERE department_code = ? AND department_id <> ?
        LIMIT 1
    `;

    const deleteSql = `
        UPDATE department
        SET deleted_at = NOW()
        WHERE department_id = ?
    `;

    const restoreSql = `
        UPDATE department
        SET deleted_at = NULL
        WHERE department_code = ?
    `;

    let connection;

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
        connection = await pool.getConnection();
        await connection.beginTransaction();

        for (const [idx, d] of departmentList.entries()) {
            const [rows]: any = await connection.query(
                `SELECT department_code, deleted_at FROM department WHERE department_code = ? AND department_id <> ? LIMIT 1`,
                [d.departmentCode, d.departmentId]
            );
            const inactiveRow = rows[0];

            if (rows.length > 0 && inactiveRow.deleted_at !== null) {
                await connection.query(deleteSql, [d.departmentId]);
                await connection.query(restoreSql, [inactiveRow.department_code]);
            } else {
                await connection.query(emptySql, [idx, d.departmentCode, d.departmentId]);

                const updateVals = [
                    d.departmentCode,
                    d.departmentName ?? null,
                    d.departmentId,
                ];
                await connection.query(updateSql, updateVals);
            }
        }

        await connection.commit();

        res.json(
            makeResponse({
                result: departmentList,
                retCode: 'SUCCESS',
                retMsg: 'Departments updated/restored successfully',
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