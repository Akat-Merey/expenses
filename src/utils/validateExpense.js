function validateExpense(data, isPatch = false) {
    const { title, amount, category } = data;
    const errors = [];

    if(!isPatch || title != undefined) {
        if (typeof title !=='string' || title.trim() === '') {
            errors.push('title is required and must be noot empty');
        }
    }

    if(!isPatch || amount != undefined) {
        if (typeof amount !=='number' || Number.isNaN(amount)) {
            errors.push('amount must be a vlaid number');
        } else if (amount <= 0) {
            errors.push('amount must be greater than 0');
        }
    }

    if (category !== undefined && typeof category !== 'string') {
        errors.push('category must be a string');
    }

    return errors;
}

module.exports = validateExpense;