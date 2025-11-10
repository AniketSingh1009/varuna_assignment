# FuelEU Maritime Compliance Platform

Full-stack application for managing FuelEU Maritime compliance, including route comparison, compliance balance calculation, banking, and pooling operations.

## 🏗️ Architecture

This project implements **Hexagonal Architecture** (Ports & Adapters / Clean Architecture):

- **Backend:** Node.js + TypeScript + PostgreSQL + Express
- **Frontend:** React + TypeScript + TailwindCSS + Vite
- **Testing:** Jest (backend), Supertest (integration)

## 📁 Project Structure

```
.
├── backend/                 # Backend API
│   ├── src/
│   │   ├── core/           # Domain & business logic
│   │   │   ├── domain/     # Entities & types
│   │   │   ├── application/# Use cases
│   │   │   └── ports/      # Repository interfaces
│   │   ├── adapters/       # Infrastructure implementations
│   │   │   ├── inbound/    # HTTP controllers
│   │   │   └── outbound/   # PostgreSQL repositories
│   │   ├── infrastructure/ # DB connection, migrations
│   │   └── server/         # Express setup
│   └── package.json
│
├── frontend/               # Frontend dashboard
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api/           # API client
│   │   └── types/         # TypeScript types
│   └── package.json
│
├── AGENT_WORKFLOW.md      # AI agent usage documentation
├── REFLECTION.md          # Learnings and insights
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
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

Edit `.env`:
```
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fueleu_maritime
NODE_ENV=development
```

4. **Create database**
```bash
createdb fueleu_maritime
```

5. **Run migrations and seed**
```bash
npm run migrate
npm run seed
```

6. **Start backend server**
```bash
npm run dev
```

Backend runs on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

Runs unit tests and integration tests with coverage report.

### Test Coverage
- Unit tests for all use cases (ComputeCB, BankSurplus, ApplyBanked, CreatePool, ComputeComparison)
- Integration tests for HTTP endpoints
- Edge case validation

## 📊 Features

### 1. Route Comparison
- View all routes with GHG intensity data
- Set baseline route
- Compare routes against baseline
- Visual compliance indicators

### 2. Compliance Balance Calculator
- Calculate CB based on ship data
- Formula: CB = (Target - Actual) × Energy in Scope
- Target Intensity (2025): 89.3368 gCO₂e/MJ
- Energy conversion: 41,000 MJ/tonne

### 3. Banking Operations
- Bank positive compliance balance
- Apply banked surplus to future deficits
- FIFO deduction mechanism
- View total banked amounts

### 4. Pooling
- Create pools with multiple ships
- Greedy allocation algorithm
- Constraints enforcement:
  - Total pool CB must be ≥ 0
  - Deficit ships cannot exit worse
  - Surplus ships cannot go negative
- Visual allocation results

## 🔗 API Endpoints

### Routes
- `GET /api/routes` - Get all routes
- `POST /api/routes/:id/baseline` - Set baseline
- `GET /api/routes/comparison` - Compare routes

### Compliance
- `GET /api/compliance/cb` - Calculate compliance balance
- `GET /api/compliance/adjusted-cb` - Get adjusted CB with banking

### Banking
- `GET /api/banking/records` - Get banking records
- `POST /api/banking/bank` - Bank surplus
- `POST /api/banking/apply` - Apply banked surplus

### Pools
- `POST /api/pools` - Create pool
- `GET /api/pools/:id` - Get pool details

## 📐 Core Formulas

### Compliance Balance
```
Energy in Scope = Fuel Consumption (t) × 41,000 MJ/t
CB = (Target Intensity - Actual Intensity) × Energy in Scope
```

### Banking
- Positive CB can be banked for future use
- FIFO deduction when applying banked amounts
- Validation: Cannot bank more than available surplus

### Pooling
- Total pool CB must be non-negative
- Greedy allocation: surplus ships transfer to deficit ships
- Constraints prevent unfair outcomes

## 🏛️ Architecture Principles

### Hexagonal Architecture Benefits
1. **Separation of Concerns** - Business logic isolated from infrastructure
2. **Testability** - Easy to mock dependencies
3. **Flexibility** - Can swap implementations without changing core
4. **Maintainability** - Clear boundaries between layers

### Dependency Flow
```
Inbound Adapters (HTTP) → Application (Use Cases) → Domain (Entities)
                                ↓
                        Ports (Interfaces)
                                ↓
                    Outbound Adapters (PostgreSQL)
```

## 📚 Documentation

- **[AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md)** - Detailed AI agent usage log
- **[REFLECTION.md](./REFLECTION.md)** - Learnings and efficiency analysis
- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend setup guide

## 🔧 Development

### Code Quality
```bash
# Backend linting
cd backend
npm run lint

# Frontend linting
cd frontend
npm run lint
```

### Build for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 📖 References

- **FuelEU Maritime Regulation** (EU) 2023/1805
- Annex IV - Compliance Balance methodology
- Articles 20-21 - Banking and Pooling rules

## 🤖 AI Agent Usage

This project was developed with AI assistance (Kiro AI). See [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) for:
- Prompts and outputs
- Validation process
- Efficiency gains
- Best practices

## 📝 License

MIT

## 👥 Contributing

This is an assignment project. For production use, consider:
- Authentication/authorization
- Rate limiting
- Comprehensive error logging
- Performance optimization
- Security hardening
- CI/CD pipeline
