const pool = require('../db');
const { loadSql } = require('../../sql-query/sqlLoader');

const insertUserSql = loadSql('users/insertUser.sql');
const selectUsersSql = loadSql('users/selectUsers.sql');

async function addUser(req, res) {
  const { name, email } = req.body;

  try {
    const result = await pool.query(insertUserSql, [name, email]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

async function listUsers(req, res) {
  try {
    const result = await pool.query(selectUsersSql);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function addUserWithFail(req, res) {
  const { name, email } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(insertUserSql, [name, email]);

    // специальная ошибка
    await client.query('INSERT INTO not_existing_table VALUES (1)');

    await client.query('COMMIT');

    res.status(201).json(result.rows[0]);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Transaction failed:', err.message);
    res.status(500).json({ error: 'Transaction rolled back' });
  } finally {
    client.release();
  }
}

module.exports = { addUser, listUsers, addUserWithFail };