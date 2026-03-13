import React, {useEffect} from 'react'
import {EditorFormProps} from "@/lib/types";
import {useFieldArray, useForm, UseFormReturn, useWatch} from "react-hook-form";
import {educationSchema, EducationValues, WorkExperienceValues} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {GripHorizontal} from "lucide-react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
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
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const MONTHS = [
	{ value: 1, label: "January" },
	{ value: 2, label: "February" },
	{ value: 3, label: "March" },
	{ value: 4, label: "April" },
	{ value: 5, label: "May" },
	{ value: 6, label: "June" },
	{ value: 7, label: "July" },
	{ value: 8, label: "August" },
	{ value: 9, label: "September" },
	{ value: 10, label: "October" },
	{ value: 11, label: "November" },
	{ value: 12, label: "December" },
] as const;

const EducationForm = ({resumeData, setResumeData}: EditorFormProps) => {
	const form = useForm<EducationValues>({
		resolver: zodResolver(educationSchema),
		defaultValues: {
			education: resumeData.education || []
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
		name: 'education'
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

	return (
		<div className="max-w-xl mx-auto space-y-6">
			<div className="space-y-1.5 text-center">
				<h2 className="text-2xl font-semibold">Education</h2>
				<p className="text-sm text-muted-foreground">
					Add as many education as you like
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
								<EducationItem
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
								degree: "",
								school: "",
								startYear: undefined,
								startMonth: undefined,
								endYear: undefined,
								endMonth: undefined,
							})}
						>
							Add education
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}
export default EducationForm

interface EducationItemProps {
	form: UseFormReturn<EducationValues>;
	index: number;
	remove: (index: number) => void;
	id: string
}

function EducationItem({ form, index, remove, id }: EducationItemProps) {
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
				<span className="font-semibold">Education {index + 1}</span>
				<GripHorizontal className="size-5 cursor-grab text-muted-foreground focus:outline-none"
	                {...attributes}
	                {...listeners}
				/>
			</div>
			<FormField
				control={form.control}
				name={`education.${index}.degree`}
				render={({field}) => (
					<FormItem>
						<FormLabel>Degree</FormLabel>
						<FormControl>
							<Input {...field} autoFocus />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name={`education.${index}.school`}
				render={({field}) => (
					<FormItem>
						<FormLabel>School</FormLabel>
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
					name={`education.${index}.startYear`}
					render={({field}) => (
						<FormItem>
							<FormLabel>Start year</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="number"
									placeholder="2025"
									value={field.value ?? ""}
									onChange={(e) => {
										const v = e.target.value;
										field.onChange(v === "" ? undefined : Number(v))
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={`education.${index}.startMonth`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Start month (optional)</FormLabel>
							<FormControl>
								<Select
									value={field.value?.toString() ?? ""}
									onValueChange={(value) => {
										field.onChange(value === "" ? undefined : Number(value));
									}}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="— Month —" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{MONTHS.map((m) => (
												<SelectItem key={m.value} value={m.value.toString()}>
													{m.label}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={`education.${index}.endYear`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>End year</FormLabel>
							<FormControl>
								<Input
									type="number"
									inputMode="numeric"
									placeholder="2026"
									value={field.value ?? ""}
									onChange={(e) => {
										const v = e.target.value;
										field.onChange(v === "" ? undefined : Number(v));
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name={`education.${index}.endMonth`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>End month (optional)</FormLabel>
							<FormControl>
								<Select
									value={field.value?.toString() ?? ""}
									onValueChange={(value) => {
										field.onChange(value === "" ? undefined : Number(value));
									}}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="— Month —" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{MONTHS.map((m) => (
												<SelectItem key={m.value} value={m.value.toString()}>
													{m.label}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<FormDescription>
				Leave <span className="font-semibold">end date</span> empty if you are currently studying here.
			</FormDescription>
			<Button variant="destructive" type="button" onClick={() => remove(index)}>
				Remove
			</Button>
		</div>
	)
}
