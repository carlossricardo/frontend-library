import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from '../../../services/user.service';
import { UserDetailComponent } from '../../components/user-detail/user-detail.component';
import { Subscription } from 'rxjs';
import { UserClient } from '../../interfaces/user-client.interface';

@Component({
  selector: 'app-user-client',
  templateUrl: './user-client.component.html',
  styleUrls: ['./user-client.component.scss']
})
export class UserClientComponent implements OnInit, OnDestroy {
  

  api = environment.apiUrl;   
  user!: UserClient | null;
  ref: DynamicDialogRef | undefined;

  private subscriptions: Subscription = new Subscription(); 

  constructor(
    
    public userService: UserService,
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
    
    this.findUser();
    const userSubscription = this.userService.user$.subscribe( (value) => {            
      this.user = value;
    });

    this.subscriptions.add(userSubscription);
    
  }



  onClickUserDetail(){

    this.ref = this.dialogService.open( UserDetailComponent , {
      header: `Información`,      
      data: this.user,
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


    this.ref.onClose.subscribe( async ( resp: UserClient ) => {

      if( resp === undefined ) return;
      this.userService.mapperUserSubject( resp );
      
  
    });

  }




  findUser(){
    const findSubscription = this.userService.findUserActive().subscribe({
      next: ( resp ) => {

      },
      error: ( err ) => {

      },
      complete: () => {

      }
    });

    this.subscriptions.add(findSubscription);


  }
}
