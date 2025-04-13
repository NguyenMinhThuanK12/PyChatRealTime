export function extractTime(dateString) {
    const date = new Date(dateString);
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${hours}:${minutes}`;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
    return number.toString().padStart(2, "0");
}

export function formatMessageTime(messageTime) {
    const currentTime = new Date();

    const diffInMillis = currentTime - messageTime + 500;

    // Convert difference to minutes
    const diffInMinutes = Math.floor(diffInMillis / (1000 * 60));

    if (diffInMinutes < 60) {
        return `${diffInMinutes}m`; // Less than 60 minutes ago
    } else if (diffInMinutes < 1440) {
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours}h`; // Less than 24 hours ago
    } else {
        // More than a day ago, format as "dd/mm"
        const options = { day: '2-digit', month: '2-digit' };
        return messageTime.toLocaleDateString('vi-VN', options);
    }
}