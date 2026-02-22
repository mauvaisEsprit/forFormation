const { Pool } = require('pg');
require('dotenv').config();

// создаём подключение к базе
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// проверяем подключение сразу
pool.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к PostgreSQL', err);
  } else {
    console.log('PostgreSQL подключен');
  }
});

module.exports = pool;