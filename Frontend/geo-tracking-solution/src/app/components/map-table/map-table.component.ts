import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import User from '../../classes/User';
import { ServerDataService } from '../../services/server-data/server-data.service';
import { MatSort } from '@angular/material/sort';

// interface to store the maptypes
interface MapType {
  value: string;
  viewValue: string;
}



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


  constructor(private serverDataService: ServerDataService) {}

  ngOnInit() {
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


  //parameter to declare maptype ('vector', 'raster', 'satellite') default should be vector because best performance
  public selectedMap: string = 'vector';

  //different MapTypes for html Dropdown Selection
  public mapTypes: MapType[] = [
    { value: 'vector', viewValue: 'Vektor' },
    { value: 'raster', viewValue: 'Raster' },
    { value: 'satellite', viewValue: 'Satelit' },
  ];

  //delete current Map and make init of new chosen Map
  changeMapType(selectedMap: string) {
    this.selectedMap = selectedMap;    
  }

}
