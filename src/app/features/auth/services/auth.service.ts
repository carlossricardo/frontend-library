import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, catchError, finalize, from, map, of, switchMap, take, tap, throwError } from 'rxjs';
// import { AuthRequest, AuthResponse, ResponseUser, User, UserDto } from '../interfaces/auth.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from './token.service';
import { User } from '../interfaces/user.interface';
import { AuthResponse, CheckStatusResponse } from '../interfaces/auth.response';
import { AuthRequest } from '../interfaces/auth.interface';
import { UserClient } from '../../user/client/interfaces/user-client.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();


  constructor(

    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private tokenService: TokenService,

  ){

  }


  api = environment.apiUrl;

  initializeUser(): Promise<void> {
    return new Promise((resolve) => {
      const token = this.tokenService.getToken();
      if (token && !this.jwtHelper.isTokenExpired(token)) {
        this.findStatus()
          .pipe(finalize(() => resolve()))
          .subscribe();
      } else {
        this.userSubject.next(null);
        resolve();
      }
    });
  }



  findStatus(): Observable<User | null> {
    const url = `${this.api}/security/checkStatus`;
    return this.http.get<CheckStatusResponse>(url).pipe(
      map((response) => {
        const user = response.status && response.data ? response.data : null;
        this.userSubject.next(user);
        return user;
      }),
      catchError(() => {
        this.userSubject.next(null);
        return of(null);
      })
    );
  }

  signIn(request: AuthRequest): Observable<AuthResponse> {
    const url = `${this.api}/authentication/client/login`;
    return this.http.post<AuthResponse>(url, request).pipe(
      tap((resp) => {
        if (resp.status) {
          this.tokenService.setToken(resp.token);
          this.findStatus().subscribe();
        }
      })
    );
  }

  registerClient(dto: UserClient): Observable<AuthResponse> {
    const url = `${this.api}/authentication/client/register`;
    return this.http.post<AuthResponse>(url, dto).pipe(
      switchMap((resp) => {
        if (resp.status) {
          
          this.tokenService.setToken(resp.token);
          return from(this.initializeUser()).pipe(
            map(() => resp)
          );
        }
        return throwError(() => new Error('Error en el registro'));
      }),
      catchError((err) => {
        console.error('Error al registrar el usuario:', err);
        return throwError(() => err);
      })
    );
  }


  verifyJwtToken(): Observable<boolean> {
    const token = this.tokenService.getToken();      
    const isValid = !!token && !this.jwtHelper.isTokenExpired(token);
    return of(isValid);
  }


  removeUser(){
    this.userSubject.next( null );
  }




}
