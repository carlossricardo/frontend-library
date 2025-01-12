import { CartItems } from "./cart-client.interface";

export interface CartResponseClient {
    status:  boolean;
    message: string;
    data:    CartItems[];
}

export interface CartItemResponseClient {
    status:  boolean;
    message: string;
    data:    CartItems;
}