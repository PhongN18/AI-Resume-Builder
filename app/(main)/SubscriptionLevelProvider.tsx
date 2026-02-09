"use client"

import {createContext, ReactNode, useContext} from "react";
import {SubscriptionLevel} from "@/lib/subscription";

const SubscriptionLevelContext = createContext<SubscriptionLevel | undefined>(
	undefined
)

interface SubscriptionLevelProviderProps {
	children: ReactNode;
	userSubscriptionLevel: SubscriptionLevel
}

export default function SubscriptionLevelProvider({children, userSubscriptionLevel}: SubscriptionLevelProviderProps) {
	return (
		<SubscriptionLevelContext.Provider value={userSubscriptionLevel}>
			{children}
		</SubscriptionLevelContext.Provider>
	)
}

export function useSubscriptionLevel() {
	return useContext(SubscriptionLevelContext)
}