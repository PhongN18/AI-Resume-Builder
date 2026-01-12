import {z} from "zod";

export const generalInfoSchema = z.object({
	title: z.string().trim().optional().or(z.literal("")),
	description: z.string().trim().optional().or(z.literal("")),
})

export type GeneralInfoValue = z.infer<typeof generalInfoSchema>

export const personalInfoSchema = z.object({
	photo: z.custom<File | undefined>()
		.refine(
			(f) => !f || (f instanceof File && f.type.startsWith("image/")),
			"Must be an image file"
		)
		.refine(
			(f) => !f || f.size <= 1024 * 1024 * 4,
			"File must be less than 4MB"
		),
	firstName: z.string().trim().optional(),
	lastName: z.string().trim().optional(),
	jobTitle: z.string().trim().optional(),
	city: z.string().trim().optional(),
	country: z.string().trim().optional(),
	phone: z.string().trim().optional(),
	email: z.string().trim().optional(),
})

export type PersonalInfoValue = z.infer<typeof personalInfoSchema>

export const workExperienceSchema = z.object({
	workExperiences: z.array(
		z.object({
			position: z.string().trim().optional(),
			company: z.string().trim().optional(),
			startDate: z.string().trim().optional(),
			endDate: z.string().trim().optional(),
			description: z.string().trim().optional(),
		})
	).optional()
})

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>

export type WorkExperience = NonNullable<z.infer<typeof workExperienceSchema>["workExperiences"]>[number]

export const educationSchema = z.object({
	education: z.array(
		z.object({
			degree: z.string().trim().optional(),
			school: z.string().trim().optional(),
			startDate: z.string().trim().optional(),
			endDate: z.string().trim().optional(),
		})
	).optional()
})

export type EducationValues = z.infer<typeof educationSchema>

export const skillSchema = z.object({
	skills: z.array(z.string().trim().optional()),
})

export type SkillValues = z.infer<typeof skillSchema>

export const summarySchema = z.object({
	summary: z.string().trim().optional(),
})

export type SummaryValues = z.infer<typeof summarySchema>

export const resumeSchema = z.object({
	...generalInfoSchema.shape,
	...personalInfoSchema.shape,
	...workExperienceSchema.shape,
	...educationSchema.shape,
	...skillSchema.shape,
	...summarySchema.shape,
	colorHex: z.string().trim().optional(),
	borderStyle: z.string().trim().optional(),
})

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
	id?: string
	photo?: File | string | null
}

export const generateWorkExperienceSchema = z.object({
	description: z.string().trim().min(1, "Required").min(20, "Must be at least 20 characters"),
})

export type GenerateWorkExperienceInput = z.infer<typeof generateWorkExperienceSchema>

export const generateSummarySchema = z.object({
	jobTitle: z.string().trim().optional(),
	...workExperienceSchema.shape,
	...educationSchema.shape,
	...skillSchema.shape
})

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>

export const emptyResumeValues: ResumeValues = {
	// General Info
	title: "",
	description: "",

	// Personal Info
	firstName: "",
	lastName: "",
	jobTitle: "",
	city: "",
	country: "",
	phone: "",
	email: "",
	photo: undefined,

	// Work Experiences
	workExperiences: [],

	// Education
	education: [],

	// Skills
	skills: [],

	// Summary
	summary: "",

	// Customize preview
	colorHex: "",
	borderStyle: "",
};
