const pool = require('../db');

// Получить всех пользователей с их постами (JOIN)
async function listUsers(req, res) {
  try {
    const result = await pool.query(`
      SELECT u.id as user_id, u.name, u.email, p.id as post_id, p.title, p.content
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id
      ORDER BY u.id, p.id
    `);

    // Преобразуем результат в объект с массивом постов
    const usersMap = {};
    result.rows.forEach(row => {
      if (!usersMap[row.user_id]) {
        usersMap[row.user_id] = { id: row.user_id, name: row.name, email: row.email, posts: [] };
      }
      if (row.post_id) {
        usersMap[row.user_id].posts.push({ id: row.post_id, title: row.title, content: row.content });
      }
    });

    res.json(Object.values(usersMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Добавить пользователя
async function addUser(req, res) {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

module.exports = { listUsers, addUser };