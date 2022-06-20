export const warn = (valid: boolean, message: string) => {
    if (process.env.NODE_ENV === 'development' && !valid && console !== undefined) {
        console.warn(`Warning: ${message}`)
    }
}

export const devWarn = (valid: boolean, component: string, message: string) => {
    warn(valid, `[Wanderer design vue: ${component}] ${message}`)
}
