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

let posts = [
  { id: 1, title: '첫 글', writer: '김코딩', views: 0 },
  { id: 2, title: '두 번째 글', writer: '이서버', views: 3 },
  { id: 3, title: '세 번째 글', writer: '김코딩', views: 1 }
];

router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM posts ORDER BY id DESC'
  )
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM posts WHERE id=?', [id]
  )
  res.json(rows);
});

router.post('/', async (req, res) => {
  const [rows] = await pool.query(
    'INSERT INTO posts (title, writer) VALUES(?, ?)', [t, w]
  )
  res.json(rows);
});

router.put('/:id', async (req, res) =>{
  const [rows] = await pool.query(
    'SELECT * FROM posts ORDER BY id DESC'
  )
  res.json(rows);
});

router.delete('/:id', async (req, res) => {
  const [rows] = await pool.query(
    'DELETE FROM posts WHERE id=?', [id]
  )
  res.json(rows);
});

module.exports = router;