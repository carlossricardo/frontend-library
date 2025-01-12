import { Component, OnDestroy, OnInit } from '@angular/core';

import { find, Subscription } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { Data } from '../../interfaces/dashboard.admin';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {


  items: Data[] = [];

  private subscriptions: Subscription = new Subscription(); 

  constructor(

    private dashboardService: DashboardService
  ){
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  ngOnInit(): void {
    this.findAll();

    const dashboardSubscription = this.dashboardService.dashboardItems$.subscribe({
      next: ( item ) => {
        this.items = item;
      }
    });

    this.subscriptions.add(dashboardSubscription);
    
  }


  findAll(){


    const findAllSubscription = this.dashboardService.findAll().subscribe({
      next: ( resp ) => {
      },
      error: ( err ) => {
      },
      complete: ( ) => {

      }
    });

    this.subscriptions.add(findAllSubscription);
  }





}
