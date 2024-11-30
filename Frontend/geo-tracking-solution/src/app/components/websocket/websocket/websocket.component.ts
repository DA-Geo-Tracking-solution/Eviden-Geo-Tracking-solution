import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../../../services/websocketservice/websocketservice.service';
import { KeycloakService } from '../../../services/keycloak/keycloak.service';

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrl: './websocket.component.css'
})
export class WebsocketComponent implements OnInit, OnDestroy {
  private token = this.keycloakService.keycloak?.token;
  
  messages: string[] = [];

  constructor(private websocketService: WebsocketService, private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    if (this.token) {
      console.log(this.token)
      this.websocketService.connect(this.token);
      console.log("iinit")

      this.websocketService.subscribe('/topic/public', (message) => {
        console.log(message.body);
        this.messages.push(message.body);
      });
    }
  }

  sendMessage(content: string): void {
    this.websocketService.send('/app/chat.sendMessage', { content });
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}
