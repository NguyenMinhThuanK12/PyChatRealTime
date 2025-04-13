import { createContext, useEffect, useMemo, useReducer } from "react";
export const AuthContext = createContext()

const initialState = {
	user: JSON.parse(localStorage.getItem('user')) || null,
	auth: JSON.parse(localStorage.getItem('auth')) || false,
}

const reducer = (state, action) => {
	switch (action.type) {
		case "LOGIN":
			return {
				...state,
				user: action.value,
				auth: true,
			}
		case "LOGOUT":
			return {
				...state,
				user: null,
				auth: false
			}
		default:
			break;
	}
}

export const AuthProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState)
	const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}