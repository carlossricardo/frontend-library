import { Book } from "src/app/features/book/admin/interfaces/book.interface";
import { User } from "src/app/features/user/admin/interfaces/user.interface";

export interface Loan {
    id:      string;
    status:  string;
    note:  string;
    user: User;
    details: LoanDetail[];
    total_units:   number;
    date_returned: Date;
    created_at: Date;
    updated_at: Date;
}



export interface LoanDetail {
    id:         string;
    loan_id:    string;
    book:    Book;
    quantity:   number;
    created_at: Date;
    updated_at: Date;
}