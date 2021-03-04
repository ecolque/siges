//import { RegisterService } from './../../services/register.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from '../../services/utils.service';
import { GeoService } from '../../geo/geo.service';


@Component({
  selector: 'map-person',
  templateUrl: './map-project.component.html',
  // styleUrls: ['./funcionario.component.css']
})
export class MapProjectComponent implements OnInit {
    projects: any = [];
    
    ngOnInit() { 

    }
}