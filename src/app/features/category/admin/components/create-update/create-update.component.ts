import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment.prod';
import { CategoryService } from '../../../services/category.service';
import { ToolService } from 'src/app/utils/services/tool.service';
import { ToastService } from 'src/app/utils/services/toast.service';

import { Subscription } from 'rxjs';
import { Category } from '../../interfaces/category.interface';


@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.scss']
})
export class CreateUpdateComponent implements OnInit, OnDestroy {

  api = environment.apiUrl;   
  
  selectedFile: any | null = null;    
  
  formCategory!: FormGroup;  

  isChange: boolean = false;

  isBlocked: boolean = false;

  categoryData!: Category;

  private subscriptions: Subscription = new Subscription(); 

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig<any>,
    private ref: DynamicDialogRef,
    private categoryService: CategoryService,        
    private toastService: ToastService,

  ){

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    if (this.ref) {
      this.ref.close();
    }
  }


  ngOnInit(): void {

    this.initForm();
    this.setCategory();
    
  }

  initForm() {
    this.formCategory = this.fb.group({
      code: ['', [Validators.required]],      
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],            
      status: [ '', [Validators.required]],
    });
  }

  setCategory(){


    if( this.config.data === undefined ){

      this.isChange = true;
      return;
    }

    const { id, code, name, description, status } = this.config.data;


    this.formCategory.patchValue({ id, code, name, description, status });
    this.categoryData = {  code, name, description, status };

    this.formCategory.valueChanges.subscribe((value: Category) => {
      
      const isEqual =
        value.code === this.categoryData.code &&
        value.name === this.categoryData.name &&
        value.description === this.categoryData.description &&
        value.status === this.categoryData.status;    

  
      this.isChange = !isEqual;
    });
    
  }

  onClickCreateUpdateCategory(){

    this.formCategory.disable();
    this.isBlocked = true;
    
    if( this.config.data ){      
      const dto: Category = {
  
        ...this.formCategory.value,
        id: this.config.data.id
  
      };
      this.updateCategoryService( dto );
      return;
    }
    
    
    this.formCategory.disable();
    
    
    const dto: Category = this.formCategory.value;    
    this.createCategoryService( dto );
    
  }

  updateCategoryService( categoryDto: Category ){

    const patchSubscription = this.categoryService.patch( categoryDto ).subscribe({
      next: ( resp ) => {
         
        this.formCategory.disable();
        this.toastService.showSuccess( 'Mensaje del sistema', resp.message,  );
        this.ref.close( resp.data ); 
      }, 
      error: ( err ) => {
        this.toastService.showError( 'Mensaje del sistema', ''  );
      },
      complete: () => {

      }
    });

    this.subscriptions.add(patchSubscription);

  }

  createCategoryService( categoryDto: Category ){

    const createSubscription = this.categoryService.create( categoryDto ).subscribe({
      next: ( resp ) => {
         
        this.formCategory.disable();
        this.toastService.showSuccess( 'Mensaje del sistema', resp.message,  );
        this.ref.close( resp.data ); 
      }, 
      error: ( err ) => {
        this.toastService.showError( 'Mensaje del sistema', ''  );
      },
      complete: () => {

      }
    });


    this.subscriptions.add(createSubscription);

  }

  fieldsValidate(campo: string){
    return this.formCategory.get(campo)?.invalid && this.formCategory.get(campo)?.touched && this.formCategory.get(campo)?.dirty;
  }

}
