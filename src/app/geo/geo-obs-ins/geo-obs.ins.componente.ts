import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeoService } from '../geo.service';


@Component({
  selector: 'app-obs-ins',
  templateUrl: './geo-obs-ins.component.html',
  // styleUrls: ['./funcionario.component.css']
})
export class GeoObsInsComponent implements OnInit {


  ins: any;
  busy: Subscription;

  constructor(
    private geoService: GeoService,
    public activeModal: NgbActiveModal,
    // private registerService: RegisterService
  ) { }

  ngOnInit() {
    // if (this.photoId != 0 ) {
    //   if(this.photoId > 2429328) {
    //     this.busy = this.geoService.getPhoto(this.photoId)
    //     .subscribe(
    //         data => {            
    //             this.geoPhoto = data;                                              
    //             console.log(data);
    //         }, errors => {
    //            alert(errors);
    //         });
    //   }else {
    //     this.geoPhoto = {id: this.photoId};
    //   }
      
    // }else {
    //   this.activeModal.close('');
    // }
  }

  save(){
    console.log(this.ins);
    if(!this.ins.obs){
      alert("ingrese observacion")
      return;
    }
    this.procesar();
  }
  delete(){
    console.log(this.ins);
    if(confirm("Si eliminas quedara registrado esta accion, borrar?")){
      this.ins.obs = ''
      this.procesar();
    }
  }

  procesar(){
    this.geoService.updateObs(this.ins).subscribe(() => {
      this.activeModal.close({ok: true, obs: this.ins.obs});
    }, error => alert(error));
  }
}
