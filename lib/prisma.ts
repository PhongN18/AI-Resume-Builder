// lib/prisma.ts
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL is not set");
}

// Create the Neon adapter for Prisma
const adapter = new PrismaNeon({ connectionString });

// Global singleton pattern for Next.js (prevents multiple clients in dev)
const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter,
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
