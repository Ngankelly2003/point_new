import { error } from "./logger";


export const storageGet = (key: string, parseItem: boolean = false) => {
    try {
        const valueStr = localStorage.getItem(key)
        if (!valueStr) return null;
        if (parseItem) return JSON.parse(valueStr)
        return valueStr;
    } catch (err) {
        error(`Error get storage data [${key}]`, err)
        return null;
    }
}

export const storageSet = (key: string, value: string) => {
    localStorage.setItem(key, value);
    window.dispatchEvent(new CustomEvent('storage', { detail: key }))
}

export const storageRemove = (key: string) => {
    return localStorage.removeItem(key)
}