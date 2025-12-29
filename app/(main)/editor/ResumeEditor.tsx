'use client'

import React, {useState} from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import GeneralInfoForm from "@/app/(main)/editor/form/GeneralInfoForm";
import PersonalInfoForm from "@/app/(main)/editor/form/PersonalInfoForm";
import {useSearchParams} from "next/navigation";
import {steps} from "@/app/(main)/editor/steps";
import Breadcrumbs from "@/app/(main)/editor/Breadcrumbs";
import Footer from "@/app/(main)/editor/Footer";
import {emptyResumeValues, ResumeValues} from "@/lib/validation";
import ResumePreviewerSection from "@/app/(main)/editor/ResumePreviewerSection";
import {cn, mapToResumeValues} from "@/lib/utils";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import useAutosaveResume from "@/app/(main)/editor/useAutosaveResume";
import {ResumeServerData} from "@/lib/types";

interface ResumeEditorProps {
	resumeToEdit: ResumeServerData | null
}

const ResumeEditor = ({resumeToEdit}: ResumeEditorProps) => {
	const searchParams = useSearchParams()
	const currentStep = searchParams.get("step") || steps[0].key
	const [resumeData, setResumeData] = useState<ResumeValues>(
		resumeToEdit ? mapToResumeValues(resumeToEdit) : emptyResumeValues
	)
	const [showSmResumePreview, setShowSmResumePreview] = useState(false)

	const { isSaving, hasUnsavedChanges } = useAutosaveResume(resumeData)
	useUnloadWarning(hasUnsavedChanges)

	function setStep(key: string) {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("step", key)
		window.history.pushState(null, "", `?${newSearchParams.toString()}`)
	}

	const FormComponent = steps.find(
		step => step.key === currentStep
	)?.component



	return (
		<div className="flex grow flex-col">
			<header className="space-y-1.5 border-b px-3 py-5 text-center">
				<h1 className="text-2xl font-bold">Design your resume</h1>
				<p className="text-sm text-muted-foreground">
					Follow the steps below to create your resume. Your progress will be saved automatically.
				</p>
			</header>
			<main className="relative grow">
				<div className="absolute top-0 bottom-0 flex w-full">
					<div className={cn("w-full md:w-1/2 p-3 overflow-y-auto space-y-6 p-3 md:block", showSmResumePreview && "hidden")}>
						<Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
						{FormComponent && <FormComponent resumeData={resumeData} setResumeData={setResumeData} />}
					</div>
					<div className="grow md:border-r" />
					<ResumePreviewerSection
						resumeData={resumeData}
						setResumeData={setResumeData}
						clasName={cn(showSmResumePreview && "flex")}
					/>
				</div>
			</main>
			<Footer 
				currentStep={currentStep}
				setCurrentStep={setStep}
				showSmResumePreview={showSmResumePreview}
				setShowSmResumePreview={setShowSmResumePreview}
		        isSaving={isSaving}/>
		</div>
	)
}
export default ResumeEditor
