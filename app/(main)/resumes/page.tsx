import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {PlusSquare} from "lucide-react";
import {Metadata} from "next";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {resumeDataInclude} from "@/lib/types";
import ResumeItem from "@/app/(main)/resumes/ResumeItem";

export const metadata: Metadata = {
	title: "Your resumes"
}

const Resumes = async () => {
	const { userId } = await auth()

	if (!userId) {
		return null
	}

	const [resumes, totalCount] = await Promise.all([
		prisma.resume.findMany({
			where: { userId },
			orderBy: { updatedAt: "desc" },
			include: resumeDataInclude
		}),
		prisma.resume.count({
			where: { userId },
		})
	])


	return (
		<main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
			<Button asChild className="mx-auto flex w-fit gap-2">
				<Link href="/editor">
					<PlusSquare className="size-5"/>
					New Resume
				</Link>
			</Button>
			<div className="space-y-1">
				<h1 className="text-3xl font-bold">Your resumes</h1>
				<p>Total: {totalCount}</p>
			</div>
			<div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-5">
				{resumes.map(res => (
					<ResumeItem key={res.id} resume={res} />
				))}
			</div>
		</main>
	)
}
export default Resumes
