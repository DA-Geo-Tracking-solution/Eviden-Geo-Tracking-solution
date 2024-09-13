import { Injectable } from '@angular/core';
import { error } from 'console';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: WebSocket;
  private subject: Subject<MessageEvent>;

  constructor() { }

  // Verbindung zum Websocket Server (Java Backend)
  public connect(url: string): Subject<MessageEvent> {
    if (!this.subject) {
      this.socket = new WebSocket(url);
      this.subject = this.createObservableSocket(this.socket);
    }
    return this.subject;
  }


  // Nachrichten senden können
  public send(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  // Verbindung schließen
  public close(): void {
    this.socket.close();
  }

  // Nachrichten empfangen mit Observable
  private createObservableSocket(socket: WebSocket): Subject<MessageEvent> {
    const observable = new Observable<MessageEvent>(observer => {
      socket.onmessage = (event) => observer.next(event);
      socket.onerror = (event) => observer.error(error);
      socket.onclose = () => observer.complete();
      return () => socket.close();
    });

    const observer ={
      next: (data: Object) => {
        if(socket.readyState === WebSocket.OPEN){
          socket.send(JSON.stringify(data));
        }
      }
    };

    return Subject.create(observer, observable);
  }

}


