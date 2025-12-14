import { useUIStore } from "@/store/uiStore";

export default function Popup() {
	const message = useUIStore((state) => state.message);

	if (!message) return null;

	return (
		<div className="fixed top-4 right-4 flex flex-col gap-3 z-999 max-w-[400px]">
			<div className="popup-message-error">{message}</div>
		</div>
	);
}
