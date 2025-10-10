import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import createPool from '../db.js';
import { ProgramProps } from '../types/program.type.js';
import { snakeToCamelArray, invalidArray } from '../utils/array.util.js';
import { makeResponse } from '../utils/response.util.js';

// Create the pool once and reuse
const pool = createPool();

export async function getPrograms(req: Request, res: Response) {
    const status = req.query.status;
    const sqlAll = `
        SELECT *
        FROM program
        ORDER BY program_id ASC;
    `;
    const sqlActive = `
        SELECT
            program_id,
            program_code,
            program_name,
            department_id
        FROM program
        WHERE deleted_at IS NULL
        ORDER BY program_id ASC;
    `;
    const sql = status === 'active' ? sqlActive : sqlAll;

    try {
        const [rows] = await pool.query<RowDataPacket[]>(sql);
        const programList = snakeToCamelArray(rows) as ProgramProps[];

        res.json(makeResponse({ result: programList }));
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

export async function addPrograms(req: Request, res: Response) {
    const programList: ProgramProps[] = req.body;
    const addSql = `
        INSERT INTO program (
            program_code,
            program_name,
            department_id
        )
        VALUES (?, ?, ?)
    `;
    const restoreSql = `
        UPDATE program
        SET deleted_at = NULL
        WHERE program_code = ?
    `;

    if (invalidArray(programList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No program list provided',
                status: 400,
            })
        );
    }

    try {
        const addOrRestorePromises = programList.map(async (p) => {
            if (p.deletedAt !== null && p.programId) {
                await pool.query(restoreSql, [p.programCode]);
            } else {
                const addVals = [p.programCode, p.programName, p.departmentId];
                await pool.query(addSql, addVals);
            }
        });

        await Promise.all(addOrRestorePromises);

        res.json(
            makeResponse({
                result: programList,
                retCode: 'SUCCESS',
                retMsg: 'Programs added/restored successfully',
                status: 200,
            })
        );
    } catch (err) {
        console.error('Error adding/restoring programs:', err);
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

export async function updatePrograms(req: Request, res: Response) {
    const programList: ProgramProps[] = req.body;
    const updateSql = `
        UPDATE program
        SET
            program_code = ?,
            program_name = ?,
            department_id = ?
        WHERE program_id = ?
    `;
    const emptySql = `
        UPDATE program
        SET program_code = ?
        WHERE program_code = ? AND program_id <> ?
        LIMIT 1
    `;
    const deleteSql = `
        UPDATE program
        SET deleted_at = NOW()
        WHERE program_id = ?
    `;
    const restoreSql = `
        UPDATE program
        SET deleted_at = NULL
        WHERE program_code = ?
    `;

    let connection;

    if (invalidArray(programList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No program IDs provided',
                status: 400,
            })
        );
    }

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        for (const [idx, p] of programList.entries()) {
            const [rows]: any = await connection.query(
                `SELECT program_code, deleted_at FROM program WHERE program_code = ? AND program_id <> ? LIMIT 1`,
                [p.programCode, p.programId]
            );
            const inactiveRow = rows[0];

            if (rows.length > 0 && inactiveRow.deleted_at !== null) {
                // restore soft-deleted program
                await connection.query(deleteSql, [p.programId]);
                await connection.query(restoreSql, [inactiveRow.program_code]);
            } else {
                // handle potential duplicate program_code
                await connection.query(emptySql, [idx, p.programCode, p.programId]);

                // update program
                const updateVals = [p.programCode, p.programName, p.departmentId, p.programId];
                await connection.query(updateSql, updateVals);
            }
        }

        await connection.commit();

        res.json(
            makeResponse({
                result: programList,
                retCode: 'SUCCESS',
                retMsg: 'Programs updated/restored successfully',
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

export async function deleteProgram(req: Request, res: Response) {
    const idList: string[] = req.body.data;
    const sql = `
        UPDATE program
        SET deleted_at = NOW()
        WHERE program_id IN (?)
    `;

    if (invalidArray(idList)) {
        return res.status(400).json(
            makeResponse({
                result: [],
                retCode: 'ERROR',
                retMsg: 'No program IDs provided',
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
                retMsg: 'Failed to delete programs',
                status: 500,
            })
        );
    }
}