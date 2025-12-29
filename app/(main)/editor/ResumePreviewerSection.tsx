import {ResumeValues} from "@/lib/validation";
import ResumePreviewer from "@/components/ResumePreviewer";
import ColorPicker from "@/app/(main)/editor/ColorPicker";
import BorderStyleButton from "@/app/(main)/editor/BorderStyleButton";
import {cn} from "@/lib/utils";

interface ResumePreviewerSectionProps {
	resumeData: ResumeValues;
	setResumeData: (resumeData: ResumeValues) => void;
	clasName?: string;
}

const ResumePreviewerSection = ({resumeData, setResumeData, clasName}: ResumePreviewerSectionProps) => {
	return (
		<div className={cn("group relative hidden md:flex w-full md:w-1/2", clasName)}>
			<div className="opacity-50 xl:opacity-100 group-hover:opacity-100 transition-opacity duration-300 absolute left-1 top-1 flex flex-col flex-none gap-2 lg:left-3 lg:top-3">
				<ColorPicker color={resumeData.colorHex} onChange={color => setResumeData({...resumeData, colorHex: color.hex})} />
				<BorderStyleButton borderStyle={resumeData.borderStyle} onChange={borderStyle => setResumeData({...resumeData, borderStyle})} />
			</div>
			<div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
				<ResumePreviewer
					resumeData={resumeData}
					className="max-w-2xl shadow-md"
				/>
			</div>
		</div>
	)
}
export default ResumePreviewerSection
