const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function migrate() {
  try {
    // 1. Создаём таблицу migrations
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log('Migrations table ready');

    // 2. Получаем список уже выполненных миграций
    const { rows } = await pool.query(
      'SELECT name FROM migrations'
    );
    const executed = rows.map(r => r.name);

    // 3. Читаем файлы из папки migrations
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (!executed.includes(file)) {
        console.log(`Running migration: ${file}`);

        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        await pool.query('BEGIN');
        await pool.query(sql);
        await pool.query(
          'INSERT INTO migrations(name) VALUES($1)',
          [file]
        );
        await pool.query('COMMIT');

        console.log(`Migration ${file} applied`);
      }
    }

    console.log('All migrations complete');
    process.exit(0);

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();