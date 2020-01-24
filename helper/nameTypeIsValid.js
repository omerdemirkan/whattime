module.exports = nameType => {
    if (nameType === 'Name' 
    || nameType === 'First Name'
    || nameType === 'Full Name' 
    || nameType === 'Alias') return true;

    return false;
}