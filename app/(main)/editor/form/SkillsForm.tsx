import React, {useEffect} from 'react'
import {EditorFormProps} from "@/lib/types";
import {useForm, useWatch} from "react-hook-form";
import {skillSchema, SkillValues} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";

const SkillsForm = ({resumeData, setResumeData}: EditorFormProps) => {
	const form = useForm<SkillValues>({
		resolver: zodResolver(skillSchema),
		defaultValues: {
			skills: resumeData.skills || []
		}
	})

	const watchedValues = useWatch({ control: form.control });
	const { isValid } = form.formState;

	useEffect(() => {
		if (!isValid) return;
		if (!watchedValues) return;

		setResumeData(prev => ({
			...prev,
			skills: watchedValues.skills?.filter(s => s !== undefined)
				.map(s => s.trim())
				.filter(s => s !== "") || [],
		}));
	}, [watchedValues, isValid, setResumeData]);

	return (
		<div className="max-w-xl mx-auto space-y-6">
			<div className='space-y-1.5 text-center'>
				<h2 className="text-2xl font-semibold">Skills</h2>
				<p className="text-sm text-muted-foreground">What are you good at?</p>
			</div>
			<Form {...form}>
				<form className="space-y-3">
					<FormField
						control={form.control}
						name="skills"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="sr-only">Skills</FormLabel>
								<FormControl>
									<Textarea
										value={field.value?.join(",") || ""}
										placeholder="e.g. ReactJS, NodeJS, Graphic Design, ..."
										onChange={e => {
											const skills = e.target.value.split(",");
											field.onChange(skills)
										}}
									/>
								</FormControl>
								<FormDescription>
									Separate each skill with a comma &#34;,&#34; .
								</FormDescription>
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</div>
	)
}
export default SkillsForm
