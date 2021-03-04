import { Component, OnInit } from '@angular/core';
import { TreeModel } from 'angular-tree-component';
import { ITreeOptions } from 'angular-tree-component';
import { UtilsService } from './../services/utils.service';
import { Router } from '@angular/router';

import { RegisterService } from './../services/register.service';
import { RegisterListComponent } from './../register/register-list/register-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { MsgModalComponent } from './../shared/utils/msg-modal/msg-modal.component';
import { Subscription } from 'rxjs/subscription';


import { Observable } from 'rxjs/Observable';
import { FormOpenprojectComponent } from './form-openproject/form-openproject.component';
import { LoginPopupComponent } from '../login/login.popup.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  public project: any = { id: 0, name: ''};
  public register: any;
  private objProject: any;

  buscarTodos: boolean;
  showPoints: boolean;

  isSelectedSearchTypeProyect: boolean = true;
  classDivSearch: String = 'col col-lg-12';
  metrica: number;

  busy: Subscription;

  /*options: ITreeOptions = {
    getChildren: this.getChildren.bind(this)
  };*/

  constructor( private router: Router,
      private registerService: RegisterService,
      private modalService: NgbModal
    ) {
        this.registerService.projectSelectedEmitter.subscribe(project => {
          this.project = project;
          this.register = null;
          RegisterService.personIdSelected = 0;
          // RegisterService.selectedRegister = null;
          RegisterService.selectedProject = this.project;          
          this.metrica = RegisterService.selectedProject.metricaId;
          RegisterService.isSelectedProject = true;
          this.router.navigate(['project', this.project.id, 'list']);
          console.log('ProjectComponent project');
          console.log(this.project);
          this.showPoints = this.project.evaluar;
        });

        this.registerService.registerSelectedEmitter.subscribe(register => {
          this.register = register;
          RegisterService.personIdSelected = 0;
          if (this.register != null) {
            RegisterService.personIdSelected = this.register.person.id;
          }

          console.log('Register selected');
          console.log(this.register);
          // RegisterService.selectedRegister = this.register;
        });

        LoginPopupComponent.loginSuccessEmitter.subscribe(result => {
            if (result) {
              this.nodes = UtilsService.getTreeProjects();
              /*if(this.isSelectedSearchTypeProyect){
                this.project = null;
                RegisterService.isSelectedProject = false;
              }*/
            }
        });
      }

  nodes: any;  
  ngOnInit() {
    this.nodes = UtilsService.getTreeProjects();    
  }

 /* nodes = [
    {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' },
        { id: 3, name: 'child2' }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1', children: [] },
        { id: 6, name: 'child2.2', children: [
          { id: 7, name: 'grandchild2.2.1' }
        ] }
      ]
    }
  ];*/

  onEvent(event) {
    console.log(event);
  }

  searchPeople() {
    if (this.project.id) {
      this.registerService.projectSelectedEmitter.emit(this.project);
    }else {
      console.log('Proyecto null');
    }
      console.log(this.project);
  }

  resetPeople() {
    this.project = { id: 0, name: ''};
    this.register = null;
    this.router.navigate(['project']);
  }

  searchByTypeProject() {
    if (this.buscarTodos) {
      this.isSelectedSearchTypeProyect = true;
      this.classDivSearch = 'col col-lg-12';
    }else {
      this.isSelectedSearchTypeProyect = false;
      this.classDivSearch = 'col col-lg-9';
    }
  }

  openProject() {
    this._openProject();
  }

  // PROJECT CLOSE OPEN
  /*closeInicialProject() {
    if (this.project.id) {
      this._closeProjectoConfirmForm('Esta operacion es irreversible, esta de acuerdo en cerrar LISTA INICIAL del PROYECTO?', 'MENSAJE!', 'bg-warning', 0);
    }else { console.log('Proyecto null'); }
  }*/

  /*closeProject() {
    if (this.project.id) {
      this._closeProjectoConfirmForm('Esta operacion es irreversible, esta de acuerdo en cerrar el PROYECTO?', 'MENSAJE!', 'bg-warning', 1);
    }else { console.log('Proyecto null'); }
  }*/

  isAcceses(param: number) {    
    return UtilsService.isAcceses(param);   
  }

  private _openProject() {
    this._openFromOpenproject({projectId: this.project.id, causal: ''});
  }

  /*private _closeInicialProject() {
    if (this.project.id) {
      this.busy = this.registerService.closeInicialProject({projectId: this.project.id, causal: ''})
      .subscribe(
        data => {
          RegisterService.selectedProject.cerradoInicial = true;
        },
        errors => {
          this.openMsgForm(errors, 'ERROR!', 'bg-danger');
          }
      );
    }else { console.log('Proyecto null'); }
  }*/

  /*private _closeProject() {
    if (this.project.id) {
      this.busy = this.registerService.closeProject({projectId: this.project.id, causal: ''})
      .subscribe(
        data => {
          RegisterService.selectedProject.cerrado = true;
        },
        errors => {
          this.openMsgForm(errors, 'ERROR!', 'bg-danger');
          }
      );
    }else { console.log('Proyecto null'); }
  }*/

  // FIN PROJECT CLOSE OPEN

  private _openFromOpenproject(obj: any) {
    const modalRef = this.modalService.open(FormOpenprojectComponent, {size: 'sm'});
    modalRef.componentInstance.obj = obj;
    modalRef.result.then((result) => {
         if (result == 'ok') {
          RegisterService.selectedProject.cerrado = false;
         }
    });
  }

  /*private _closeProjectoConfirmForm(msg: string, typeMsg: string, classHeader: string, isCloseInitial: number) {
    const modalRef = this.modalService.open(MsgModalComponent, {size: 'sm'});
    modalRef.componentInstance.typeMsg = typeMsg;
    modalRef.componentInstance.classHeader = classHeader;
    modalRef.componentInstance.msg = msg;
    modalRef.componentInstance.okBtn = true;
    modalRef.result.then((result) => {
         if (result == 'ok') {
           if (isCloseInitial === 0) {
             this._closeInicialProject();
            }
           if (isCloseInitial === 1) {
             this._closeProject();
            }
         }
    });
  }*/

  /*private openMsgForm(msg: string, typeMsg: string, classHeader: string) {
    const modalRef = this.modalService.open(MsgModalComponent, {size: 'sm'});
    modalRef.componentInstance.typeMsg = typeMsg;
    modalRef.componentInstance.classHeader = classHeader;
    modalRef.componentInstance.msg = msg;
  }*/

  /*asyncChildren = [
    {
      id:55,
      name: 'child1',
      hasChildren: true
    }, {
      id:55,
      name: 'child2'
    }
  ];*/

  /*getChildren(node: any) {
    console.log(node.data);
    let data = node.data;
    this.registerService.getTreeProject(data.obj.typeTree,data.obj.id)
    .subscribe(
      result => {
        const newNodes = result.map((o) => Object.assign({}, o));
        //const newNodes = this.asyncChildren.map((c) => Object.assign({}, c));
        console.log(newNodes);
        return newNodes;
      },
      errors => {
        alert(errors);
        console.log(errors);
      }
    );
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


  go($event) {
   // $event.stopPropagation();
    // console.log($event.id);
    if ($event.selected) {
      this.project = $event;
      this.registerService.projectSelectedEmitter.emit(this.project);
    }
  }


  filterFn(value, treeModel: TreeModel) {
    console.log(value);
    // treeModel.filterNodes((node) => fuzzysearch(value, node.data.name));
  }
 /* options1: ITreeOptions = {
    displayField: 'name',
    nodeClass: (node) => node.data.name
  };*/
}

function fuzzysearch (needle, haystack) {
  const haystackLC = haystack.toLowerCase();
  const needleLC = needle.toLowerCase();

  const hlen = haystack.length;
  const nlen = needleLC.length;

  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needleLC === haystackLC;
  }
  outer: for (let i = 0, j = 0; i < nlen; i++) {
    const nch = needleLC.charCodeAt(i);

    while (j < hlen) {
      if (haystackLC.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}
