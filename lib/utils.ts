import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {ResumeServerData} from "@/lib/types";
import {ResumeValues} from "@/lib/validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File ? {
    name: value.name,
    size: value.size,
    type: value.type,
    lastModified: value.lastModified,
  } : value
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    workExperiences: data.workExperiences.map(exp => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      startYear: exp.startYear ?? undefined,
      startMonth: exp.startMonth ?? undefined,
      endYear: exp.endYear ?? undefined,
      endMonth: exp.endMonth ?? undefined,
      description: exp.description || undefined,
    })),
    education: data.education.map(edu => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startYear: edu.startYear ?? undefined,
      startMonth: edu.startMonth ?? undefined,
      endYear: edu.endYear ?? undefined,
      endMonth: edu.endMonth ?? undefined,
    })),
    skills: data.skills,
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined,
  }
}