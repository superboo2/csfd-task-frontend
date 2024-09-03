import { BASE_URL_BACKEND } from './config.js'

export function getServiceUrl(serviceName) {
    return new URL(BASE_URL_BACKEND + serviceName)
}
export function getUrlWithFilterWithFilter(serviceName, filter) {
    const url = getServiceUrl(serviceName)

    if (filter) {
        const entries = Object.entries(filter)
        for (let [key, value] of entries) {
            url.searchParams.append(key, value)
        }
    }

    return url
}
