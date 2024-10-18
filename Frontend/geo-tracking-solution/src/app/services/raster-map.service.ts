import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import User from '../classes/User';
import 'leaflet-draw';

@Injectable({
  providedIn: 'root'
})
export class RasterMapService {

  private map!: L.Map;
  private rastermarkers: { [key: number]: L.Marker } = [];
  private userLocations: { [key: string]: [number, number][] } = {};

  private allLocations: any;

  constructor() { }

  setMap(map: L.Map): void {
    this.map = map;
  } drawUserMarkers(users: User[]) {
    if (this.map) {
      for (const user of users) {
        if (this.rastermarkers[user.id]) {
          this.rastermarkers[user.id].setLatLng([user.location.latitude, user.location.longitude])
        } else {
          const marker = L.marker([user.location.latitude, user.location.longitude]);
          marker.addTo(this.map);
          marker.bindPopup(`<b>I am ${user.username}</b>`).openPopup();
          this.rastermarkers[user.id] = marker;
        }
      }
      if (Object.keys(this.rastermarkers).length > users.length) {
        for (const key of Object.keys(this.rastermarkers)) {
          users.findIndex((user) => user.id !== Number.parseInt(key));
        }
      }
    }
    return this.allLocations;
  }
  //Draw a line for each User
  drawUserLines(users: User[]) {
    for (const user of users) {
      const lat = user.location.latitude;
      const lng = user.location.longitude;
      if (!this.userLocations[user.id]) {
        this.userLocations[user.id] = [];
      }
      //add current location to Array and get rid of the oldest when more than 10 locations
      this.userLocations[user.id].push([lat, lng]);
      if (this.userLocations[user.id].length > 10) {
        this.userLocations[user.id].shift();
      }
    }
    // Check if the map is defined
    if (!this.map) {
      return;
    }

    // Remove all lines from the map
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Polyline) {
        this.map?.removeLayer(layer);
      }
    });

    // Draw a line for each user
    for (const userId in this.userLocations) {
      const latlngs = this.userLocations[userId];
      if (latlngs.length > 1) {
        L.polyline(latlngs, { color: 'red' }).addTo(this.map);
      }
    }
  }
  //clear the MarkersArray
  clearMarkers() {
    this.rastermarkers = [];
  }

  initializeDrawing(): void {
    // Zeichenebene
    const drawnItems = new L.FeatureGroup();
    this.map.addLayer(drawnItems);

    // Zeichnungsoptionen
    const drawControl = new L.Control.Draw({
      draw: {
        marker: false,
        polyline: {
          shapeOptions: {
            color: '#0000ff',   // Blue stroke color
            weight: 4,          // Stroke width of 4 pixels
            opacity: 0.7,       // 70% opacity for the line
            dashArray: '5, 5',  // Dashed line (5px dash, 5px gap)
            lineCap: 'round',   // Rounded line ends
            lineJoin: 'round'   // Rounded line joins
          }
        },
        polygon: {
          shapeOptions: {
            color: '#00ff00'
          }
        },
        rectangle: {
          shapeOptions: {
            color: '#000000'
          }
        },
        circle: {
          shapeOptions: {
            color: '#ff8800'
          }
        }
      },
      edit: {
        featureGroup: drawnItems, // Set feature group for editing
        remove: true, // Enable delete button at the bottom
      }
    });

    this.map.addControl(drawControl);

    // Ereignisse, um auf die gezeichneten Formen zu reagieren
    this.map.on(L.Draw.Event.CREATED, function (event) {
      const layer = event.layer;
      drawnItems.addLayer(layer);

      let coordinates;

      if (layer instanceof L.Polygon) {
        coordinates = layer.getLatLngs();
        console.log(coordinates);
      }
    });
  }
}
