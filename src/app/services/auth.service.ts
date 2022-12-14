import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "https://localhost:7168/api/User/"
  constructor(private http: HttpClient, private router: Router) { }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj)
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj)
  }

  signOut() {
    //on signout clear localstorage
    localStorage.clear();
    //localStorage.removeItem('token')    //removes single item, in this example the token
    this.router.navigate(['login']);
  }
  //Logic to check for token. If there is a token, save it in local storage (singleton service)
  setToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')    //!! converts string to boolean
  }
}
