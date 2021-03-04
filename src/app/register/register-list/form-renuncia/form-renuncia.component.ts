import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/subscription';
import { RegisterService } from './../../../services/register.service';
import { UtilsService } from './../../../services/utils.service';


@Component({
    selector: 'app-form-obs',
    templateUrl: './form-renuncia.component.html'
  })

export class FormRenunciaComponent implements OnInit {

    register: any;
    renuncia: any;
    busy: Subscription;
    error: any;

    copyObs: string;

    constructor(
        public activeModal: NgbActiveModal,
        private registerService: RegisterService
    ) { }

    ngOnInit() {
        if (this.register.id > 0) {
            this.busy = this.registerService.getRenuncia(this.register.id)
                            .subscribe(
                                data => {
                                    /*this.puntajes = data['puntajes'];
                                    this.dobleBeneficios = data['dobleBeneficios'];
                                    this.setTotalPuntaje();
                                    this.setLists();*/
                                    this.renuncia = data;
                                    this.copyObs = this.renuncia.obs;
                                    this.renuncia.obs = null;
                                    console.log(data);
                                }, errors => {
                                   this.error = errors;
                                   this.registerService.openFormLogin(this.error);
                                   this.activeModal.close();
                                });
        }
    }

    cancelRenuncia() {
        this.renuncia.estadoId = this.register.estado.id;
        this.busy = this.registerService.cancelRenuncia(this.renuncia)
              .subscribe(
                data => {
                    this.register.estado = data;
                    this.register.inicialClose = false;
                    this.activeModal.close();
                }, errors => {
                  this.error = errors;
                  }
              );
      }

    okRenuncia() {
        this.renuncia.estadoId = this.register.estado.id;
        this.busy = this.registerService.renunciar(this.renuncia)
        .subscribe(
          data => {
            this.register.estado = data;
            this.activeModal.close();
          },
          errors => {
            this.error = errors;
            }
        );
      }
}
