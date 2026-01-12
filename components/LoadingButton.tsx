import {Button} from "./ui/button"
import React from 'react'
import {Loader2} from "lucide-react";
import {cn} from "@/lib/utils";

interface LoadingButtonProps extends React.ComponentProps<typeof Button>{
	loading: boolean,
}

const LoadingButton = ({
       loading,
       disabled,
       className,
       ...props
}: LoadingButtonProps) => {
	return (
		<Button
			disabled={loading || disabled}
			className={cn("flex items-center gap-2", className)}
			{...props}
		>
			{loading && <Loader2 className="size-5 animate-spin" /> }
			{props.children}
		</Button>
	)
}
export default LoadingButton
