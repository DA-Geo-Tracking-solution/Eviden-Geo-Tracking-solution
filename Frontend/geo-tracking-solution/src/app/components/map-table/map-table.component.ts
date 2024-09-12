import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import User from '../../classes/User';

@Component({
  selector: 'app-map-table',
  templateUrl: './map-table.component.html',
  styleUrl: './map-table.component.css'
})
export class MapTableComponent {
  currentUserData: User = { id: -1, username: "currentUser", group: "auth", location: {longitude: 0, latitude: 0}};
  users: User[] = [this.currentUserData];

  error: string = "Error";
  displayedColumns: string[] = ['id', 'username', 'longitude', 'latitude'];


  dataSource = new MatTableDataSource(this.users);

}
