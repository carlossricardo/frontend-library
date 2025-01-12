import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { Carrousel, Data } from '../../interfaces/dashboard.client';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-dashboard-client',
  templateUrl: './dashboard-client.component.html',
  styleUrls: ['./dashboard-client.component.scss']
})
export class DashboardClientComponent implements OnInit, OnDestroy {

  items: Data[] = [];
  itemsCarrousel: Carrousel[] = [];

  responsiveOptions: any[] | undefined;

  api = environment.apiUrl;   

  private subscriptions: Subscription = new Subscription(); 

  constructor(
    private dashboardService: DashboardService
  ){

  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
  ngOnInit(): void {

    this.responsiveOptions = [
      {
          breakpoint: '1400px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '1220px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '1100px',
          numVisible: 1,
          numScroll: 1
      },
    ];

    this.findAllClient();


    const dashboardSubscription = this.dashboardService.dashboardClientItems$.subscribe({
      next: ( item ) => {
        this.items = item;
      }
    });

    this.subscriptions.add(dashboardSubscription);
    
  }



  findAllClient(){


    const findAllSubscription = this.dashboardService.findAllClient().subscribe({
      next: ( resp ) => {
        this.itemsCarrousel = resp.carrousel;
      },
      error: ( err ) => {

      },
      complete: ( ) => {

      }
    });

    this.subscriptions.add(findAllSubscription);
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

}
