import {SubscriptionLevel} from "@/lib/subscription";

export function canCreateResume(
	subscriptionLevel: SubscriptionLevel,
	currentResumeCount: number
) {
	const maxResumeMap: Record<SubscriptionLevel, number> = {
		free: 1,
		premium: 3,
		premium_plus: Infinity
	}

	const maxResumes = maxResumeMap[subscriptionLevel]
	return currentResumeCount < maxResumes
}

export function canUseAITools(subscriptionLevel: SubscriptionLevel | undefined) {
	return subscriptionLevel !== "free"
}

export function canUseCustomizations(subscriptionLevel: SubscriptionLevel | undefined) {
	return subscriptionLevel === "premium_plus"
}