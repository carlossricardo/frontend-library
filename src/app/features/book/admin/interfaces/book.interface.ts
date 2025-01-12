

export interface Book {
    id?:          string;
    title:       string;
    description: string;
    created_at?:  Date;
    updated_at?:  Date;
    image: string;
    autor: string;
    status: number;
    // status: boolean;
    emission: Date;
    units: number;
    categories:  string[];
}

