import { CategoryClient } from "./category-client.interface";


export interface CategoryResponseClient {
    status:  boolean;
    message: string;
    data:    CategoryClient[];
    total_records: number;
}