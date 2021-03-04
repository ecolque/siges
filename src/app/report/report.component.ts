import { Component, OnInit } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from './../services/utils.service';
import { ReportService } from './report.service';
import { Subscription } from 'rxjs/subscription';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  URL_PRINT: string;

  typeProgram: string;

  department: number;
  year: number;
  departamentos: any = [];
  years: any = [];
  currentTime = new Date();
  stateProjects: any = [];
  stateTmpProjects: any = [];
  countInicial: number;
  countFinal: number;  
  countNotInicial: number;
  countNotFinal: number;  

  gestions: any = [];
  idxdepts: any = [];
  projects = [];

  selecteds: any = [];
  projectsIds: any = [];

  sdGestions: any = [];
  urbano: boolean;
  rural: boolean;
  urbrural: boolean;
  ch: boolean;
  lp: boolean;
  cb: boolean;
  or: boolean;
  pt: boolean;
  tr: boolean;
  sc: boolean;
  be: boolean;
  pd: boolean;

  acep: boolean;
  reemAcep: boolean;
  reemAcepEspera: boolean;
  rech: boolean;
  reemRech: boolean;
  ren: boolean;

  isCollapsed: boolean;
  byProject;
  list: any = [];

  busy: Subscription;
  constructor(private reportService: ReportService) {
    this.department = 0;
    this.year = 0;
    this.countInicial = 0;
    this.countFinal = 0;
    this.countNotInicial = 0;
    this.countNotFinal = 0;

    this.acep = true;
    this.reemAcep = true;  
    this.typeProgram = '1';
  }

  ngOnInit() {
    this.gestions = UtilsService.getProjects().map(item => item.yearId).filter((v, i, s) => s.indexOf(v) === i);
    this.idxdepts = UtilsService.getProjects().map(item => item.deptId).filter((v, i, s) => s.indexOf(v) === i);

    for (let i = 0; i < this.idxdepts.length; i++) {
      this.setDept(this.idxdepts[i]);
    }

    console.log(this.gestions);
    this.URL_PRINT = UtilsService.PATH_PRINT;   

    this.departamentos = UtilsService.getDepartamentos();
    for (let i = this.currentTime.getFullYear()+1; i > 2017; i-- ) {
      this.years.push(i);
    }    
  }

  searchProjects() {
    let obj = {
              gestions: this.sdGestions, urbano: this.urbano, rural: this.rural, urbrural: this.urbrural, ch: this.ch, lp: this.lp,
              cb: this.cb, or: this.or, pt: this.pt, tr: this.tr, sc: this.sc, be: this.be, pd: this.pd, typeProgram: this.typeProgram
            };
    if (this.isCollapsed) {
        this.busy = this.reportService.getProjectByParameters(obj).subscribe(data => {
          this.projects = data;          
        }, error => {
          alert(error);
        });
    }
  }

  atach(obj: any, idx: number) {
    this.selecteds.push(obj);
    this.projectsIds.push(obj.id);
    this.projects.splice(idx, 1);
  }

  detach(obj: any, idx: number) {
    this.projects.push(obj);
    this.selecteds.splice(idx, 1);
    this.projectsIds.splice(idx, 1);
  }

 /* setGestion(val){
    console.log(this.sdGestions);
  }*/

  _ch: boolean;
  _lp: boolean;
  _cb: boolean;
  _or: boolean;
  _pt: boolean;
  _tr: boolean;
  _sc: boolean;
  _be: boolean;
  _pd: boolean;
  private setDept(idx: number) {
    switch (idx) {
      case 1:
        this._ch = true;
        break;
      case 2:
        this._lp = true;
        break;
      case 3:
        this._cb = true;
        break;
      case 4:
        this._or = true;
        break;
      case 5:
        this._pt = true;
        break;
      case 6:
        this._tr = true;
        break;
      case 7:
        this._sc = true;
        break;
      case 8:
        this._be = true;
        break;
      case 9:
        this._pd = true;
        break;
    }
  }

  serchByProject() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.searchProjects();
    }else {
      this.reset();
    }
  }

  change() {
    this.byProject = false;
    this.isCollapsed = false;
    this.reset();
  }

  searchStateProjects() {
      this.stateProjects = [];
      this.busy = this.reportService.getStateProject(this.department, this.year).subscribe(data => {
        this.stateProjects = data;
        this.stateTmpProjects = data; 
        this.countNotInicial = this.stateProjects.filter(_=>_.iclose === 'No').length;       
        this.countNotFinal = this.stateProjects.filter(_=>_.fclose === 'No').length;
        this.countInicial = this.stateProjects.filter(_=>_.iclose === 'Si').length;       
        this.countFinal = this.stateProjects.filter(_=>_.fclose === 'Si').length;
        console.log(data);
      }, error => {
        alert(error);
      });
  }

  updateName(id: number){
    this.busy = this.reportService.updateProject(id, this.department, this.year).subscribe(data => {
      this.stateProjects = data;      
    }, error => {
      alert(error);
    });
  }

  filterNotInicial(){
    this.stateProjects = this.stateTmpProjects.filter(_=>_.iclose === 'No');
  }

  filterNotFinal(){
    this.stateProjects = this.stateTmpProjects.filter(_=>_.fclose === 'No');
  }

  filterInicial(){
    this.stateProjects = this.stateTmpProjects.filter(_=>_.iclose === 'Si');
  }

  filterFinal(){
    this.stateProjects = this.stateTmpProjects.filter(_=>_.fclose === 'Si');
  }
 
  private reset() {
    this.projects = [];
    this.selecteds = [];
    this.projectsIds = [];
  }

}
