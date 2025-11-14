# waste-tracking-id-backend

A Node.js microservice built on the DEFRA Core Delivery Platform (CDP) that generates unique waste tracking identifiers. The service provides a REST API endpoint that returns sequential, year-prefixed alphanumeric IDs using the Sqids encoding library.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone and Install](#clone-and-install)
  - [Local Development with Docker Compose](#local-development-with-docker-compose)
  - [Development Without Docker](#development-without-docker)
  - [Verify Setup](#verify-setup)
- [API Endpoints](#api-endpoints)
- [Development](#development)
  - [Available Scripts](#available-scripts)
  - [Running Tests](#running-tests)
  - [Code Quality](#code-quality)
  - [MongoDB Locks](#mongodb-locks)
  - [Proxy Configuration](#proxy-configuration)
- [Environments](#environments)
- [Docker](#docker)
  - [Build Development Image](#build-development-image)
  - [Build Production Image](#build-production-image)
  - [Docker Compose](#docker-compose)
- [CI/CD](#cicd)
- [Additional Resources](#additional-resources)
- [Updating Dependencies](#updating-dependencies)
- [Licence](#licence)
  - [About the Licence](#about-the-licence)

## Overview

The waste-tracking-id-backend service provides:

- **Unique ID Generation**: Generates sequential waste tracking IDs in the format `YYXXXXXX` (e.g., "25ABC123") where YY represents the year and XXXXXX is a Sqids-encoded sequential counter
- **Year-Based Reset**: Automatically resets the counter at the start of each calendar year
- **Atomic Operations**: Uses MongoDB with distributed locking to ensure unique ID generation in concurrent environments
- **Health Monitoring**: Provides health check endpoints for container orchestration
- **API Documentation**: Auto-generated Swagger documentation for easy integration

## Key Features

- **Sqids Encoding**: Uses Sqids library for generating short, collision-free alphanumeric identifiers
- **MongoDB Distributed Locking**: Implements mongo-locks for atomic counter updates
- **CDP Integration**: Built-in support for DEFRA Core Delivery Platform patterns including request tracing and CloudWatch metrics
- **Swagger Documentation**: Interactive API documentation available at `/documentation`
- **Comprehensive Testing**: Full test coverage with Jest
- **Docker Support**: Multi-stage Docker builds for development and production
- **Code Quality Tools**: ESLint with neostandard, Prettier, and Husky pre-commit hooks
- **Structured Logging**: ECS-formatted logs via Pino for enhanced observability
- **Security Headers**: HSTS, XSS protection, and other security headers enabled by default

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Hapi.js
- **Database**: MongoDB
- **ID Generation**: Sqids
- **Validation**: Joi
- **Configuration**: Convict
- **Logging**: Pino (ECS format)
- **Testing**: Jest
- **Locking**: mongo-locks
- **Metrics**: AWS Embedded Metrics
- **API Documentation**: hapi-swagger
- **Linting**: ESLint with neostandard
- **Formatting**: Prettier

## Prerequisites

- Node.js (see .nvmrc for required version)
- npm
- MongoDB
- Docker and Docker Compose (for containerised development)

We recommend using [nvm](https://github.com/creationix/nvm) (Node Version Manager) to manage Node.js versions.

## Getting Started

### Clone and Install

1. Clone the repository:

   ```bash
   git clone <repository-url> waste-tracking-id-backend
   cd waste-tracking-id-backend
   ```

2. Use the correct Node.js version:

   ```bash
   nvm use
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Local Development with Docker Compose

The easiest way to run the service locally with all dependencies:

1. Start all services (MongoDB, LocalStack, and the application):

   ```bash
   docker compose up --build -d
   ```

2. The service will be available at `http://localhost:3001`

3. View logs:

   ```bash
   docker compose logs -f waste-tracking-id-backend
   ```

4. Stop all services:
   ```bash
   docker compose down
   ```

### Development Without Docker

If you prefer to run the service directly on your machine:

1. Ensure MongoDB is running locally on `mongodb://127.0.0.1:27017`

2. Start the development server:

   ```bash
   npm run dev
   ```

3. The service will start on `http://localhost:3001` with hot reload enabled

### Verify Setup

1. Check the health endpoint:

   ```bash
   curl http://localhost:3001/health
   ```

2. Generate a waste tracking ID:

   ```bash
   curl http://localhost:3001/next
   ```

3. Access the API documentation at: `http://localhost:3001/documentation`

## API Endpoints

| Method | Endpoint         | Description                                    |
| :----- | :--------------- | :--------------------------------------------- |
| `GET`  | `/next`          | Generate and return the next waste tracking ID |
| `GET`  | `/health`        | Health check endpoint for monitoring           |
| `GET`  | `/documentation` | Interactive Swagger API documentation          |

### Example: Generate Waste Tracking ID

**Request:**

```bash
curl -X GET http://localhost:3001/next \
  -H "x-cdp-request-id: test-123"
```

**Response:**

```json
{
  "id": "25ABC123"
}
```

## Development

### Available Scripts

**Development:**

```bash
npm run dev              # Start with hot reload (nodemon)
npm run dev:debug        # Start with Node.js debugger enabled
npm run docker:dev       # Run in Docker development mode
```

**Testing:**

```bash
npm test                 # Run all tests with coverage
npm run test:watch       # Run tests in watch mode
```

**Code Quality:**

```bash
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

**Production:**

```bash
npm start                # Start in production mode
```

**Git Hooks:**

```bash
npm run setup:husky               # Initialise Husky git hooks
npm run git:pre-commit-hook       # Run pre-commit validation manually
```

### Running Tests

Run the full test suite with coverage:

```bash
npm test
```

The project includes comprehensive unit tests for:

- ID generation logic
- API endpoints
- Configuration validation
- Error handling

Coverage reports are generated in the `coverage/` directory.

### Code Quality

This project follows DEFRA code standards. Before committing:

- **ESLint**: Uses neostandard configuration for consistent code style
- **Prettier**: Enforces code formatting rules
- **Husky**: Runs linting and tests on pre-commit
- **Joi Validation**: Follows schema validation best practices (no custom error messages, use built-in validators)

#### Windows Prettier Issue

If you are having issues with formatting of line breaks on Windows, update your global git config:

```bash
git config --global core.autocrlf false
```

### MongoDB Locks

The service uses MongoDB distributed locks to ensure atomic ID generation. If you require a write lock for MongoDB operations, you can acquire it via `server.locker` or `request.locker`:

```javascript
async function doStuff(server) {
  const lock = await server.locker.lock('unique-resource-name')

  if (!lock) {
    // Lock unavailable
    return
  }

  try {
    // do stuff
  } finally {
    await lock.free()
  }
}
```

Keep lock operations small and atomic for best performance.

You may also use the **using** keyword for automatic lock resource management:

```javascript
async function doStuff(server) {
  await using lock = await server.locker.lock('unique-resource-name')

  if (!lock) {
    // Lock unavailable
    return
  }

  // do stuff
  // lock automatically released
}
```

Helper methods are also available in `src/common/helpers/mongodb.js`.

### Proxy Configuration

The service uses a forward proxy which is configured by default via the `HTTP_PROXY` environment variable.

For most HTTP clients, the proxy is configured automatically through `setGlobalDispatcher(new ProxyAgent(proxyUrl))`.

If you're using a custom HTTP client that doesn't respect the global dispatcher, you can provide the proxy explicitly:

```javascript
import { ProxyAgent } from 'undici'

return await fetch(url, {
  dispatcher: new ProxyAgent({
    uri: proxyUrl,
    keepAliveTimeout: 10,
    keepAliveMaxTimeout: 10
  })
})
```

## Environments

The service supports the following environments:

- **local**: Local development environment
- **dev**: Development environment on CDP
- **test**: Testing environment on CDP
- **perf-test**: Performance testing environment on CDP
- **ext-test**: External testing environment on CDP
- **prod**: Production environment on CDP

Configuration is managed through environment variables and the Convict library. See `src/config.js` for all available configuration options.

## Docker

### Build Development Image

Build the Docker image for development:

```bash
docker build --target development --no-cache --tag waste-tracking-id-backend:development .
```

Run the development container:

```bash
docker run -e PORT=3001 -p 3001:3001 waste-tracking-id-backend:development
```

### Build Production Image

Build the optimised production image:

```bash
docker build --no-cache --tag waste-tracking-id-backend .
```

Run the production container:

```bash
docker run -e PORT=3001 -p 3001:3001 waste-tracking-id-backend
```

### Docker Compose

The `compose.yml` file provides a complete local development environment with:

- **LocalStack**: AWS services emulation (S3, SQS)
- **MongoDB**: Database for counter storage
- **waste-tracking-id-backend**: The application service

Start all services:

```bash
docker compose up --build -d
```

View service logs:

```bash
docker compose logs -f waste-tracking-id-backend
```

Stop all services:

```bash
docker compose down
```

## CI/CD

The project includes automated workflows for:

- **Continuous Integration**: Automated testing and linting on pull requests
- **Code Quality**: SonarCloud integration for code quality and security scanning
- **Dependency Management**: Dependabot for automated dependency updates

### SonarCloud Setup

Instructions for configuring SonarCloud can be found in [sonar-project.properties](./sonar-project.properties).

### Dependabot

To enable Dependabot, rename `.github/example.dependabot.yml` to `.github/dependabot.yml`.

## Additional Resources

- [DEFRA Core Delivery Platform Documentation](https://defra.github.io/cdp-portal/)
- [Hapi.js Documentation](https://hapi.dev/)
- [Sqids Specification](https://sqids.org/)
- [MongoDB Locking Patterns](https://www.mongodb.com/docs/manual/faq/concurrency/)

## Updating Dependencies

To update dependencies, use [npm-check-updates](https://github.com/raineorshine/npm-check-updates):

```bash
ncu --interactive --format group
```

This will allow you to selectively update dependencies in an interactive manner.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

### About the Licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
