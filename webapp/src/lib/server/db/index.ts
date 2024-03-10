import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getDynamicEnvVar } from '$lib/server/dynamic-env';

const client = postgres(getDynamicEnvVar('DATABASE_URL'));
export const db = drizzle(client);
