import {ResumeValues} from "@/lib/validation";
import {toast} from 'sonner'
import {useState} from "react";
import LoadingButton from "@/components/LoadingButton";
import {WandSparkles} from "lucide-react";
import {generateSummary} from "@/app/(main)/editor/form/actions";

interface GenerateSummaryButtonProps {
	resumeData: ResumeValues;
	onSummaryGenerated: (summary: string) => void
}

const GenerateSummaryButton = ({resumeData, onSummaryGenerated}: GenerateSummaryButtonProps) => {
	const [loading, setLoading] = useState(false);

	async function handleClick() {
		try {
			setLoading(true);
			const aiResponse = await generateSummary(resumeData)
			onSummaryGenerated(aiResponse)
		} catch (e) {
			console.error(e)
			toast.error("Failed to generate summary", {
				description: "Something went wrong. Please try again later.",
			})
		} finally {
			setLoading(false);
		}
	}

	return (
		<LoadingButton
			variant="outline"
			type="button"
			onClick={handleClick}
			loading={loading}
		>
			<WandSparkles className="size-4" />
			Generate (AI)
		</LoadingButton>
	)
}
export default GenerateSummaryButton
