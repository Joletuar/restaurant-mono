# Restaurant Management API

## Overview

This is a restaurant management API built with Node.js, TypeScript, and Domain-Driven Design (DDD) principles. The application manages ingredients, recipes, and orders for a restaurant system.

## Architecture

The project follows a clean architecture approach with Domain-Driven Design patterns:

### Bounded Contexts

- **Ingredients**: Manages restaurant ingredients
- **Recipes**: Handles recipe creation and management with ingredient relationships
- **Orders**: Manages order lifecycle and status tracking
- **Shared**: Common domain objects and utilities

### Key Architectural Patterns

- **Domain-Driven Design (DDD)**: Clear separation of concerns with bounded contexts
- **Clean Architecture**: Layered approach with domain, application, and infrastructure layers
- **CQRS Pattern**: Separation of commands and queries
- **Event-Driven Architecture**: Domain events for decoupled communication
- **Dependency Injection**: Inversion of control for better testability

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **Web Framework**: Fastify
- **Validation**: TypeBox with Fastify type provider
- **Logging**: Pino
- **Testing**: Jest
- **Linting**: ESLint
- **Formatting**: Prettier
- **Security**: Helmet, CORS

## Project Structure

```
src/
├── apps/
│   └── restaurant-api/           # Main application entry point
│       ├── config/               # Application configuration
│       ├── dependencies/         # Dependency injection container
│       └── http/                 # HTTP layer (controllers, routes)
└── bounded-contexts/
    ├── ingredients/              # Ingredient domain
    │   ├── application/          # Use cases and DTOs
    │   ├── domain/               # Entities and business logic
    │   └── infrastructure/       # Data persistence
    ├── orders/                   # Order domain
    │   ├── application/          # Commands, queries, event handlers
    │   ├── domain/               # Order entity and business rules
    │   └── infrastructure/       # Data persistence
    ├── recipes/                  # Recipe domain
    └── shared/                   # Common domain objects
```

## Features

### Ingredients

- Create and manage restaurant ingredients
- Query ingredients by ID
- List all ingredients

### Recipes

- Create recipes with ingredient combinations
- Recipe management with ingredient relationships
- Query recipes by ID

### Orders

- Create orders for specific recipes
- Order status management with state transitions:
  - `PENDING` → `IN_PROGRESS` → `COMPLETED`
  - `PENDING` → `CANCELLED`
- Order lifecycle tracking with domain events
- Business rules enforcement for status transitions

## API Endpoints

### Health Check

- `GET /api/health` - Application health status

### Ingredients

- `GET /api/ingredients` - Get all ingredients
- `GET /api/ingredients/:id` - Get ingredient by ID

### Recipes

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get recipe by ID

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id` - Update order status

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- Node.js 18+ (for compatibility)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd restaurant-mono
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running the Application

#### Development Mode

```bash
bun run dev
```

#### Production Build

```bash
bun run build
bun run start
```

### Testing

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:watch-all
```

### Code Quality

```bash
# Type checking
bun run typecheck

# Linting
bun run lint
bun run lint:fix

# Formatting
bun run format
bun run format:fix
```

## Configuration

The application uses environment variables for configuration:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production/test)

## Domain Events

The application implements domain events for decoupled communication:

- **OrderCreatedEvent**: Triggered when a new order is created
- **OrderStatusUpdatedEvent**: Triggered when order status changes

## Business Rules

### Order Status Transitions

- Orders start in `PENDING` status
- Valid transitions:
  - `PENDING` → `IN_PROGRESS`
  - `IN_PROGRESS` → `COMPLETED`
  - `PENDING` → `CANCELLED` (direct cancellation)
- Invalid transitions are prevented by domain rules

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Run linting and formatting before committing
4. Use conventional commits for commit messages

## License

This project is private and proprietary.

## Author

Johan Tuarez
