"use client"

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Check} from "lucide-react";
import {Button} from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";

const premiumFeatures = ["AI tools", "Up to 3 resumes"]
const premiumPlusFeatures = ["Infinite resumes", "Design customizations"]

const PremiumModal = () => {
	const {open, setOpen} = usePremiumModal()

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Resume Builder AI Premium</DialogTitle>
				</DialogHeader>
				<div className="space-y-6">
					<p>
						Get a premium subscription to unlock
					</p>
					<div className="flex w-full">
						<div className="flex w-1/2 flex-col space-y-5">
							<h3 className="text-center text-lg font-bold">Premium</h3>
							<ul className="list-inside space-y-2">
								{premiumFeatures.map(feature => (
									<li key={feature} className="flex items-center gap-2">
										<Check className="size-4 text-green-500" />
										{feature}
									</li>
								))}
							</ul>
							<Button>
								Get Premium
							</Button>
						</div>
						<div className="border-l mx-6" />
						<div className="flex w-1/2 flex-col space-y-5">
							<h3 className="text-center text-lg font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">Premium Plus</h3>
							<ul className="list-inside space-y-2">
								{premiumPlusFeatures.map(feature => (
									<li key={feature} className="flex items-center gap-2">
										<Check className="size-4 text-green-500" />
										{feature}
									</li>
								))}
							</ul>
							<Button variant="premium">
								Get Premium Plus
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
export default PremiumModal
