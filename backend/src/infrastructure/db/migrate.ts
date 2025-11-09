import { pool } from './connection';

const migrations = `
-- Routes table
CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  route_id VARCHAR(100) NOT NULL,
  vessel_type VARCHAR(100) NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  ghg_intensity DECIMAL(10, 4) NOT NULL,
  fuel_consumption DECIMAL(10, 2) NOT NULL,
  distance DECIMAL(10, 2) NOT NULL,
  total_emissions DECIMAL(10, 2) NOT NULL,
  is_baseline BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ship compliance table
CREATE TABLE IF NOT EXISTS ship_compliance (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  cb_gco2eq DECIMAL(15, 2) NOT NULL,
  target_intensity DECIMAL(10, 4) NOT NULL,
  actual_intensity DECIMAL(10, 4) NOT NULL,
  energy_in_scope DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(ship_id, year)
);

-- Bank entries table
CREATE TABLE IF NOT EXISTS bank_entries (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  amount_gco2eq DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pools table
CREATE TABLE IF NOT EXISTS pools (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pool members table
CREATE TABLE IF NOT EXISTS pool_members (
  pool_id INTEGER REFERENCES pools(id) ON DELETE CASCADE,
  ship_id VARCHAR(100) NOT NULL,
  cb_before DECIMAL(15, 2) NOT NULL,
  cb_after DECIMAL(15, 2) NOT NULL,
  PRIMARY KEY (pool_id, ship_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_routes_baseline ON routes(is_baseline);
CREATE INDEX IF NOT EXISTS idx_ship_compliance_ship_year ON ship_compliance(ship_id, year);
CREATE INDEX IF NOT EXISTS idx_bank_entries_ship ON bank_entries(ship_id);
CREATE INDEX IF NOT EXISTS idx_pool_members_pool ON pool_members(pool_id);
`;

async function migrate() {
  try {
    console.log('Running migrations...');
    await pool.query(migrations);
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
