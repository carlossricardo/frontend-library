import { BookClient } from "src/app/features/book/client/interfaces/book-client.interface";
import { UserClient } from "src/app/features/user/client/interfaces/user-client.interface";

export interface LoanClient {
    id:      string;
    status:  string;
    user: UserClient;
    reviewer: UserClient;
    details: LoanDetail[];
    total_units:   number;
    note:   string;
    date_returned: Date;
    created_at: Date;
    updated_at: Date;
}

export interface LoanDetail {
    id:         string;
    loan_id:    string;
    book:    BookClient;
    quantity:   number;
    created_at: Date;
    updated_at: Date;
}