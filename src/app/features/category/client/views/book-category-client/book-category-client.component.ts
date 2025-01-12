import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { CategoryService } from '../../../services/category.service';
import { DataViewLazyLoadEvent } from 'primeng/dataview';
import { Subscription } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CartService } from 'src/app/features/loan/services/cart.service';
import { BookDetailComponent } from 'src/app/features/book/client/components/book-detail/book-detail.component';
import { BookClient } from 'src/app/features/book/client/interfaces/book-client.interface';


@Component({
  selector: 'app-book-category-client',
  templateUrl: './book-category-client.component.html',
  styleUrls: ['./book-category-client.component.scss']
})
export class BookCategoryClientComponent implements OnInit, OnDestroy {


  category_id!: string;


  api = environment.apiUrl;   
  
  books: BookClient[] = [];
  filteredBooks: BookClient[] = [];

  totalRecords: number = 0;
  loading: boolean = true;
  offset: number = 0; 
  readonly limit: number = 50; 

  ref: DynamicDialogRef | undefined;
  private subscriptions: Subscription = new Subscription(); 

  


  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private cartService: CartService,  
    public dialogService: DialogService,  
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
     
    if (this.ref) {
      this.ref.close();
    }
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      this.category_id = params['id'];      
    });


    const booksSubscription = this.categoryService.categoryBooksClientItems$.subscribe(items => {
      this.books = items;
      this.filteredBooks = [...this.books];      
    });

    this.subscriptions.add(booksSubscription);
  }

  addBooksToCart(book_id: string): void {


    const cartSubscription = this.cartService.addBooksToCart( book_id ).subscribe({
      next: ( resp ) => {

      },
      error: ( err ) => {

      },
      complete: () => {

      }
      
    });

    this.subscriptions.add(cartSubscription);
  }

  onClickDetail( data: any ){

    
    
    this.ref = this.dialogService.open( BookDetailComponent , {
      header: `Library app`,   
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


  findAllClientByCategory( $event: DataViewLazyLoadEvent ){


    const offset = $event.first ? $event.first / 50 : 0;

    this.loading = true;

    const findAllSubscription = this.categoryService.findAllClientByCategory( this.category_id, offset, this.limit ).subscribe({
      next: ( resp ) => {
        this.totalRecords = resp.total_records;

      },
      error: ( err ) => {

      },
      complete: ( ) => {
        this.loading = false;

      } 
    })

    this.subscriptions.add(findAllSubscription);


  }


  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  filterBooks(event: Event) {        
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredBooks = this.books.filter(book => 
        book.title.toLowerCase().includes(searchValue)
    );
  }



}
