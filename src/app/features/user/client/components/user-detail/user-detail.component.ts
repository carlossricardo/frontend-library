import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { UserService } from '../../../services/user.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToolService } from 'src/app/utils/services/tool.service';
import { ToastService } from 'src/app/utils/services/toast.service';
import { FileSelectEvent } from 'primeng/fileupload';
import { cedulaEcuatorianaValidator } from 'src/app/shared/validators/ecuadorian-id.validator';
import { Subscription } from 'rxjs';
import { UserClient } from '../../interfaces/user-client.interface';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {

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
    private config: DynamicDialogConfig<UserClient>,
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

    });
  }



  setUser(){


    if( this.config.data === undefined ){

      this.isChange = true;
      return;
    }

    const { id, email, identification, names, surnames, phone, image } = this.config.data;
    if( image !== undefined ){
      this.setDefaultImage( image );
    }

    

    this.formUser.patchValue({ 
      email, 
      identification,
      names,
      surnames,
      phone,
      image
        
    });

    this.userData = { id, email, identification, names, surnames, phone, image };
    this.formUser.valueChanges.subscribe((value) => {
      
      const isEqual =
        value.email === this.userData.email &&
        value.identification === this.userData.identification &&
        value.names === this.userData.names &&
        value.surnames === this.userData.surnames &&
        value.phone === this.userData.phone &&
        value.image === this.userData.image
  

  
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

  patchService( dto: UserClient ){
    const patchSubscription = this.userService.patchClient( dto ).subscribe({
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
  

  onClickUpdateUser(){

    this.formUser.disable();

    const dto: UserClient = {
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


  
  fieldsValidate(campo: string){
    return this.formUser.get(campo)?.invalid && this.formUser.get(campo)?.touched && this.formUser.get(campo)?.dirty;
  }


}
