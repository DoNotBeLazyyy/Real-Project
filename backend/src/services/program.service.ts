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
    const sqlActive = `
        SELECT
            program_id,
            program_code,
            program_name
        FROM program
        WHERE deleted_at IS NULL
        ORDER BY program_id ASC;
    `;
    const sqlAll = `
        SELECT
            program_id,
            program_code,
            program_name
        FROM program
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
    const sql = `
        INSERT INTO program
        (
            program_code,
            program_name
        )
        VALUES ?
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
        const values = programList.map(d => [
            d.programCode,
            d.programName ?? null,
        ]);

        await pool.query(sql, [values]);

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

export async function updatePrograms(req: Request, res: Response) {
    const programList: ProgramProps[] = req.body;
    const sql = `
        UPDATE program
        SET
            program_code = ?,
            program_name = ?
        WHERE program_id = ?
    `;

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
        const updatePromises = programList.map(d => {
            const values = [
                d.programCode,
                d.programName ?? null,
                d.programId,
            ];
            return pool.query(sql, values);
        });

        await Promise.all(updatePromises);

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