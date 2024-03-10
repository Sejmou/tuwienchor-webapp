import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const songs = pgTable('Song', {
	id: uuid('id').primaryKey(),
	createdAt: timestamp('created_at'),
	name: text('name')
});
