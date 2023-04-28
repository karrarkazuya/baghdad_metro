function updateTime() {
    // Get current date and time
    const now = new Date();

    // Get hours, minutes, and seconds
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Determine if it's AM or PM
    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If the hour is 0, it should be 12

    // Format time
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${amOrPm}`;

    // Update time in HTML
    document.getElementById('time').textContent = time;
}

// Update time every second
setInterval(updateTime, 1000);
