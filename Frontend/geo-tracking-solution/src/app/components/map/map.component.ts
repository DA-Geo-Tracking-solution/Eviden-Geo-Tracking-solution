import { Component, Input, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { RasterMapService } from '../../services/raster-map.service';
import { VectorMapService } from '../../services/vector-map.service';
import User from '../../classes/User';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/src/css/maplibre-gl.css';
import maplibregl from 'maplibre-gl';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

interface MapType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  public _selectedMap: any;

  @Input()
  //array to store user information
  public users: User[] = [];
  @Input()
  set selectedMap(value: string){
    this._selectedMap = value;
    this.reloadMap(this._selectedMap);
  }
  //parameter to seclare maptype ('vector', 'raster', 'satellite') default should be vector because best performance
  private map: any;

  constructor(private rasterMapService: RasterMapService, private vectorService: VectorMapService) { }

  //draw new Lines and Markers when something changes
  ngOnChanges(changes: SimpleChanges): void {
    switch (this._selectedMap) {
      case 'vector':
        this.vectorService.drawUserMarkers(this.users);
        this.vectorService.drawUserLines(this.users);
        break;
      case 'raster':
        this.rasterMapService.drawUserMarkers(this.users);
        this.rasterMapService.drawUserLines(this.users);
        break;
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }


  //initialize chosen Map
  private initMap(): void {
    switch (this._selectedMap) {
      case 'vector':
        this.initVectormap();
        break;
      case 'raster':
        this.initRastermap();
        break;
      case 'satellite':
        //placeholder, because currently no satellite image map
        this.initVectormap();
        break;
    }
  }

  //Initialize Raster map
  private initRastermap() {
    this.rasterMapService.clearMarkers();
    this.map = L.map('map', {
      center: [48.627, 16.1],
      zoom: 8,
      worldCopyJump: true
    });

    const tiles = L.tileLayer('http://localhost:8080/styles/basic-preview/512/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    this.rasterMapService.setMap(this.map);

  }

  //delete current Map and make init of new chosen Map
  reloadMap(_selectedMap: string) {
    this._selectedMap = _selectedMap;
    this.map.remove();
    this.initMap();
  }

  // Initialize Vektormap 
  private initVectormap() {
    this.vectorService.clearMarkers();
    this.map = new maplibregl.Map({
      container: "map",
      style: 'http://localhost:8080/styles/basic-preview/style.json',
      center: [16.1, 48.627],
      zoom: 8,
      minZoom: 3,
    });
    this.map.addControl(new maplibregl.NavigationControl({
      visualizePitch: true,
      showZoom: true,
      showCompass: true
    }));
    this.vectorService.setMap(this.map);
    this.vectorService.initializeDrawControl();
  }
}
