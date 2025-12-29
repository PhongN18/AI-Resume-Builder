import React, {useEffect, useRef} from "react";
import {useForm, useWatch} from "react-hook-form";
import { personalInfoSchema, PersonalInfoValue } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {EditorFormProps} from "@/lib/types";
import {Button} from "@/components/ui/button";

const PersonalInfoForm = ({resumeData, setResumeData}: EditorFormProps) => {
	const form = useForm<PersonalInfoValue>({
		resolver: zodResolver(personalInfoSchema),
		mode: "onChange", // ✅ no manual trigger needed
		defaultValues: {
			firstName: resumeData.firstName || "",
			lastName: resumeData.lastName || "",
			jobTitle: resumeData.jobTitle || "",
			city: resumeData.city || "",
			country: resumeData.country || "",
			phone: resumeData.phone || "",
			email: resumeData.email || "",
		},
	});

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

	const photoInputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="max-w-xl mx-auto space-y-6">
			<div className="space-y-1.5 text-center">
				<h2 className="text-2xl font-semibold">Personal Info</h2>
				<p className="text-sm text-muted-foreground">Tell us about yourself.</p>
			</div>

			<Form {...form}>
				<form className="space-y-3">
					<FormField
						control={form.control}
						name="photo"
						render={({ field: { value, ...fieldValues } }) => (
							<FormItem>
								<FormLabel>Your photo</FormLabel>
								<div className="flex items-center gap-2">
									<FormControl>
										<Input
											{...fieldValues}
											ref={photoInputRef}
											type="file"
											accept="image/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												fieldValues.onChange(file);
											}}
										/>
									</FormControl>
									<Button
										variant="secondary"
										type="button"
										onClick={() => {
											fieldValues.onChange(null)
											if (photoInputRef.current) {
												photoInputRef.current.value = ""
											}
										}}
									>
										Remove
									</Button>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-3">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="jobTitle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Job Title</FormLabel>
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
							name="city"
							render={({ field }) => (
								<FormItem>
									<FormLabel>City</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="country"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<Input {...field} type="tel" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input {...field} type="email" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</div>
	);
};

export default PersonalInfoForm;
