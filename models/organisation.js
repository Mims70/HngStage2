const client = require('../config/database');

const createOrganisation = async (organisation) => {
  const query = `
    INSERT INTO organisations (orgId, name, description, userId)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [organisation.orgId, organisation.name, organisation.description, organisation.userId];
  const res = await client.query(query, values);
  return res.rows[0];
};

const addUserToOrganisation = async (orgId, userId) => {
  const query = `
    INSERT INTO organisation_users (orgId, userId)
    VALUES ($1, $2);
  `;
  await client.query(query, [orgId, userId]);
};

const getOrganisationById = async (orgId) => {
  const res = await client.query('SELECT * FROM organisations WHERE orgId = $1', [orgId]);
  return res.rows[0];
};

module.exports = {
  createOrganisation,
  addUserToOrganisation,
  getOrganisationById,
};
