import express from 'express';
import pool from './db';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/test-db', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
