export default function formatTime(secs) {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const formattedSeconds = seconds > 9 ? seconds : `0${seconds}`
    return `${minutes}:${formattedSeconds}`
}