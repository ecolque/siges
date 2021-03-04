import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/subscription';
import { RegisterService } from './../../../services/register.service';


@Component({
    selector: 'app-form-obs',
    templateUrl: './form-openregisters.component.html'
  })

export class FormOpenRegistersComponent implements OnInit {

    registers: any;
    //countRegisters: number = 0;

    busy: Subscription;
    error: any;

    openRegister = new Object();
    observation: string;

    typeList: number; // 0 inicial 1 final

    constructor(
        public activeModal: NgbActiveModal,
        private registerService: RegisterService
    ) { }

    ngOnInit() { }

    checkAll(ev) {
        if (this.typeList === 0) {
            this.registers.forEach(x => x.inicialClose = ev.target.checked);
        }

        if (this.typeList === 1) {
            this.registers.forEach(x => x.close = ev.target.checked);
        }
    }

    isAllChecked() {
        if (this.typeList === 0) {
            return this.registers.every(_ => _.inicialClose);
        }

        if (this.typeList === 1) {
            return this.registers.every(_ => _.close);
        }
    }

    openRegisters() {
        let arry: any = [];
        if (this.typeList === 0) {
            this.registers.filter(_ =>_.inicialClose).forEach(x => arry.push(x.id));
            console.log(arry);

            this.openRegister['list'] = arry;
            this.openRegister['obs'] = this.observation;

            this.busy = this.registerService.openRegistersInicial(this.openRegister)
                .subscribe(
                    data => {
                        this.activeModal.close(arry);
                    },
                    errors => {
                        this.error = errors;
                        this.registerService.openFormLogin(this.error);
                    }
                );
        }

        if (this.typeList === 1) {
            this.registers.filter(_ => _.close).forEach(x => arry.push(x.id));
            console.log(arry);

            this.openRegister['list'] = arry;
            this.openRegister['obs'] = this.observation;

            this.busy = this.registerService.openRegisters(this.openRegister)
                .subscribe(
                    data => {
                        this.activeModal.close(arry);
                    },
                    errors => {
                    this.error = errors;
                    this.registerService.openFormLogin(this.error);
                    }
                );
        }
    }
}

