import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private url: string = 'http://localhost:8080/admin/hello';

  constructor(private http: HttpClient) { }

  // GET
  getData(): Observable<any> {
    return this.http.get<any>(this.url).pipe(catchError(this.handleError))
  }

  // POST


  // Fehlerbehandlung
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-seitiger Fehler
      console.error('Ein Fehler ist aufgetreten:', error.error.message);
    } else {
      // Server-seitiger Fehler
      console.error(`Backend antwortete mit Status ${error.status}, ` + `Fehler-Body war: ${error.error}`);
    }
    // Einen benutzerfreundlichen Fehler zurückgeben
    return throwError('Etwas ist schiefgelaufen; bitte versuchen Sie es später erneut.');
  }
}
