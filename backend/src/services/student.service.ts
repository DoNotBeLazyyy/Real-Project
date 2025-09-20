import { Request, Response } from 'express';
import createPool from '../db.js';
import { StudentProps } from '../types/student.type.js';

// Create the pool once and reuse
const pool = createPool();

export async function getAllStudents(_req: Request, res: Response) {
    try {
        const [rows] = await pool.query('SELECT * FROM student');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function addStudents(req: Request, res: Response) {
    const students: StudentProps[] = req.body;

    try {
        const sql = `INSERT INTO student
            (id, first_name, last_name, sex, email, age, address, program, year_level)
            VALUES ?`;

        // Transform data into array of arrays for bulk insert
        const values = students.map(s => [
            s.id, s.firstName, s.lastName, s.sex,
            s.email, s.age, s.address, s.program,
            s.yearLevel
        ]);

        await pool.query(sql, [values]); // bulk insert
        res.json({ message: `${students.length} students added successfully` });
    } catch (err) {
        console.log('error: ', err);
        res.status(500).json({ error: err });
    }
}

export async function updateStudent(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;

    try {
        const sql = 'UPDATE student SET first_name=?, last_name=?, sex=?, email=?, age=?, address=?, program=?, year_level=? WHERE id=?';
        const values = [
            data.first_name, data.last_name, data.sex,
            data.email, data.age, data.address,
            data.program, data.year_level,
            id
        ];
        await pool.query(sql, values);
        res.json({ message: 'Student updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

export async function deleteStudent(req: Request, res: Response) {
    const id = req.params.id;

    try {
        await pool.query('DELETE FROM student WHERE id = ?', [id]);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}