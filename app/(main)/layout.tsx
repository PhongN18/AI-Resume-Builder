import Navbar from "./Navbar";
import PremiumModal from "@/components/premium/PremiumModal";
import {auth} from "@clerk/nextjs/server";
import {getUserSubscriptionLevel} from "@/lib/subscription";
import SubscriptionLevelProvider from "@/app/(main)/SubscriptionLevelProvider";

export default async function Layout({ children }: { children: React.ReactNode }) {
	const {userId} = await auth()

	if (!userId) return null

	const userSubscriptionLevel = await getUserSubscriptionLevel(userId)
	console.log(userSubscriptionLevel)
	return (
		<SubscriptionLevelProvider userSubscriptionLevel={userSubscriptionLevel}>
			<div className="flex min-h-screen flex-col">
				<Navbar />
				{children}
				<PremiumModal />
			</div>
		</SubscriptionLevelProvider>
	);
}
