import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/subscription';
import { RegisterService } from './../../../services/register.service';


@Component({
    selector: 'app-form-record',
    templateUrl: './form-record.component.html'
  })

export class FormRecordComponent implements OnInit {

    registerId: number;
    personId: number;
    changes: any;

    busy: Subscription;
    error: string;

    constructor(
        public activeModal: NgbActiveModal,
        private registerService: RegisterService
    ) {}

    ngOnInit() {
        if (this.registerId > 0 && this.personId > 0) {
            this.busy = this.registerService.getRecord(this.registerId, this.personId)
                            .subscribe(
                                data => {                                    
                                    this.changes = data;
                                    console.log(data);
                                }, errors => {
                                   this.error = errors;
                                   //this.registerService.openFormLogin(this.error);
                                   //this.activeModal.close();
                                });
        }
     }

    /*guardarReemplazo(obj: any) {
        console.log(obj);
        obj.registerId = this.register.id;
        this.busy = this.registerService.guardarReemplazo(this.register.id, obj.id, obj.estado.id)
                .subscribe(
                    data => {
                        this.register.reemplazante = {id: obj.id, nombres: (obj.person.paterno + ' ' + obj.person.materno + ' ' + obj.person.nombres)};
                        obj.estado = data;
                        console.log(data);
                        this.activeModal.close();
                    }, errors => {
                        this.error = errors;
                        this.registerService.openFormLogin(this.error);
                    });
    }

    cancelRegisterReemplazo(obj: any) {
        this.busy = this.registerService.cancelReemplazo(this.register.id, obj.id, obj.estado.id)
                .subscribe(
                    data => {
                        this.register.reemplazante = {id: 0, nombres: ''};
                        obj.estado = data;
                        console.log(data);
                        this.activeModal.close();
                    }, errors => {
                        this.error = errors;
                        this.registerService.openFormLogin(this.error);
                    });
    }*/
}
