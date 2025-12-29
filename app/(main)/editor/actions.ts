'use server'

import {resumeSchema, ResumeValues} from "@/lib/validation";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {del, put} from "@vercel/blob";
import path from "node:path";

export async function saveResume(values: ResumeValues) {
	const { id } = values;

	console.log("new saved", values)

	const { photo, workExperiences, education, skills, ...resumeValues } = resumeSchema.parse(values)

	const { userId } = await auth()

	if (!userId) {
		throw new Error("User does not exist")
	}

	const existingResume = id
	? await prisma.resume.findUnique({where: { id, userId }})
	: null

	if (id && !existingResume) {
		throw new Error("Resume does not exist")
	}

	let newPhotoUrl: string | undefined | null = undefined

	if (photo instanceof File) {
		if (existingResume?.photoUrl ) {
			await del(existingResume.photoUrl)
		}

		const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
			access: "public"
		})

		newPhotoUrl = blob.url
	} else if (photo === null) {
		if (existingResume?.photoUrl) {
			await del(existingResume.photoUrl)
		}

		newPhotoUrl = null
	}

	if (id) {
		return prisma.resume.update({
			where: {id},
			data: {
				...resumeValues,
				photoUrl: newPhotoUrl,
				workExperiences: {
					deleteMany: {},
					create: workExperiences?.map(exp => ({
						...exp,
						startDate: exp.startDate ? new Date(exp.startDate) : undefined,
						endDate: exp.endDate ? new Date(exp.endDate) : undefined
					})),
				},
				education: {
					deleteMany: {},
					create: education?.map(edu => ({
						...edu,
						startDate: edu.startDate ? new Date(edu.startDate) : undefined,
						endDate: edu.endDate ? new Date(edu.endDate) : undefined
					})),
				},
				skills:  skills?.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
								.map((s) => s.trim())
			}
		})
	} else {
		return prisma.resume.create({
			data: {
				...resumeValues,
				userId,
				photoUrl: newPhotoUrl,
				workExperiences: {
					create: workExperiences?.map(exp => ({
						...exp,
						startDate: exp.startDate ? new Date(exp.startDate) : undefined,
						endDate: exp.endDate ? new Date(exp.endDate) : undefined
					})),
				},
				education: {
					create: education?.map(edu => ({
						...edu,
						startDate: edu.startDate ? new Date(edu.startDate) : undefined,
						endDate: edu.endDate ? new Date(edu.endDate) : undefined
					})),
				},
				skills:  skills?.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
								.map((s) => s.trim())
			}
		})
	}

}