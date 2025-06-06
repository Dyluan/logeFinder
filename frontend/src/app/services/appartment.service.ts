import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { filter, Observable, of } from 'rxjs';
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

  getFavorites(userId: string): Observable<Appartement[]> {
    let params = new HttpParams();
    params = params.set('userId', userId);
    return this.http.get<Appartement[]>(`${this.apiUrl}/favorites`, { params });
  }
  
  addToFavorites(id: number, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/favorites/new`, {
      id: id,
      userId: userId
    })
  }

  deleteFromFavorites(userId: string, itemId: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('userId', userId);
    params = params.set('itemId', itemId);
    return this.http.delete(`${this.apiUrl}/favorites/delete`, {
      params: params
    })
  }

  isFavorite(itemId: number): Observable<boolean> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return of (false);
    }

    let params = new HttpParams()
      .set('userId', userId)
      .set('itemId', itemId.toString());

    return this.http.get<boolean>(`${this.apiUrl}/favorites/check`, { params });
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