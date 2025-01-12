import { User } from "./user.interface";


export interface AuthResponse {
    status: boolean;
    message: string;
    token: string;
}

export interface CheckStatusResponse {
    status: boolean;
    message: string;
    data: User;
}