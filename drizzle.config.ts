import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

config();
export default {
	schema: './src/lib/server/drizzle.ts',
	out: './drizzle',
	driver: 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
		authToken: process.env.DATABASE_TOKEN
	}
} satisfies Config;
