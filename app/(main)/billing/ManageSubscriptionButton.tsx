'use client'

import {toast} from "sonner"
import {useState} from "react";
import LoadingButton from "@/components/LoadingButton";
import {createCustomerPortalSession} from "@/app/(main)/billing/actions";

export default function ManageSubscriptionButton() {
	const [loading, setLoading] = useState(false)

	async function handleClick() {
		try {
			setLoading(true)
			window.location.href = await createCustomerPortalSession()
		} catch (e) {
			console.error(e)
			toast.error("", {
				description: "Something went wrong. Please try again later.",
			})
		} finally {
			setLoading(false)
		}
	}

	return <LoadingButton onClick={handleClick} loading={loading}>
		Manage subscription
	</LoadingButton>
}