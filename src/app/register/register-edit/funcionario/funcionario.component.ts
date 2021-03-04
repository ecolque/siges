import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterService } from './../../../services/register.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent implements OnInit {

  people: any = [];
  busy: Subscription;
  error: any;

  personId: number;
  paterno: string;
  materno: string;
  documento: string;
  isFamily: boolean;

  causal: string;

  constructor(
    public activeModal: NgbActiveModal,
    private registerService: RegisterService
  ) { }

  ngOnInit() {
    if (this.documento || this.isFamily) {
      this.busy = this.registerService.getFuncionarios(this.personId, this.paterno, this.materno, this.documento ? this.documento : '-1')
                      .subscribe(
                          data => {
                              this.people = data.employees;
                              this.causal = data.causal;
                              console.log(data);
                          }, errors => {
                              this.registerService.openFormLogin(errors);
                          });
    }else {
      alert('Para ver detalles, Edite los datos y guarde.');
      this.activeModal.close('');
    }
  }

  save() {
    if (this.personId > 0) {
        this.error = '';
        if (this.causal && this.causal.length > 11) {
          this.busy = this.registerService.saveFuncionarios(this.personId, this.causal)
              .subscribe(
                  data => {
                    this.activeModal.close('ok');
                  }, errors => {
                      this.registerService.openFormLogin(errors);
                  });
        }else {
          this.error = 'Min 10 caract.'
        }
    }else {
      this.activeModal.close('ok');
    }
  }
}
