import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from 'src/app/utils/services/toast.service';
import { ToolService } from 'src/app/utils/services/tool.service';

import { environment } from 'src/environments/environment.prod';
import { LoanService } from '../../../services/loan.service';
import { Subscription } from 'rxjs';
import { Loan } from '../../interfaces/loan.interface';



interface Statuses {
  name: string;
  value: string;
}

@Component({
  selector: 'app-manage-loan',
  templateUrl: './manage-loan.component.html',
  styleUrls: ['./manage-loan.component.scss']
})
export class ManageLoanComponent implements OnInit, OnDestroy {


  loanValue!: Loan; 

  isChange: boolean = false;

  statuses: Statuses[] = [
    {
      name: 'Activa',
      value: 'active'
    },
    {
      name: 'Aceptada',
      value: 'accepted'
    },
    {
      name: 'Devuelta',
      value: 'returned'
    },
    {
      name: 'Atrasada',
      value: 'overdue'
    },
    {
      name: 'Rechazada',
      value: 'rejected'
    },
  ]; 

  api = environment.apiUrl;   

  formLoan!: FormGroup;

  private subscriptions: Subscription = new Subscription(); 

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig<any>,
    private ref: DynamicDialogRef,

    private toolService: ToolService,
    private toastService: ToastService,
    private loanService: LoanService

  ){

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    if (this.ref) {
      this.ref.close();
    }
  }

  ngOnInit(): void {

   this.loanValue =  this.config.data ;

   this.initForm();
   this.setLoan();
    
  }

  initForm() {
    this.formLoan = this.fb.group({

      
      status: ['', [Validators.required]],      
     
    });
  }

  setLoan(){

    const { status } = this.loanValue;
    this.formLoan.patchValue({ status });

    this.formLoan.valueChanges.subscribe( (value) => {
      const isEqual = 
        value.status === this.loanValue.status;
      
        this.isChange = !isEqual;

    });

  }


  onClickVerifyLoan(){

    if( this.loanValue ){

      const data: Loan = {
        id: this.loanValue.id,
        ...this.formLoan.value
      }

      
      
      // const bookDto = this.mapperToLoan( data );

      const loanSubscription = this.loanService.patchLoan( data ).subscribe({
        next: ( resp ) => {          
          this.toastService.showSuccess( 'Mensaje del sistema', resp.message,  );  
          this.ref.close( resp.data );             
        },
        error: ( err ) => {                    
  
        },
        complete: () => {
  
        }
      });

      this.subscriptions.add(loanSubscription);
    }
  }

  // mapperToLoan( data: any ): LoanDto {
  //   return {
  //     id: data.id,
  //     status: data.status
  //   }
  // }



}
