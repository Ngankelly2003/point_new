import { UserLoginType } from "../UserType"


export type LoginType = {
    accessToken: string, 
    refreshToken: string,
    expires?: Date,
    user: UserLoginType
    permission?: string,
}

export type RequestLoginType = {
    username: string,
    password: string
}

export type ResponseLoginType = {
    success: boolean,
    result: LoginType,
    errors: string[]
}

