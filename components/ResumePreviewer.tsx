import {ResumeValues} from "@/lib/validation";
import {cn} from "@/lib/utils";
import {useEffect, useRef, useState} from "react";
import useDimensions from "@/hooks/useDimensions";
import Image from "next/image";
import { formatDate } from "date-fns";
import {Badge} from "@/components/ui/badge";
import {BorderStyles} from "@/app/(main)/editor/BorderStyleButton";

interface ResumePreviewProps {
	resumeData: ResumeValues;
	className?: string;
}

const ResumePreviewer = ({resumeData, className}: ResumePreviewProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);

	const { w } = useDimensions(containerRef)

	return (
		<div
			className={cn("bg-white text-black h-fit w-full aspect-[210/297]", className)}
			ref={containerRef}
		>
			<div
				className={cn("space-y-6 p-6", !w && "invisible")}
				style={{
					zoom: (1/794) * w
				}}
			>
				<PersonalInfoHeader resumeData={resumeData} />
				<SummarySection resumeData={resumeData} />
				<WorkExperiencesSection resumeData={resumeData} />
				<EducationSection resumeData={resumeData} />
				<SkillsSection resumeData={resumeData} />
			</div>
		</div>
	)
}
export default ResumePreviewer

interface ResumeSectionProps {
	resumeData: ResumeValues;
}

function PersonalInfoHeader({resumeData}: ResumeSectionProps) {
	const { photo, firstName, lastName, jobTitle, city, country, phone, email, colorHex, borderStyle } = resumeData;

	const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

	useEffect(() => {
		const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
		if (objectUrl) setPhotoSrc(objectUrl);
		if (photo === null) setPhotoSrc("")

		return () => URL.revokeObjectURL(objectUrl);
	}, [photo])

	return(
		<div className="flex items-center gap-6">
			{photoSrc && (
				<Image
					src={photoSrc}
					width={100}
					height={100}
					alt={`${firstName} ${lastName}`}
					className="aspect-square object-cover"
					style={{ borderRadius:
						borderStyle === BorderStyles.SQUARE ? "0px"
						: borderStyle === BorderStyles.CIRCLE ? "999px"
						: "20%"
					}}
				/>
			)}
			<div className="space-y-2.5">
				<div className="space-y-1">
					<p className="text-3xl font-bold" style={{ color: colorHex }}>
						{firstName} {lastName}
					</p>
					<p className="font-medium">{jobTitle}</p>
				</div>
				<p className="text-xs text-gray-500">
					{city}{city && country ? ", " : ""}{country}
					{(city || country) && (phone || email) ? " • " : ""}
					{[phone, email].filter(Boolean).join(" • ")}
				</p>
			</div>
		</div>
	)
}

function SummarySection({resumeData}: ResumeSectionProps) {
	const { summary, colorHex } = resumeData;

	if (!summary) return null;

	return (
		<>
			<hr className="border-2" style={{ borderColor: colorHex }}/>
			<div className="space-y-3 break-inside-avoid">
				<p className="text-lg font-semibold" style={{ color: colorHex }}>Professional profile</p>
				<div className="whitespace-pre-line text-sm">{summary}</div>
			</div>
		</>
	)
}

function WorkExperiencesSection({resumeData}: ResumeSectionProps) {
	const { workExperiences, colorHex } = resumeData;

	const workExperiencesNotEmpty = workExperiences?.filter
	(exp => Object.values(exp).filter(Boolean).length > 0)

	if (!workExperiencesNotEmpty?.length) return null;

	return (
		<>
			<hr className="border-2" style={{ borderColor: colorHex }} />
			<div className="space-y-3">
				<p className="text-lg font-semibold" style={{ color: colorHex }}>Work experiences</p>
				{workExperiencesNotEmpty.map((exp, index) => (
					<div key={index} className="break-inside-avoid space-y-1">
						<div style={{ color: colorHex }} className="flex items-center justify-between text-sm font-semibold">
							<span>{exp.position}</span>
							{exp.startDate && (
								<span>
									{formatDate(exp.startDate, "MM/yyyy")} -{" "}
									{exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
								</span>
							)}
						</div>
						<p className="text-xs font-semibold">{exp.company}</p>
						<div className="whitespace-pre-line text-xs">{exp.description}</div>
					</div>
				))}
			</div>
		</>
	)
}

function EducationSection({resumeData}: ResumeSectionProps) {
	const { education, colorHex } = resumeData;

	const educationNotEmpty = education?.filter
	(exp => Object.values(exp).filter(Boolean).length > 0)

	if (!educationNotEmpty?.length) return null;

	return (
		<>
			<hr className="border-2" style={{ borderColor: colorHex }}/>
			<div className="space-y-3">
				<p className="text-lg font-semibold" style={{ color: colorHex }}>Education</p>
				{educationNotEmpty.map((edu, index) => (
					<div key={index} className="break-inside-avoid space-y-1">
						<div style={{ color: colorHex }} className="flex items-center justify-between text-sm font-semibold">
							<span>{edu.degree}</span>
							{edu.startDate && (
								<span>
									{formatDate(edu.startDate, "MM/yyyy")}
									{edu.endDate ? ` - ${formatDate(edu.endDate, "MM/yyyy")}` : ""}
								</span>
							)}
						</div>
						<p className="text-xs font-semibold">{edu.school}</p>
					</div>
				))}
			</div>
		</>
	)
}

function SkillsSection({resumeData}: ResumeSectionProps) {
	const { skills, colorHex, borderStyle } = resumeData

	if (!skills.length) return null

	return (
		<>
			<hr className="border-2" style={{ borderColor: colorHex }} />
			<div className="break-inside-avoid space-y-3">
				<p className="text-lg font-semibold" style={{ color: colorHex }}>Skills</p>
				<div className="flex flex-wrap gap-2 break-inside-avoid">
					{skills.map((skill, index) => (
						<Badge
							key={index}
							className="bg-black text-white hover:bg-black"
							style={{
								backgroundColor: colorHex,
								borderRadius:
									borderStyle === BorderStyles.SQUARE ? "0px"
									: borderStyle === BorderStyles.CIRCLE ? "999px"
									: "8px"
							}}
						>
							{skill}
						</Badge>
					))}
				</div>
			</div>
		</>
	)
}