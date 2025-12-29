import GeneralInfoForm from "@/app/(main)/editor/form/GeneralInfoForm";
import PersonalInfoForm from "@/app/(main)/editor/form/PersonalInfoForm";
import {EditorFormProps} from "@/lib/types";
import WorkExperienceForm from "@/app/(main)/editor/form/WorkExperienceForm";
import EducationForm from "@/app/(main)/editor/form/EducationForm";
import SkillsForm from "@/app/(main)/editor/form/SkillsForm";
import SummaryForm from "@/app/(main)/editor/form/SummaryForm";

export const steps: {
	title: string,
	component: React.ComponentType<EditorFormProps>,
	key: string,
}[] = [
	{ title: "General Info", component: GeneralInfoForm, key: 'general-info' },
	{ title: "Personal Info", component: PersonalInfoForm, key: 'personal-info' },
	{ title: "Work Experiences", component: WorkExperienceForm, key: 'work-experience' },
	{ title: "Education", component: EducationForm, key: 'education' },
	{ title: "Skills", component: SkillsForm, key: 'skills' },
	{ title: "Summary", component: SummaryForm, key: 'summary' },
]