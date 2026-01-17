import { makeResponse } from '../utils/response.util.js';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import createPool from 'src/createPool.js';
// Reuse pool
const pool = createPool();
// Setup uploads folder if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir))
    fs.mkdirSync(uploadDir);
export const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
});
export async function addCoursework(req, res) {
    const { title, instruction, period, dueDate, dueTime, scheduleId } = req.body;
    const files = req.files; // multer stores files here
    console.log('files: ', files);
    if (!title || !period) {
        return res.status(400)
            .json(makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Title and period are required' }));
    }
    try {
        // Insert coursework
        const sqlCoursework = `
            INSERT INTO coursework
            (title, instruction, period, dueDate, dueTime, scheduleId)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [courseworkResult] = await pool.execute(sqlCoursework, [title, instruction, period, dueDate, dueTime, scheduleId]);
        const courseworkId = courseworkResult.insertId;
        const fileResults = [];
        if (files && files.length > 0) {
            const sqlAttachment = `
                INSERT INTO coursework_attachment
                (courseworkId, fileName, filePath, mimeType, size)
                VALUES (?, ?, ?, ?, ?)
            `;
            for (const file of files) {
                await pool.execute(sqlAttachment, [courseworkId, file.originalname, file.path, file.mimetype, file.size]);
                fileResults.push({
                    fileName: file.originalname,
                    filePath: file.path,
                    mimeType: file.mimetype,
                    size: file.size
                });
            }
        }
        res.json(makeResponse({
            result: {
                courseworkId,
                title,
                instruction,
                period,
                dueDate,
                dueTime,
                scheduleId,
                files: fileResults
            },
            retMsg: 'Coursework added successfully',
            retCode: 'SUCCESS'
        }));
    }
    catch (err) {
        res.status(500)
            .json(makeResponse({ result: [], retCode: 'ERROR', retMsg: String(err) }));
    }
}
// Get all coursework
// Get all coursework with attachments
export async function getCourseworks(req, res) {
    try {
        const sql = `
            SELECT
                c.courseworkId,
                c.title,
                c.instruction,
                c.period,
                c.dueDate,
                c.dueTime,
                c.scheduleId,
                a.attachmentId,
                a.fileName,
                a.filePath,
                a.mimeType,
                a.size,
                a.createdAt
            FROM coursework c
            LEFT JOIN coursework_attachment a
                ON c.courseworkId = a.courseworkId
            ORDER BY c.courseworkId ASC
        `;
        const [rows] = await pool.query(sql);
        // Transform rows into a structured format
        const courseworksMap = {};
        rows.forEach((row) => {
            const cwId = row.courseworkId;
            if (!courseworksMap[cwId]) {
                courseworksMap[cwId] = {
                    courseworkId: cwId,
                    title: row.title,
                    instruction: row.instruction,
                    period: row.period,
                    dueDate: row.dueDate,
                    dueTime: row.dueTime,
                    scheduleId: row.scheduleId,
                    files: []
                };
            }
            if (row.attachmentId) {
                courseworksMap[cwId].files.push({
                    attachmentId: row.attachmentId,
                    fileName: row.fileName,
                    filePath: row.filePath,
                    mimeType: row.mimeType,
                    size: row.size,
                    createdAt: row.createdAt
                });
            }
        });
        const courseworks = Object.values(courseworksMap);
        res.json(makeResponse({ result: courseworks }));
    }
    catch (err) {
        res.status(500)
            .json(makeResponse({ result: [], retCode: 'ERROR', retMsg: String(err) }));
    }
}
// Update coursework
export async function updateCoursework(req, res) {
    const { courseworkId, title, instruction, period, dueDate, dueTime, scheduleId } = req.body;
    if (!courseworkId) {
        return res.status(400)
            .json(makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Coursework ID is required' }));
    }
    try {
        const sql = `
            UPDATE coursework
            SET title = ?, instruction = ?, period = ?, dueDate = ?, dueTime = ?, scheduleId = ?
            WHERE courseworkId = ?
        `;
        const [result] = await pool.execute(sql, [title, instruction, period, dueDate, dueTime, scheduleId, courseworkId]);
        res.json(makeResponse({ result, retMsg: 'Coursework updated successfully' }));
    }
    catch (err) {
        res.status(500)
            .json(makeResponse({ result: [], retCode: 'ERROR', retMsg: String(err) }));
    }
}
// Delete coursework
export async function deleteCoursework(req, res) {
    const { courseworkId } = req.body;
    if (!courseworkId) {
        return res.status(400)
            .json(makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Coursework ID is required' }));
    }
    try {
        const sql = 'DELETE FROM coursework WHERE courseworkId = ?';
        const [result] = await pool.execute(sql, [courseworkId]);
        res.json(makeResponse({ result, retMsg: 'Coursework deleted successfully' }));
    }
    catch (err) {
        res.status(500)
            .json(makeResponse({ result: [], retCode: 'ERROR', retMsg: String(err) }));
    }
}
