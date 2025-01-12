import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FileSelectEvent } from 'primeng/fileupload';
import { cedulaEcuatorianaValidator } from 'src/app/shared/validators/ecuadorian-id.validator';
// import { UserDto } from '../../interfaces/auth.interface';
import { ToolService } from 'src/app/utils/services/tool.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastService } from 'src/app/utils/services/toast.service';
import { Subscription } from 'rxjs';
import { UserClient } from 'src/app/features/user/client/interfaces/user-client.interface';
import { AuthProfile } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {


  registerForm!: FormGroup;

  selectedFile: any | null = null;

  private subscriptions: Subscription = new Subscription();
  files: File[] = [];

  profiles: AuthProfile[] = [
    {
      name: 'Estudiante',
      value: 'STUDENT'
    },
    {
      name: 'Docente',
      value: 'TEACHER'
    },
  ];




  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,    
    private toolService: ToolService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
  ){

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();
    
  }

  onClickRegister(){

    if (!this.registerForm.valid) {      
      return;      
    } 

    this.registerForm.disable();
    
    const dto: UserClient = { ...this.registerForm.value }


    const registerSubscription = this.authService.registerClient( dto ).subscribe({
      next: ( resp ) => {

        this.confirmationService.confirm({
          closeOnEscape: false,
          header: 'Mensaje del sistema',
          message: resp.message,
          accept: () => {
              
              this.router.navigate(['/']);
          },
          reject: () => {                  
          }
        });
      },
      error: ( err ) => {     
        
                
        this.registerForm.enable();
        this.toastService.showError('Mensaje del sistema', err.error.message );
      },
      complete: ( ) => {
        
        
        this.registerForm.enable();
      }
    });
    this.subscriptions.add(registerSubscription);
    

  }


  initForm(){
    this.registerForm = this.formBuilder.group({
      identification: ['', [Validators.required, cedulaEcuatorianaValidator]],
      names: ['', [Validators.required]],
      surnames: ['', [Validators.required]],
      profile: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/) ]],
      email: ['', [Validators.required, Validators.email ]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z]).*$/),
        ]
      ],      
    });
  }
  

  fieldsValidate(campo: string){
    return this.registerForm.get(campo)?.invalid && this.registerForm.get(campo)?.touched && this.registerForm.get(campo)?.dirty;
  }



}
