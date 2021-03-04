import { element } from 'protractor';
import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UtilsService } from './../services/utils.service';
import { ManagementService } from './management.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs/subscription';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {
  public project: any = { id: 0, name: ''};
  public project2: any = { id: 0, name: ''};

  public dni: any = { document: ''};
  public changeHolder: any = { causal: ''};
  public obj: any = {currentHolderId: 0, registerId: 0, newHolderId: 0, causal: '', parentescoId: 0}
  errors: string;

  people: any;
  comFam: any;
  people2: any = [];
  busy: Subscription;
  busy2: Subscription;
  setClickedRow: Function;

  typeProgram: number;
  typePrograms: any = [];

  //control de calidad
  departaments: any = [];
  years: any = [];
  currentTime = new Date();
  department: number;
  year: number;
  projects: any = [];

  constructor(private managementService: ManagementService) {    
    this.setClickedRow = function(index) {
      this.selectedRow = index;
    }

    this.typeProgram = 0;
    this.department = 0;
    this.year = 0;
   }

  ngOnInit() {
    this.departaments = UtilsService.getDepartamentos();
    for (let i = this.currentTime.getFullYear()+1; i > 2017; i-- ) {
      this.years.push(i);
    }    
  }

  changeProject() {
    this.errors = null;
    if (this.dni.document) {
      this.busy = this.managementService.searchProjectByDocument(this.dni.document).subscribe(data => {
          this.people = data;          
          if(this.people.length === 0)
            alert("No se encontro datos")
        }, error => alert(error) );
    }else {
      alert("Ci. Requerido");
    }
  }

  keePerson(registerId: number) {
    this.errors = null;
    this.busy = this.managementService.keepPerson(registerId, this.dni.document).subscribe(data => {
      this.people = data;
      console.log(data);
    }, error => this.errors = error);
  }

  saveChangeProjectPerson() {
    this.errors = null;
    if (this.project.id) {
      let tmp = this.people.filter(_ => _.select === true);
      if (tmp) {
        tmp.forEach(_ => _.newProjectId = this.project.id);
        console.log(tmp);
        this.busy = this.managementService.changeProjectPerson(tmp).subscribe(data => {
          this.people = data;
          this.project = { id: 0, name: ''};
        }, error => this.errors = error);
      }
    }else {
      this.errors = 'seleccione proyecto';
    }
  }

  getCompFamily(){
    this.errors = null;
    if (this.dni.document) {
      this.busy = this.managementService.searchComFamByDocument(this.dni.document).subscribe(data => {
          this.comFam = data;
          if(this.comFam.length === 0)
            alert("No se encontro datos del titular")       
          console.log(this.comFam);   
        }, error => alert(error) );
    }else {
      alert("Ci. Requerido");
    }
  }

  changePeople(person: any) {
    person.select = !person.select;
  }

  selectedPerson(currentId: number, person: any){    
      this.obj.currentHolderId = currentId;
      this.obj.registerId = person.registerId;
      this.obj.newHolderId = person.personId;    
      this.obj.parentescoId = person.parentescoId;            
  }

  saveChangeHolder(){    
    console.log(this.obj);        
    this.obj.causal = this.changeHolder.causal;
    this.busy = this.managementService.changeHolder(this.obj).subscribe(data => {
      this.comFam = [];
      this.changeHolder.causal = '';
      alert("Se hizo el cambio de titular."); 
    }, error => alert(error) );    
  }

  validatePregips() {
    if(this.project2.id > 0) {
      this.busy2 = this.managementService.validatePregipsByProjectId(this.project2.id).subscribe(data => {        
        this.people2.forEach(_=>_.observacion = '');
        console.log(data);
        data.forEach(_=> {           
          let per = this.people2.find(p => p.id === _.registerId); 
          if(per) {
            if(_.state === true) {
              per.codeProy = _.err;
            }else {
              per.observacion = _.err;
            }
          }
        });                
      }, error => alert(error) );
    }else {
      alert("Proyecto requerido");
    }   
  }

  validateRegisterPregips(registerId: any) {    
    if(registerId > 0) {
      this.busy2 = this.managementService.validatePregipsByRegisterId(registerId).subscribe(data => {
        console.log(data);
        this.people2.forEach(_=>_.observacion = '');
        data.forEach(_=> { 
          let per = this.people2.find(p => p.id === _.registerId); 
          if(per) {
            if(_.state === true) {
              per.codeProy = _.err;
            }else {
              per.observacion = _.err;
            }
          }
        });                
      }, error => alert(error) );
    }else {
      alert("Registro requerido");
    }   
  }

  searchPeople(){        
    if(this.project2.id > 0) {
      this.busy = this.managementService.getPeopleByProjectId(this.project2.id).subscribe(data => {
        this.people2 = data;        
        console.log(this.people2)
      }, error => alert(error) );
    }else{
      alert("Proyecto requerido");
    }   
  }

  searchDataByTypeProgram() {
    if(this.typeProgram > 0){
      this.busy = this.managementService.searchDataByTypeProgram(this.typeProgram).subscribe(data => {
        this.typePrograms = data;
        console.log(this.typePrograms);
        if(this.typePrograms != null && this.typePrograms.length <= 0){
          alert("No se encontro datos.");
        }
      }, error => alert(error) );
    }else{
      alert("Seleccione el tipo de Programa");
    }   
  }

  editPeople(regId: number){
    console.log(regId);
  }  

  isAcceses(param: number) {    
    return UtilsService.isAcceses(param);   
  } 

 /* searchStateProjects() {
    this.busy = this.managementService.getStateProject(this.department, this.year).subscribe(data => {
      this.stateProjects = data;
      console.log(data);
    }, error => {
      alert(error);
    });
}

updateName(id: number){
  this.busy = this.managementService.updateProject(id, this.department, this.year).subscribe(data => {
    this.stateProjects = data;
    console.log(data);
  }, error => {
    alert(error);
  });
}*/

  formatter  = (x: {name: string}) => x.name;
  /*searchProject = (text$: Observable<string>) =>
        text$.debounceTime(200).map(term => term === '' ? []: UtilsService.getProjects().filter(v => new RegExp(term, 'gi').test(v.name)).slice(0, 10)); */

  search = (text$: Observable<string>) =>
      text$
        .debounceTime(200)
        .distinctUntilChanged()
        .map(term => term.length < 2 ? []
          : UtilsService.getProjects().filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 20));

  formatter2  = (x: {name: string}) => x.name;
  /*searchProject = (text$: Observable<string>) =>
        text$.debounceTime(200).map(term => term === '' ? []: UtilsService.getProjects().filter(v => new RegExp(term, 'gi').test(v.name)).slice(0, 10)); */

  search2 = (text$: Observable<string>) =>
      text$
        .debounceTime(200)
        .distinctUntilChanged()
        .map(term => term.length < 2 ? []
          : UtilsService.getProjects().filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 20));
  
  //control calidad doble beneficio
  searchProjectsDobleBeneficio() {
    if(this.department > 0 && this.year > 0) {
      this.busy = this.managementService.serachProjectsByDepartmentAndGestion(this.department, this.year).subscribe(data => {
        this.projects = data;
        console.log(data);
      }, e => alert(e));
    } else{
      alert("Seleccione Departamento o Gestion.");
    }    
  }

  showDobleBeneficio(proyId: number) {
    alert("hola" + proyId);
  }

  verificarNuevamente(proyId: number) {
    this.busy = this.managementService.verificarDobleBeneficio(proyId).subscribe(data => {
      //this.projects = data;
      console.log(data);
    }, e => alert(e));
  }

  resetProject() {
    this.project2 = { id: 0, name: ''};
    this.people2 = []
  }
}
