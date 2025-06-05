import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000/user';

  isUserRegistered(email: string): Observable<boolean> {
    let params = new HttpParams();
    params = params.set('email', email);
    return this.http.get(`${this.apiUrl}`, { params }).pipe(
      map(() => true), //si la requête réussit
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(false); //user non trouvé
        }
        throw error; //autre erreur
      })
    );
  }

  registerThisUser(email: string, nom: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sign`, {
      email: email,
      nom: nom
    })
  }

  //renvoie l'id de notre user dans la database. En fonction de l'email
  getUserId(email: string): Observable<string> {
    let params = new HttpParams();
    params = params.set('email', email);
    return this.http.get<string>(`${this.apiUrl}/id`, {params})
  }
}
