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
    const { title, instruction, period, dueDate, dueTime, scheduleId } = req.body;
    const files = req.files as Express.Multer.File[]; // multer stores files here

    console.log('files: ', files);

    if (!title || !period) {
        return res.status(400).json(makeResponse({ result: [], retCode: 'ERROR', retMsg: 'Title and period are required' }));
    }

    try {
        // Insert coursework
        const sqlCoursework = `
            INSERT INTO coursework
            (title, instruction, period, due_date, due_time, schedule_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [courseworkResult]: any = await pool.execute(sqlCoursework, [title, instruction, period, dueDate, dueTime, scheduleId]);
        const courseworkId = courseworkResult.insertId;

        let fileResults: any[] = [];
        if (files && files.length > 0) {
            const sqlAttachment = `
                INSERT INTO coursework_attachment
                (coursework_id, file_name, file_path, mime_type, size)
                VALUES (?, ?, ?, ?, ?)
            `;

            for (const file of files) {
                await pool.execute(sqlAttachment, [
                    courseworkId,
                    file.originalname,
                    file.path,
                    file.mimetype,
                    file.size
                ]);

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
    } catch (err: any) {
        res.status(500).json(makeResponse({ result: [], retCode: 'ERROR', retMsg: String(err) }));
    }
}

// Get all coursework
// Get all coursework with attachments
export async function getCourseworks(req: Request, res: Response) {
    try {
        const sql = `
            SELECT
                c.coursework_id,
                c.title,
                c.instruction,
                c.period,
                c.due_date,
                c.due_time,
                c.schedule_id,
                a.attachment_id,
                a.file_name,
                a.file_path,
                a.mime_type,
                a.size,
                a.created_at
            FROM coursework c
            LEFT JOIN coursework_attachment a
                ON c.coursework_id = a.coursework_id
            ORDER BY c.coursework_id ASC
        `;

        const [rows]: any = await pool.query(sql);

        // Transform rows into a structured format
        const courseworksMap: Record<number, any> = {};

        rows.forEach((row: any) => {
            const cwId = row.coursework_id;

            if (!courseworksMap[cwId]) {
                courseworksMap[cwId] = {
                    courseworkId: cwId,
                    title: row.title,
                    instruction: row.instruction,
                    period: row.period,
                    dueDate: row.due_date,
                    dueTime: row.due_time,
                    scheduleId: row.schedule_id,
                    files: []
                };
            }

            if (row.attachment_id) {
                courseworksMap[cwId].files.push({
                    attachmentId: row.attachment_id,
                    fileName: row.file_name,
                    filePath: row.file_path,
                    mimeType: row.mime_type,
                    size: row.size,
                    createdAt: row.created_at
                });
            }
        });

        const courseworks = Object.values(courseworksMap);

        res.json(makeResponse({ result: courseworks }));
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
