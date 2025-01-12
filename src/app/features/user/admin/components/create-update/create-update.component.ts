import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToolService } from 'src/app/utils/services/tool.service';
import { ToastService } from 'src/app/utils/services/toast.service';
import { Subscription } from 'rxjs';
import { cedulaEcuatorianaValidator } from 'src/app/shared/validators/ecuadorian-id.validator';
import { FileSelectEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.scss']
})
export class CreateUpdateComponent implements OnInit, OnDestroy{

  formUser!: FormGroup;

  isChange: boolean = false;

  api = environment.apiUrl;   
  selectedFile: any | null = null;  
  files: File[] = [];

  userData!: any;
  isBlocked: boolean = false;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private config: DynamicDialogConfig<any>,
    private toolService: ToolService,
    private ref: DynamicDialogRef,
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
    this.setUser();
  }

  onFileSelect(event: FileSelectEvent) {
    
    
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      
      
      this.selectedFile = file;
            
      this.formUser.get('image')?.setValue(this.selectedFile.name);
      
    }
  }

  initForm() {
    this.formUser = this.fb.group({
      identification: ['', [Validators.required, cedulaEcuatorianaValidator]],
      names: ['', [Validators.required]],
      surnames: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/) ]],
      email: ['', [Validators.required, Validators.email ]],        
      image: [ '', []],      
      status: [ '', [Validators.required]],

    });
  }

  fieldsValidate(campo: string){
    return this.formUser.get(campo)?.invalid && this.formUser.get(campo)?.touched && this.formUser.get(campo)?.dirty;
  }

  setUser(){


    if( this.config.data === undefined ){

      this.isChange = true;
      return;
    }

    const { id, email, identification, names, surnames, phone, image, status } = this.config.data;
    if( image !== undefined ){
      this.setDefaultImage( image );
    }

    

    this.formUser.patchValue({ 
      email, 
      identification,
      names,
      surnames,
      phone,
      image,
      status: status === 1
        
    });

    this.userData = { id, email, identification, names, surnames, phone, image, status: status === 1 };
    this.formUser.valueChanges.subscribe((value) => {
      
      const isEqual =
        value.email === this.userData.email &&
        value.identification === this.userData.identification &&
        value.names === this.userData.names &&
        value.surnames === this.userData.surnames &&
        value.phone === this.userData.phone &&
        value.image === this.userData.image &&
        value.status === this.userData.status 
  

  
      this.isChange = !isEqual;
    });
  }


  setDefaultImage(image: string) {
    const fileObject = {
      name: image,
      objectURL: `${this.api}/files/getFile/users/${image}`,
    };

    this.selectedFile = fileObject;

  }

  patchService( dto: any ){
    const patchSubscription = this.userService.patch( dto ).subscribe({
      next: ( resp ) => {                 
        this.toastService.showSuccess( 'Mensaje del sistema', resp.message,  );
        this.ref.close( resp.data ); 
      }, 
      error: ( err ) => {                
        this.toastService.showSuccess( 'Mensaje del sistema', err,  );
      },
      complete: ( ) => {
      }
    })

    this.subscriptions.add( patchSubscription );    
  }


  onClickCreateUpdateUser(){

    this.formUser.disable();

    const dto: any = {
      ...this.formUser.value,
      id: this.userData.id
    }

    
    if( dto.image === 'fd7f7587-d385-4e64-b0a0-99d2d89a8ec2_20250106_134020_default.jpg'){
      this.patchService( dto );

      return;
    }
    
    if( dto.image === this.userData.image ){
      this.patchService( dto );
  
      return;
      
    }

    const toolsSubscription = this.toolService.subirArchivo( this.selectedFile, 'users').subscribe({
      next: ( resp ) => {          
        dto.image = resp.data;          
        this.patchService( dto );

        
      },
      error: ( err ) => {

      },
      complete: () => {

      }
    });


    this.subscriptions.add(toolsSubscription);

  }




}
