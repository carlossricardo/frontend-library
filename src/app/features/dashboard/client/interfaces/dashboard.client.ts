export interface ResponseDashboardClient {
    status:  boolean;
    message: string;
    data:    Data[];
    carrousel: Carrousel[];
}

export interface Data {
    name:  string;
    icon:  string;
    value: number;
    color:  string;
}

export interface Carrousel {
    title:  string;
    image:  string;
    description: number;
    units:  string;
    autor:  string;
}
