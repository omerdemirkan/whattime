
const availableIsValid = available => {
    try {
        const length = available.length;
        if (length > 20 || length % 2 !== 0) {
            return false;
        }

        return true;
    }
    catch(err) {
        return false;
    }
}

const nameIsValid = name => {
    return true;
}

module.exports = submition => {
    if (nameIsValid(submition.name) && availableIsValid(submition.available)) {
        return true;
    } else {
        return false;
    }
}