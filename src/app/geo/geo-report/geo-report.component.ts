import { RegisterService } from './../../services/register.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeoService } from '../geo.service';
import { UtilsService } from '../../services/utils.service';


@Component({
  selector: 'app-gep-report',
  templateUrl: './geo-report.component.html',
  // styleUrls: ['./funcionario.component.css']
})
export class GeoReportComponent implements OnInit {

  department: number;
  year: number;  
  busy: Subscription;
  URL_PRINT: string;

  constructor(
    private geoService: GeoService,
    public activeModal: NgbActiveModal,
    private registerService: RegisterService
  ) {}

  ngOnInit() {    
    console.log(this.year);
    console.log(this.department);
    if (this.department != 0 && this.year != 0) {
      /*this.busy = this.geoService.getPhoto(this.photoId)
                      .subscribe(
                          data => {
                              this.geoPhoto = data;
                              console.log(data);
                          }, errors => {
                             alert(errors);
                          });*/
    }else {
      //this.activeModal.close('');
    }

    this.URL_PRINT = UtilsService.PATH_PRINT;
  }

  reportAll() {
    //this.registerService
  }
}
