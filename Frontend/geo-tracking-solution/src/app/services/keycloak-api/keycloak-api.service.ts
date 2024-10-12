import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KeycloakApiService {
  private realm = "test";
  private keycloakUrl = `http://localhost:8081/auth/realms/${this.realm}/protocol/openid-connect/token`;
  private clientId = 'test-client';
  //private clientSecret = 'your-client-secret';  // If using a confidential client
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  loginWithCredentials(username: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', this.clientId);
    body.set('username', username);
    body.set('password', password);

    // If you are using a confidential client, add the client_secret parameter
    //if (this.clientSecret) {
    //  body.set('client_secret', this.clientSecret);
    //}

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(this.keycloakUrl, body.toString(), { headers }).pipe(
      map((response: any) => {
        // Check for access_token in the response
        this.token = response.access_token;
        localStorage.setItem('token', this.token || "");
        return response;  // Return the response for further processing
      }),
      catchError(error => {
        console.error('Login failed', error);

        // Optional: Provide user feedback (like a toast notification)
        // You could implement a notification service to inform users of errors

        // Return a default value or error object
        return of({
          success: false,
          error: 'Login failed. Please try again later.'
        });
      })
    );
  }

  // Retrieve token for authenticated requests
  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  // Logout user and clear tokens
  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    // Implement further logout actions like redirect to login page
  }

  // Optional: You can also refresh tokens, handle expiration, etc.
}
