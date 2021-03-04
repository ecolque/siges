import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/subscription';
import { RegisterService } from './../../services/register.service';


@Component({
    selector: 'app-form-openproject',
    templateUrl: './form-openproject.component.html'
  })

export class FormOpenprojectComponent implements OnInit {

    obj: any;
    busy: Subscription;
    error: any;           

    constructor(
        public activeModal: NgbActiveModal,
        private registerService: RegisterService
    ) { }

    ngOnInit() { }
    
    openProject(){
        this.error = null;
        if (this.obj.projectId) {
            this.busy = this.registerService.openProject(this.obj)
            .subscribe(
              data => {
                this.activeModal.close('ok');
              }, errors => {                                                                    
                  this.error = errors;
                }
            );
          }else { console.log('Proyecto null'); }
    }
}