function validateId(id) {
    const parseId = Number(id);

    if (!Number.isInteger(parseId) || parseId <= 0) {
        return null;
    }

    return parseId;
}

module.exports = validateId;