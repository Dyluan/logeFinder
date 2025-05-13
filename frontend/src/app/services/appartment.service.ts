import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appartement } from '../models/appartement';

@Injectable({
  providedIn: 'root'
})
export class AppartmentService {
  // private apiUrl = 'localhost:3000/appartments';
  private apiUrl = 'http://localhost:3000/appartments';

  constructor(private http: HttpClient) { }

  getAppartments(): Observable<Appartement[]> {
    return this.http.get<Appartement[]>(this.apiUrl);
  }

  getAppartmentById(id: number): Observable<Appartement> {
    return this.http.get<Appartement>(`${this.apiUrl}/${id}`);
  }
}
