import React, {useEffect} from 'react'
import {EditorFormProps} from "@/lib/types";
import {useFieldArray, useForm, UseFormReturn, useWatch} from "react-hook-form";
import {workExperienceSchema, WorkExperienceValues} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {GripHorizontal} from "lucide-react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities"
import {cn} from "@/lib/utils";
import GenerateWorkExperienceButton from "@/app/(main)/editor/form/GenerateWorkExperienceButton";

const WorkExperienceForm = ({ resumeData, setResumeData }: EditorFormProps) => {
	const form = useForm<WorkExperienceValues>({
		resolver: zodResolver(workExperienceSchema),
		defaultValues: {
			workExperiences: resumeData.workExperiences || []
		}
	})

	const watchedValues = useWatch({ control: form.control });
	const { isValid } = form.formState;

	useEffect(() => {
		if (!isValid) return;
		if (!watchedValues) return;

		setResumeData(prev => ({
			...prev,
			...watchedValues,
		}));
	}, [watchedValues, isValid, setResumeData]);

	const { fields, append, remove, move } = useFieldArray({
		control: form.control,
		name: 'workExperiences'
	})

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	function handleDragEnd(event: DragEndEvent) {
		const {active, over} = event
		if (over && active.id !== over.id) {
			const oldIndex = fields.findIndex(f => f.id === active.id);
			const newIndex = fields.findIndex(f => f.id === over.id);
			move(oldIndex, newIndex)

			return arrayMove(fields, oldIndex, newIndex)
		}
	}

	console.log(form)

	return (
		<div className="max-w-xl mx-auto space-y-6">
			<div className="space-y-1.5 text-center">
				<h2 className="text-2xl font-semibold">Work Experience</h2>
				<p className="text-sm text-muted-foreground">
					Add as many experiences as you like
				</p>
			</div>
			<Form {...form} >
				<form className="space-y-3">
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
						modifiers={[restrictToVerticalAxis]}
					>
						<SortableContext
							items={fields}
							strategy={verticalListSortingStrategy}
						>
							{fields.map((field, index) => (
								<WorkExperienceItem
									key={field.id}
				                    index={index}
									form={form}
									remove={remove}
									id={field.id}
								/>
							))}
						</SortableContext>
					</DndContext>
					<div className="flex justify-center">
						<Button
							type="button"
							onClick={() => append({
								position: "",
								company: "",
								startDate: "",
								endDate: "",
								description: "",
							})}
						>
							Add work experience
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}

export default WorkExperienceForm

interface WorkExperienceItemProps {
	form: UseFormReturn<WorkExperienceValues>;
	index: number;
	remove: (index: number) => void;
	id: string
}

function WorkExperienceItem({ form, index, remove, id }: WorkExperienceItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({id})

	return (
		<div
			ref={setNodeRef}
			className={cn("space-y-3 border rounded-md bg-background p-3",
				isDragging && "shadow-xl z-50 cursor-grab relative"
			)}
			style={{
				transform: CSS.Transform.toString(transform),
				transition
			}}
		>
			<div className="flex justify-between gap-2">
				<span className="font-semibold">Work experience {index + 1}</span>
				<GripHorizontal className="size-5 cursor-grab text-muted-foreground focus:outline-none"
					{...attributes}
					{...listeners}
				/>
			</div>
			<div className="flex justify-center">
				<GenerateWorkExperienceButton
					onWorkExperienceGenerated={exp =>
						form.setValue(`workExperiences.${index}`, exp)
					}
				/>
			</div>
			<FormField
				control={form.control}
				name={`workExperiences.${index}.position`}
				render={({field}) => (
					<FormItem>
						<FormLabel>Job title</FormLabel>
						<FormControl>
							<Input {...field} autoFocus />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name={`workExperiences.${index}.company`}
				render={({field}) => (
					<FormItem>
						<FormLabel>Company</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div className="grid grid-cols-2 gap-3">
				<FormField
					control={form.control}
					name={`workExperiences.${index}.startDate`}
					render={({field}) => (
						<FormItem>
							<FormLabel>Start date</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="date"
									value={field.value?.slice(0, 10)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={`workExperiences.${index}.endDate`}
					render={({field}) => (
						<FormItem>
							<FormLabel>End date</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="date"
									value={field.value?.slice(0, 10)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<FormDescription>
				Leave <span className="font-semibold">end date</span> empty if you are currently working here.
			</FormDescription>
			<FormField
				control={form.control}
				name={`workExperiences.${index}.description`}
				render={({field}) => (
					<FormItem>
						<FormLabel>Description</FormLabel>
						<FormControl>
							<Textarea {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<Button variant="destructive" type="button" onClick={() => remove(index)}>
				Remove
			</Button>
		</div>
	)
}