import { BookClient } from "./book-client.interface";

export interface BookResponseClient {
    status:  boolean;
    message: string;
    data:    BookClient[];
    total_records: number;
}
