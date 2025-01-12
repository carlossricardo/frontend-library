import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoanService } from '../../../services/loan.service';
import { TableLazyLoadEvent } from 'primeng/table';

import { ManageClientComponent } from '../../components/manage-client/manage-client.component';
import { Subscription } from 'rxjs';
import { LoanClient } from '../../interfaces/loan-client.interface';


@Component({
  selector: 'app-loan-client',
  templateUrl: './loan-client.component.html',
  styleUrls: ['./loan-client.component.scss']
})
export class LoanClientComponent implements OnInit, OnDestroy {
  
  
  loanItems: LoanClient[] = [];
  
  totalRecords: number = 0;
  loading: boolean = true;
  offset: number = 0;
  readonly limit: number = 10; 
  
  ref: DynamicDialogRef | undefined;

  private subscriptions: Subscription = new Subscription(); 
  
  constructor(    
    public dialogService: DialogService,
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

    const loansClientSubscription = this.loanService.loanClientItems$.subscribe(items => {
      this.loanItems = items;
    });

    this.subscriptions.add(loansClientSubscription);
    
  }

  onClickVerifiyData( data: LoanClient ){

    
    
    this.ref = this.dialogService.open( ManageClientComponent , {
      header: 'Verificar información',   
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



    
  }


  findAllClient( $event: TableLazyLoadEvent ){
    
    const offset = $event.first ? $event.first / 10 : 0;

    this.loading = true;

    const findAllSubscription = this.loanService.findAllClient( offset, this.limit ).subscribe({
      next: ( resp ) => {
      },
      error: ( err ) => {
        
      },
      complete: () => {
        this.loading = false;
      }

    });

    this.subscriptions.add(findAllSubscription);


  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }



  
}
