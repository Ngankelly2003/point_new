export const debug = (message?: any, ...optionalParams: any[]): void => {
    if (!process.env.NEXT_PUBLIC_PRODUCT) {
        if (optionalParams) {
            console.log(message, optionalParams)
        } else {
            console.log(message)
        }
    }
}

export const error = (message?: any, ...optionalParams: any[]): void => {
    if (optionalParams) {
        console.error(message, optionalParams)
    } else {
        console.error(message)
    }
}

export const warn = (message?: any, ...optionalParams: any[]): void => {
    if (optionalParams) {
        console.warn(message, optionalParams)
    } else {
        console.warn(message)
    }
}