import { redirect } from "react-router-dom";
import { customToast } from "./customToast";

export const getAuthToken = () => {
	const auth = localStorage.getItem("auth");

	if (!auth) {
		return null;
	}

	// const tokenDuration = getTokenDuration();
	// if (tokenDuration < 0) {
	// 	return "EXPIRED";
	// }

	return auth;
};

export const tokenLoader = () => {
	return getAuthToken();
};

export const authChecker = () => {
	if (window.location.pathname == "/") {
		setTimeout(() => {
			customToast({ type: "error", message: "Please login to continue" })
		}, 1);
		return redirect("/login");
	}
	// if()
	if (!getAuthToken()) {
		console.log("not login yet")
		setTimeout(() => {
			customToast({ type: "error", message: "Please login to continue" })
		}, 1);
		return redirect("/login");
	}
	return null;
};