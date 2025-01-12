
export interface Category {
    id?:          string;
    code:          string;
    name:        string;
    description: string;
    created_at?:  Date;
    updated_at?:  Date;
    status: number;
}