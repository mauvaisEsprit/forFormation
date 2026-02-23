// repositories/user.repository.js
const { loadSql } = require("../../sql-query/sqlLoader");
const insertUserSql = loadSql("users/insertUser.sql");

async function insert(client, { name, email }) {
  console.log("Repository");
  const result = await client.query(insertUserSql, [name, email]);
  return result.rows[0];
}

module.exports = { insert };
