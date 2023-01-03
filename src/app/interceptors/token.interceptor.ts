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
        setHeaders: { Authorization: `${myToken}` }  //stringinterpolation in ES6
      })
    }
    //send the request
    return next.handle(request)


    //implement this in app.module.ts provider
  }
}
