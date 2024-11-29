import { Injectable } from '@angular/core';
import { Client, IMessage, Stomp, StompConfig } from '@stomp/stompjs';
// import * as SockJS from 'sockjs-client';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient!: Client;
  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();

  constructor() {}

 connect(token: string): void {
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
    const stompClient2 = Stomp.over(socket);
    stompClient2.connect({Authorization: `Bearer ${token}`}, (frame:any) => {
        console.log(frame);

        stompClient2.subscribe("/user/topic", (message) => {
            const data = JSON.parse(message.body);
            console.log(data);

            //$("#tbody").append(`<tr><td>${data.message}</td><td>${data.from}</td></tr>`)

        });
    });*/
    
    
    /*const socket = new WebSocket('ws://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClient.debug = (str) => console.log(str);
    stompClient.connect(
      { 'X-Authorization': token }, // Pass JWT as header
      onConnect,                       // Callback for successful connection
      onError                          // Callback for errors
    );

    // Callback for successful connection
    function onConnect(frame: string) {
        console.log('Connected: ' + frame);

        // Subscribe to a topic
        stompClient.subscribe(
            '/topic/someTopic',         // Topic to subscribe to
            (onMessageReceived),
            { 'X-Authorization': token }
        );

        //sendMessage('/app/wherever', { content: 'Hello, WebSocket!' });
    }

    // Callback for connection errors
    function onError(error: any) {
        console.error('Error connecting to WebSocket:', error);
    }

    function onMessageReceived(message: any) {
      console.log('Message received:', message.body);
      // Process the message here
    }*/
  

    this.stompClient.onConnect = () => {
      console.log('Connected');
      this.connectedSubject.next(true);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error', frame);
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
    this.connectedSubject.next(false);
  }

  subscribe(destination: string, callback: (message: IMessage) => void): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe(destination, callback);
    } else {
      console.error('Cannot subscribe, client is not connected');
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
