import { pool } from './connection';

const seedData = `
-- Clear existing data
TRUNCATE routes, ship_compliance, bank_entries, pools, pool_members RESTART IDENTITY CASCADE;

-- Insert 5 routes with complete data
INSERT INTO routes (route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, total_emissions, is_baseline) VALUES
  ('R001', 'Container', 'HFO', 2024, 91.0000, 5000.00, 12000.00, 4500.00, true),
  ('R002', 'BulkCarrier', 'LNG', 2024, 88.0000, 4800.00, 11500.00, 4200.00, false),
  ('R003', 'Tanker', 'MGO', 2024, 93.5000, 5100.00, 12500.00, 4700.00, false),
  ('R004', 'RoRo', 'HFO', 2025, 89.2000, 4900.00, 11800.00, 4300.00, false),
  ('R005', 'Container', 'LNG', 2025, 90.5000, 4950.00, 11900.00, 4400.00, false);
`;

async function seed() {
  try {
    console.log('Seeding database...');
    await pool.query(seedData);
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
