import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/subscription';
import { RegisterService } from './../../../services/register.service';


@Component({
    selector: 'app-form-obs',
    templateUrl: './person-similiar.component.html'
  })

export class PersonSimilarComponent implements OnInit {

    people: any = [];
    busy: Subscription;
    error: any;

    constructor(
        public activeModal: NgbActiveModal,
        private registerService: RegisterService
    ) { }

    ngOnInit() { }

    selected(person: any) {
        this.activeModal.close(person);
    }
}
