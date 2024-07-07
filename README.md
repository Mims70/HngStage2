# User Authentication and Organization Management System

This project implements a user authentication and organization management system using Node.js, Express, PostgreSQL, JWT authentication, and Jest for testing.

## Overview

This project aims to build a secure and scalable user authentication and organization management system. It includes user registration, login, JWT-based authentication, and management of organizations.

## Features

- **User Authentication:**
  - Register new users with default organization assignment.
  - Login with email and password authentication using JWT tokens.
  - Secure routes using middleware for token verification.

- **Organization Management:**
  - Create, read, update, delete (CRUD) operations for organizations.
  - Restrict access to organizations based on user roles or permissions.

- **Testing:**
  - Unit tests for authentication endpoints using Jest and Supertest.
  - Ensure secure and expected behavior of endpoints.

## Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 
- npm 
- PostgreSQL
