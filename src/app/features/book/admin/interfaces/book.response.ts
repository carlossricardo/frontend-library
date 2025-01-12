import { Book } from "./book.interface";


export interface BookResponse {
    status:  boolean;
    message: string;
    data:    Book[];
    total_records: number;
}