'use server'

import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {del} from "@vercel/blob";
import {revalidatePath} from "next/cache";

export async function deleteResume(id: string) {
	const { userId } = await auth();

	if (!userId) throw new Error("User is not authenticated");

	const resume = await prisma.resume.findUnique({
		where: { id, userId },
		select: { id: true, photoUrl: true }, // only what you need
	});

	if (!resume) throw new Error("Resume not found");

	// 1) Delete DB records first (FK-safe)
	await prisma.$transaction(async (tx) => {
		await tx.workExperience.deleteMany({ where: { resumeId: id } });
		await tx.education.deleteMany({ where: { resumeId: id } }); // if you have this table

		await tx.resume.delete({ where: { id } });
	});

	// 2) Then delete blob (can't be rolled back)
	if (resume.photoUrl) {
		try {
			await del(resume.photoUrl);
		} catch (e) {
			// optional: log only, don't fail the request since DB is already deleted
			console.error("Failed to delete photo from blob:", e);
		}
	}

	revalidatePath("/resumes");
}