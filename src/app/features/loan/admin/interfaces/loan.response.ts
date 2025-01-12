import { Loan } from "./loan.interface";

export interface LoanResponse {
    status:  boolean;
    message: string;
    data:    Loan[];
    total_records: number;
}
