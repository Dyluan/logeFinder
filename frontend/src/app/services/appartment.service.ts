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

  getFavorites(email: string) {
    let params = new HttpParams();
    params = params.set('email', email);
    return this.http.get<Appartement>(`${this.apiUrl}/favorites`, { params });
  }

  searchAppartments(filters: {
    maxPrice?: number;
    minSurface?: number;
    city?: string;
    minRooms?: number;
    type_location?: string;
    type_bien?: string;
    garage?: string;
    tri?: string;
    textSearch?: string;
    }): Observable<Appartement[]> {
      let params = new HttpParams();
      if (filters.maxPrice) {
        params = params.set('maxPrice', filters.maxPrice);
      }
      if (filters.minSurface) {
        params = params.set('minSurface', filters.minSurface)
      }
      if (filters.city) {
        params = params.set('city', filters.city);
      }
      if (filters.minRooms) {
        params = params.set('minRooms', filters.minRooms);
      }
      if (filters.type_location) {
        params = params.set('type_location', filters.type_location);
      }
      if (filters.type_bien) {
        params = params.set('type_bien', filters.type_bien);
      }
      if (filters.garage) {
        params = params.set('garage', filters.garage);
      }
      if (filters.tri) {
        params = params.set('tri', filters.tri);
      }
      if (filters.textSearch) {
        params = params.set('textSearch', filters.textSearch);
      }
      return this.http.get<Appartement[]>(`${this.apiUrl}/search`, { params });
  }
}