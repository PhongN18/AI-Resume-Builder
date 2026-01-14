"use client"

import {ResumeServerData} from "@/lib/types";
import Link from "next/link";
import {formatDate} from "date-fns";
import ResumePreviewer from "@/components/ResumePreviewer";
import {mapToResumeValues} from "@/lib/utils";
import {useRef, useState, useTransition} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreVertical, Printer, Trash2} from "lucide-react";
import {toast} from "sonner"
import {deleteResume} from "@/app/(main)/resumes/action";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import LoadingButton from "@/components/LoadingButton";
import {useReactToPrint} from "react-to-print";

interface ResumeItemProps {
	resume: ResumeServerData
}

const ResumeItem = ({resume}: ResumeItemProps) => {
	const contentRef = useRef<HTMLDivElement>(null)

	const reactToPrintFn = useReactToPrint({
		contentRef,
		documentTitle: resume.title || "Untitled Resume"
	})

	const wasUpdated = resume.updatedAt !== resume.createdAt

	return (
		<div className="group relative border rounded-lg border-transparent hover:border-border transition-colors bg-secondary p-3">
			<div className="space-y-3">
				<Link
					href={`/editor?resumeId=${resume.id}`}
					className="inline-block w-full text-center space-y-2"
				>
					<p className="font-semibold line-clamp-1 overflow-hidden px-6">
						{resume.title || "No title"}
					</p>
					<p className="line-clamp-2 text-sm overflow-hidden break-words px-4 min-h-[2.5rem]">{resume.description}</p>
					<p className="text-xs mt-1 text-muted-foreground italic">
						{wasUpdated ? "Updated " : "Created "}
						{formatDate(resume.updatedAt, "MMM d, yyyy hh:mm:ss")}
					</p>
				</Link>
				<Link
					href={`/editor?resumeId=${resume.id}`}
					className="inline-block w-full relative"
				>
					<ResumePreviewer
						resumeData={mapToResumeValues(resume)}
						className="overflow-hidden shadow-sm transition-shadow group-hover:shadow-lg"
						contentRef={contentRef}
					/>
					<div
						className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"
					/>
				</Link>
				<OptionsMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />
			</div>
		</div>
	)
}
export default ResumeItem

interface OptionsMenuProps {
	resumeId: string;
	onPrintClick: () => void;
}

function OptionsMenu({resumeId, onPrintClick}: OptionsMenuProps) {
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-0.5 top-0.5 bg-transparent outline-none focus:outline-none opacity-0 transition-opacity group-hover:opacity-100"
					>
						<MoreVertical className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						className="flex items-center gap-2"
						onClick={() => setShowDeleteConfirmation(true)}
					>
						<Trash2 className="size-4" />
						Delete
					</DropdownMenuItem>
					<DropdownMenuItem
						className="flex items-center gap-2"
						onClick={onPrintClick}
					>
						<Printer className="size-4" />
						Print
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DeleteConfirmDialog
				resumeId={resumeId}
				open={showDeleteConfirmation}
				onOpenChange={setShowDeleteConfirmation}
			/>
		</>
	)
}

interface DeleteConfirmDialogProps {
	resumeId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function DeleteConfirmDialog({resumeId, open, onOpenChange}: DeleteConfirmDialogProps) {
	const [isPending, startTransition] = useTransition()

	async function handleDelete() {
		startTransition(async () => {
			try {
				await deleteResume(resumeId)
				onOpenChange(false)
			} catch (e) {
				console.error(e)
				toast.error("Failed to delete resume", {
					description: "Something went wrong. Please try again later.",
				})
			}
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete resume?</DialogTitle>
					<DialogDescription>
						This will permanently delete this resume. This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<LoadingButton
						loading={isPending}
						onClick={handleDelete}
						variant="destructive"
					>
						Delete
					</LoadingButton>
					<Button
						variant="secondary"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}