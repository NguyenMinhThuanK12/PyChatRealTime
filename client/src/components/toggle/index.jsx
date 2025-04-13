import { useEffect, useState } from "react";
import { useThemeContext } from "../../hooks/useThemeContext";

const Index = () => {
	const { currentTheme, changeCurrentTheme } = useThemeContext()
	const [enabled, setEnabled] = useState(false);

	return (
		<div className="relative flex flex-col items-center justify-center overflow-hidden">
			<div className="flex">
				<label className="inline-flex relative items-center cursor-pointer">
					<input
						type="checkbox"
						className="sr-only peer"
						checked={currentTheme === 'light' ? false : true}
						readOnly
					/>
					<div
						onClick={() => {
							setEnabled(!enabled);
							changeCurrentTheme(enabled ? "light" : "dark")
						}}
						className="w-14 h-8 bg-gray-200 rounded-full peer peer-focus:ring-primary-600 peer-checked:after:translate-x-[85%] peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-primary"
					></div>
				</label>
			</div>
		</div>
	);
}

export default Index