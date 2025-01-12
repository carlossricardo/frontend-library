import { Component, OnDestroy, OnInit } from '@angular/core';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoanService } from '../../../services/loan.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { ManageLoanComponent } from '../../components/manage-loan/manage-loan.component';
import { DialogConfirmationService } from 'src/app/utils/services/dialog-confirmation.service';
import { ToastService } from 'src/app/utils/services/toast.service';
import { Subscription } from 'rxjs';
import { Loan } from '../../interfaces/loan.interface';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss']
})
export class LoanComponent implements OnInit, OnDestroy {

  loans: Loan[] = [];
  loansFilter: Loan[] = [];

  totalRecords: number = 0;
  loading: boolean = true;
  offset: number = 0;
  readonly limit: number = 50; 

  ref: DynamicDialogRef | undefined;

  private subscriptions: Subscription = new Subscription(); 

  constructor(
    private loanService: LoanService,
    public dialogService: DialogService,
    private dialogConf: DialogConfirmationService,
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

    const loanSubscription = this.loanService.loanItems$.subscribe( items => {
      this.loans = items; 
      this.loansFilter = [ ...this.loans ];         
    });

    this.subscriptions.add(loanSubscription);


  }

  onClickVerifiyData( data: Loan ){

    
    
    this.ref = this.dialogService.open( ManageLoanComponent , {
      header: 'Gestionar información',   
      data: data,
      contentStyle: { overflow: 'auto' },
      // baseZIndex: 10000,
      maximizable: false,
      
      styleClass: '',
      closeOnEscape: false,

      width: '50vw',
      height: '90vh',
      modal:true,
      breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
      },
    });

    this.ref.onClose.subscribe( async ( resp: Loan ) => {
      if( resp === undefined ) return;

      this.loanService.mapperToLoanSubject( resp );
      
    });


    
  }


  loadLoans( $event: TableLazyLoadEvent ){
    
    const offset = $event.first ? $event.first / 50 : 0;


    this.loading = true;

    const findAllSubscription = this.loanService.findAllLoans(offset, this.limit).subscribe({
      next: (resp) => {              
      
        this.loading = false;
        this.totalRecords = resp.total_records;        
        
      },
      error: (err) => {
        console.error('Error cargando los prestamos:', err);
        this.loading = false;
      },
    });

    this.subscriptions.add(findAllSubscription);

  }

  onClickRemoveItem( loan: Loan ){


    this.dialogConf.showConfirmation(
      `¿Estás seguro de eliminar este registro "${ loan.id }"?`,
      'pi pi-book',
      () => {
        this.loanService.deleteItem( loan.id ).subscribe({
          next: ( resp ) => {
    
            this.toastService.showSuccess( 'Mensaje del sistema', resp.message,  );
    
          },
          error: ( err ) => {
    
          },
          complete: () => {
    
          }
        });
      },  
    );



  }


  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }


  applyFilterGlobal($event: Event ) {
    
    const searchValue = ($event.target as HTMLInputElement).value.toLowerCase();
        

    this.loansFilter = this.loans.filter( item => item.user.identification.toLowerCase().includes( searchValue ));
  }






}
