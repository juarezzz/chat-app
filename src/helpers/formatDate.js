export default function formatDate(date) {
    const day = date.getDate();
    const formattedDay = day < 10 ? '0' + day : day
    const month = date.getMonth() + 1
    const formattedMonth = month < 10 ? '0' + month : month
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return `${formattedDay}/${formattedMonth} - ${time}`
}