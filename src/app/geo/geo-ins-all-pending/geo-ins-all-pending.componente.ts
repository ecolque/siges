import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeoService } from '../geo.service';
import { UtilsService } from '../../services/utils.service';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-obs-ins-all',
  templateUrl: './geo-ins-all-pending.component.html',
  // styleUrls: ['./funcionario.component.css']
})
export class GeoInsAllPendingComponent implements OnInit {

  projects: any = [];
  project: string = '';

  causal: string = '';

  userId: number;
  // ins: any;
  busy: Subscription;

  constructor(
    private geoService: GeoService,
    public activeModal: NgbActiveModal,
    // private registerService: RegisterService
  ) { }

  ngOnInit() {
  }

  save(){
    // console.log(this.ins);
    // if(!this.ins.obs){
    //   alert("ingrese observacion")
    //   return;
    // }
    // this.procesar()project;
  }
  autorize(){

    if(confirm("Esta seguro habilitar?")){
      this.procesar();
    }
  }

  procesar(){

    if(this.projects.length == 0){
      alert("no hay proyectos");
      return;
    }

    if(!this.causal){
      alert("ingrese causal");
      return;
    }

    let proys = [];
    this.projects.forEach(obj => {
      proys.push({ userId: this.userId, lateDays: obj.lateDays, note: this.causal, inspectionId: obj.inspectionId });
    });
    
    this.geoService.autorizeNMPendingProkect(proys).subscribe((res) => {
      this.activeModal.close('');
    }, e => {
      alert(e);
    });
    // this.geoService.updateObs(this.ins).subscribe(() => {
    //   this.activeModal.close({ok: true, obs: this.ins.obs});
    // }, error => alert(error));
  }

  searchProject(){
    if(!this.project){
      alert('Ingrese codigo o nombre de proyecto');
      return;
    }
    if(this.projects.length <= 2){
      alert("Ingrese por lo menos tres caracteres");
      return;
    }

    this.geoService.getNMProjectsPendigs(this.project).subscribe((res)=>{
      this.projects = res; console.log(res);
      if(this.projects.length == 0){
        alert("no hay datos para mostrar")
      }
    });
  }
}
