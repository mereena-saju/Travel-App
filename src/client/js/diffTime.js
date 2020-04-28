function calculateTimeDiff(now,departDate) {
    if (departDate.getTime() < now.getTime()) {
        return 'Error: invalid dates';
    } else {
        const timeDiff = departDate.getTime() - now.getTime();
        const diffInDays = timeDiff / (1000 * 3600 * 24);
        return diffInDays.toFixed(0);
    }
}
export { calculateTimeDiff }