import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeoService } from '../geo.service';
import { UtilsService } from '../../services/utils.service';
import { forEach } from '@angular/router/src/utils/collection';


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

    constructor(
        private geoService: GeoService,
        public activeModal: NgbActiveModal,
    // private registerService: RegisterService
    ) { 
        this.setClickedRow = function(index) {
            this.selectedRow = index;
        }
    }

    ngOnInit() { 
        this.lat = -16.299561;
        this.lng = -64.681661;
        this.zoom = 7;
        this.idPicture = 0;
        console.log(this.projectId);
        if(this.projectId != 0) {
            this.geoService.getDataEvaluation(this.projectId).subscribe(data => {
                this.people = data['people'];
                this.locations = data['locations'];
                this.locationsTmp = this.locations;                

                if(this.locations && this.locations[0].lat) {
                    this.lat = this.locations[0].lat;
                    this.lng = this.locations[0].lng;
                    this.zoom = 12;
                }
                console.log(this.locations);
                //console.log(data);
            }, err => {
                console.log(err);
            });
        }

        this.URL_PICTURE = UtilsService.PATH_PHOTOS;
    }

    findMarker(personId: number) {
        console.log(personId);
        let tmp = this.people.find(_ => _.id === personId);        
        if(tmp && tmp.lat) {
            this.lat = parseFloat(tmp.lat);
            this.lng = parseFloat(tmp.lng);
            this.locations = [];
            this.locations.push({'lat': this.lat, 'lng': this.lng});
            console.log(this.locations);
        }else {
            alert("No tiene Cordenadas");
        }
        this.idPicture = 0;
    }

    resetLocations() {
        this.locations = this.locationsTmp;
        this.idPicture = 0;
    }

    showPicture(id: number) {
        this.idPicture = id;
    }
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
