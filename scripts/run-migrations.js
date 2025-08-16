const { DataSource } = require('typeorm');
const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({
  path: path.resolve(__dirname, '..', 'environment', `.env.${process.env.NODE_ENV || 'local'}`),
});

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'nestuser',
  password: process.env.POSTGRES_PASSWORD || 'nestpass',
  database: process.env.POSTGRES_DB || 'template-app',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});

async function runMigrations() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
    
    const migrations = await AppDataSource.runMigrations();
    console.log(`✅ ${migrations.length} migrations executed successfully`);
    
    await AppDataSource.destroy();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations(); 