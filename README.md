# Nest-Next Authentication App

## Overview

This project is a full-stack authentication system built with **NestJS** for the backend API and **Next.js** for the frontend web application. It provides a comprehensive authentication solution with multiple strategies including local authentication, JWT tokens, and Google OAuth integration.

---

## Features

- Passport.js for authentication strategies
- JWT for token-based authentication
- TypeORM for database access
- Server-side authentication
- Client-side route protection
- API route handlers for authentication flow

---

## Build System

- **Turborepo** for monorepo management and optimized builds

---

## Tech Stack

### Backend (NestJS)

- Express.js

- **User Authentication:**
  - Sign Up with username and password
  - Sign In with username and password
  - Google OAuth 2.0 integration
- **Database:**
  - PostgreSQL DB with Prisma ORM
- **API Security:**
  - Protect APIs with JWT (JSON Web Tokens)
  - Refresh Tokens for extended sessions
  - Revoke Tokens for immediate session invalidation
- **Authorization:**
  - Role-Based Access Control (RBAC)
  - Public Routes for unrestricted access
- **Backend Framework:**
  - NestJS Configuration

### Frontend (Next.js)

- **Authentication Forms:**
  - Sign Up Form
  - Sign In Form
- **State Management:**
  - `useFormState` Hook for form handling
- **Session Management:**
  - Sessions
  - Update Sessions
- **Page Protection:**
  - Protect Pages
  - Middleware for route guarding
  - Role-Based Access Control (RBAC) for page access

---

## Setup & Installation

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL or another compatible database

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/jiten0709/Nest-Next-AuthenticationApp.git
    cd Nest-Next-AuthenticationApp
    ```

2.  **(Optional) Initialize Turborepo (if starting a new monorepo)**
    _If you're setting up the monorepo from scratch or re-initializing, you might use:_
    ```bash
    npx create-turbo@latest
    # Or, if adding to an existing project:
    # npm install turbo --save-dev
    # npx turbo init
    ```
    _This project assumes Turborepo is already configured._
3.  **Install dependencies**
    ```bash
    npm install # or yarn install
    cd api
    npm install # or yarn install
    cd ../web
    npm install # or yarn install
    ```
4.  **Configure environment variables**
    - Create `.env` files in both `api` and `web` directories
    - Set up the required environment variables (see `.env.example` files)
5.  **Set up the database**

    - Ensure your PostgreSQL (or chosen DB) server is running.
    - Run migrations (specific commands will depend on your TypeORM setup, typically `npm run migrate` in the `api` directory).

6.  **Start the development servers**
    ```bash
    # In the root directory
    npm run dev
    ```
    The services (api as well as web) will typically run on `http://localhost:<PORT>` as configured

---

## Authentication Flow

### Local Authentication

1.  User registers via `/auth/signup`
2.  User signs in via `/auth/signin`
3.  Backend validates credentials and issues JWT token
4.  Frontend stores token in secure cookies

### Google OAuth

1.  User initiates login via `/auth/google/login`
2.  User is redirected to Google consent screen
3.  After authorization, Google redirects to `/auth/google/callback`
4.  Backend processes the authentication and issues JWT token
5.  Frontend stores token in secure cookies

### Token Refresh

- Access tokens are short-lived
- Refresh tokens are used to obtain new access tokens
- Implemented via `/auth/refresh` endpoint

### Sign Out

1.  User signs out via `/auth/signout`
2.  Backend invalidates tokens
3.  Frontend clears auth cookies

---

## Contributors

- Jiten Parmar
