require('dotenv').config();
const mysql = require('mysql2/promise');
const express = require('express');
const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
});

router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM posts ORDER BY id DESC'
  );
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await pool.query(
    'SELECT * FROM posts WHERE id=?', [id]
  );
  if (rows.length === 0) return res.status(404).json({error: '없음'});
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { title, content, writer} = req.body;
  if (!title) return res.status(400).json({error: '제목 필수'});
  const [result] = await pool.query(
    'INSERT INTO posts (title, content, writer) VALUES(?, ?, ?)', [title, content ?? null, writer ?? null]
  );
  const [rows] = await pool.query(
    'SELECT * FROM posts WHERE id=?', [result.insertId]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) =>{
  const id = Number(req.params.id);
  const { title } = req.body;
  const [result] = await pool.query(
    'UPDATE posts SET title=? WHERE id=?', [title, id]
  );
  if (result.affectedRows === 0) return res.status(404).json({error: '없음'});
  const [rows] = await pool.query(
    'SELECT * FROM posts WHERE id=?', [id]
  );
  res.json(rows);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const [result] = await pool.query(
    'DELETE FROM posts WHERE id=?', [id]
  );
  if (result.affectedRows === 0) return res.status(404).json({error: '없음'});
  res.status(204).end();
});

module.exports = router;
