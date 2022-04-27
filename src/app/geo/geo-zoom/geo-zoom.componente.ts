import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeoService } from '../geo.service';


@Component({
  selector: 'app-funcionario',
  templateUrl: './geo-zoom.component.html',
  // styleUrls: ['./funcionario.component.css']
})
export class GeoZoomComponent implements OnInit {

  photoId: number;
  description: string;
  date: string;
  created: string;

  geoPhoto: any;
  busy: Subscription;

  constructor(
    private geoService: GeoService,
    public activeModal: NgbActiveModal,
    // private registerService: RegisterService
  ) { }

  ngOnInit() {
    if (this.photoId != 0 ) {
      if(this.photoId > 3096470) {
        this.busy = this.geoService.getPhoto(this.photoId)
        .subscribe(
            data => {            
                this.geoPhoto = data;                                              
                console.log(data);
            }, errors => {
               alert(errors);
            });
      }else {
        this.geoPhoto = {id: this.photoId};
      }
      
    }else {
      this.activeModal.close('');
    }
  }
}
