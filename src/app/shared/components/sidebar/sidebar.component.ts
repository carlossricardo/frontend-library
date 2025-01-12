import { Component, ElementRef, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { OptionService } from 'src/app/features/security/services/option.service';
import { environment } from 'src/environments/environment.prod';
// import { OptionComponent } from 'src/app/features/security/components/option/option.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  items: MenuItem[] = [];
  menu: any[] = [];
  user: any | null = null;


  api = environment.apiUrl;   


  constructor(
    private optionService: OptionService,
    public authService: AuthService,   

    public el: ElementRef,
  ){

  }

  ngOnInit(): void {
    this.loadOptions();
    
  }

  loadOptions(){

    this.optionService.loadOptions().subscribe({

      next: ( resp ) => {
        
        this.menu = resp.data;
                let arrayMenu: MenuItem[] = [];
                for( let m of this.menu ){
                    let arrayMenuItem: MenuItem[] = []
                    if( !(m.children!.length == 0) ){
                        for( let mc of m.children! ){
                            if( mc.parent_id == m.id ){
                                let menuItems: MenuItem = {
                                    label: mc.name,
                                    
                                    icon: mc.icon,
                                    routerLink: mc.url != null ? [mc.url] : ['']
                                }
                                arrayMenuItem.push( menuItems );
                            }
                        }
                    }

                    m.children = [];

                    let menu: MenuItem = {
                        label: m.name,

                        icon: m.icon,                        
                        items: arrayMenuItem
                    }

                    

                    arrayMenu.push( menu );

                   

                }
                this.items = arrayMenu;  


      },
      error: ( err ) => {

      },
      complete: () => {

      }
    })
  }

}
