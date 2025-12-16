 import { pgTable, serial, text, integer, varchar, timestamp } from "drizzle-orm/pg-core";


 export const productsTable = pgTable("products", {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    });

 export const processesTable = pgTable("processes", {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        productId: integer("product_id")
            .notNull()
            .references(() => productsTable.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
 });
 export const machinesTable = pgTable("machines", {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        processId: integer("process_id")
            .notNull()
            .references(() => processesTable.id, { onDelete: "cascade" }),
            createdAt: timestamp("created_at").defaultNow().notNull(),
});
