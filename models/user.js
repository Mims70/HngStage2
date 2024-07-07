const client = require('../config/database');
const bcrypt = require('bcryptjs');

const createUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const query = `
    INSERT INTO users (userId, firstName, lastName, email, password, phone)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [user.userId, user.firstName, user.lastName, user.email, hashedPassword, user.phone];
  const res = await client.query(query, values);
  return res.rows[0];
};

const findUserByEmail = async (email) => {
  const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

const deleteUserByEmail = async (email) => {
  await client.query('DELETE FROM users WHERE email = $1', [email]);
};

module.exports = {
  createUser,
  findUserByEmail,
  deleteUserByEmail,
};
