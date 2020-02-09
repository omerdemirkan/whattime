export default date => {
    const parsedDate = new Date(date);
    const minutes = parsedDate.getMinutes();
    
    const hours = parsedDate.getHours() % 12;
    return (hours !== 0 ? hours : '12') + ':' + (minutes < 10 ? '0' : '') + minutes + (parsedDate.getHours() >= 12 ? 'PM' : 'AM');
}