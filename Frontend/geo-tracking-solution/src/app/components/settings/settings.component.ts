import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faUser} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  activeTab: string = 'user';

  // * Icons
  faUser = faUser;

  constructor(private router: Router) { }

  setActiveTab(tab: string){
    this.activeTab = tab;
  }

  isActiveTab(tab: string): boolean{
    return this.activeTab == tab;
  }

}
