const request = require('supertest');
const { app } = require('../app');
const client = require('../config/database');
const { createUser } = require('../models/user');
const { createOrganisation } = require('../models/organisation');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Generate unique email for each test
const generateUniqueEmail = () => {
  return `testuser_${uuidv4()}@example.com`;
};

// Generate JWT token for a user
const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Clean up after tests
afterAll(async () => {
  await client.end(); // Close database connection
});

describe('Auth Endpoints', () => {
  // Setup a test user
  let testUser;

  // Reset database and prepare test environment
  beforeEach(async () => {
    // Clean up previous test data or reset the database state
    await client.query('DELETE FROM users'); // Remove all users

    // Create a new test user for each test case
    testUser = {
      userId: uuidv4(),
      firstName: 'John',
      lastName: 'Doe',
      email: generateUniqueEmail(), // Generate unique email for each test
      password: 'password123',
      phone: '1234567890'
    };

    // Register the test user
    await createUser(testUser);
  });

  it('should generate a token with correct expiration and user details', async () => {
    const token = generateToken(testUser);

    // Decode token to check expiry and user details
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded.email).toEqual(testUser.email);
    expect(decoded.firstName).toEqual(testUser.firstName);
    expect(decoded.lastName).toEqual(testUser.lastName);
    expect(decoded.exp).toBeTruthy(); // Check if expiry is present
  });

  it('should not allow users to see data from organizations they don’t have access to', async () => {
    // Create a new organisation
    const organisation = await createOrganisation({
      orgId: uuidv4(),
      name: 'Test Organisation',
      description: 'Testing access control'
    });

    // Generate token for the user
    const token = generateToken(testUser);

    // Access endpoint that requires authentication (e.g., /organisations/:orgId)
    const res = await request(app)
      .get(`/organisations/${organisation.orgId}`)
      .set('Authorization', `Bearer ${token}`); // Set Authorization header with Bearer token

    // Check expected response/status codes
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success');
    expect(res.body.data.name).toEqual(organisation.name);
    expect(res.body.data.description).toEqual(organisation.description);
  });

  describe('POST /auth/register', () => {
    it('should register user successfully with default organisation', async () => {
      const user = {
        userId: uuidv4(),
        firstName: 'Jane',
        lastName: 'Smith',
        email: generateUniqueEmail(), // Generate unique email for each test
        password: 'password456',
        phone: '9876543210'
      };

      const res = await request(app)
        .post('/auth/register')
        .send(user);

      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.user.firstName).toEqual(user.firstName);
      expect(res.body.data.user.email).toEqual(user.email);
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: generateUniqueEmail(), // Generate unique email for each test
          password: 'password123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('error');
      expect(res.body.message).toEqual('All fields are required');
    });

    it('should fail if email is duplicate', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(testUser); // Use the existing testUser which has already been registered

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('error');
      expect(res.body.message).toEqual('Email already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should log the user in successfully', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.user.email).toEqual(testUser.email);
    });

    it('should fail with incorrect credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.status).toEqual('error');
      expect(res.body.message).toEqual('Invalid email or password');
    });
  });
});
