const uuid = (() => {
    let i = 0
    return (key: string) => {
        i++
        return `__UUID_${key}_number_${i}`
    }
})

export default uuid
