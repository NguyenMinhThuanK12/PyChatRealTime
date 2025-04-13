import { toast } from "react-toastify";
export const customToast = ({ type, message }) => {
	if (type === "success") {
		toast.success(message);
	} else if (type === "info") {
		toast.info(message);
	} else {
		toast.error(message);
	}
};