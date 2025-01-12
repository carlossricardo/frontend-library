import { Category } from "./category.interface";

export interface CategoryResponse {
    status:  boolean;
    message: string;
    data:    Category[];
    total_records: number;
}
