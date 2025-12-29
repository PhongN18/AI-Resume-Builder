'use client'

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import {UserButton} from "@clerk/nextjs";
import {CreditCard} from "lucide-react";
import {ModeToggle} from "@/components/ModeToggle";
import {dark} from "@clerk/themes";
import { useTheme } from "next-themes";

const Navbar = () => {
	const { theme } = useTheme();

	return (
		<header className="shadow-sm">
			<div className="max-w-7xl mx-auto p-3 flex items-center justify-between gap-3">
				<Link href="/resumes" className="flex items-center gap-2">
					<Image src={logo} alt="Logo" width={40} height={40} className="rounded-full" />
					<span className="text-xl font-bold tracking-tights">AI Resume Builder</span>
				</Link>
				<div className="flex items-center gap-3">
					<ModeToggle />
					<UserButton
						appearance={{
							baseTheme: theme === "dark" ? dark : undefined,
							elements: {
								avatarBox: {
									width: 35,
									height: 35,
								}
							}
						}}
					>
						<UserButton.MenuItems>
							<UserButton.Link href="/billing" label="Billing" labelIcon={<CreditCard className="size-4" />} />
						</UserButton.MenuItems>
					</UserButton>
				</div>
			</div>
		</header>
	)
}
export default Navbar
