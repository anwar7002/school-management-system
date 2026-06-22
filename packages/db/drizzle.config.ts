import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

export default {
  schema: './src/schema',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: dbUrl,
  },
} satisfies Config;
