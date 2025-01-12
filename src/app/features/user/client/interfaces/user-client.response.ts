import { UserClient } from "./user-client.interface";

export interface UserResponseClient {

    status: boolean;
    message: string;
    data: UserClient;
}