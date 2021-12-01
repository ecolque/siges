import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { GeoService } from './geo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { GeoZoomComponent } from './geo-zoom/geo-zoom.componente';
import { Subscription } from 'rxjs/subscription';
import { AuthService } from '../services/auth.service';
import { GeoReportComponent } from './geo-report/geo-report.component';
import { GeoEvaluationComponent } from './geo-evaluation/geo-evaluation.component';

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
import { GeoObsInsComponent } from './geo-obs-ins/geo-obs.ins.componente';
import { GeoInsPendingComponent } from './geo-ins-pending/geo-ins-pending.componente';

@Component({
  selector: 'app-geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.css']
})
export class GeoComponent implements OnInit {
  busy: Subscription;
  departamentos: any = [];
  years = [];
  insIds: any = [];
  projIds: any = [];
  projectId: number;
  registerId: number;

  currentTime = new Date();

  year: number;
  department: number;

  setClickedRowProject: Function;
  setClickedRowInspection: Function;
  setClickedRowPerson: Function;
  selectedRowProject: Number;
  selectedRowInspection: Number;
  selectedRowPerson: Number;

  images: Array<string>;

  lat: number = -16.299561;
  lng: number = -64.681661;
  zoom: number = 5;

  projects: any;
  people: any;
  inspections: any;
  photos: any;
  mapPhotos: any;
  times: any;

  URL_PRINT: String;

  isSpp: boolean = false;
  err: string;  

  map;
  icon: string;
  iconFooter: string;

  constructor( private geoService: GeoService, 
      private modalService: NgbModal) {
    this.setClickedRowProject = function(index) {
      this.selectedRowProject = index;
      this.projectId = index;
    }

    this.setClickedRowInspection = function(index) {
      this.selectedRowInspection = index;
    }

    this.setClickedRowPerson = function(index) {
      this.selectedRowPerson = index;
    }
    
    this.department = 0;
    this.year = 0;
    this.icon = 'app/assets/css/images/marker-icon.png';
    this.iconFooter = 'app/assets/images/foot.png';  
  }

  ngOnInit() {
    this.err = null;
    this.isSpp = AuthService.userType === 1 ? true : false;
    console.log( UtilsService.SSP );
    console.log( UtilsService.USER );
    if (!this.isSpp) {
      this.departamentos = UtilsService.getDepartamentos();
      for (let i = this.currentTime.getFullYear()+1; i > 2010; i-- ) {
        this.years.push(i);
      }
    }else {
      this.busy = this.geoService.getProjectsByUser().subscribe(
        data => { this.projects = data; console.log(data); },
        error => { this.err = error; }
      );
    }
    this.URL_PRINT = UtilsService.PATH_PRINT;
    this.drawMap();
  }
  view;
  drawMap(){
      this.view = new View({
          center: fromLonLat([-65.640756, -16.613781]),
          zoom: 5,
          minZoom: 4,
          maxZoom: 19
      });
      this.map = new Map({
          layers: [ new TileLayer({source: new BingMaps({imagerySet: 'Aerial',key: 'ArxDLV-ANzpdA9DkVHwHYjnSUJFVDkvvCKVab3vxun8aNQuHmu_BZQTBY79JdS_T'})}) ],  
          target: 'map',
          view: this.view
      });
  }
  private _setMarkerToMap(obj: any, icon = this.icon) {
        if(this.map == null) return;
        var iconFeature = new Feature(new Point(fromLonLat([obj.lng, obj.lat])));
        iconFeature.set('style', new Style({
          image: new Icon({
            anchor: [0.5, 0.96],
            crossOrigin: 'anonymous',
            src: icon,
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

  search() {
    this.projects = null;
    this.inspections = null;
    this.people = null;
    this.photos = null;
    this.mapPhotos = null;
    this.times = null
    this.selectedRowProject = 0;
    this.selectedRowInspection = 0;
    this.selectedRowPerson = 0;
    this.registerId = 0;
    if(this.department != 0 && this.year != 0){
      this.busy = this.geoService.getProjects(this.department, this.year).subscribe(
        data => {this.projects = data; console.log(data); },
        error => alert(error)
        );
    }else{alert("Seleccione departamento y Año");}
  }

  searchPerson(project: any) {
    this.registerId = 0;
    this.inspections = null;
    this.insIds = [];
    this.selectedRowInspection = 0;
    this.photos = null;
    this.mapPhotos = null;
    this.times = null;
    this.busy = this.geoService.getPeople(project.id).subscribe(data => {this.people = data; console.log(data)});
  }

  searchInspection(project: any) {
    this.people = null;
    this.inspections = null;
    this.insIds = [];
    this.selectedRowInspection = 0;
    this.selectedRowPerson = 0;
    this.photos = null;
    this.mapPhotos = null;
    this.times = null;
    this.projectId = project.id;
    this.registerId = 0;
    this.busy = this.geoService.getInspections(project.id).subscribe(data => { this.inspections = data; console.log(data); });
  }

  getInspectionsByRegisterId(registerId: number, countInspections: number) {
    this.registerId = registerId;
    this.inspections = null;
    this.insIds = [];
    this.selectedRowInspection = 0;
    this.photos = null;
    this.mapPhotos = null;
    this.times = null;
    if (countInspections != 0) {
        this.busy = this.geoService.getInspectionsByRegisterId(registerId).subscribe(data => {this.inspections = data; console.log(data); });
    }
  }

  getTime(insp: any) {
    this.busy = this.geoService.getTimeSupervisionByInspectionId(insp.id).subscribe(data => {
      insp.hr = data['time'];            
    });
  }

  getPhotos(inspectionId: number) {

    this.photos = null;
    this.mapPhotos = null;
    this.times = null;
    this.busy = this.geoService.getPhotos(inspectionId).subscribe(data => {
      this.zoom = 14;
      this.photos = data;  this.mapPhotos = data; console.log(data);
      if (this.photos) {
        let tmp = this.photos[0];
        if (tmp && tmp.lat != 0 && tmp.lng != 0) {
          this.view.setZoom(15);
          this.view.setCenter(fromLonLat([tmp.lng, tmp.lat])); 
          // this.lat = tmp.lat;
          // this.lng = tmp.lng;
          // this._setMarkerToMap({lat: tmp.lat, lng: tmp.lng});
        }
        this._resetMarkers();
        this.photos.forEach(loc => {
          if (loc && loc.lat != 0 && loc.lng != 0) {
            this._setMarkerToMap({lat: loc.lat, lng: loc.lng});
          }
        });
      }
    });
  }

  getTraking(inspectionId: number) {
    this.busy = this.geoService.getTraking(inspectionId).subscribe(data => {
      this.times = data;
      // this.zoom = 14;
      this.mapPhotos = null;
      if (this.times) {

        this.view.setZoom(15);
        this.view.setCenter(fromLonLat([this.times[0].locations[0].lng, this.times[0].locations[0].lat])); 
        this._resetMarkers();

        for (let i = 0; i < this.times.length; i++) {
          // this.lat = this.times[i].locations[0].lat;
          // this.lng = this.times[i].locations[0].lng;
          if (this.mapPhotos === null) { this.mapPhotos = []; }
          
          for (let j = 0; j < this.times[i].locations.length; j++) {
              let locFirst = this.times[i].locations[j];
              /*if(j === 0){
                locFirst.icon = "assets/images/start.png"
              }else if(j === this.times[i].locations.length-1){
                locFirst.icon = "assets/images/end.png"
              }else{
                locFirst.icon = "assets/images/foot.png"
              }*/
              // locFirst.icon = this.iconFooter;              
              // this.mapPhotos.push(locFirst);
              // this.photos.forEach(loc => {
                if (locFirst && locFirst.lat != 0 && locFirst.lng != 0) {
                  this._setMarkerToMap({lat: locFirst.lat, lng: locFirst.lng}, this.iconFooter);
                }
              // });
          }
          
          /*let locFirst = this.times[i].locations[0];
          locFirst.icon = "assets/images/start.png"
          this.mapPhotos.push(locFirst);
          let locLast = this.times[i].locations[this.times[i].locations.length-1];
          locLast.icon = "assets/images/end.png"
          this.mapPhotos.push(locLast);        */
          // this.mapPhotos = this.locations.first();
        }
      }
     /* this.zoom = 14;
      this.photos = data;  this.mapPhotos = data; consol console.log(data)
      if(this.photos){
        let tmp = this.photos[0];
        if(tmp && tmp.lat != 0 && tmp.lng != 0){
          this.lat = tmp.lat;
          this.lng = tmp.lng;
        }
      }  */
    });
  }

  zoomImg(photo: any) {
    const modalRef = this.modalService.open(GeoZoomComponent, {size: 'lg'});    
    modalRef.componentInstance.photoId = photo.id;
    modalRef.componentInstance.description = photo.description;
    modalRef.componentInstance.date = photo.date;
    modalRef.componentInstance.created = photo.created;  
  }

  findMarker(photoId: number) {
    this.times = null;
    this.mapPhotos = this.photos.filter(_ => _.id === photoId);
    if (this.mapPhotos) {
      // this.lat = this.mapPhotos[0].lat;
      // this.lng = this.mapPhotos[0].lng;
        this._resetMarkers();
        this.view.setZoom(14);
        this.view.setCenter(fromLonLat([this.mapPhotos[0].lng, this.mapPhotos[0].lat])); 
        this._setMarkerToMap({lat: this.mapPhotos[0].lat, lng: this.mapPhotos[0].lng})
    }
  }

  changeInspections(obj: any) {
    console.log(obj.selected);
    if (obj.selected) {
      this.insIds.push(obj.id);
    }else {
      let data = this.insIds.filter(_ => _ == obj.id);
      if (data){
        this.insIds.splice(data.indexOf(obj.id), 1);
      }
    }
    console.log(this.insIds);
  } 

  changeProjects(obj: any) {
    console.log(obj.selected);
    if (obj.selected) {
      this.projIds.push(obj.id);
    }else {
      let data = this.projIds.filter(_ => _ == obj.id);
      if (data){
        this.projIds.splice(data.indexOf(obj.id), 1);
      }
    }
    console.log(this.projIds);
  }

  searchOnlyInspections(){
    this.projects = this.projects.filter(_ => _.inspections != 0);
    this.projIds = [];
  }

  changeCbx(){
    this.projects = null;
  }

  report() {
    if(this.year != 0 && this.department != 0) {
      const modalRef = this.modalService.open(GeoReportComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
      modalRef.componentInstance.year = this.year;
      modalRef.componentInstance.department = this.department;  
    }else { alert("Seleccione departamento y Año"); }
  }

  openFormEvaluation(projectId: number, projectCode: string) {
    const modalRef = this.modalService.open(GeoEvaluationComponent, {size: 'lg', backdrop: 'static', keyboard: false});    
    modalRef.componentInstance.projectId = projectId;
    modalRef.componentInstance.projectCode = projectCode;
    /*modalRef.componentInstance.date = photo.date;
    modalRef.componentInstance.created = photo.created;  */
  }

  setObs(inspecion){
    console.log(inspecion);
    const modalRef = this.modalService.open(GeoObsInsComponent, {size: 'sm', backdrop: 'static', keyboard: false});    
    modalRef.componentInstance.ins = JSON.parse(JSON.stringify(inspecion));
    modalRef.result.then((res) => {
      console.log(':::::: ',res);
      if (res.ok == true) {
        inspecion.obs = res.obs;
      }
    });
    // modalRef.componentInstance.projectCode = projectCode;
  }
  openFormPending(){
    const modalRef = this.modalService.open(GeoInsPendingComponent, {size: 'lg', backdrop: 'static', keyboard: false});    
    modalRef.componentInstance.userId = UtilsService.USER.id;
    modalRef.result.then((res) => {
      console.log(':::::: ',res);
      if (res.ok == true) {
        // inspecion.obs = res.obs;
      }
    });
  }

  isAcceses(param: number) {    
    return UtilsService.isAcceses(param);   
  }
}
