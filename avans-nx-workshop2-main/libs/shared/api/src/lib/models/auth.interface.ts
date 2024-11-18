/**
 * User information required for loggin in
 */
export interface IUserCredentials {
    emailAddress: string;
    password: string;
}

/**
 * User information required for registration
 */
export interface IUserRegistration extends IUserCredentials {
    name: string;
}

export interface IToken {
    token: string;
}
