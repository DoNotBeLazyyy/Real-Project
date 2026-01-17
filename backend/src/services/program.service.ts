import { ProgramProps } from '@app-types/program.type.js';
import { invalidArray } from '@utils/array.util.js';
import { makeResponse } from '@utils/response.util.js';
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import createPool from 'src/createPool.js';

// Create the pool once and reuse
const pool = createPool();

export async function getPrograms(req: Request, res: Response) {
    const status = req.query.status;
    const sqlAll = `
        SELECT *
        FROM program
        ORDER BY programId ASC;
    `;
    const sqlActive = `
        SELECT
            programId,
            programCode,
            programName,
            departmentId
        FROM program
        WHERE deletedAt IS NULL
        ORDER BY programId ASC;
    `;
    const sql = status === 'active' ? sqlActive : sqlAll;

    try {
        const [programList] = await pool.query<RowDataPacket[]>(sql);

        res.json(makeResponse({ result: programList }));
    } catch (err) {
        res.status(500)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: String(err),
                    status: 500
                })
            );
    }
}

export async function addPrograms(req: Request, res: Response) {
    const programList: ProgramProps[] = req.body;
    const addSql = `
        INSERT INTO program (
            programCode,
            programName,
            departmentId
        )
        VALUES (?, ?, ?)
    `;
    const restoreSql = `
        UPDATE program
        SET deletedAt = NULL
        WHERE programCode = ?
    `;

    if (invalidArray(programList)) {
        return res.status(400)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: 'No program list provided',
                    status: 400
                })
            );
    }

    try {
        const addOrRestorePromises = programList.map(async(p) => {
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
                status: 200
            })
        );
    } catch (err) {
        console.error('Error adding/restoring programs:', err);
        res.status(500)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: String(err),
                    status: 500
                })
            );
    }
}

export async function updatePrograms(req: Request, res: Response) {
    const programList: ProgramProps[] = req.body;
    const updateSql = `
        UPDATE program
        SET
            programCode = ?,
            programName = ?,
            departmentId = ?
        WHERE programId = ?
    `;
    const emptySql = `
        UPDATE program
        SET programCode = ?
        WHERE programCode = ? AND programId <> ?
        LIMIT 1
    `;
    const deleteSql = `
        UPDATE program
        SET deletedAt = NOW()
        WHERE programId = ?
    `;
    const restoreSql = `
        UPDATE program
        SET deletedAt = NULL
        WHERE programCode = ?
    `;

    let connection;

    if (invalidArray(programList)) {
        return res.status(400)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: 'No program IDs provided',
                    status: 400
                })
            );
    }

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        for (const [idx, p] of programList.entries()) {
            const [rows]: any = await connection.query('SELECT programCode, deletedAt FROM program WHERE programCode = ? AND programId <> ? LIMIT 1', [p.programCode, p.programId]);
            const inactiveRow = rows[0];

            if (rows.length > 0 && inactiveRow.deletedAt !== null) {
                // restore soft-deleted program
                await connection.query(deleteSql, [p.programId]);
                await connection.query(restoreSql, [inactiveRow.programCode]);
            } else {
                // handle potential duplicate programCode
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
                status: 200
            })
        );
    } catch (err) {
        if (connection) await connection.rollback();

        res.status(500)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: String(err),
                    status: 500
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
        SET deletedAt = NOW()
        WHERE programId IN (?)
    `;

    if (invalidArray(idList)) {
        return res.status(400)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: 'No program IDs provided',
                    status: 400
                })
            );
    }

    try {
        await pool.query(sql, [idList]);

        res.json(makeResponse({ result: idList }));
    } catch (err) {
        res.status(500)
            .json(
                makeResponse({
                    result: [],
                    retCode: 'ERROR',
                    retMsg: 'Failed to delete programs',
                    status: 500
                })
            );
    }
}