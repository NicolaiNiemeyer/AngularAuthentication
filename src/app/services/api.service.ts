import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl: string = 'http://localhost:7168/api/User'
  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
}
