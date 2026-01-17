import { invalidArray } from '../utils/array.util.js';
import { makeResponse } from '../utils/response.util.js';
import createPool from 'src/createPool.js';
// Create the pool once and reuse
const pool = createPool();
export async function getDepartments(req, res) {
    const status = req.query.status;
    const sqlAll = `
        SELECT *
        FROM department
        ORDER BY departmentId ASC;
    `;
    const sqlActive = `
        SELECT
            departmentId,
            departmentCode,
            departmentName
        FROM department
        WHERE deletedAt IS NULL
        ORDER BY departmentId ASC;
    `;
    const sql = status === 'active' ? sqlActive : sqlAll;
    try {
        const [departmentList] = await pool.query(sql);
        res.json(makeResponse({ result: departmentList }));
    }
    catch (err) {
        res.status(500)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: String(err),
            status: 500
        }));
    }
}
export async function addDepartments(req, res) {
    const departmentList = req.body;
    const addSql = `
        INSERT INTO department (
            departmentCode,
            departmentName
        )
        VALUES (?, ?)
    `;
    const restoreSql = `
        UPDATE department
        SET deletedAt = NULL
        WHERE departmentCode = ?
    `;
    if (invalidArray(departmentList)) {
        return res.status(400)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: 'No department list provided',
            status: 400
        }));
    }
    try {
        const addOrRestorePromises = departmentList.map(async (d) => {
            if (d.deletedAt !== null && d.departmentId) {
                // restore soft-deleted department
                await pool.query(restoreSql, [d.departmentCode]);
            }
            else {
                const addVals = [d.departmentCode, d.departmentName ?? null];
                await pool.query(addSql, addVals);
            }
        });
        await Promise.all(addOrRestorePromises);
        res.json(makeResponse({
            result: departmentList,
            retCode: 'SUCCESS',
            retMsg: 'Departments added/restored successfully',
            status: 200
        }));
    }
    catch (err) {
        console.error('Error adding/restoring departments:', err);
        res.status(500)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: String(err),
            status: 500
        }));
    }
}
export async function updateDepartments(req, res) {
    const departmentList = req.body;
    const updateSql = `
        UPDATE department
        SET
            departmentCode = ?,
            departmentName = ?
        WHERE departmentId = ?
    `;
    const emptySql = `
        UPDATE department
        SET departmentCode = ?
        WHERE departmentCode = ? AND departmentId <> ?
        LIMIT 1
    `;
    const deleteSql = `
        UPDATE department
        SET deletedAt = NOW()
        WHERE departmentId = ?
    `;
    const restoreSql = `
        UPDATE department
        SET deletedAt = NULL
        WHERE departmentCode = ?
    `;
    let connection;
    if (invalidArray(departmentList)) {
        return res.status(400)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: 'No department IDs provided',
            status: 400
        }));
    }
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        for (const [idx, d] of departmentList.entries()) {
            const [rows] = await connection.query('SELECT departmentCode, deletedAt FROM department WHERE departmentCode = ? AND departmentId <> ? LIMIT 1', [d.departmentCode, d.departmentId]);
            const inactiveRow = rows[0];
            if (rows.length > 0 && inactiveRow.deletedAt !== null) {
                await connection.query(deleteSql, [d.departmentId]);
                await connection.query(restoreSql, [inactiveRow.departmentCode]);
            }
            else {
                await connection.query(emptySql, [idx, d.departmentCode, d.departmentId]);
                const updateVals = [d.departmentCode, d.departmentName ?? null, d.departmentId];
                await connection.query(updateSql, updateVals);
            }
        }
        await connection.commit();
        res.json(makeResponse({
            result: departmentList,
            retCode: 'SUCCESS',
            retMsg: 'Departments updated/restored successfully',
            status: 200
        }));
    }
    catch (err) {
        if (connection)
            await connection.rollback();
        res.status(500)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: String(err),
            status: 500
        }));
    }
    finally {
        if (connection)
            connection.release();
    }
}
export async function deleteDepartment(req, res) {
    const idList = req.body.data;
    const sql = `
        UPDATE department
        SET deletedAt = NOW()
        WHERE departmentId IN (?)
    `;
    if (invalidArray(idList)) {
        return res.status(400)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: 'No department IDs provided',
            status: 400
        }));
    }
    try {
        await pool.query(sql, [idList]);
        res.json(makeResponse({ result: idList }));
    }
    catch (err) {
        res.status(500)
            .json(makeResponse({
            result: [],
            retCode: 'ERROR',
            retMsg: 'Failed to delete departments',
            status: 500
        }));
    }
}
