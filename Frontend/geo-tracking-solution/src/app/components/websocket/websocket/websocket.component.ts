import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../../../services/websocketservice/websocketservice.service';
import { KeycloakService } from '../../../services/keycloak/keycloak.service';
import { ServerDataService } from '../../../services/server-data/server-data.service';

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrl: './websocket.component.css'
})
export class WebsocketComponent implements OnInit, OnDestroy {
  private token = this.keycloakService.keycloak?.token;
  
  messages: string[] = [];

  constructor(private serverDataService: ServerDataService, private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    this.serverDataService.getChatMessages('2', (message) => {
      console.log(message);
      this.messages.push(message.content);
    });
  }

  sendMessage(content: string): void {
    //this.websocketService.send('/app/chat.sendMessage', { content });
  }

  ngOnDestroy(): void {
    this.serverDataService.close();
  }
}
