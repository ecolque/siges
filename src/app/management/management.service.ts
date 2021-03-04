import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// import { Router } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from './../services/utils.service';

import 'rxjs/Rx';

@Injectable()
export class ManagementService {

    constructor(
        private http: Http,        
// private utilsService: UtilsService
        ) { console.log('authenticate:' + UtilsService.authenticateBaseUrl); }

    searchProjectByDocument(document: string): Observable<any[]> {
        let params = 'searchProjectByDocument/' + document;
        return this.http.get(UtilsService.registerBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    searchComFamByDocument(document: string): Observable<any[]> {
        let params = 'searchComFamByDocument/' + document;
        return this.http.get(UtilsService.registerBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }   

    keepPerson(registerId: number, document: string): Observable<any[]> {
        let params = 'keepPerson/' + registerId + '/' + document;
        return this.http.get(UtilsService.registerBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    changeProjectPerson(list: any): Observable<any[]> {
        return this.http.post(UtilsService.registerBaseUrl + 'changeProjectPerson', list)
        .map(UtilsService.extractData)
        .do(data => {
            console.log(data);
        })
        .catch(UtilsService.handleError);
    }

    changeHolder(obj: any): Observable<any[]> {
        return this.http.post(UtilsService.registerBaseUrl + 'changeHolder', obj)
        .map(UtilsService.extractData)
        .do(data => {
            console.log(data);
        })
        .catch(UtilsService.handleError);
    }
    
    validatePregipsByProjectId(projectId: number){
        let params = 'validatePregipsByProjectId/' + projectId;
        return this.http.get(UtilsService.baseUrl_2+'/' + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    validatePregipsByRegisterId(registerId: number) {        
        let params = 'validatePregipsByRegisterId/' + registerId;
        return this.http.get(UtilsService.baseUrl_2+'/' + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getPeopleByProjectId(projectId: number){
        let params = 'getPeopleByProjectId/'+projectId;
        return this.http.get(UtilsService.registerBaseUrl + params)
            .map(UtilsService.extractData)
            .do(data => { })
            .catch(UtilsService.handleError);
    }

    searchDataByTypeProgram(typeProgram: number){
        let params = 'searchDataByTypeProgram/'+typeProgram;
        return this.http.get(UtilsService.registerBaseUrl + params)
            .map(UtilsService.extractData)
            .do(data => { })
            .catch(UtilsService.handleError);
    }

    serachProjectsByDepartmentAndGestion(department: number, year: number) {
        let params = 'serachProjectsByDepartmentAndGestion/'+department+'/'+year;
        return this.http.get(UtilsService.registerBaseUrl + params)
            .map(UtilsService.extractData)
            .do(data => { })
            .catch(UtilsService.handleError);
    }

    verificarDobleBeneficio(proyId: number) {
        let params = 'verificarDobleBeneficio/'+proyId;
        return this.http.get(UtilsService.registerBaseUrl + params)
            .map(UtilsService.extractData)
            .do(data => { })
            .catch(UtilsService.handleError);
    }
}
