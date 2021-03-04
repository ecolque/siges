import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/subscription';
import { RegisterService } from './../../../services/register.service';


@Component({
    selector: 'app-form-obs',
    templateUrl: './form-reemplazo.component.html'
  })

export class FormReemplazoComponent implements OnInit {

    register: any;
    registers: any= [];
    cancelReemplazo: boolean;
    busy: Subscription;
    error: string;

    constructor(
        public activeModal: NgbActiveModal,
        private registerService: RegisterService
    ) { }

    ngOnInit() { }

    guardarReemplazo(obj: any) {
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
    }
}
