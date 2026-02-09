import { Metadata } from "next"
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import Stripe from "stripe";
import GetSubscriptionButton from "@/app/(main)/billing/GetSubscriptionButton";
import {formatDate} from "date-fns";
import ManageSubscriptionButton from "@/app/(main)/billing/ManageSubscriptionButton";

export const metadata: Metadata = {
	title: "Billing"
}

const Page = async () => {
	const {userId} = await auth()

	if (!userId) return null

	const subscription = await prisma.userSubscription.findUnique({
		where: {userId}
	})

	const priceInfo = subscription
		? await stripe.prices.retrieve(subscription.stripePriceId, { expand: ["product"] })
		: null

	return (
		<main className="max-w-7xl mx-auto w-full space-y-6 px-3 py-6">
			<h1 className="text-3xl font-bold">Billing</h1>
			<p>
				Your current plan:{" "}
				<span className="font-bold">
					{priceInfo ? (priceInfo.product as Stripe.Product).name : "Free"}
				</span>
			</p>
			{subscription ? (
				<>
					{subscription.stripeCancelAtPeriodEnd && (
						<p className="text-destructive">
							Your subscription will be cancel on{" "}
							{formatDate((subscription.stripeCancelAt ?? subscription.stripeCurrentPeriodEnd), "MMMM dd, yyyy")}
						</p>
					)}
					<ManageSubscriptionButton />
				</>
			) : (
				<GetSubscriptionButton />
			)}
		</main>
	)
}
export default Page
