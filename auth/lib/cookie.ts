import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { OptionsType } from 'cookies-next/lib/types'

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/auth/constant/token_key'

import JWT from '../model/jwt'

/**
 *
 * @param options - 서버사이드에서 사용할 경우 options에 res: ServerResponse, req: IncomingMessage 값이 필요
 * @returns user jwt token: string | boolean | undefined | null
 */
const getAccessToken = (options?: OptionsType | undefined) => {
    return getCookie(ACCESS_TOKEN_KEY, options)
}

/**
 *
 * @param options - 서버사이드에서 사용할 경우 options에 res: ServerResponse, req: IncomingMessage 값이 필요
 * @returns
 */
const setAuthToken = (jwt: JWT, options?: OptionsType | undefined) => {
    setCookie(ACCESS_TOKEN_KEY, jwt.accessToken, {
        ...options,
        expires: jwt.accessExpriedDate,
    })
    setCookie(REFRESH_TOKEN_KEY, jwt.refreshToken, {
        ...options,
        expires: jwt.refreshExpiredDate,
    })
}

/**
 *
 * @param options - 서버사이드에서 사용할 경우 options에 res: ServerResponse, req: IncomingMessage 값이 필요
 * @returns user jwt token: string | boolean | undefined | null
 */
const getRefreshToken = (options?: OptionsType | undefined) => {
    return getCookie(REFRESH_TOKEN_KEY, options)
}

const clearAuthToken = () => {
    deleteCookie(ACCESS_TOKEN_KEY)
    deleteCookie(REFRESH_TOKEN_KEY)
}

export { getAccessToken, getRefreshToken, setAuthToken, clearAuthToken }
