import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './msg-modal.component.html'
})
export class MsgModalComponent {
  typeMsg: string;
  classHeader: string;
  msg: any;
  okBtn: boolean;
  showBtn: boolean;
  constructor(public activeModal: NgbActiveModal) { }
}