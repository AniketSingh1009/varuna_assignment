# FuelEU Maritime Backend API

Backend API for FuelEU Maritime compliance platform built with Node.js, TypeScript, and PostgreSQL using Hexagonal Architecture.

## Architecture Overview

This project follows **Hexagonal Architecture** (Ports & Adapters / Clean Architecture):

```
src/
├── core/
│   ├── domain/          # Domain entities and types
│   ├── application/     # Use cases (business logic)
│   └── ports/           # Interfaces (repository contracts)
├── adapters/
│   ├── inbound/
│   │   └── http/        # Express controllers
│   └── outbound/
│       └── postgres/    # PostgreSQL repositories
├── infrastructure/
│   └── db/              # Database connection, migrations, seeds
└── server/              # Express app setup and routes
```

### Key Principles:
- **Domain-Driven Design** - Business logic in core domain
- **Dependency Inversion** - Core depends on abstractions (ports), not implementations
- **Separation of Concerns** - Clear boundaries between layers
- **Testability** - Easy to mock dependencies and test in isolation

## Database Schema

| Table | Purpose |
|-------|---------|
| `routes` | Route data with GHG intensity and fuel consumption |
| `ship_compliance` | Computed compliance balance records |
| `bank_entries` | Banked surplus transactions |
| `pools` | Pooling arrangements |
| `pool_members` | Pool member allocations |

## Core Formulas

### Compliance Balance (CB)
```
Target Intensity (2025) = 89.3368 gCO₂e/MJ
Energy in Scope = Fuel Consumption (t) × 41,000 MJ/t
CB = (Target Intensity - Actual Intensity) × Energy in Scope
```

- **Positive CB** = Surplus (compliant)
- **Negative CB** = Deficit (non-compliant)

### Banking
- Ships can bank positive CB for future use
- Banked surplus can be applied to offset future deficits
- FIFO deduction when applying banked amounts

### Pooling
- Multiple ships pool their CB together
- Total pool CB must be ≥ 0
- Greedy allocation: surplus ships transfer to deficit ships
- Constraints:
  - Deficit ships cannot exit worse than they entered
  - Surplus ships cannot exit with negative CB

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fueleu_maritime
NODE_ENV=development
```

4. **Create database**
```bash
# Using psql
createdb fueleu_maritime

# Or using SQL
psql -U postgres -c "CREATE DATABASE fueleu_maritime;"
```

5. **Run migrations**
```bash
npm run migrate
```

6. **Seed database**
```bash
npm run seed
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Server runs on `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Health Check
```bash
curl http://localhost:3000/health
```

## API Endpoints

### Routes

#### GET /api/routes
Get all routes
```bash
curl http://localhost:3000/api/routes
```

#### POST /api/routes/:id/baseline
Set a route as baseline
```bash
curl -X POST http://localhost:3000/api/routes/1/baseline
```

#### GET /api/routes/comparison
Compare all routes against baseline
```bash
curl http://localhost:3000/api/routes/comparison
```

**Response:**
```json
{
  "baseline": {
    "routeId": "ROUTE-001",
    "ghgIntensity": 85.5
  },
  "comparisons": [
    {
      "routeId": "ROUTE-002",
      "year": 2025,
      "ghgIntensity": 92.3,
      "percentDiff": 7.95,
      "compliant": false
    }
  ]
}
```

### Compliance

#### GET /api/compliance/cb
Compute compliance balance
```bash
curl "http://localhost:3000/api/compliance/cb?shipId=SHIP-001&year=2025&actualIntensity=85.0&fuelConsumption=1000"
```

**Response:**
```json
{
  "shipId": "SHIP-001",
  "year": 2025,
  "cbGco2eq": 177808.8,
  "targetIntensity": 89.3368,
  "actualIntensity": 85.0,
  "energyInScope": 41000000
}
```

#### GET /api/compliance/adjusted-cb
Get CB adjusted for banked surplus
```bash
curl "http://localhost:3000/api/compliance/adjusted-cb?shipId=SHIP-001&year=2025"
```

### Banking

#### GET /api/banking/records
Get banking records for a ship
```bash
curl "http://localhost:3000/api/banking/records?shipId=SHIP-001&year=2025"
```

#### POST /api/banking/bank
Bank surplus CB
```bash
curl -X POST http://localhost:3000/api/banking/bank \
  -H "Content-Type: application/json" \
  -d '{
    "shipId": "SHIP-001",
    "year": 2025,
    "amount": 50000
  }'
```

#### POST /api/banking/apply
Apply banked surplus
```bash
curl -X POST http://localhost:3000/api/banking/apply \
  -H "Content-Type: application/json" \
  -d '{
    "shipId": "SHIP-001",
    "year": 2026,
    "amount": 30000
  }'
```

### Pools

#### POST /api/pools
Create a pool
```bash
curl -X POST http://localhost:3000/api/pools \
  -H "Content-Type: application/json" \
  -d '{
    "year": 2025,
    "members": [
      {"shipId": "SHIP-001", "cbBefore": 100000},
      {"shipId": "SHIP-002", "cbBefore": -50000}
    ]
  }'
```

**Response:**
```json
{
  "poolId": 1,
  "year": 2025,
  "members": [
    {
      "shipId": "SHIP-001",
      "cbBefore": 100000,
      "cbAfter": 50000
    },
    {
      "shipId": "SHIP-002",
      "cbBefore": -50000,
      "cbAfter": 0
    }
  ]
}
```

#### GET /api/pools/:id
Get pool details
```bash
curl http://localhost:3000/api/pools/1
```

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Test Coverage
```bash
npm test
# Coverage report generated in ./coverage/
```

### Test Structure
- **Unit Tests** - `src/core/application/__tests__/`
  - ComputeComparison
  - ComputeCB
  - BankSurplus
  - ApplyBanked
  - CreatePool

- **Integration Tests** - `src/adapters/inbound/http/__tests__/`
  - API endpoint testing with Supertest
  - Mocked repositories

## Linting

```bash
npm run lint
```

## Project Structure Details

### Core Layer
- **Domain** - Pure TypeScript interfaces and types
- **Application** - Business logic use cases
- **Ports** - Repository interfaces (contracts)

### Adapters Layer
- **Inbound** - HTTP controllers (Express)
- **Outbound** - PostgreSQL repositories

### Infrastructure Layer
- Database connection pooling
- Migration scripts
- Seed data

### Server Layer
- Express app configuration
- Route definitions
- Dependency injection

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Development Notes

### Adding New Features
1. Define domain types in `core/domain/`
2. Create use case in `core/application/`
3. Define port interface in `core/ports/`
4. Implement adapter in `adapters/outbound/`
5. Create controller in `adapters/inbound/http/`
6. Add routes in `server/routes.ts`
7. Write tests

### Database Changes
1. Update migration in `infrastructure/db/migrate.ts`
2. Update seed data if needed
3. Run `npm run migrate`

## References

- **FuelEU Maritime Regulation** (EU) 2023/1805
- Annex IV - Compliance Balance calculation
- Articles 20-21 - Banking and Pooling rules

## License

MIT
