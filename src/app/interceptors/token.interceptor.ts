//use interceptor to append token on the header
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();

    //Logic to modify header request. The header requests a token to send back to the back-end
    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }  //stringinterpolation in ES6
      })
    }
    //send the request
    return next.handle(request);

    //implement this in app.module.ts provider
  }
}
