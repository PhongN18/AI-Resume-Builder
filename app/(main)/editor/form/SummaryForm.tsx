import React, {useEffect} from 'react'
import {EditorFormProps} from "@/lib/types";
import {useForm, useWatch} from "react-hook-form";
import {summarySchema, SummaryValues} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import GenerateSummaryButton from "@/app/(main)/editor/form/GenerateSummaryButton";

const SummaryForm = ({resumeData, setResumeData}: EditorFormProps) => {
	const form = useForm<SummaryValues>({
		resolver: zodResolver(summarySchema),
		defaultValues: {
			summary: resumeData.summary || ""
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
				<h2 className="font-semibold text-2xl">Professional summary</h2>
				<p className="text-sm text-muted-foreground">
					Write a short introduction for your resume or let the AI generate one from your entered data.
				</p>
			</div>
			<Form {...form}>
				<form>
					<FormField
						control={form.control}
						name="summary"
						render={({field}) => (
							<FormItem>
								<FormLabel>Professional summary</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										placeholder="A brief, engaging text about yourself"
									/>
								</FormControl>
								<FormMessage />
								<GenerateSummaryButton
									resumeData={resumeData}
									onSummaryGenerated={summary => form.setValue("summary", summary)}
								/>
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</div>
	)
}
export default SummaryForm
