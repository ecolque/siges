import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeoService } from '../geo.service';


@Component({
  selector: 'app-obs-ins',
  templateUrl: './geo-ins-pending.component.html',
  // styleUrls: ['./funcionario.component.css']
})
export class GeoInsPendingComponent implements OnInit {

  projects: any = [];

  userId: number;
  // ins: any;
  busy: Subscription;

  constructor(
    private geoService: GeoService,
    public activeModal: NgbActiveModal,
    // private registerService: RegisterService
  ) { }

  ngOnInit() {
    this.geoService.getNMProjectsPendigs().subscribe((res)=>{
      this.projects = res; console.log(res);
    });
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
    // console.log(this.ins);
    // if(!this.ins.obs){
    //   alert("ingrese observacion")
    //   return;
    // }
    // this.procesar()project;
  }
  autorize(project, idx: number){

    if(confirm("Esta seguro autorizar!!, Guardar?")){
      this.procesar(project, idx);
    }
  }

  procesar(project, idx: number){
    project.userId = this.userId;
    console.log(project);
    this.geoService.autorizeNMPendingProkect(project).subscribe((res) => {
      this.projects.splice(idx,1);
    }, e => {
      alert(e);
    });
    // this.geoService.updateObs(this.ins).subscribe(() => {
    //   this.activeModal.close({ok: true, obs: this.ins.obs});
    // }, error => alert(error));
  }
}
