import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, map } from 'rxjs';
import { UserClient } from '../client/interfaces/user-client.interface';
import { User } from '../admin/interfaces/user.interface';
import { UserResponse } from '../admin/interfaces/user.response';
import { UserResponseClient } from '../client/interfaces/user-client.response';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  private userSubject = new BehaviorSubject< UserClient | null>(null);
  public user$ = this.userSubject.asObservable();


  private usersItemsSubject = new BehaviorSubject<User[]>([]);
  public usersItems$ = this.usersItemsSubject.asObservable();

  api = environment.apiUrl;

  constructor(
    private http: HttpClient
  ){
  }


  findAll( offset: number, limit: number = 10 ){
    const url = `${this.api}/security/user?offset=${offset}&limit=${limit}`;
    return this.http.get<UserResponse>(url)
      .pipe(        
        map( (item) => {
          ( item.data.length > 0 && item.status ) ? this.usersItemsSubject.next( item.data ): this.usersItemsSubject.next( [] );
          return item;
        })        
      );
  }

  patch( dto: User ){
    const url = `${this.api}/security/user?user_id=${ dto.id }`;
    return this.http.patch<UserResponse>(url, dto);
  }

  deleteItem( user_id: string ){
    const url = `${this.api}/security/user/remove?user_id=${ user_id }`;
    return this.http.get<UserResponse>(url)
      .pipe(
        map( (resp) => {
          const currentUsers = this.usersItemsSubject.value;
          const itemToRemove = currentUsers.find(item => item.id === user_id);
          if (itemToRemove) {            
            const updatedList = currentUsers.filter(item => item.id !== user_id);
            this.usersItemsSubject.next(updatedList);          
          }
          return resp;

        })
      );
  }

  findUserActive(){
    const url = `${this.api}/security/user/active`;
    return this.http.get<UserResponseClient>( url )
      .pipe(
        map( (item) => item.status && item.data ? this.userSubject.next( item.data ): this.userSubject.next( null ) )
      );
  }


  patchClient( dto: UserClient ){
    const url = `${this.api}/security/user/active?user_id=${ dto.id }`;
    return this.http.patch<UserResponseClient>(url, dto);
  }



  getUser(): UserClient | null {        
    return this.userSubject.value;
  }

  clearUser(): void {
    this.userSubject.next(null);
  }

  mapperUserSubject( data: UserClient ){
    this.userSubject.next( data );


  }

  mapperUsersSubject( data: User ){

    const currentUsers = this.usersItemsSubject.value;
    
    const existingUserIndex = currentUsers.findIndex(item => item.id === data.id);
  
    
    if (existingUserIndex !== -1) {
      currentUsers[existingUserIndex] = {
        ...currentUsers[existingUserIndex],
        email: data.email,
        identification: data.identification,
        names: data.names,
        surnames: data.surnames,
        phone: data.phone,        
        created_at: data.created_at,
        updated_at: data.updated_at,
        image: data.image,
        status: !data.status ? 0 : 1,

      };
    }
      
    if (existingUserIndex === -1) {      
      currentUsers.unshift({
        id: data.id,
        email: data.email,
        identification: data.identification,
        names: data.names,
        surnames: data.surnames,
        phone: data.phone,  
        created_at: data.created_at,
        updated_at: data.updated_at,
        image: data.image,        
        status: !data.status ? 0 : 1,

      });      
    }
      
    this.usersItemsSubject.next([...currentUsers]);

  }






}
