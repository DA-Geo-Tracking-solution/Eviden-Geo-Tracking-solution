import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import User from '../../classes/User';
import 'leaflet-draw';

@Injectable({
  providedIn: 'root'
})
export class RasterMapService {

  private map!: L.Map;
  private rastermarkers: { [key: number]: L.Marker } = [];
  private userLocations: { [key: string]: [number, number][] } = {};

  private allLocations: any;
  private drawnItems = new L.FeatureGroup();
  //temporary to store coordinates from map should later be pushed to backend
  private drawingCoordinates: any;

  constructor() { }

  setMap(map: L.Map): void {
    this.map = map;
  }

  drawUserMarkers(users: User[]) {
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

  drawDrawings(drawingData: any) {
    for (const figure of drawingData) {
      if (figure.type === 'Polygon') {
        const polygonCoordinates = [];
        for (const coordinates of figure.coordinates[0]) {
          polygonCoordinates.push([coordinates[1], coordinates[0]]);
        }
        L.polygon(polygonCoordinates, {
          color: 'blue',
          fillColor: '#3388ff',
          fillOpacity: 0.5
        }).addTo(this.drawnItems);
      } else if (figure.type === 'Circle') {
        const center: L.LatLngExpression = [figure.coordinates[0][1], figure.coordinates[0][0]];
        const radius = figure.coordinates[1];
        //factor for latitude specific factor from DegreeLongitude to meters
        const metersPerDegreeLongitude = 111320 * Math.cos(figure.coordinates[0][1] * (Math.PI / 180));

        L.circle(center, {
          radius: radius * metersPerDegreeLongitude,
          color: 'blue',
          fillColor: '#3388ff',
          fillOpacity: 0.5
        }).addTo(this.drawnItems);
      } else if (figure.type === 'Linestring') {
        const linestringCoordinates = [];
        for (const coordinates of figure.coordinates) {
          linestringCoordinates.push([coordinates[1], coordinates[0]]);
        }
        L.polyline(linestringCoordinates, {
          color: 'blue',
          fillColor: '#3388ff',
          fillOpacity: 0.5
        }).addTo(this.drawnItems);
      }else if (figure.type === 'Point') {
        const pointCoordinates: L.LatLngExpression = [figure.coordinates[1], figure.coordinates[0]];
        L.circleMarker(pointCoordinates, {radius: 5}).addTo(this.drawnItems);
      }
    }
  }

  //clear the MarkersArray
  clearMarkers() {
    this.rastermarkers = [];
  }

  initializeDrawing(): void {
    // Zeichenebene
    this.map.addLayer(this.drawnItems);

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
        featureGroup: this.drawnItems, // Set feature group for editing
        remove: true, // Enable delete button at the bottom
      }
    });

    this.map.addControl(drawControl);

    // Ereignisse, um auf die gezeichneten Formen zu reagieren
    this.map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      this.drawnItems.addLayer(layer);

      let coordinates;

      if (layer instanceof L.Polygon) {
        coordinates = layer.getLatLngs();
        console.log(coordinates);
      }
    });
  }

  getDrawingData(): void {
    return this.drawingCoordinates;
  }
}
