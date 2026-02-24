import useCalculateProgress from "@/hooks/useCalculateProgress";
import { getCurrentTheme } from "@/lib/utils";

export default function ProgressBar() {
	const { percentage } = useCalculateProgress();
	const percent = percentage || 0;

	const isDark = getCurrentTheme() === "dark";

	const getThemeColors = (p: number) => {
		if (p < 10) return { bg: "bg-red-600", text: isDark ? "text-red-400" : "text-red-600" };
		if (p < 20) return { bg: "bg-red-500", text: isDark ? "text-red-400" : "text-red-500" };
		if (p < 30) return { bg: "bg-orange-600", text: isDark ? "text-orange-400" : "text-orange-600" };
		if (p < 40) return { bg: "bg-orange-500", text: isDark ? "text-orange-400" : "text-orange-500" };
		if (p < 50) return { bg: "bg-yellow-500", text: isDark ? "text-yellow-400" : "text-yellow-600" };
		if (p < 60) return { bg: "bg-yellow-400", text: isDark ? "text-yellow-300" : "text-yellow-500" };
		if (p < 70) return { bg: "bg-amber-500", text: isDark ? "text-amber-400" : "text-amber-500" };
		if (p < 80) return { bg: "bg-lime-500", text: isDark ? "text-lime-400" : "text-lime-500" };
		if (p < 90) return { bg: "bg-green-500", text: isDark ? "text-green-400" : "text-green-500" };
		return { bg: "bg-emerald-600", text: isDark ? "text-emerald-400" : "text-emerald-600" };
	};

	const { bg, text } = getThemeColors(percent);
	const trackBg = isDark ? "bg-gray-700" : "bg-gray-200";

	return (
		<div className="mb-10">
			<div className={`flex justify-between mb-1 font-medium ${text}`}>
				<span className="text-base">Progresso do Curso</span>
				<span className="text-sm">{percent.toFixed(2)}%</span>
			</div>

			<div className={`w-full rounded-full h-2.5 ${trackBg}`}>
				<div className={`h-2.5 rounded-full transition-all duration-500 ${bg}`} style={{ width: `${percent}%` }}></div>
			</div>
		</div>
	);
}
