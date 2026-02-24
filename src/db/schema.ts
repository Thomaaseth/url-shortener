import { pgTable, varchar, uuid, timestamp, integer, index } from "drizzle-orm/pg-core";

export const url = pgTable('url', {
    id: uuid('urlId').primaryKey().defaultRandom(),
    url: varchar('url', { length: 255 }).notNull(),
    shortCode: varchar('shortCode', { length: 6}).notNull().unique(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
    count: integer('count').default(0),
}, (table) => [
    index('shortCode_idx').on(table.shortCode)
]);