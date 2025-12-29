import {
	Breadcrumb,
	BreadcrumbItem, BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {steps} from "@/app/(main)/editor/steps";
import React from "react";

interface BreadcrumbsProps {
	currentStep: string
	setCurrentStep: (currentStep: string) => void
}

const Breadcrumbs = ({ currentStep, setCurrentStep }: BreadcrumbsProps) => {
	return (
		<div className="flex justify-center">
			<Breadcrumb>
				<BreadcrumbList>
					{steps.map(step => (
						<React.Fragment key={step.key}>
							<BreadcrumbItem>
								{step.key === currentStep ? (
									<BreadcrumbPage>{step.title}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<button onClick={() => setCurrentStep(step.key)}>
											{step.title}
										</button>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							<BreadcrumbSeparator className="last:hidden" />
						</React.Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	)
}
export default Breadcrumbs
