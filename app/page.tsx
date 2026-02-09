import Image from "next/image";
import logo from "@/public/logo.png";
import resumePreview from "@/public/resume-preview.jpg"
import Link from "next/link";
import {Button} from "@/components/ui/button";

const Home = () => {
	console.log(`
  ****   ****
 ****** ******
***************
 *************
  ***********
   *********
    *******
     *****
      ***
       *
     _
    /_/
   __    _   _  _   _
  /  \\  | \\ | || |_| |
 / /\\ \\ |  \\| ||  _  |
/_/  \\_\\|_|\\__||_| |_|

             _       _ 
 ___   _   _/ / ___/ / _   _   ____
|   \\ | | |  / / _  / | \\ | | /    \\
| |) )| \\_/ | ( (_) ) |  \\| |(     __
|___/  \\___/   \\___/  |_|\\__| \\____/
	`)

	return (
		<main className="flex min-h-screen flex-col items-center justify-cển gap-6 bg-gray-100 px-5 py-12 text-gray-900 text-center md:text-start md:flex-row lg:gap-12">
			<div className="max-w-prose">
				<Image
					src={logo}
					alt="logo"
					width={150}
					height={150}
					className="mx-auto md:mx-0"
				/>
				<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl scroll-m-20">
					Create the{" "}
					<span
						className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent"
					>
						Perfect Resume
					</span>
					{" "}in Minutes
				</h1>
				<p className="text-lg text-gray">
					Our <span className="font-bold">AI Resume Builder</span> helps you design a professional resume without breaking a sweat
				</p>
				<Button asChild size="lg" variant="premium">
					<Link href='/resumes'>Get started</Link>
				</Button>
			</div>
			<div>
				<Image
					src={resumePreview}
					alt="resume preview"
					width={600}
					className="shadow-md lg:rotate-[1.5deg]"
				/>
			</div>
		</main>
	)
}
export default Home
