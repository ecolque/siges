import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/subscription';
import { RegisterService } from './../../../services/register.service';
import { UtilsService } from './../../../services/utils.service';


@Component({
    selector: 'app-form-obs',
    templateUrl: './form-obs.component.html'
  })

export class FormObsComponent implements OnInit {

    register: any;
    projectId: number;
    busy: Subscription;

    puntajes: any= [];
    dobleBeneficios: any= [];

    totalPuntaje: number;
    showPoints: boolean;

    listCorte: any = [];
    listPvs: any = [];
    list3xmil: any = [];
    listTitulacion: any = [];
    listAev: any = [];
    listSinarep: any = [];

    resultMsg: string;
    resultClass: string;

    constructor(
        public activeModal: NgbActiveModal,
        private registerService: RegisterService
    ) { this.totalPuntaje = 0; }

    ngOnInit() {
        if (this.register.id > 0 && this.projectId > 0) {
            this.busy = this.registerService.getDetalleObservaciones(this.projectId, this.register.id, this.register.person.document, this.register.person.id)
                    .subscribe(
                        data => {
                            this.puntajes = data['puntajes'];
                            this.dobleBeneficios = data['dobleBeneficios'];
                            this.setTotalPuntaje();
                            this.setLists();  
                            console.log(data);                          
                        }, errors => {
                            this.registerService.openFormLogin(errors);
                        });
        }
    }

    autorizarBeneficio(obj: any) {
        this.resultMsg = null;
        obj.registerId = this.register.id;
        obj.titularId = this.register.person.id;
        obj.msg = '';
        if(obj.estado === 'Activo'){
            obj.msg = "Debe estar en estado Baja en el V4";
            return;
        }        
        this.busy = this.registerService.autorizarBeneficio(obj)
        .subscribe(
            data => {
                this.register.pvs = data.pvs;
                this.register.ueve = data.ueve;
                this.register.tresxmil = data.tresxmil;
                this.register.titulacion = data.titulacion;
                this.register.aev = data.aev;
                this.register.sinarep = data.sinarep;
                this.register.estado = data.estado;
                console.log(data);
                // this.setResult("Correctamente Guardado", 'alert-success');
                obj.msg = 'Correctamente Guardado';
            }, errors => {
                obj.msg = errors;
                this.registerService.openFormLogin(errors);
                // this.setResult(errors, 'alert-danger');
            });
    }

    autorizarBeneficioSinarep(obj: any) {
        obj.registerId = this.register.id;
        obj.titularId = this.register.person.id;
        obj.msg = '';
        this.busy = this.registerService.autorizarBeneficio(obj)
        .subscribe(
            data => {
                this.register.pvs = data.pvs;
                this.register.ueve = data.ueve;
                this.register.tresxmil = data.tresxmil;
                this.register.titulacion = data.titulacion;
                this.register.aev = data.aev;
                this.register.sinarep = data.sinarep;
                this.register.estado = data.estado;
                this.activeModal.close('');
            }, errors => {
                obj.msg = errors;
                this.registerService.openFormLogin(errors);
            });
    }

    setTotalPuntaje() {        
        this.puntajes.forEach(el => {
            this.totalPuntaje +=  el.puntaje;            
        });
    }

    setLists() {
        this.listCorte = this.getListsByOrderId(1);
        this.listPvs = this.getListsByOrderId(2);
        this.listTitulacion = this.getListsByOrderId(3);
        this.list3xmil = this.getListsByOrderId(4);
        this.listAev = this.getListsByOrderId(5);
        this.listSinarep = this.getListsByOrderId(100);
    }

    getListsByOrderId(id: number) {
        let res = this.dobleBeneficios.filter(obj => obj.orden == id);
        if (res.length > 0) {
            console.log('this.listCorte');
            console.log(this.listCorte);
            return res;
        }
        return null;
    }

    isAcceses(param: number) {    
        return UtilsService.isAcceses(param);   
      }

    private setResult(msg: string, cls: string) {
        this.resultMsg = msg;
        this.resultClass = cls;
    }
}
