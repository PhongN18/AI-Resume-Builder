import {NextRequest} from "next/server";
import stripe from "@/lib/stripe"
import {env} from "@/env"
import Stripe from "stripe";
import {clerkClient} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
	try {
		const payload = await req.text()
		const signature = req.headers.get("stripe-signature");
		if (!signature) return new Response("Signature is missing", {status: 400});

		const event = stripe.webhooks.constructEvent(
			payload,
			signature,
			env.STRIPE_WEBHOOK_SECRET
		)

		console.log(event.type, event)

		switch (event.type) {
			case "checkout.session.completed":
				await handleSessionCompleted(event.data.object)
				break
			case "customer.subscription.created":
			case "customer.subscription.updated":
				await handleSubscriptionCreatedOrUpdated(event.data.object.id)
				break
			case "customer.subscription.deleted":
				await handleSubscriptionDeleted(event.data.object)
				break
			default:
				console.log(`Unhandled event type: ${event.type}`)
				break
		}

		return new Response("Event received", {status: 200})

	} catch (e) {
		console.error(e)
		return new Response("Internal server error", {status: 500})
	}
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
	const userId = session.metadata?.userId
	if (!userId) {
		throw new Error("User ID is missing in session metadata")
	}

	(await clerkClient()).users.updateUserMetadata(userId, {
		privateMetadata: {
			stripeCustomerId: session.customer as string
		}
	})
}

async function handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
	const subscription = await stripe.subscriptions.retrieve(subscriptionId)
	console.log("subscription json", JSON.stringify(subscription, null, 2));
	if (subscription.status === 'active' || subscription.status === 'trialing' || subscription.status === "past_due") {
		await prisma.userSubscription.upsert({
			where: { userId: subscription.metadata.userId },
			create: {
				userId: subscription.metadata.userId,
				stripeSubscriptionId: subscription.id,
				stripeCustomerId: subscription.customer as string,
				stripePriceId: subscription.items.data[0].price.id,
				stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
				stripeCancelAtPeriodEnd: subscription.cancel_at_period_end || subscription.cancel_at != null,
				stripeCancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null
			},
			update: {
				stripePriceId: subscription.items.data[0].price.id,
				stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
				stripeCancelAtPeriodEnd: subscription.cancel_at_period_end || subscription.cancel_at != null,
				stripeCancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null
			}
		})
	} else {
		await prisma.userSubscription.deleteMany({
			where: { stripeCustomerId: subscription.customer as string }
		})
	}
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
	await prisma.userSubscription.deleteMany({
		where: { stripeCustomerId: subscription.customer as string }
	})
}