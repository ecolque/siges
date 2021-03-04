import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { SearchService } from './search.service';
import { error } from 'selenium-webdriver';
import { Subscription } from 'rxjs/subscription';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  obj: any = {name: '', fname: '', lname: ''};
  busy: Subscription;
  /*name : string;
  fname : string;
  lname : string;*/
  errNames: string;

  ci: string;
  errCi: string;
  isDni: boolean;

  msg: string = 'La persona no se encuentra registrada en la Base de Datos de Proyectos ';
  msg2: string = 'Ingrese Num. Documento';
  corteElectoral: any = [];
  segip: any = [];

  pvs: any = [];
  msgPvs: string;

  ueve: any = [];
  msgUeve: string;

  titulacion: any = [];
  msgTitulacion: string;

  tresxmil: any = [];
  msgTresxmil: string;

  aev: any = [];
  msgAev: string;

  data: any = [];

  pageCorteElectoral: number = 0;
  pagePvs: number = 0;
  pageTitulacion: number = 0;
  pageTresxmil: number = 0;
  pageAev: number = 0;

  URL_PRINT: string;
  
  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.URL_PRINT = UtilsService.PATH_PRINT;    
  }

  resetCi() {
    this.ci = null;
  }

  searchByDni() {
    this.isDni = false;
    this.errCi = null;
    if (this.ci) {
        this.resetList();
        this.busy = this.searchService.findByDni(this.ci).subscribe(data => {
            console.log(data);
            this.corteElectoral = data['corteElectoral'];
            this.segip = data['segip'];

            this.pvs = data['pvs'];
            if (this.pvs.length < 1) {
              this.msgPvs = this.msg + 'del PVS !!!';
            }

            this.ueve = data['ueve'];
            if (this.ueve.length < 1) {
              this.msgUeve = this.msg + 'del UEVE !!!';
            }

            this.titulacion = data['titulacion'];
            if (this.titulacion.length < 1) {
              this.msgTitulacion = this.msg + 'de Titulación !!!';
            }

            this.tresxmil = data['tresxmil'];
            if (this.tresxmil.length < 1) {
              this.msgTresxmil = this.msg + 'del 3x1000 !!!';
            }

            this.aev = data['aev'];
            if (this.aev.length < 1) {
              this.msgAev = this.msg + 'de la AEVIVIENDA !!!';
            }
            this.isDni = true;
        }, err => {
          this.errCi = err;
          this.isDni = true;
        });
    }else { this.errCi = this.msg2; }
  }

  searchByNames(form) {
    console.log(form);
    this.resetPages();
    this.data = [];
    form.page = 0;
    this.errNames = '';
    this.busy = this.searchService.findByNames(form).subscribe(data => {
      this.data = data;
    }, err => {
      this.errNames = err;
    });
  }

  moreCorteElectoral(form) {
    form.page = (15 + this.pageCorteElectoral);
    this.busy = this.searchService.findCorteElectoral(form).subscribe(data => {
      this.data.corteElectoral = data['corteElectoral'];
      this.pageCorteElectoral += 15;
    }, err => {
      this.errNames = err;
    });
  }
  morePvs(form) {
    form.page = (15 + this.pagePvs);
    this.busy = this.searchService.findPvs(form).subscribe(data => {
      this.data.pvs = data['pvs'];
      this.pagePvs += 15;
    }, err => {
      this.errNames = err;
    });
  }
  moreTitulacion(form) {
    form.page = (15 + this.pageTitulacion);
    this.busy = this.searchService.findTitulacion(form).subscribe(data => {
      this.data.titulacion = data['titulacion'];
      this.pageTitulacion += 15;
    }, err => {
      this.errNames = err;
    });
  }
  moreTresxmil(form) {
    form.page = (15 + this.pageTresxmil);
    this.busy = this.searchService.findTresxmil(form).subscribe(data => {
      this.data.tresxmil = data['tresxmil'];
      this.pageTresxmil += 15;
    }, err => {
      this.errNames = err;
    });
  }
  moreAev(form) {
    form.page = (15 + this.pageAev);
    this.busy = this.searchService.findAev(form).subscribe(data => {
      this.data.aev = data['aev'];
      this.pageAev += 15;
    }, err => {
      this.errNames = err;
    });
  }

  download() {
    if (this.ci) {
        this.busy = this.searchService.download({ci: this.ci}).subscribe(data => {

        }, err => {
          this.errCi = err;
          console.log(err);
        });
    }else { this.errCi = this.msg2; }
  }

  private resetList() {
    this.corteElectoral = [];

    this.pvs = [];
    this.msgPvs = null;

    this.titulacion = [];
    this.msgTitulacion = null;

    this.tresxmil = [];
    this.msgTresxmil = null;

    this.aev = [];
    this.msgAev = null;
  }

  private resetPages() {
    this.pageCorteElectoral = 0;
    this.pagePvs = 0;
    this.pageTitulacion = 0;
    this.pageTresxmil = 0;
    this.pageAev = 0;
  }

}
