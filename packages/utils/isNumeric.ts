const isNumeric = (value: number | string): boolean => {
    if (typeof value === 'string') {
        return !isNaN(parseFloat(value))
    }
    return isFinite(value)
}

export default isNumeric
