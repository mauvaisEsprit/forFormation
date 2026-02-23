const pool = require("../db");
const { loadSql } = require("../../sql-query/sqlLoader");
const userService = require("../services/user.service")

const insertUserSql = loadSql("users/insertUser.sql");
const selectUsersSql = loadSql("users/selectUsers.sql");
const updateUserSql = loadSql("users/updateUser.sql");

// controllers/user.controller.js
async function createUserController(req, res, next) {
  console.log("Controller")
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err); // централизованный error middleware
  }
}

async function listUsers(req, res) {
  try {
    const result = await pool.query(selectUsersSql);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function addUserWithFail(req, res) {
  const { name, email } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(insertUserSql, [name, email]);

    // специальная ошибка
    await client.query("INSERT INTO not_existing_table VALUES (1)");

    await client.query("COMMIT");
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Transaction failed:", err.message);
    res.status(500).json({ error: "Transaction rolled back" });
  } finally {
    client.release();
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  console.log(id);
  const { name, email } = req.body;

  const userId = parseInt(id, 10);
  if (isNaN(userId) || userId < 1) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(updateUserSql, [name, email, userId]);

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "User not found" });
    }

    await client.query("COMMIT");

    res.json(result.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Transaction failed: ", err.message);
    res.status(500).json({ error: "Transaction rolled back" });
  } finally {
    client.release();
  }
}

module.exports = { createUserController, listUsers, addUserWithFail, updateUser };
