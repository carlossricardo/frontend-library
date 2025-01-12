import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogConfirmationService } from 'src/app/utils/services/dialog-confirmation.service';
import { ToastService } from 'src/app/utils/services/toast.service';
import { CreateUpdateComponent } from '../../components/create-update/create-update.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  users: any[] = [];
  totalRecords: number = 0;
  loading: boolean = true;
  offset: number = 0; 

  readonly limit: number = 50; 

  ref: DynamicDialogRef | undefined;

  private subscriptions: Subscription = new Subscription(); 

  usersFilter: any[] = [];

  constructor(

    private dialogConf: DialogConfirmationService,
    private userService: UserService,
    private toastService: ToastService,
    public dialogService: DialogService,
  ){

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    if (this.ref) {
      this.ref.close();
    }
  }


  ngOnInit(): void {
    const usersSubscription = this.userService.usersItems$.subscribe( items => {
      this.users = items;    
      this.usersFilter = [ ...this.users ];  
    });

    this.subscriptions.add(usersSubscription);
  }


  findAll( $event: TableLazyLoadEvent ){
    
    const offset = $event.first ? $event.first / 50 : 0;

    this.loading = true;

    const findAllSubscription = this.userService.findAll(offset, this.limit).subscribe({
      next: (resp) => {

        
        
     
        this.loading = false;
        this.totalRecords = resp.total_records;

      },
      error: (err) => {
        
        this.loading = false;
      },
    });

    this.subscriptions.add(findAllSubscription);

  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  onClickUpdateUser( user: any ){

    this.ref = this.dialogService.open( CreateUpdateComponent , {
      header: `Editar usuario - ${ user.id }`,      
      data: user,
      contentStyle: { overflow: 'auto' },
      
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


    this.ref.onClose.subscribe( async ( resp: any ) => {

      if( resp === undefined ) return;
      this.userService.mapperUsersSubject( resp );
      
  
    });

  }

  onClickRemoveItem( user: any ){


    this.dialogConf.showConfirmation(
      `¿Estás seguro de eliminar este registro "${ user.identification }"?`,
      'pi pi-user',
      () => {
        this.userService.deleteItem( user.id ).subscribe({
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

  applyFilterGlobal($event: Event ) {
    
    const searchValue = ($event.target as HTMLInputElement).value.toLowerCase();
        

    this.usersFilter = this.users.filter( item => item.person.identification.toLowerCase().includes( searchValue ));
  }


}
