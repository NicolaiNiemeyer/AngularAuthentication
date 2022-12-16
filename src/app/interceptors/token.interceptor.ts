//use interceptor to append token on the header
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private toast: NgToastService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const myToken = this.auth.getToken();

    //Logic to modify header request. The header requests a token to send back to the back-end
    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }  //stringinterpolation in ES6
      })
    }
    //send the request
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            console.log("this is client side error");
            errorMsg = `Error: ${error.error.message}`;
          } else {
            console.log("This is serve side error");
            errorMsg = `Error Code: ${error.status}, Message: ${error.message}`;
          }
          console.log(errorMsg);
          return throwError(() => new Error(errorMsg));
        })
      )

    //implement this in app.module.ts provider
  }
}
