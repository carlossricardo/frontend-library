import { User } from "./user.interface";


export interface UserResponse {
    status: boolean;
    message: string;
    data: User[];
    total_records: number;
}