export interface User {

    firstName: string,
    lastName: string,
    email: string,
    password: string,
    id?: number|undefined,
}

export interface UserLogin {
    email: string,
    password: string
}