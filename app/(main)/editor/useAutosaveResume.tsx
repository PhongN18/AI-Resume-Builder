import {ResumeValues} from "@/lib/validation";
import useDebounce from "@/hooks/useDebounce";
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {saveResume} from "@/app/(main)/editor/actions";
import {Button} from "@/components/ui/button";
import {toast} from "sonner"
import {fileReplacer} from "@/lib/utils";

export default function useAutosaveResume(resumeData: ResumeValues) {
	const searchParams = useSearchParams()
	const [resumeId, setResumeId] = useState(resumeData.id)

	const debouncedResumeData = useDebounce(resumeData, 1500)

	const [lastSavedData, setLastSavedData] = useState<ResumeValues>(
		structuredClone(resumeData)
	)

	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [isError, setIsError] = useState<boolean>(false)

	useEffect(() => {
		setIsError(false)
	}, [debouncedResumeData]);

	useEffect(() => {
		async function handleSave() {
			try {
				setIsSaving(true)
				setIsError(false)

				const newData = structuredClone(debouncedResumeData)
				const updateResume = await saveResume({
					...newData,
					...(JSON.stringify(lastSavedData.photo, fileReplacer) === JSON.stringify(newData.photo, fileReplacer) && {
						photo: undefined
					}),
					id: resumeId
				})

				setResumeId(updateResume.id)
				setLastSavedData(newData)

				if (searchParams.get('resumeId') !== updateResume.id) {
					const newSearchParams = new URLSearchParams(searchParams)
					newSearchParams.set("resumeId", updateResume.id)
					window.history.replaceState(
						null, "", `?${newSearchParams.toString()}`
					)
				}
			} catch (e) {
				setIsError(true)
				console.error(e)

				toast.error("Could not save changes", {
					description: "Something went wrong while saving.",
					action: {
						label: "Retry",
						onClick: () => handleSave(),
					},
				})

			} finally {
				setIsSaving(false)
			}
		}

		const hasUnsavedChanges = JSON.stringify(debouncedResumeData, fileReplacer) !== JSON.stringify(lastSavedData, fileReplacer)

		if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
			handleSave()
		}
	}, [debouncedResumeData, isSaving, lastSavedData, isError, resumeId, searchParams]);

	return {
		isSaving,
		hasUnsavedChanges: JSON.stringify(resumeData) !== JSON.stringify(lastSavedData)
	}
}