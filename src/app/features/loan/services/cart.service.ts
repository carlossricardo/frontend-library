import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

import { HttpClient } from '@angular/common/http';
import { CartItems, LoanCart } from '../client/interfaces/cart-client.interface';
import { LoanResponseClient } from '../client/interfaces/loan-client.response';
import { CartItemResponseClient, CartResponseClient } from '../client/interfaces/cart-client.response';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemsSubject = new BehaviorSubject<CartItems[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  
  private cartItemCount = new BehaviorSubject(0);
  public carItemsCount$ = this.cartItemCount.asObservable();

  api = environment.apiUrl;

  constructor(
    private http : HttpClient,
  ) {
    
    this.findAllCart().subscribe({});

  }


  sendCartItemsToLoan( data: LoanCart ){
    const url = `${this.api}/administration/client/cart/book`;
    return this.http.post<LoanResponseClient>(url, data );
  }


  findAllCart(){

    const url = `${this.api}/administration/client/cart/books`;
    return this.http.get<CartResponseClient>(url)
      .pipe(
        map((item) => {
          if (item.status === true && item.data.length > 0) {          
            this.cartItemsSubject.next(item.data);                
            const totalItemsCount = item.data.reduce((total, currentItem) => total + (currentItem.quantity || 0), 0);                
            this.cartItemCount.next(totalItemsCount);
          } else {
            
            this.cartItemsSubject.next([]);
            this.cartItemCount.next(0);
          }
    
          return item;
        })
      );

  }

  removeAllCartItems(){

    const url = `${this.api}/administration/client/cart/book/removeAll`;
    return this.http.get<CartResponseClient>(url).pipe(
      map((resp) => {
        if (resp.status && resp.data === null) {           
          this.cartItemsSubject.next([]);
          this.cartItemCount.next(0);
        }
        return resp; 
      }),

    );

  }

  addBooksToCart( book_id: string ){
    const url = `${this.api}/administration/client/cart/book/add?book_id=${book_id}&quantity=1`;
    return this.http.get<CartItemResponseClient>(url)
      .pipe(
        map( (resp ) => {

          if (!resp.status) {
            return;
          }
    
          const updatedItem = resp.data;
          let currentItems = this.cartItemsSubject.value;
    
          const existingItem = currentItems.find((item) => item.book.id === updatedItem.book.id );
              
          if (existingItem) {
            currentItems = currentItems.map((item) =>
              item.id === updatedItem.id                
                ? { ...item, quantity: updatedItem.quantity }
                : item
            );
          }
          
          if (!existingItem) {
            const newItem: CartItems = {
              id: updatedItem.id,
              quantity: updatedItem.quantity,
              book: {
                id: updatedItem.book.id,
                title: '',
                description: '',
                categories: [],
                autor: '',
                image: '',
                status: 1,
                units: 0,
                emission: new Date(),
              },
            };
            currentItems = [...currentItems, newItem];
          }
          
          this.cartItemsSubject.next(currentItems);
          this.cartItemCount.next(this.cartItemCount.value + 1);                    
          return resp;
        })
      );

  }

  reduceBooksToCart( cart_id: string ){
    const url = `${this.api}/administration/client/cart/book/reduce?cart_id=${cart_id}`;
  
    return this.http.get<CartItemResponseClient>(url).pipe(
      map((resp) => {

        if (!resp.status) {
          return;
        }

        const updatedItem = resp.data;
  
        const updatedList = this.cartItemsSubject.value
          .map(item => {
            if (updatedItem && item.book.id === updatedItem.book.id) {
              return { ...item, quantity: updatedItem.quantity };
            }
            return item;
          })
          .filter(item => {
                     
            return !(item.id === cart_id && !updatedItem);
            
          });
          
        this.cartItemsSubject.next(updatedList);
        this.cartItemCount.next(this.cartItemCount.value - 1);
  
        return resp;
      })
    );


  }

  removeCartItemBook( cart_id: string ){

    const url = `${this.api}/administration/client/cart/book/remove?cart_id=${cart_id}`;

    return this.http.get<CartResponseClient>(url).pipe(
      map((resp) => {
        if (resp.status) {
          const cartItems = this.cartItemsSubject.value;
  
          const itemToRemove = cartItems.find(item => item.id === cart_id);
  
          if (itemToRemove) {            
            const updatedList = cartItems.filter(item => item.id !== cart_id);
            this.cartItemsSubject.next(updatedList);
              
            const updatedCount = this.cartItemCount.value - itemToRemove.quantity;
            this.cartItemCount.next(updatedCount > 0 ? updatedCount : 0);
          }
        }
  
        return resp;
      })
    );


  }


  clearCartItems(): void {
    this.cartItemsSubject.next([]);
    this.cartItemCount.next(0);
  }

  getCartItemCount() {
    return this.cartItemCount;
  }
}
