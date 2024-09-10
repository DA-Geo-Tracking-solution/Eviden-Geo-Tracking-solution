import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent {
    isDarkMode = false;

    toggleDarkMode(){
      this.isDarkMode = !this.isDarkMode;
      if (this.isDarkMode){
        document.body.classList.add('dark-mode');
      }else{
        document.body.classList.remove('dark-mode')
      }
    }


}
