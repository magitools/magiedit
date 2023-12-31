import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import type { InferSelectModel } from 'drizzle-orm';

const user = sqliteTable('user', {
	id: text('id').notNull().primaryKey(),
	email: text('email').notNull(),
	username: text('username').notNull(),
	customerId: text('customer_id'),
	aiCredits: integer('ai_credits').default(0),
	keyHash: text('key_hash')
});

const userKey = sqliteTable('user_key', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	hashedPassword: text('hashed_password')
});

const userSession = sqliteTable('user_session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	activeExpires: integer('active_expires').notNull(),
	idleExpires: integer('idle_expires').notNull()
});

const userImages = sqliteTable('user_image', {
	id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
	url: text('url').notNull(),
	description: text('description').notNull().default('no description provided, sorry'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

const userPreferences = sqliteTable('user_preference', {
	id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
	key: text('key').notNull().unique(),
	value: text('value').notNull()
});

const userArticles = sqliteTable('user_article', {
	id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
	content: text('content').notNull(),
	iv: text('iv').notNull(),
	author: text('author')
		.notNull()
		.references(() => user.id)
});

type UserPreferences = InferSelectModel<typeof userPreferences>;

export { user, userKey, userSession, userImages, userPreferences, userArticles };
export type { UserPreferences };
