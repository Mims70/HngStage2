// controllers/organisationController.js
const { v4: uuidv4 } = require('uuid');
const client = require('../config/database');

const getAllOrganisations = async (req, res) => {
  try {
    const organisations = await client.query('SELECT * FROM organisations');
    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: organisations.rows,
    });
  } catch (error) {
    console.error('Error retrieving organisations:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

const getOrganisationById = async (req, res) => {
  const { orgId } = req.params;

  try {
    const organisation = await client.query('SELECT * FROM organisations WHERE orgId = $1', [orgId]);
    if (!organisation.rows.length) {
      return res.status(404).json({
        status: 'error',
        message: 'Organisation not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Organisation retrieved successfully',
      data: organisation.rows[0],
    });
  } catch (error) {
    console.error('Error retrieving organisation:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

const createNewOrganisation = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'Name is required',
    });
  }

  try {
    const newOrgId = uuidv4();
    const organisation = await client.query(
      'INSERT INTO organisations (orgId, name, description) VALUES ($1, $2, $3) RETURNING *',
      [newOrgId, name, description]
    );

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: organisation.rows[0],
    });
  } catch (error) {
    console.error('Error creating organisation:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

module.exports = {
  getAllOrganisations,
  getOrganisationById,
  createNewOrganisation,
};
