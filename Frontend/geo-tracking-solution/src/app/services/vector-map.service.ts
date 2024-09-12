//Comments are written by Olama 7b from Zagreb for test reasons
import { Injectable } from '@angular/core';
// Importing maplibre-gl library for creating a map
import maplibregl from 'maplibre-gl';
// Importing User class to get user information
import User from '../classes/User';

@Injectable({
  providedIn: 'root'
})
export class VectorMapService {

  private map!: maplibregl.Map; // Declaring a Map property as an optional field
  private vectormarkers: { [key: number]: maplibregl.Marker } = []; // Creating a dictionary to store markers
  private userLocations: { [key: string]: [number, number][] } = {}; // Creating a dictionary to store user locations

  private allLocations: any; // Storing the return value of the drawUserMarkers method

  constructor() { }

  setMap(map: maplibregl.Map): void { // Method for setting the map property
    this.map = map;
  }

  drawUserMarkers(users: User[]): any { // Method for drawing user markers on the map
    if (this.map) { // Checking if the map property is set
      for (const user of users) { // Iterating through the users array
        if (this.vectormarkers[user.id]) { // Checking if a marker already exists for this user
          this.vectormarkers[user.id].setLngLat([user.location.longitude, user.location.latitude]); // Updating the existing marker's location
        } else { // If no marker exists yet, creating one and adding it to the map
          const marker = new maplibregl.Marker().setLngLat([user.location.longitude, user.location.latitude]).addTo(this.map);
          this.vectormarkers[user.id] = marker; // Storing the newly created marker in the vectormarkers dictionary
        }
      }
      if (Object.keys(this.vectormarkers).length > users.length) { // Checking if any markers are left over after drawing new markers
        for (const key of Object.keys(this.vectormarkers)) { // Iterating through the vectormarkers dictionary
          users.findIndex((user) => user.id !== Number.parseInt(key)); // Finding the index of the user with the given ID in the users array
        }
      }
    }
    return this.allLocations; // Returning the value of the allLocations property
  }

  drawUserLines(users: User[]): void { // Method for drawing lines connecting user locations on the map
    for (const user of users) { // Iterating through the users array
      const lat = user.location.latitude; // Getting the latitude and longitude coordinates of the current user's location
      const lng = user.location.longitude;
      if (!this.userLocations[user.id]) { // Checking if this user has any locations stored in the userLocations dictionary
        this.userLocations[user.id] = []; // Creating a new array to store their locations
      }

      this.userLocations[user.id].push([lng, lat]); // Adding the current location to the user's array of locations in the userLocations dictionary

      if (this.userLocations[user.id].length > 10) { // Checking if there are more than 10 locations stored for this user
        this.userLocations[user.id].shift(); // Removing the oldest location from the array
      }
      const lineId = `line-${user.id}`; // Creating a unique ID for each line, using the user's ID as the prefix
      if (this.map) { // Checking if the map property is set
        //debug
        console.log(this.userLocations[user.id]);
        const lineData: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'LineString',
                'coordinates': this.userLocations[user.id]
              },
              properties: {}
            }
          ]
        };

        if (this.map.getSource(lineId)) { // Checking if the line is already on the map
          const source = this.map.getSource(lineId) as maplibregl.GeoJSONSource; // Getting the existing line's GeoJSON data
          source.setData(lineData); // Updating the existing line with new data
        } else { // If no line exists yet, creating a new one and adding it to the map
          this.map.addSource(lineId, {
            'type': 'geojson',
            'data': lineData
          });
          this.map.addLayer({
            'id': lineId,
            'type': 'line',
            'source': lineId,
            'paint': {
              'line-color': '#ff0000',
              'line-width': 4,
              'line-opacity': 0.8
            }
          })
        }
      }
    }
  }

  //clear the MarkersArray
  clearMarkers() {
    this.vectormarkers = [];
  }
}
