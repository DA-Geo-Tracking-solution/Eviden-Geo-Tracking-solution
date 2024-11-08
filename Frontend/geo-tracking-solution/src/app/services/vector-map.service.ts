//Comments are written by Olama 7b from Zagreb for testing reasons
import { Injectable } from '@angular/core';
// Importing maplibre-gl library for creating a map
import maplibregl from 'maplibre-gl';
// Importing User class to get user information
import User from '../classes/User';
import MaplibreTerradrawControl from '@watergis/maplibre-gl-terradraw';
import { FeatureCollection, Feature, Polygon, GeoJsonProperties } from 'geojson';


@Injectable({
  providedIn: 'root'
})

export class VectorMapService {
  private map!: maplibregl.Map; // Declaring a Map property as an optional field
  private drawControl!: MaplibreTerradrawControl;
  private vectormarkers: { [key: number]: maplibregl.Marker } = []; // Creating a dictionary to store markers
  private userLocations: { [key: string]: [number, number][] } = {}; // Creating a dictionary to store user locations

  private allLocations: any; // Storing the return value of the drawUserMarkers method
  private geojsonData: FeatureCollection<Polygon, GeoJsonProperties> = {
    'type': 'FeatureCollection',
    'features': []
  };

  //temporary to store coordinates from map should later be pushed to backend
  private drawingCoordinates: any;

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
        //console.log(this.userLocations[user.id]);

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

  drawDrawings(drawingData: any) {
    for (const figure of drawingData) {
      if (figure.type === 'Polygon') {
        const polygonCoordinates: [number, number][] = [];
        for (const coordinates of figure.coordinates[0]) {
          polygonCoordinates.push([coordinates[0], coordinates[1]]);
        }
        this.addPolygon(polygonCoordinates, drawingData.findIndex((drawing: any) => drawing === figure));
      } else if (figure.type === 'Circle') {
        const center = [figure.coordinates[0][0], figure.coordinates[0][1]];
        const radius = figure.coordinates[1];
        //factor for latitude specific factor from DegreeLongitude to meters
        //const metersPerDegreeLongitude = 111320 * Math.cos(figure.coordinates[0][1] * (Math.PI / 180));

        /*L.circle(center, {
          radius: radius * metersPerDegreeLongitude,
          color: 'blue',
          fillColor: '#3388ff',
          fillOpacity: 0.5
        }).addTo(this.drawnItems);*/
      } else if (figure.type === 'Linestring') {
        const linestringCoordinates = [];
        for (const coordinates of figure.coordinates) {
          linestringCoordinates.push([coordinates[1], coordinates[0]]);
        }
        /*L.polyline(linestringCoordinates, {
          color: 'blue',
          fillColor: '#3388ff',
          fillOpacity: 0.5
        }).addTo(this.drawnItems);*/
      } else if (figure.type === 'Point') {
        const pointCoordinates: L.LatLngExpression = [figure.coordinates[1], figure.coordinates[0]];
        /*L.circleMarker(pointCoordinates, {radius: 5}).addTo(this.drawnItems);*/
      }
    }
    if (this.map) {
      this.map.addSource("5ae", {
        'type': 'geojson',
        'data': this.geojsonData
      });
      this.map.addLayer({
        'id': '5ae',
        'type': 'fill',
        'source': '5ae',
        'paint': {
          'fill-color': '#ff0000',
          'fill-opacity': 0.8
        }
      });
    }
  }


  addPolygon(coordinates: [number, number][], id: number) {
    const newPolygon: Feature<Polygon> = {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [coordinates]
      },
      "properties": {
        "id": id
      }
    };
    this.geojsonData.features.push(newPolygon);
  }


  //clear the MarkersArray
  clearMarkers() {
    this.vectormarkers = [];
  }

  initializeDrawControl(): void {
    this.drawControl = new MaplibreTerradrawControl();

    // Zeichnungskontrolle der Karte hinzufügen
    this.map.addControl(this.drawControl, 'bottom-left');

    this.map.on('load', (event) => {
      let data = [];
      const terraDrawInstance = this.drawControl.getTerraDrawInstance(); //get Drawings data

      terraDrawInstance.on('finish', (event) => {
        data = [];
        const storedFeatures = terraDrawInstance["_store"]["store"]; // Access the stored features from the Map
        for (const key in storedFeatures) { // iterate for every figure
          if (storedFeatures.hasOwnProperty(key)) {
            const feature = storedFeatures[key];

            if (["polygon", "rectangle", "angled-rectangle", "freehand"].includes(feature.properties.mode)) {
              data.push({
                type: "Polygon",
                coordinates: feature.geometry.coordinates
              });
            } else if (["circle"].includes(feature.properties.mode)) {
              let lngcoordinates = 0;
              let latcoordinates = 0;

              for (let i = 0; i < feature.geometry.coordinates[0].length - 1; i++) {
                lngcoordinates += Number(feature.geometry.coordinates[0][i][0]);
                latcoordinates += Number(feature.geometry.coordinates[0][i][1]);
              }

              const avglng = lngcoordinates / (feature.geometry.coordinates[0].length - 1);
              const avglat = latcoordinates / (feature.geometry.coordinates[0].length - 1);
              //caculate radius (first Longitude - the Longitude on the opposit side of the circle)
              const radius = (Number(feature.geometry.coordinates[0][0][0]) - Number(feature.geometry.coordinates[0][(feature.geometry.coordinates[0].length - 1) / 2][0])) / 2;

              data.push({
                type: "Circle",
                coordinates: [[avglng, avglat], radius]
              });
            } else if (["linestring"].includes(feature.properties.mode)) {
              data.push({
                type: "Linestring",
                coordinates: feature.geometry.coordinates
              });
            } else if (["point"].includes(feature.properties.mode)) {
              data.push({
                type: "Point",
                coordinates: feature.geometry.coordinates
              });
            }
          }
        }
        this.drawingCoordinates = data;
      });
    });
  }

  getDrawingData(): void {
    return this.drawingCoordinates;
  }
}
