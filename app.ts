// infrastructure
const { Pool } = require("pg");
require("dotenv").config();
const bodyParser = require("body-parser");

const pool = new Pool({
  connectionString: process.env.PG_DATABASE_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

// database
const format = require("pg-format");

const insertNewUserQuery = `
    INSERT INTO users (user_id, balance) VALUES (%L, 0);
`;

const insertNewUser = (userId) =>
  pool.query(format(insertNewUserQuery, userId));

const selectUserQuery = `
    SELECT * FROM users WHERE users.user_id = %L
`;

const selectUser = async (userId) => {
  const { rows } = await pool.query(format(selectUserQuery, userId));
  return rows[0];
};

const updateUserQuery = `
    UPDATE users SET balance = %L WHERE user_id = %L
`;

const updateUser = async (userId, balance) =>
  pool.query(format(updateUserQuery, balance, userId));

// app

const express = require("express");
const app = express();
app.use(bodyParser.json());

app.get("/users/:userId", async (req, res) => {
  let user;
  const userId = req.params.userId;
  user = await selectUser(userId);

  if (!user) {
    await insertNewUser(userId);
    user = await selectUser(userId);
  }

  res.send(JSON.stringify(user));
});

app.put("/users/:userId", async (req, res) => {
  const user = await selectUser(req.params.userId);
  if (!user) {
    res.status(404);
  }

  const newBalance = user.balance + 10;
  await updateUser(req.params.userId, newBalance);
  res.status(200).send();
});

const port = process.env.PORT || 8080;

// start the server listening for requests
app.listen(port, () => console.log(`Server runnning on ${port}`));
