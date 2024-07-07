const express = require('express');
const {
  getAllOrganisations,
  getOrganisationById,
  createNewOrganisation
} = require('../controllers/organisationController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Get all organisations
router.get('/', authMiddleware, getAllOrganisations);

// Get organisation by ID
router.get('/:orgId', authMiddleware, getOrganisationById);

// Create new organisation
router.post('/', authMiddleware, createNewOrganisation);

module.exports = router;
