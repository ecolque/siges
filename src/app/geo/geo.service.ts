import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// import { Router } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from './../services/utils.service';

import 'rxjs/Rx';

@Injectable()
export class GeoService {

    constructor(
        private http: Http,
// private utilsService: UtilsService
        ) { console.log('authenticate:' + UtilsService.authenticateBaseUrl); }

        getProjects(departmentId: number, year: number): Observable<any[]> {
        let params = 'getProjects/' + departmentId + '/' + year;
        return this.http.get(UtilsService.geoBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getProjectsByUser(): Observable<any[]> {
        let params = 'getProjectsByUser';
        return this.http.get(UtilsService.geoBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getInspections(projectId: number): Observable<any[]> {
        let params = 'getInspections/' + projectId;
        return this.http.get(UtilsService.geoBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getInspectionsByRegisterId(registerId: number): Observable<any[]> {
        let params = 'getInspectionsByRegisterId/' + registerId;
        return this.http.get(UtilsService.geoBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getPeople(projectId: number): Observable<any[]> {
        let params = 'getPeople/' + projectId;
        return this.http.get(UtilsService.geoBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getTimeSupervisionByInspectionId (inspectionId: number): Observable<any[]> {
        let params = 'getTimeSupervisionByInspectionId/' + inspectionId;
        return this.http.get(UtilsService.geoBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getPhotos (inspectioId: number): Observable<any[]> {
        let params = 'getPhotos/' + inspectioId;
        return this.http.get(UtilsService.geoBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getTraking(inspectioId: number): Observable<any[]> {
        let params = 'getTraking/' + inspectioId;
        return this.http.get(UtilsService.geoBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getPhoto(inspectioId: number): Observable<any[]> {
        let params = 'getPhoto/' + inspectioId;
        return this.http.get(UtilsService.geoBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getDataEvaluation(projectId: number): Observable<any[]> {
        let params = 'getDataEvaluation/' + projectId;
        return this.http.get(UtilsService.geoBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getPhotosByRegisterId(registerId: number): Observable<any[]> {
        let params = 'getPhotosByRegisterId/' + registerId;
        return this.http.get(UtilsService.geoBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

/*authWhenInvalidateSession(user:any): Observable<any[]>{
    this.userAuthenticate = false;
    return this.http.post(UtilsService.authWhenInvalidateSessionBaseUrl, user)
            .map(UtilsService.extractData)
            .do(data => {
                console.log(data);
            })
            .catch(UtilsService.handleError);
}

  getUserAuthenticate(){
    console.log("getUserAuthenticate:"+ this.userAuthenticate);
    return this.userAuthenticate;
  }

  logout(){
    return this.http.get(UtilsService.logoutBaseUrl)
                .map(UtilsService.extractData)
                .do(data => {
                    this.userAuthenticate = false;
                    this.router.navigate(['login']);
                })
                .catch(UtilsService.handleError);
  }  */
}
