import {ResumeValues} from "@/lib/validation";
import type { Prisma } from "@prisma/client";

export interface EditorFormProps {
	resumeData: ResumeValues;
	setResumeData: (value: ResumeValues | ((prev: ResumeValues) => ResumeValues)) => void;
}

export const resumeDataInclude = {
	workExperiences: true,
	education: true
} satisfies Prisma.ResumeInclude

export type ResumeServerData = Prisma.ResumeGetPayload<{
	include: typeof resumeDataInclude
}>