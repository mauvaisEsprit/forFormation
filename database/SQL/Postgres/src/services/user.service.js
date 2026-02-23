// services/user.service.js
const pool = require('../db');
const userRepository = require('../repositories/user.repository');

async function createUser(data) {
    console.log("Service")
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // сервис работает только с репозиторием
    const user = await userRepository.insert(client, data);

    await client.query('COMMIT');
    return user;

  } catch (err) {
    await client.query('ROLLBACK');

    // карта ошибок PostgreSQL
    switch (err.code) {
      case '23505':
        const error = new Error('Email already exists');
        error.statusCode = 409;
        throw error;
      default:
        throw err;
    }
  } finally {
    client.release();
  }
}

module.exports = { createUser };