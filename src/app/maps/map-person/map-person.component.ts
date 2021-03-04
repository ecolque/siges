//import { RegisterService } from './../../services/register.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from '../../services/utils.service';
import { GeoService } from '../../geo/geo.service';


@Component({
  selector: 'map-person',
  templateUrl: './map-person.component.html',
  // styleUrls: ['./funcionario.component.css']
})
export class MapPersonComponent implements OnInit {

  registerId: number;
  photos: any;
 /* year: number;  
  busy: Subscription;*/
  URL_PICTURE: string;

  constructor(    
    public activeModal: NgbActiveModal,
    public geoService: GeoService
    //private registerService: RegisterService
  ) {}

  ngOnInit() {    
   // console.log(this.year);
   // console.log(this.department);
   // if (this.department != 0 && this.year != 0) {
      /*this.busy = this.geoService.getPhoto(this.photoId)
                      .subscribe(
                          data => {
                              this.geoPhoto = data;
                              console.log(data);
                          }, errors => {
                             alert(errors);
                          });*/
  //  }else {
      //this.activeModal.close('');
   // }
    if( this.registerId != 0){
        this.geoService.getPhotosByRegisterId(this.registerId).subscribe(data => {
            this.photos = data;
            console.log(data);
        }, e => alert(e));
    }    
    this.URL_PICTURE = UtilsService.PATH_PHOTOS;
  }

  reportAll() {
    //this.registerService
  }
}
