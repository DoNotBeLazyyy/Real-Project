import { Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import createPool from '../db.js';
import { makeResponse } from '../utils/response.util.js';

// Reuse pool
const pool = createPool();
// Setup uploads folder if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
export const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
});

export async function addCoursework(req: Request, res: Response) {
    const { title, instruction, period, due_date, due_time, schedule_id } = req.body;
    const file = req.file;

    if (!title || !period) {
        return res.status(400).json(makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Title and period are required' }));
    }

    try {
        // 1️⃣ Insert coursework
        const sqlCoursework = `
            INSERT INTO coursework
            (title, instruction, period, due_date, due_time, schedule_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [courseworkResult]: any = await pool.execute(sqlCoursework, [title, instruction, period, due_date, due_time, schedule_id]);

        const courseworkId = courseworkResult.insertId;

        // 2️⃣ If there is a file, insert attachment
        let fileResult = null;
        if (file) {
            const sqlAttachment = `
                INSERT INTO coursework_attachment
                (coursework_id, file_name, file_path, mime_type, size)
                VALUES (?, ?, ?, ?, ?)
            `;
            await pool.execute(sqlAttachment, [
                courseworkId,
                file.originalname,
                file.path,
                file.mimetype,
                file.size
            ]);

            fileResult = {
                fileName: file.originalname,
                filePath: file.path,
                mimeType: file.mimetype,
                size: file.size
            };
        }

        res.json(makeResponse({
            result: {
                courseworkId,
                title,
                instruction,
                period,
                due_date,
                due_time,
                schedule_id,
                file: fileResult
            },
            retMsg: 'Coursework added successfully',
            retCode: 'SUCCESS'
        }));
    } catch (err: any) {
        res.status(500).json(makeResponse({ result: [], retCode: 'ERROR', retMsg: String(err) }));
    }
}

// Get all coursework
export async function getCourseworks(req: Request, res: Response) {
    try {
        const sql = `SELECT * FROM coursework ORDER BY coursework_id ASC`;
        const [rows] = await pool.query(sql);
        res.json(makeResponse({ result: rows }));
    } catch (err: any) {
        res.status(500).json(makeResponse({ result: [], retCode: 'ERROR', retMsg: String(err) }));
    }
}

// Update coursework
export async function updateCoursework(req: Request, res: Response) {
    const { coursework_id, title, instruction, period, due_date, due_time, schedule_id } = req.body;

    if (!coursework_id) {
        return res.status(400).json(makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Coursework ID is required' }));
    }

    try {
        const sql = `
            UPDATE coursework
            SET title = ?, instruction = ?, period = ?, due_date = ?, due_time = ?, schedule_id = ?
            WHERE coursework_id = ?
        `;
        const [result] = await pool.execute(sql, [title, instruction, period, due_date, due_time, schedule_id, coursework_id]);

        res.json(makeResponse({ result, retMsg: 'Coursework updated successfully' }));
    } catch (err: any) {
        res.status(500).json(makeResponse({ result: [], retCode: 'ERROR', retMsg: String(err) }));
    }
}

// Delete coursework
export async function deleteCoursework(req: Request, res: Response) {
    const { coursework_id } = req.body;

    if (!coursework_id) {
        return res.status(400).json(makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Coursework ID is required' }));
    }

    try {
        const sql = `DELETE FROM coursework WHERE coursework_id = ?`;
        const [result] = await pool.execute(sql, [coursework_id]);

        res.json(makeResponse({ result, retMsg: 'Coursework deleted successfully' }));
    } catch (err: any) {
        res.status(500).json(makeResponse({ result: [], retCode: 'ERROR', retMsg: String(err) }));
    }
}
