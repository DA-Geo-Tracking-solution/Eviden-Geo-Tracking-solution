import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import User from '../../classes/User';
import { ThemeService } from '../../services/Theme/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieSettingsService } from '../../services/Cookies/cookie-settings.service';
import { MapType } from '../../models/interfaces';
import { ServerDataService } from '../../services/server-data/server-data.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-map-table',
  templateUrl: './map-table.component.html',
  styleUrl: './map-table.component.css'
})
export class MapTableComponent implements OnInit {
  currentUserData: User = { id: -1, username: "currentUser", group: "auth", location: { longitude: 16.1, latitude: 48.627 } };
  users: User[] = [this.currentUserData];

  displayedColumns: string[] = ['id', 'username', 'longitude', 'latitude'];

  dataSource!: MatTableDataSource<User>;
  @ViewChild(MatSort) sort!: MatSort;

  currentTheme: string = '';

  //parameter to declare maptype ('vector', 'raster', 'satellite') default should be vector because best performance
  public selectedMap: string = 'vector';

  //different MapTypes for html Dropdown Selection
  public mapTypes: MapType[] = [
    { value: 'vector', viewValue: 'Vektor' },
    { value: 'raster', viewValue: 'Raster' },
    { value: 'satellite', viewValue: 'Satelit' },
  ];

  constructor(private themeService: ThemeService, private cookieService: CookieSettingsService, private translateService: TranslateService, private serverDataService: ServerDataService) { 
    this.translateService.use(this.cookieService.getLanguage());
  }

  ngOnInit(): void {
    this.themeService.currentTheme.subscribe((theme) => {
      this.currentTheme = theme;
    });

    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;

    const date = new Date(Date.now());
    date.setFullYear(2023)


    const earliestDate = date.toISOString().split('.')[0] + date.toISOString().split('.')[1].substring(3);

    this.serverDataService.getGeoLocationData(0, earliestDate, (data: any) => {
      if (data.key?.timestamp && data.key?.userEmail && data.longitude && data.latitude) {
        const user: User = { id: -0, username: data.key.userEmail, group: "auth", location: { longitude: data.longitude, latitude: data.latitude } }
        this.users.push(user)
        console.log(this.users);
        this.dataSource.data = this.users;
      }
    });
  }


  //delete current Map and make init of new chosen Map
  changeMapType(selectedMap: string) {
    this.selectedMap = selectedMap;    
  }

}
