
import { Component, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
    selector: 'app-popup-login',
    templateUrl: './login.popup.component.html'
})
export class LoginPopupComponent implements OnInit {
    public static loginSuccessEmitter: EventEmitter<any> = new EventEmitter();

    constructor(
        public activeModal: NgbActiveModal
    ) { }
    ngOnInit() { }

    loginSuccess(event: any) {
        this.activeModal.close(true);
        LoginPopupComponent.loginSuccessEmitter.emit(true);
    }
}
