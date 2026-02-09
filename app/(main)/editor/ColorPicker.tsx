import {Color, ColorChangeHandler, TwitterPicker} from "react-color"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {PaletteIcon} from "lucide-react";
import {useState} from "react";
import {useSubscriptionLevel} from "@/app/(main)/SubscriptionLevelProvider";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";

interface ColorPickerProps {
	color: Color | undefined,
	onChange: ColorChangeHandler
}

const ColorPicker = ({color, onChange}: ColorPickerProps) => {
	const [showPopover, setShowPopover] = useState(false);
	const subscriptionLevel = useSubscriptionLevel()
	const premiumModal = usePremiumModal()

	return (
		<Popover open={showPopover} onOpenChange={setShowPopover}>
			<PopoverTrigger asChild>
				<Button
			        size="icon"
					title="Change resume color"
					onClick={() => {
						if (!canUseCustomizations(subscriptionLevel)) {
							premiumModal.setOpen(true)
						}
						setShowPopover(true)
					}}
				>
					<PaletteIcon className="size-5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="border-none bg-transparent shadow-none"
				align="end"
			>
				<TwitterPicker
					color={color}
					onChange={onChange}
					triangle="top-right"
				/>
			</PopoverContent>
		</Popover>
	)
}
export default ColorPicker
