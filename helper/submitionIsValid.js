
const availableIsValid = (available, date) => {
    try {
        const length = available.length;
        if (length > 20 || length % 2 !== 0) {
            console.log('failed available array length test');
            return false;
        }

        // Checking if available is sorted and that no two epochs are the same.
        let isSorted = true;
        available.forEach((epoch, index) => {
            if (index < length - 1 && epoch + 60 >= available[length + 1]) {
                console.log('failed available array sorted test');
                isSorted = false;
            }
        });

        if (!isSorted) {
            return false;
        }

        // Checking if given availabilities are within the given timeframe
        const start = date.getTime();
        const end = start + 86400000;
        console.log(start);

        if (available[0] < start || available[length - 1] > end) {
            console.log(start - available[0]);
            return false;
        }
        
        return true
    }
    catch(err) {
        return false;
    }
}

const nameIsValid = name => {
    return typeof name === 'string' && name.length >= 3 && name.length <= 30;
}

module.exports = (submition, date) => {
    console.log(nameIsValid(submition.name), availableIsValid(submition.available, date));

    if (!submition.name || !submition.available) return false;

    return (nameIsValid(submition.name) && availableIsValid(submition.available, date))
}