import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from '../REST/rest.service';
import { WebsocketService } from '../websocketservice/websocketservice.service';
import { IMessage } from '@stomp/stompjs';
import { validate } from 'maplibre-gl';

@Injectable({
  providedIn: 'root'
})
export class ServerDataService {

  constructor(
    private restService: RestService,
    private websocketService: WebsocketService
  ) {}

  async getData(restUrl: string, websocketTopic: string, callback: (Data: any) => void) {
    (await this.restService.GET(restUrl)).subscribe({
      next: (v) =>  {
        for (const element of v) {
          callback(element);
        }
      },
      error: (e) => console.error('Error fetching secure data', e),
      complete: () => console.info('complete') 
    });
    
    if(this.websocketService.connect()){
      this.websocketService.subscribe(websocketTopic, (message: IMessage) => {
        const jsonData = JSON.parse(message.body);
        console.log('Received JSON:', jsonData);
        callback(jsonData);
      });
    }
  }

  async getChatMessage(chatid: string, callback: (Data: any) => void) {
    this.getData(`member/chat/${chatid}/messages`, `/topic/chat/${chatid}`, callback);
  }

  close() {
    this.websocketService.disconnect();
  }
}
