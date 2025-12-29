import React, {useEffect, useState} from "react";


export default function useDimensions(containerRef: React.RefObject<HTMLDivElement | null>): { w: number, h: number } {
	const [dimensions, setDimensions] = useState({ w: 0, h: 0 })

	useEffect(() => {
		const currentRef = containerRef.current
		if (!currentRef) return

		function getDimensions() {
			return {
				w: currentRef?.offsetWidth || 0,
				h: currentRef?.offsetHeight || 0,
			}
		}

		const resizeObserver = new ResizeObserver(entries => {
			const entry = entries[0]
			if (entry) {
				setDimensions(getDimensions())
			}
		})

		if (currentRef) {
			resizeObserver.observe(currentRef)
			setDimensions(getDimensions())
		}

		return () => {
			if (currentRef) {
				resizeObserver.unobserve(currentRef)
			}
			resizeObserver.disconnect()
		}
	}, [containerRef]);

	return dimensions
}
