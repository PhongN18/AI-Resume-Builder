import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		POSTGRES_URL: z.string().min(1),
		POSTGRES_URL_NON_POOLING: z.string().min(1),
		POSTGRES_USER: z.string().min(1),
		POSTGRES_HOST: z.string().min(1),
		POSTGRES_PASSWORD: z.string().min(1),
		POSTGRES_DATABASE: z.string().min(1),
		POSTGRES_URL_NO_SSL: z.string().min(1),
		POSTGRES_PRISMA_URL: z.string().min(1),

		CLERK_SECRET_KEY: z.string().min(1),
		BLOB_READ_WRITE_TOKEN: z.string().min(1),
		OPENAI_API_KEY: z.string().min(1),
		STRIPE_SECRET_KEY: z.string().min(1),
		STRIPE_WEBHOOK_SECRET: z.string().min(1),
	},

	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1), // <- see note below
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
		NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_MONTHLY: z.string().min(1),
		NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_PLUS_MONTHLY: z.string().min(1),
		NEXT_PUBLIC_BASE_URL: z.string().min(1),
	},

	runtimeEnv: {
		// ✅ server
		POSTGRES_URL: process.env.POSTGRES_URL,
		POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
		POSTGRES_USER: process.env.POSTGRES_USER,
		POSTGRES_HOST: process.env.POSTGRES_HOST,
		POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
		POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
		POSTGRES_URL_NO_SSL: process.env.POSTGRES_URL_NO_SSL,
		POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,

		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

		// ✅ client
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_MONTHLY,
		NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_PLUS_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_PLUS_MONTHLY,
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
	},
	onValidationError: (error) => {
		console.error("❌ Invalid environment variables:", error);
		throw new Error("Invalid environment variables");
	},
	onInvalidAccess: (variable) => {
		throw new Error(`❌ Attempted to access a server-side env var on the client: ${variable}`);
	},
});
