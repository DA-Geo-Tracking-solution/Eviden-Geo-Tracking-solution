import { Injectable } from '@angular/core';
import { Client, IMessage, Stomp, StompConfig } from '@stomp/stompjs';
// import * as SockJS from 'sockjs-client';
import SockJS from 'sockjs-client';
import { BehaviorSubject, single } from 'rxjs';
import { KeycloakService } from '../keycloak/keycloak.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient!: Client;
  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();
  private subscribtions: [destination: string, callback: (message: IMessage) => void][] = [];

  constructor(private keycloakService: KeycloakService) {}

  connect(): boolean {
    const token = this.keycloakService.profile?.token;
    if (token) {
      this.stompClient = new Client({
        brokerURL: 'ws://localhost:8080/ws/chat', // Update with your WebSocket endpoint
        connectHeaders: {
          Authorization: `Bearer ${token}`, // Add JWT token in headers
        },
        debug: (str) => console.log(str),
        reconnectDelay: 5000, // Automatically reconnect after 5 seconds
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      /*const socket = new SockJS("/ws");
      const stompClient2 = Stomp.over(socket);*/
      
      /*const socket = new WebSocket('ws://localhost:8080/ws');
      const stompClient = Stomp.over(socket);*/

      this.stompClient.onConnect = () => {
        console.log('Connected');
        this.connectedSubject.next(true);
      };
  
      this.stompClient.onStompError = (frame) => {
        console.error('STOMP error', frame);
      };
  
      this.stompClient.activate();
      return true;
    }
    return false
  }

  isConnected(): boolean {
    return this.stompClient?.active;
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
    this.connectedSubject.next(false);
  }

  subscribe(destination: string, callback: (message: IMessage) => void): void {
    console.log(destination)
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe(destination, callback);
    } else {
      this.subscribtions.push([destination, callback])
      this.stompClient.onConnect = () => {
        for(const subscribtion of this.subscribtions) {
          this.stompClient.subscribe(subscribtion[0], subscribtion[1]);
          this.connectedSubject.next(true);
        }
      };
    }
  }

  send(destination: string, body: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error('Cannot send, client is not connected');
    }
  }
}
