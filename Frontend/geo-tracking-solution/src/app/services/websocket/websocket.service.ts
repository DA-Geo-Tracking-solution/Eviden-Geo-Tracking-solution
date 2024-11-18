import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket!: WebSocket;
  private subject!: Subject<any>;

  constructor() { }

  // Verbindung zum WebSocket-Server herstellen und ein Subject zurückgeben
  public connect(url: string): Subject<any> {
    if (!this.subject || this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket(url);
      this.subject = this.createObservableSocket(this.socket);
    }
    return this.subject;
  }

  // Nachricht im JSON-Format senden
  public send(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open. Ready state is:", this.socket.readyState);
    }
  }

  // Verbindung schließen
  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  // WebSocket als Subject erstellen, das Daten empfangen und senden kann
  private createObservableSocket(socket: WebSocket): Subject<any> {
    // Observable: Daten empfangen
    const observable = new Observable<any>(observer => {
      socket.onmessage = (event) => {
        try {
          // Nachricht als JSON parsen
          const data = JSON.parse(event.data);
          observer.next(data);
        } catch (error) {
          console.error("Error parsing message data:", error);
          observer.error(error);
        }
      };
      socket.onerror = (error) => observer.error(error);
      socket.onclose = () => observer.complete();
      return () => socket.close();
    });

    // Observer: Daten senden
    const observer = {
      next: (data: any) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
        } else {
          console.error("WebSocket is not open. Ready state is:", socket.readyState);
        }
      }
    };

    return Subject.create(observer, observable);
  }
}
