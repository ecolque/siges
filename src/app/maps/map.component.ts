import { forEach } from '@angular/router/src/utils/collection';
import { Pixel } from 'ol/pixel.js';
import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { Router } from '@angular/router';
import { MapService } from './map.service';
import { MapPersonComponent } from './map-person/map-person.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
//declare let L;
import VectorSource from 'ol/source/Vector.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {fromLonLat} from 'ol/proj.js';
//import TileLayer from 'ol/layer/Tile.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js'
import {BingMaps, Cluster} from 'ol/source.js';;
import TileWMS from 'ol/source/TileWMS.js';
import OSM from 'ol/source/OSM';
import {Circle as CircleStyle, Fill, Stroke, Style, Text, Icon} from 'ol/style.js';
import {toStringHDMS} from 'ol/coordinate.js';
import Overlay from 'ol/Overlay.js';
import {toLonLat} from 'ol/proj.js';
//import {defaults as defaultControls, ScaleLine} from 'ol/control';


@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
  })
  export class MapComponent implements OnInit {    

    lat: number;
    lng: number;
    zoom: number;
    departamentos: any = [];
    projects: any = [];
    activities: any = [];
    people: any = [];
    peopleTmp: any = [];
    dataGrl: any;
    department: number;
    year: number;
    Url: string;

    getPeople: Function;
    selectedRow: Number;

    showInfoPeople: Function;
    selectedActivity: Function;
    selectedRowPerson: number;
    selectedRowActivities: number;

    padreSolo: number;
    madreSolo: number;
    disc: number;
    terceraEdad: number;
    otros: number;
    
    iconMSola: string;
    iconPSolo: string;
    iconDisc: string;
    iconTerceraEdad: string;
    iconFam: string;

    msgList: string;    

    isCheckAreaNacional: boolean
    isCheckAreaDept: boolean
    isLocPoblacionEst: boolean
    
    //str: string;        

    ngOnInit() {
      this.lat = -16.299561;
      this.lng = -64.681661;
      this.zoom = 6;
      this.year = 0;
      this.department = 0;

      this.padreSolo = 0;
      this.madreSolo = 0;
      this.disc = 0;
      this.terceraEdad = 0;
      this.otros = 0;

      this.departamentos = UtilsService.getDepartamentos();

      /*const map = L.map('map').setView([-16.776381594802416, -63.25455729423061], 6);
      
      const baselayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'AEV'
      }).addTo(map);

      const mytile =L.tileLayer('assets/images/Mapnik/{z}/{x}/{y}.png', {
        maxZoom: 12,
        tms: false,
        attribution: 'AEV'
      }).addTo(map);

      L.control.layers({'Basemap':baselayer},{'AEV':mytile}).addTo(map);*/
      
      this.drawMap();      
    }
    

    constructor(private mapService: MapService, private modalService: NgbModal, private router: Router) {            
      
        this.getPeople = function(index, type) {              

            this.people = [];        
            this.activities = [];
            this.selectedRowActivities = -1;
            this.selectedRow = index;
            console.log(this.selectedRow);
            this.peopleTmp = [];
            this.msgList = 'Procesando datos...';
            this.mapService.getPeopleByProjectId(index, type).subscribe (
              data => {
                
        
                this.msgList = null;
                this.zoom = 8;                
                this.peopleTmp = data['people'];
                this.activities = data['activities'];

                this._resetMarkers();             
              
                console.log(data);                
                if(this.peopleTmp) {
                  let tmp = this.peopleTmp[0];
                  if (tmp && tmp.lat != 0 && tmp.lng != 0) {
                    this.lat = tmp.lat;
                    this.lng = tmp.lng;
                  }

                  this._resetCriterios();
                  let count = 0;
                  this.peopleTmp.forEach(x => {
                    if (x.padreSolo == 1) { this.padreSolo += 1; }
                    if (x.madreSolo == 1) { this.madreSolo += 1; }
                    if (x.disc == 1 || x.discFam == 1) { this.disc += 1; }
                    if (x.terceraEdad == 1 || x.terceraEdadFam == 1) { this.terceraEdad += 1; }  
                    if(x.lat != 0 && x.lng != 0) {
                      this.people.push(x);

                      this._setMarkerToMap(x)
                     /*var iconFeature = new Feature(new Point(fromLonLat([x.lng, x.lat])));
                      iconFeature.set('style', new Style({
                        image: new Icon({
                          anchor: [0.5, 0.96],
                          crossOrigin: 'anonymous',
                          src: this.getIcon(x),                          
                        })
                      }));   
                
                      this.map.addLayer(new VectorLayer({
                        style: function(feature){ return feature.get('style') },
                        source: new VectorSource({features: [iconFeature]}), registerId: x.registerId
                      }))*/

                    }                   
                  });
                  this.otros = this.peopleTmp.length - (this.padreSolo + this.madreSolo + this.disc + this.terceraEdad);
                }
              },
              e => { 
                this._setError(e);
                this.msgList = null;
              }
            );                    
        }        

        this.showInfoPeople = function(id, marker) {
          console.log(id);
          this.selectedRowPerson = id;
          if(marker === 1) {
            const modalRef = this.modalService.open(MapPersonComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
            modalRef.componentInstance.registerId = id;
          }

          if(marker === 2) {          
            this.people = this.peopleTmp.filter(x => x.registerId === id);
            if(this.people) {
              let lt = this.people[0].lat;
              let ln = this.people[0].lng;
              if(lt != 0 && ln != 0) {
                this.lat = lt;
                this.lng = ln;
                this._resetMarkers()
                this._setMarkerToMap(this.people[0])
              }else {
                alert('No registra Inspecciones');
              }
            }
          }
        };

        this.selectedActivity = (id: number) => {
          this.selectedRowActivities = id;
        };

        this.Url = 'app/assets/images/';
        // this.Url = 'assets/images/';

        this.iconMSola = this.Url + 'msola.png';
        this.iconPSolo = this.Url + 'psolo.png';
        this.iconDisc = this.Url + 'disc.png';
        this.iconTerceraEdad = this.Url + 'terceraedad.png';
        this.iconFam = this.Url + 'fam.png';
    }

    getPeoplePoints() {
      this.mapService.getMapPeople().subscribe(d => {                        
        var feature, geometry;
        var features = [];
        var count = 0;
        d.forEach(el => {
             /*iconFeature = new Feature({
              geometry: new Point(fromLonLat([el.lng, el.lat])),
              name: 'Null Island',
              population: 4000,
              rainfall: 500
            });*/   

            geometry = new Point(fromLonLat([el.lng, el.lat]));
            feature = new Feature({geometry: geometry, name: el.name, id: el.id});
            features[count] = feature;
            count++;
        });
        
        //iconFeature.setStyle(iconStyle);  
            
        let vectorSource = new VectorSource({
          features: features
        });  
  
        /*let vectorLayer = new VectorLayer({
          source: vectorSource
        });

        this.map.addLayer(vectorLayer);*/
        var clusterSource = new Cluster({
          distance: 40,
          source: vectorSource
        });

        var styleCache = {};
        var clusters = new VectorLayer({
          source: clusterSource,
          style: function(feature) {
            var size = feature.get('features').length;
            var style = styleCache[size];
            if (!style) {
              style = new Style({
                image: new CircleStyle({
                  radius: 10,
                  stroke: new Stroke({
                    color: '#fff'
                  }),
                  fill: new Fill({
                    color: '#3399CC'
                  })
                }),
                text: new Text({
                  text: size.toString(),
                  fill: new Fill({
                    color: '#fff'
                  })
                })
              });
              styleCache[size] = style;
            }
            return style;
          }
        });

        this.map.addLayer(clusters);

        console.log(d);

        function elem_id(id) {
          return document.getElementById(id);
        }                
      }, e => console.log(e));
    }

    private _resetMarkers() {
      if(this.map) {
        const tmpLayers = [...this.map.getLayers().getArray()]                    
        for( let i = 1; i < tmpLayers.length; i++ ) {
            let lay = tmpLayers[i];
            if(lay.type == 'VECTOR' && lay.values_.registerId) {
              console.log(tmpLayers[i])
              this.map.removeLayer(tmpLayers[i]);
            }                                          
        }                  
      }
    }
    private _setMarkerToMap(obj: any) {
      var iconFeature = new Feature(new Point(fromLonLat([obj.lng, obj.lat])));
      iconFeature.set('style', new Style({
        image: new Icon({
          anchor: [0.5, 0.96],
          crossOrigin: 'anonymous',
          src: this.getIcon(obj),
        })
      }));   

      this.map.addLayer(new VectorLayer({
        style: function(feature){ return feature.get('style') },
        source: new VectorSource({features: [iconFeature]}), registerId: obj.registerId
      }))
    }
    

    layerbing: any;
    layeroms: any;
    layerAreaProtNcal: any;
    layerLocPoblacionEst: any;
    layerAreaProtDept: any;
    layercbba: any;
    map: any;    
    points:any = [];
    drawMap() {
      /*let wmslp = new TileWMS({
        url: 'http://10.10.0.102:8082/geoserver/base/wms',
        params: {'LAYERS': 'base:el_alto', 'TILED': true, 'FORMAT': 'image/png', 'TRANSPARENT': true}, 
        serverType: 'geoserver',
        crossOrigin: 'anonymous',
        transition: 1
      });*/
      let areaProtNcal = new TileWMS({
        url: 'https://geo.gob.bo/geoserver/wms',
        params: {'LAYERS': 'sernap:areasprotegidas_nacionales2016', 'TILED': true},        
        serverType: 'geoserver',        
        transition: 1
      });
      areaProtNcal.tileOptions.crossOriginKeyword = null;
      this.layerAreaProtNcal = new TileLayer({
        source: areaProtNcal
      });

      let areaProtDept = new TileWMS({        
        url: 'https://geo.gob.bo/geoserver/wms',
        params: {'LAYERS': 'APs_departamentales', 'TILED': true},        
        serverType: 'geoserver',        
        transition: 1
      });
      areaProtDept.tileOptions.crossOriginKeyword = null;
      this.layerAreaProtDept = new TileLayer({
        source: areaProtDept
      });

      let locPoblacionEst = new TileWMS({        
        url: 'https://geo.gob.bo/geoserver/wms',
        params: {'LAYERS': 'POBLACIONES', 'TILED': true},        
        serverType: 'geoserver',        
        transition: 1
      });
      locPoblacionEst.tileOptions.crossOriginKeyword = null;
      this.layerLocPoblacionEst = new TileLayer({
        source: locPoblacionEst
      });

      let wmscbba = new TileWMS({
        url: 'http://10.10.0.102:8082/geoserver/base/wms',
        params: {'LAYERS': 'base:people', 'TILED': true, 'FORMAT': 'image/png', 'TRANSPARENT': true}, 
        serverType: 'geoserver',
        crossOrigin: 'anonymous',        
        transition: 1
      });
      wmscbba.tileOptions.crossOriginKeyword = null;
      this.layercbba = new TileLayer({
        source: wmscbba
      });
            
      areaProtNcal.on('tileloadstart', function(){        
        progress.addLoading();
      });

      areaProtNcal.on('tileloadend', function() {              
        progress.addLoaded();
      });
      
      areaProtNcal.on('tileloaderror', function(e) {
        progress.addLoaded();
        console.log(e);        
      });

      let view = new View({
        center: fromLonLat([-65.640756, -16.613781]),
        zoom: 5
      });
      

     // var iconStyle = new Style({
       // image: new Icon(/** @type {module:ol/style/Icon~Options} */ ({
         /* anchor: [0.2, 26],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'assets/images/foot.png'
        }))
      });*/

      /*let iconFeature = new Feature({
        geometry: new Point(fromLonLat([-65.640756, -16.613781])),
        name: 'Null Island',
        population: 4000,
        rainfall: 500
      });
      iconFeature.setStyle(iconStyle);  
      let vectorSource = new VectorSource({
        features: [iconFeature]
      });

      let vectorLayer = new VectorLayer({
        source: vectorSource
      });*/

      

                                     

      

      /*closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };*/
      
      /*var control;
      function scaleControl() {        
        control = new ScaleLine({
          units: 'metric',
          bar: true,
          steps: 4,
          text: true,
          minWidth: 140
        });
        return control;
      }*/

      this.map = new Map({
       /* controls: defaultControls().extend([
          scaleControl()
        ]),*/
        layers: [this._getLayerOSM()],        
        target: 'map',
        view: view
      });      
            

      /////////////var iconFeature = new Feature(new Point(fromLonLat([-65.640756, -16.613781])));
      //iconFeature.set('style', createStyle('assets/images/foot.png', undefined));   

      /*this.map.addLayer(new VectorLayer({
        style: function(feature){ return feature.get('style') },
        source: new VectorSource({features: [iconFeature]})
      }))*/

      /*
      iconFeature.setStyle(iconStyle);  
      let vectorSource = new VectorSource({
        features: [iconFeature]
      });

      let vectorLayer = new VectorLayer({
        source: vectorSource
      }); */

      

      //this.getPeoplePoints();
         
      function elem_id(id) {
        return document.getElementById(id);
      }
      
      ////////////var pos = fromLonLat([-65.640756, -16.613781]);
      

     /* var popup = elem_id('popup');
      var popup_closer = elem_id('popup-closer');
      var popup_content = elem_id('popup-content');
      var olpopup = new Overlay({
          element: popup,
          autoPan: false
      });
      this.map.addOverlay(olpopup);
      popup_closer.onclick = function () {
          olpopup.setPosition(undefined);          
          return false;
      };  */  
      
      var map1 = this.map;      
      this.map.on('click', (evt) => {
        //console.log(evt)
        
          try {
            let registerId = 0
            map1.forEachLayerAtPixel(evt.pixel, function(layer) {
              if(layer.type == 'VECTOR') {            
                registerId = layer.values_.registerId
              }
            });
            if(registerId != 0 ){
              console.log(registerId)
              this.showInfoPeople(registerId, 1)
            }
          } catch (error) {
            console.log(error)
          }               
      })
      /*this.map.on('click', (evt) => {

        var view = map1.getView();
        var viewResolution = view.getResolution();        
        var source;
        let tmpId = 0
        map1.getLayers().forEach(d => {          
          console.log(d)
          if(tmpId == 1) {
            source = d;
          }
          tmpId++;
        });        
        console.log(source);
        var url = source.getSource().getGetFeatureInfoUrl(
          evt.coordinate, viewResolution, view.getProjection(),
          {'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50});
        if (url) {          
          //document.getElementById('nodelist').innerHTML = url;
          this.mapService.getFeature(url).subscribe(d => {
            document.getElementById('nodelist').innerHTML = d['_body'];
            console.log(d['_body']);
          }, e => {
            console.log(e);
          });
        }

        //console.log(map1);
        var feature = map1.forEachFeatureAtPixel(evt.pixel,
          (feature, layer) => {
                console.log(feature);
            
                if (feature) {
                  var coord = map1.getCoordinateFromPixel(evt.pixel);
                  if (typeof feature.get('features') === 'undefined') {
                      popup_content.innerHTML = '<h5><b>' + feature.get('name') + '</b></h5><i>this is an <b>unclustered</b> feature</i>';
                  } else {
                      var cfeatures = feature.get('features');
                      this.points = [];
                      if (cfeatures.length > 1) {                          
                          let strContent = '';
                          let strName = '';
                          for (var i = 0; i < cfeatures.length; i++) {
                            strName = cfeatures[i].get('name');                            
                            this.points.push({id: cfeatures[i].get('id'), name: cfeatures[i].get('name')});
                          }                          
                      }
                      if (cfeatures.length == 1) {
                          this.points.push({id: cfeatures[0].get('id'), name: cfeatures[0].get('name')});                          
                      }
                  }

                  console.log(this.points);

                  olpopup.setPosition(coord);
              } else {
                  olpopup.setPosition(undefined);
                  this.points = [];
              }             
          });
        /*var coordinate = evt.coordinate;
        var hdms = toStringHDMS(toLonLat(coordinate));

        content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
        overlay.setPosition(coordinate);*/
     // });
      

     /* map.on('pointermove', function(evt) {
        if (evt.dragging) {
          return;
        }
        var pixel = map.getEventPixel(evt.originalEvent);
        var hit = map.forEachLayerAtPixel(pixel, function() {
          return true;
        });
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
      }); */


      function Progress(el) {
        this.el = el;
        this.loading = 0;
        this.loaded = 0;
      }

      Progress.prototype.addLoading = function() {        
        if (this.loading === 0) {          
          this.show();
        }
        ++this.loading;
        this.update();
        console.log("load**************")
      };

      Progress.prototype.addLoaded = function() {
        var this_ = this;
        setTimeout(function() {
          ++this_.loaded;
          this_.update();
          console.log("load**************")
        }, 100);
      };

      Progress.prototype.update = function() {        
        var width = (this.loaded / this.loading * 100).toFixed(1) + '%';
        this.el.style.width = width;
        if (this.loading === this.loaded) {
          this.loading = 0;
          this.loaded = 0;
          var this_ = this;
          setTimeout(function() {
            this_.hide();
          }, 500);
        }
      };

      Progress.prototype.show = function() {
        this.el.style.visibility = 'visible';
      };

      Progress.prototype.hide = function() {
        if (this.loading === this.loaded) {
          this.el.style.visibility = 'hidden';
          this.el.style.width = 0;
        }
      };

      var progress = new Progress(document.getElementById('progress'));

    }    


    edwin (id) {
      console.log(id);
      const modalRef = this.modalService.open(MapPersonComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
      modalRef.componentInstance.registerId = id;
    }

    addLayerMap(chek) {
      if(chek === 1) {
        if(this.layerbing != null) {this.map.removeLayer(this.layerbing);}
        this.map.getLayers().insertAt(0, this._getLayerOSM());        
      }
      if(chek === 2) {
        if(this.layeroms != null) {this.map.removeLayer(this.layeroms);}        
        this.map.getLayers().insertAt(0, this._getLayerBing());
      }
      console.log(chek);
    }    

    addAreaProtNacl(check) {
      if(check) {
        this.map.getLayers().insertAt(1,this.layerAreaProtNcal);
        //this.map.addLayer(this.layerAreaProtNcal)
      }else {
        this.map.removeLayer(this.layerAreaProtNcal);
      }
    }

    addAreaProtDept(check) {
      if(check) {
        this.map.getLayers().insertAt(1,this.layerAreaProtDept);
      }else {
        this.map.removeLayer(this.layerAreaProtDept);
      }
    }

    addLocPoblacionEst(check) {
      if(check) {
        this.map.getLayers().insertAt(1,this.layerLocPoblacionEst);
      }else {
        this.map.removeLayer(this.layerLocPoblacionEst);
      }
    }    

    addProbreCbba(check) {
      if(check) {
        this.map.getLayers().insertAt(1,this.layercbba);
      }else {
        this.map.removeLayer(this.layercbba);
      }
    }

    private _getLayerOSM() {
      if(!this.layeroms){
        this.layeroms = new TileLayer({source: new OSM()});
        return this.layeroms;
      }else {return this.layeroms;}       
    }

    private _getLayerBing() {
      if(!this.layerbing){
        this.layerbing = new TileLayer({source: new BingMaps({imagerySet: 'Aerial',key: 'ArxDLV-ANzpdA9DkVHwHYjnSUJFVDkvvCKVab3vxun8aNQuHmu_BZQTBY79JdS_T'})});
        return this.layerbing;
      }else {return this.layerbing;}        
    }

    changeYear() {
      if(this.year != 0) {
        this._resetLists();
        this.mapService.getMapDataGenearlByYear(this.year).subscribe(
          data => { this.dataGrl = data; this.activities = data['activities']; console.log(data)},
          e => {
            this._setError(e);
          }
        );
      }
    }

    changeDepartment() {
      if(this.year != 0) {
        this.projects = [];
        this.people = [];
        this.peopleTmp = [];
        this.selectedRowActivities = -1;
        this.selectedRow = 0;
        this.mapService.getProjectsByDepartmentAndGestion(this.department, this.year).subscribe(
          data => { this.projects = data['projects']; this.activities = data['activities']; console.log(data)},
          e => {
           this._setError(e);
          }
        );
      }else {
        this.department = -1;
        alert("Selecione Gestión");
      }      
    }

    resetPeople() {
      this.people = this.peopleTmp;
      this._resetMarkers()
      if(this.people) {
        this.people.forEach(d => {
          this._setMarkerToMap(d)
        })
      }      
      this.selectedRowPerson = -1;
      this.selectedRowActivities = -1;
    }

    private _resetLists() {      
      this.projects = [];
      this.people = [];
      this.peopleTmp = [];
      this.department = 0;
      this.dataGrl = null;
      this.activities = [];      
    }

    private _resetCriterios() {
      this.padreSolo = 0;
      this.madreSolo = 0;
      this.disc = 0;
      this.terceraEdad = 0;
      this.otros = 0;
    }
  

    getIcon(p: any) {
      if(p.madreSolo == 1) {
        return this.iconMSola;
      }else if(p.padreSolo == 1) {
        return this.iconPSolo;
      }else if(p.disc == 1 || p.discFam == 1) {
        return this.iconDisc;
      }else if(p.terceraEdad == 1 || p.terceraEdadFam == 1){
        return this.iconTerceraEdad;
      }else {
        return this.iconFam;
      }
      
    }

    private _setError(e: any){
      if (e == UtilsService.ERROR) {
        this.router.navigate(['login']);
      }else {
        alert(e);
      }
    }
  }