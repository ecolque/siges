import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// import { Router } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from './../services/utils.service';

import 'rxjs/Rx';

@Injectable()
export class ReportService {

    constructor(
        private http: Http,
        ) { console.log('authenticate:' + UtilsService.authenticateBaseUrl); }

    /*searchProjectByDocument(document: string): Observable<any[]> {
        let params = "searchProjectByDocument/"+document;
        return this.http.get(UtilsService.registerBaseUrl+params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    keepPerson(registerId: number, document: string): Observable<any[]> {
        let params = "keepPerson/"+registerId+"/"+document;
        return this.http.get(UtilsService.registerBaseUrl+params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    } */

    getProjectByParameters(obj: any): Observable<any[]> {
        return this.http.post(UtilsService.registerBaseUrl + 'getProjectByParameters', obj)
        .map(UtilsService.extractData)
        .do(data => {})
        .catch(UtilsService.handleError);
    }

    getStateProject(deptId: number, year: number): Observable<any[]> {
        let params = "stateProject/"+deptId+"/"+year;
        return this.http.get(UtilsService.registerBaseUrl+params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    updateProject(id: number, deptId: number, year: number){
        let params = "updateNameProject/"+id+"/"+deptId+"/"+year;
        return this.http.get(UtilsService.registerBaseUrl+params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

}
