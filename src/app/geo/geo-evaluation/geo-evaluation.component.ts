import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeoService } from '../geo.service';
import { UtilsService } from '../../services/utils.service';
import { forEach } from '@angular/router/src/utils/collection';

import Map from 'ol/Map.js';
import {fromLonLat} from 'ol/proj.js';
import View from 'ol/View.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js'
import Feature from 'ol/Feature.js';
import {Style, Icon} from 'ol/style.js';
import Point from 'ol/geom/Point.js';
import VectorSource from 'ol/source/Vector.js';
import {BingMaps, Cluster} from 'ol/source.js';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'app-evaluation',
  templateUrl: './geo-evaluation.component.html',
  styleUrls: ['./geo-evaluation.component.css']
})
export class GeoEvaluationComponent implements OnInit {
    
    lat: number;
    lng: number;
    zoom: number;
    people: any;
    locations: any;
    locationsTmp: any;

    projectId: number;
    projectCode: string;
    URL_PICTURE: String;
    idPicture: number;

    setClickedRow: Function;
    selectedRow: Number;

    map;
    Url: string;
    icon: string;

    constructor(
        private geoService: GeoService,
        public activeModal: NgbActiveModal,
    // private registerService: RegisterService
    ) { 
        this.setClickedRow = function(index) {
            this.selectedRow = index;
        }
        this.Url = 'app/assets/images/';
    }

    async ngOnInit() { 
    

        this.lat = -16.299561;
        this.lng = -64.681661;
        this.zoom = 5;
        this.idPicture = 0;
        console.log(this.projectId);
        if(this.projectId != 0) {
            this.geoService.getDataEvaluation(this.projectId).subscribe( async (data) => {
                this.people = data['people'];
                this.locations = data['locations'];
                this.locationsTmp = this.locations;                

                // if(this.locations && this.locations[0].lat) {
                //     this.lat = this.locations[0].lat;
                //     this.lng = this.locations[0].lng;
                //     this.zoom = 12;
                // }
                await this.drawMap();
                this.locations.forEach(loc => {
                    this._setMarkerToMap(loc);
                });
                //console.log(data);
            }, err => {
                console.log(err);
            });
        }

        this.URL_PICTURE = UtilsService.PATH_PHOTOS;
    }

    drawMap(){
        return new Promise((res, rej) => {
            timer(1000).subscribe(() => {
                let view = new View({
                    center: fromLonLat([-65.640756, -16.613781]),
                    zoom: this.zoom
                });
                this.map = new Map({
                    layers: [ new TileLayer({source: new BingMaps({imagerySet: 'Aerial',key: 'ArxDLV-ANzpdA9DkVHwHYjnSUJFVDkvvCKVab3vxun8aNQuHmu_BZQTBY79JdS_T'})}) ],  
                    target: 'map1',
                    view: view
                });
                res(true);
            });
        });
    }

    private _setMarkerToMap(obj: any) {
        if(this.map == null) return;
        var iconFeature = new Feature(new Point(fromLonLat([obj.lng, obj.lat])));
        iconFeature.set('style', new Style({
          image: new Icon({
            anchor: [0.5, 0.96],
            crossOrigin: 'anonymous',
            src: this.icon = this.Url + 'fam.png',
          })
        }));   
  
        this.map.addLayer(new VectorLayer({
          style: function(feature){ return feature.get('style') },
          source: new VectorSource({features: [iconFeature]}), 
          registerId: obj.registerId
        }));
    }
    private _resetMarkers() {
        if(this.map) {
          const tmpLayers = [...this.map.getLayers().getArray()]                    
          for( let i = 1; i < tmpLayers.length; i++ ) {
              let lay = tmpLayers[i];
              if(lay.type == 'VECTOR') {
                this.map.removeLayer(tmpLayers[i]);
              }                                          
          }                  
        }
    }

    findMarker(personId: number) {
        console.log(personId);
        let tmp = this.people.find(_ => _.id === personId);    
        if(tmp && tmp.lat) {
            this._resetMarkers();
            this._setMarkerToMap({lat: parseFloat(tmp.lat) , lng: parseFloat(tmp.lng)})
            // this.lat = parseFloat(tmp.lat);
            // this.lng = parseFloat(tmp.lng);
            // this.locations = [];
            // this.locations.push({'lat': this.lat, 'lng': this.lng});
            // console.log(this.locations);
        }else {
            alert("No tiene Cordenadas");
        }
        this.idPicture = personId;
    }

    resetLocations() {
        // this.locations = this.locationsTmp;
        this.idPicture = 0;
        this.locations.forEach(loc => {
            this._setMarkerToMap(loc);
        });
    }

    // showPicture(id: number) {
    //     this.idPicture = id;
        
    // }
  /*photoId: number;
  description: string;
  date: string;
  created: string;

  geoPhoto: any;
  busy: Subscription;

  

  ngOnInit() {    
    if (this.photoId != 0 ) {
      this.busy = this.geoService.getPhoto(this.photoId)
                      .subscribe(
                          data => {
                              this.geoPhoto = data;
                              console.log(data);
                          }, errors => {
                             alert(errors);
                          });
    }else {
      this.activeModal.close('');
    }
  }*/
}
