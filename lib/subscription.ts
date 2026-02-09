import {cache} from "react";
import prisma from "@/lib/prisma";
import {env} from "@/env";

export type SubscriptionLevel = "free" | "premium" | "premium_plus"

export const getUserSubscriptionLevel = cache(
	async (userId: string): Promise<SubscriptionLevel> => {

		const subscription = await prisma.userSubscription.findUnique({
			where: { userId }
		})

		if (!subscription || subscription.stripeCurrentPeriodEnd < new Date()) {
			return "free"
		}

		if (subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_MONTHLY) {
			return "premium"
		}

		if (subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_PLUS_MONTHLY) {
			return "premium_plus"
		}

		throw new Error("Invalid subscription")
	}
)