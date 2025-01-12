import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { environment } from 'src/environments/environment.prod';
import { CartService } from 'src/app/features/loan/services/cart.service';
import { Subscription } from 'rxjs';
import { BookClient } from '../../interfaces/book-client.interface';
import { ToastService } from 'src/app/utils/services/toast.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit, OnDestroy {

  bookValue!: BookClient; 

  api = environment.apiUrl;   

  private subscriptions: Subscription = new Subscription();

  constructor(
    private config: DynamicDialogConfig<any>,
    private cartService: CartService,
    private toastService: ToastService
  ){}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
     
  }

  ngOnInit(): void {
    this.bookValue =  this.config.data ;
  }

  addBooksToCart(book_id: string): void {
    const cartSubscription = this.cartService.addBooksToCart( book_id ).subscribe({
      next: ( resp ) => {

      },
      error: ( err ) => {
        this.toastService.showError( 'Mensaje del sistema', ''  );

      },
      complete: () => {

      }
      
    });

    this.subscriptions.add(cartSubscription);
  }

}
