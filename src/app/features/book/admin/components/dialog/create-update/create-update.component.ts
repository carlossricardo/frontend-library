import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileRemoveEvent, FileSelectEvent, FileUploadEvent } from 'primeng/fileupload';
import { Category } from 'src/app/features/category/admin/interfaces/category.interface';
import { CategoryService } from 'src/app/features/category/services/category.service';
import { Book } from '../../../interfaces/book.interface';
import { BookService } from 'src/app/features/book/services/book.service';
import { ToolService } from 'src/app/utils/services/tool.service';
import { environment } from 'src/environments/environment.prod';
import { ToastService } from 'src/app/utils/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.scss']
})
export class CreateUpdateComponent implements OnInit, OnDestroy {



  api = environment.apiUrl;     
  selectedFile: any | null = null;    
  
  formBook!: FormGroup;
  bookData!: Book;
  categoriesList: Category[] = [];

  isChange: boolean = false;
  isBlocked: boolean = false;
  isLoadingCategories: boolean = false;

  private subscriptions: Subscription = new Subscription(); 

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig<any>,
    private ref: DynamicDialogRef,
    private categoryService: CategoryService,
    private bookService: BookService,
    private toolService: ToolService,
    private toastService: ToastService,    
  ){

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    if (this.ref) {
      this.ref.close();
    }
  }

  async ngOnInit() {

    this.initForm();
    this.loadCategories();
    this.setBook();
  }

  removeFile() {

    this.selectedFile = null;     
    this.formBook.get('image')?.setValue('');    
  }

  onSelect(event: FileSelectEvent) {            
    if (event.files && event.files.length > 0) {
      const file = event.files[0];            
      this.selectedFile = file;            
      this.formBook.get('image')?.setValue(this.selectedFile.name);      
    }
  }


  initForm() {
    this.formBook = this.fb.group({
      title: ['', [Validators.required]],      
      description: ['', [Validators.required]],
      emission: ['', [Validators.required]],            
      status: [ '', [Validators.required]],
      units: ['', [Validators.required]],
      autor: ['', [Validators.required]],
      categories: [[], [ Validators.required ]],
      image: ['', []],
     
    });
  }

  setBook(){

    if( this.config.data === undefined ){
      this.isChange = true;
      return;
    }

    const { id, title, description, categories, image, units, autor, emission, status } = this.config.data;
    if( image !== undefined ){
      this.setDefaultImage( image );
    }
    
    this.formBook.patchValue({ id, title, description, categories, image, units, autor, status, emission: new Date(emission)});

    this.bookData = { title, description, categories, image, units, autor,  status, emission: new Date(emission), };

    this.formBook.valueChanges.subscribe((value) => {
      
      const isEqual =
        value.title === this.bookData.title &&
        value.image === this.bookData.image &&
        value.units === this.bookData.units &&
        value.autor === this.bookData.autor &&
        value.status === this.bookData.status &&
        this.formatDate( value.emission ) === this.formatDate( this.bookData.emission ) &&
        value.description === this.bookData.description &&
        JSON.stringify(value.categories) === JSON.stringify(this.bookData.categories);
  
      this.isChange = !isEqual;
    });
    
  }



  setDefaultImage(image: string) {
    const fileObject = {
      name: image,
      objectURL: `${this.api}/files/getFile/books/${image}`,
    };

    this.selectedFile = fileObject;

  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
    return `${year}/${month}/${day}`;
  }


  fieldsValidate(campo: string){
    return this.formBook.get(campo)?.invalid && this.formBook.get(campo)?.touched && this.formBook.get(campo)?.dirty;
  }

  createBookService( bookDto: any ){

    const createSubscription = this.bookService.createBooks( bookDto ).subscribe({
      next: ( resp ) => {        

        this.toastService.showSuccess( 'Mensaje del sistema', resp.message,  );  
        this.ref.close( resp.data ); 

      }, 
      error: ( err ) => {        
        this.toastService.showError('Mensaje del sistema', '');

      },
      complete: () => {
        
      }
    });

    this.subscriptions.add(createSubscription);

  }

  updateBookService( bookDto: any ){

    const patchSubscription = this.bookService.patchBooks( bookDto ).subscribe({
      next: ( resp ) => {
         
        this.formBook.disable();
        this.toastService.showSuccess( 'Mensaje del sistema', resp.message,  );
        this.ref.close( resp.data ); 
      }, 
      error: ( err ) => {
        
        
        this.toastService.showError( 'Mensaje del sistema', '' );
      },
      complete: () => {

      }
    });

    this.subscriptions.add(patchSubscription);

  }

  uploadFileBook(){
    this.toolService.subirArchivo( this.selectedFile, 'books').subscribe({
      next: ( resp ) => {        
      },
      error: ( err ) => {

      },
      complete: () => {

      }
    })

  }

  onClickCreateUpdateBook(){

    this.formBook.disable();
    this.isBlocked = true;
    
    if( this.config.data ){      
      let bookDto: Book = {
        ...this.formBook.value,
        id: this.config.data.id
  
      };
      
      if( bookDto.image === this.bookData.image || bookDto.image === '' ){   

        this.updateBookService( bookDto );
        return;             
        
      }
      
      const toolsSubscription = this.toolService.subirArchivo( this.selectedFile, 'books').subscribe({
        next: ( resp ) => {          
          bookDto.image = resp.data;          
          this.updateBookService( bookDto );
          
        },
        error: ( err ) => {                    
          this.toastService.showError('Mensaje del sistema', '');
          
        },
        complete: () => {
        }
      });

      this.subscriptions.add(toolsSubscription);            
      return;

      
    }
    
    this.formBook.disable();

    const bookDto: Book = this.formBook.value;      

    if( bookDto.image === '' || bookDto.image === undefined ){            
      this.createBookService( bookDto );
      return;
    }

    const toolsSubscription = this.toolService.subirArchivo( this.selectedFile, 'books').subscribe({
      next: ( resp ) => {
        bookDto.image = resp.data;
        this.createBookService( bookDto );
      },
      error: ( err ) => {
        this.toastService.showError('Mensaje del sistema', '');
      },
      complete: () => {
      }
    });

    this.subscriptions.add(toolsSubscription);
    
  }


  loadCategories(){
    this.isLoadingCategories = true;
    const findCategpriesSubscription = this.categoryService.loadCategories().subscribe({
      next: ( resp ) => {        
        
        this.categoriesList = resp;
      },
      error: ( err  ) => {
        this.toastService.showError('Mensaje del sistema', '');
      },
      complete: () => {
        this.isLoadingCategories = false;
      }
    });

    this.subscriptions.add(findCategpriesSubscription);
  }


}
