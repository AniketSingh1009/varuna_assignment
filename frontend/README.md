# FuelEU Maritime Frontend

React + TypeScript + TailwindCSS dashboard implementing **Hexagonal Architecture** for FuelEU Maritime compliance management.

## Architecture

This frontend follows **Hexagonal Architecture** (Ports & Adapters):

```
src/
├── core/                      # Core domain (no React dependencies)
│   ├── domain/               # Domain entities
│   │   ├── Route.ts
│   │   ├── Comparison.ts
│   │   ├── Banking.ts
│   │   └── Pooling.ts
│   ├── application/          # Use cases (business logic)
│   │   ├── FilterRoutes.ts
│   │   └── ValidatePool.ts
│   └── ports/                # Interface contracts
│       ├── RoutePort.ts
│       ├── ComparisonPort.ts
│       ├── BankingPort.ts
│       └── PoolingPort.ts
├── adapters/
│   ├── ui/                   # React components (inbound)
│   │   └── components/
│   │       ├── RoutesTab.tsx
│   │       ├── CompareTab.tsx
│   │       ├── BankingTab.tsx
│   │       └── PoolingTab.tsx
│   └── infrastructure/       # API clients (outbound)
│       ├── ApiRouteAdapter.ts
│       ├── ApiComparisonAdapter.ts
│       ├── ApiBankingAdapter.ts
│       └── ApiPoolingAdapter.ts
├── App.tsx                   # Main app
└── main.tsx                  # Entry point
```

### Key Principles
- **Core domain** has no React dependencies
- **Use cases** contain business logic
- **Ports** define contracts
- **Adapters** implement infrastructure concerns
- **Dependency flow:** UI → Application → Domain ← Infrastructure

## Features

### 1. Routes Tab
- Display all routes with complete data (vessel type, fuel type, distance, emissions)
- Filter by vessel type, fuel type, and year
- Set baseline route
- Visual baseline indicator

### 2. Compare Tab
- Compare routes against baseline
- Show percentage difference vs baseline
- Show percentage difference vs target (89.3368 gCO₂e/MJ)
- Visual bar chart with target line
- Compliance indicators (✅/❌)

### 3. Banking Tab
- Load current compliance balance
- Bank positive CB (Article 20)
- Apply banked surplus to deficits
- Display KPIs: cb_before, applied, cb_after
- Validation: disable if CB ≤ 0

### 4. Pooling Tab
- Select ships for pooling
- Real-time validation (Sum CB ≥ 0)
- Create pool with greedy allocation
- Display before/after CB for each member
- Article 21 rules enforcement

## Setup

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Runs on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Configuration

The frontend proxies API requests to the backend at `http://localhost:3000`.
This is configured in `vite.config.ts`.

## Technologies

- **React 18** - UI library
- **TypeScript** - Type safety with strict mode
- **TailwindCSS** - Utility-first styling
- **Vite** - Fast build tool
- **Axios** - HTTP client

## Design Patterns

### Hexagonal Architecture
- **Domain Layer:** Pure business entities
- **Application Layer:** Use cases and business rules
- **Ports:** Interface definitions
- **Adapters:** Infrastructure implementations

### Benefits
1. **Testability** - Easy to mock dependencies
2. **Maintainability** - Clear separation of concerns
3. **Flexibility** - Can swap implementations
4. **Independence** - Core logic independent of frameworks

## Compliance

Implements FuelEU Maritime Regulation (EU) 2023/1805:
- **Article 20** - Banking of surplus compliance balance
- **Article 21** - Pooling arrangements
- **Target Intensity (2025)** - 89.3368 gCO₂e/MJ (2% below 91.16)
