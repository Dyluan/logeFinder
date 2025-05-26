import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { filter, Observable } from 'rxjs';
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

  searchAppartments(filters: {
    minPrice: number;
    maxPrice?: number;
    minSurface?: number;
    city?: string;
    minRooms?: number;
    type_location?: string;
    }): Observable<Appartement[]> {
      let params = new HttpParams();
      if (filters.minPrice) {
        params = params.set('minPrice', filters.minPrice);
      }
      if (filters.maxPrice) {
        params = params.set('maxPrice', filters.maxPrice);
      }
      if (filters.minSurface) {
        params = params.set('minSurface', filters.minSurface)
      }
      if (filters.city) {
        params = params.set('city', filters.city)
      }
      if (filters.minRooms) {
        params = params.set('minRooms', filters.minRooms)
      }
      if (filters.type_location) {
        params = params.set('type_location', filters.type_location)
      }

      return this.http.get<Appartement[]>(`${this.apiUrl}/search`, { params });
  }


}