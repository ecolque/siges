import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/subscription';
import { RegisterService } from './../../../services/register.service';

@Component({
    selector: 'app-form-obs-close-project',
    templateUrl: './form-obs-closeproject.html'
})

export class FormObsCloseProject implements OnInit {
    busy: Subscription;
    registers: any;

    ngOnInit() {
        if(this.registers != null) {
            console.log(this.registers);
        }
    }

    constructor( public activeModal: NgbActiveModal, private registerService: RegisterService ) { }

    save(obj: any) {
        if(obj.msg) {
            this.busy = this.registerService.saveCloseRegisterObs({id: obj.id, name: obj.msg}).subscribe(res => {
                alert("Guardado Correctamente");
            },e=>{
                alert(e);
            });
        } else {
            alert("Causal Requerido.");
        }
        console.log(obj);
    }
}