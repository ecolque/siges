import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search-container',
  templateUrl: './search.container.component.html',
  styleUrls: ['./search.container.component.css']
})
export class SearchContainerComponent implements OnInit {

  msg: string = 'La persona no se encuentra registrada en la Base de Datos de Proyectos ';

  @Input('document') ci;
  @Input() corteElectoral: any;

  @Input() pvs: Array<any> = [];
  @Input() msgPvs: string = null;

  @Input() ueve: Array<any> = [];
  @Input() msgUeve: string = null;

  @Input() titulacion: any;
  @Input() msgTitulacion: string;

  @Input() tresxmil: any;
  @Input() msgTresxmil: string;

  @Input() aev: any;
  @Input() msgAev: string;

  constructor() { }

  ngOnInit() {    
  }

}
