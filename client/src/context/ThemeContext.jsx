import { createContext, useEffect, useState } from 'react'

const initialState = {
	themeColor: "light"
}

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {

	const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
	const changeCurrentTheme = (newTheme) => {
		setTheme(newTheme)
		localStorage.setItem('theme', newTheme)
	}
	useEffect(() => {
		if (theme == "light") {
			document.documentElement.classList.remove("dark");
		} else {
			document.documentElement.classList.add("dark");
		}
		console.log(theme)
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ currentTheme: theme, changeCurrentTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}