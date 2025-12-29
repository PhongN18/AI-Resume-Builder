import {useForm, useWatch} from "react-hook-form";
import {generalInfoSchema, GeneralInfoValue} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {EditorFormProps} from "@/lib/types";
import {useEffect} from "react";


const GeneralInfoForm = ({resumeData, setResumeData}: EditorFormProps) => {
	const form = useForm<GeneralInfoValue>({
		resolver: zodResolver(generalInfoSchema),
		defaultValues: {
			title: resumeData.title || "",
			description: resumeData.description || ""
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

	return (
		<div className="max-w-xl mx-auto space-y-6">
			<div className="space-y-1.5 text-center">
				<h2 className="text-2xl font-semibold">General Info</h2>
				<p className="text-sm text-muted-foreground">
					This will not appear on your resume
				</p>
			</div>
			<Form {...form} >
				<FormField
					control={form.control}
					name="title"
					render={({field}) => (
						<FormItem>
							<FormLabel>Project name:</FormLabel>
							<FormControl>
								<Input {...field} placeholder="My cool resume" autoFocus />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({field}) => (
						<FormItem>
							<FormLabel>Description:</FormLabel>
							<FormControl>
								<Input {...field} placeholder="A resume for my next job" />
							</FormControl>
							<FormDescription>
								Describe what the resume is for.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</Form>
		</div>
	)
}
export default GeneralInfoForm
