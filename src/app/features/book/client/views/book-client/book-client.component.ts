import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../../services/book.service';

import { DataViewLazyLoadEvent } from 'primeng/dataview';
import { environment } from 'src/environments/environment.prod';
import { CartService } from 'src/app/features/loan/services/cart.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BookDetailComponent } from '../../components/book-detail/book-detail.component';
import { Subscription } from 'rxjs';
import { BookClient } from '../../interfaces/book-client.interface';
import { ToastService } from 'src/app/utils/services/toast.service';

@Component({
  selector: 'app-book-client',
  templateUrl: './book-client.component.html',
  styleUrls: ['./book-client.component.scss']
})
export class BookClientComponent implements OnInit, OnDestroy {

  api = environment.apiUrl;   
  
  books: BookClient[] = [];
  totalRecords: number = 0;
  loading: boolean = true;
  offset: number = 0; 

  @ViewChild('dv', { static: false }) dataView?: DataView;  
  readonly limit: number = 50; 
  ref: DynamicDialogRef | undefined;

  filteredBooks: BookClient[] = [];

  private subscriptions: Subscription = new Subscription(); 

  constructor(
    private bookService: BookService,    
    private cartService: CartService,    
    public dialogService: DialogService,
    private toastService: ToastService
  ){


  }
  ngOnDestroy(): void {

     
     this.subscriptions.unsubscribe();
     
     if (this.ref) {
       this.ref.close();
     }
  }


  ngOnInit(): void {

    const booksSubscription = this.bookService.booksItemsClient$.subscribe(items => {
      this.books = items;
      this.filteredBooks = [...this.books];
    });
    
    this.subscriptions.add(booksSubscription);
    
  }

  filterBooks(event: Event) {        
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredBooks = this.books.filter(book => 
        book.title.toLowerCase().includes(searchValue)
    );
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

  loadBooks( $event: DataViewLazyLoadEvent ){

    const offset = $event.first ? $event.first / 50 : 0;

    this.loading = true;

    const loadSubscription =  this.bookService.loadBooksClient(offset, this.limit).subscribe({
      next: ( resp ) => {              
        this.totalRecords = resp.total_records;
        
        this.loading = false;           
      },
      error: (err) => {
        
        this.loading = false;
        this.toastService.showError( 'Mensaje del sistema', ''  );
      },
    });


    this.subscriptions.add(loadSubscription);

  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  onClickDetail( data: BookClient ){

    
    
    this.ref = this.dialogService.open( BookDetailComponent , {
      header: `${ data.title }`,   
      data: data,
      contentStyle: { overflow: 'auto' },
      // baseZIndex: 10000,
      maximizable: false,
      
      styleClass: '',
      closeOnEscape: false,

      width: '50vw',
      // height: '60vh',
      modal:true,
      breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
      },
    });




    
  }




  

}