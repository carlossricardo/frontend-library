import { LoanClient } from "./loan-client.interface";

export interface LoanResponseClient {
    status:  boolean;
    message: string;
    data: LoanClient[];
}