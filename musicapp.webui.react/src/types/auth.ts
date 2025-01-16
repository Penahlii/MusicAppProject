export interface SignInDTO {
    userName: string;
    password: string;
}

export interface SignUpDTO {
    userName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    expiration: string;
}

export interface UserClaims {
    name: string;
    email: string;
    nameIdentifier: string;
}
