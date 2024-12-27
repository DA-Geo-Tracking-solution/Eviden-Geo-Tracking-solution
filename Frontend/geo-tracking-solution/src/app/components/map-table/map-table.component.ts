import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import User from '../../classes/User';
import { ThemeService } from '../../services/Theme/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieSettingsService } from '../../services/Cookies/cookie-settings.service';
import { MapType } from '../../models/interfaces';

@Component({
  selector: 'app-map-table',
  templateUrl: './map-table.component.html',
  styleUrl: './map-table.component.css'
})
export class MapTableComponent {
  currentUserData: User = { id: -1, username: "currentUser", group: "auth", location: { longitude: 16.1, latitude: 48.627 } };
  users: User[] = [this.currentUserData];

  displayedColumns: string[] = ['id', 'username', 'longitude', 'latitude'];

  dataSource = new MatTableDataSource(this.users);

  currentTheme: string = '';
  //parameter to declare maptype ('vector', 'raster', 'satellite') default should be vector because best performance
  public selectedMap: string = 'vector';

  //different MapTypes for html Dropdown Selection
  public mapTypes: MapType[] = [
    { value: 'vector', viewValue: 'Vektor' },
    { value: 'raster', viewValue: 'Raster' },
    { value: 'satellite', viewValue: 'Satelit' },
  ];

  constructor(private themeService: ThemeService, private cookieService: CookieSettingsService, private translateService: TranslateService) { 
    this.translateService.use(this.cookieService.getLanguage());
  }

  ngOnInit(): void {
    this.themeService.currentTheme.subscribe((theme) => {
      this.currentTheme = theme;
    });
  }


  //delete current Map and make init of new chosen Map
  changeMapType(selectedMap: string) {
    this.selectedMap = selectedMap;
  }

}
