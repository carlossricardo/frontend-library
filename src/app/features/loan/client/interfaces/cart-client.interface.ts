import { BookClient } from "src/app/features/book/client/interfaces/book-client.interface";

export interface CartItems {
    id:       string;
    quantity: number;
    book:     BookClient;
}


export interface LoanCart {
    date_returned: Date;
    total_units: number;
    note: string;

}
  