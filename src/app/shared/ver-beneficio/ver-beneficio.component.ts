import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ver-beneficio',
  templateUrl: './ver-beneficio.component.html',
  styleUrls: ['./ver-beneficio.component.css']
})
export class VerBeneficioComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
