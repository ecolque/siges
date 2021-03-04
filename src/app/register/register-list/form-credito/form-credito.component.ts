import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/subscription';
import { RegisterService } from './../../../services/register.service';


@Component({
    selector: 'app-form-credito',
    templateUrl: './form-credito.component.html'
  })

export class FormCreditoComponent implements OnInit {
    
    projectId: number;
    registerId: number;
    credito: any;
    estados: any;
    error: string;
    data: any;
    person: string;

    constructor (
        public activeModal: NgbActiveModal,
        private registerService: RegisterService
    ) {}

    ngOnInit() {            
        if (this.projectId > 0 && this.registerId > 0) {
            /*this.busy =*/ this.registerService.getCreditoEstados(this.projectId, this.registerId)
                            .subscribe(
                                dt => {  
                                    this.data = dt;
                                    this.estados = this.data.estados;
                                    //this.changes = data;
                                    console.log(this.data);
                                }, e => {
                                   this.error = e;
                                   console.log(e);
                                });
        }        
        if(this.credito.input) {
            this.error = 'Solicitante DESISTIDO';
        }
        console.log(this.credito);
        console.log(this.person);
     }

    updateState(state: any) {
        state.registerId = this.registerId;
        console.log(state);
        this.error = null;
        this.registerService.updateCreditoEstado(state).subscribe(
            res => {
                console.log(res);
                this.credito.id = state.id;
                this.credito.name = state.name;
                this.credito.input = (state.desistido == 1);
                this.estados = res;
            },
            e => this.error = e
        );
    }

    desistirCredito(state: any) {
        state.registerId = this.registerId;
        this.error = null;
        this.registerService.desistirCredito(state).subscribe(
            res => this.activeModal.close(res),
            e => this.error = e
        );
    }

    saveEntityAndOficialByRegisterId() {
        this.error = '';
        this.registerService.saveEntityAndOficialByRegisterId(this.registerId, {id: this.data.dato.id, name: this.data.dato.name}).subscribe(
            res => alert('Se Guardo'),
            e => this.error = e
        );
    }

    asignarInmueble(obj: any) {
        this.registerService.asignarInmueble(this.registerId, obj).subscribe(
            res => {
                this.data.inmueble = res.name;
                obj.person = this.person;
            },
            e => this.error = e
        );
    }

    closeModal() {
        this.activeModal.close(this.credito);
    }

}
