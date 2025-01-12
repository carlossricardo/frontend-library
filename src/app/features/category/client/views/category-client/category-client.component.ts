import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { environment } from 'src/environments/environment.prod';
import { DataViewLazyLoadEvent } from 'primeng/dataview';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryClient } from '../../interfaces/category-client.interface';

@Component({
  selector: 'app-category-client',
  templateUrl: './category-client.component.html',
  styleUrls: ['./category-client.component.scss']
})
export class CategoryClientComponent implements OnInit, OnDestroy {

  api = environment.apiUrl;   
  categories: CategoryClient[] = [];
  filteredCategories: CategoryClient[] = [];
  totalRecords: number = 0;
  loading: boolean = true;
  offset: number = 0; 
  readonly limit: number = 50; 

  private subscriptions: Subscription = new Subscription(); 


  constructor(

    private categoryService: CategoryService,
    private router: Router
  ){

  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  ngOnInit(): void {

    const categoriesSubscription = this.categoryService.categoryClientItems$.subscribe(items => {
      this.categories = items;
      this.filteredCategories = [...this.categories];
      
    });


    this.subscriptions.add(categoriesSubscription);
    
  }

  goToCategoryBook(categoryId: string) {
    this.router.navigate(['/categories/client/books'], { queryParams: { id: categoryId } });
  }


  findAllClient( $event: DataViewLazyLoadEvent ){

    const offset = $event.first ? $event.first / 50 : 0;

    this.loading = true;

    const findAllSubscription = this.categoryService.findAllClient( offset, this.limit ).subscribe({
      next: ( resp ) => {
        this.totalRecords = resp.total_records;
      },
      error: ( err ) => {

      },
      complete: ( ) => {
        this.loading = false;

      } 
    });

    this.subscriptions.add(findAllSubscription);
  }

  
  filterCategories(event: Event) {        
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCategories = this.categories.filter( category => 
      category.name.toLowerCase().includes(searchValue)
    );
  }


}
