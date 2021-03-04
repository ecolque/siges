import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { UtilsService } from './../services/utils.service';


@Injectable()
export class MapService {
    constructor(
        private http: Http) {
            
        }

    getMapPeople() {
        let params = 'getMapPeople';
        return this.http.get(UtilsService.mapBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }
    getMapDataGenearlByYear(year: number): Observable<any[]> {
        let params = 'getMapDataGenearlByYear/' + year;
        return this.http.get(UtilsService.mapBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getProjectsByDepartmentAndGestion(department: number, year: number): Observable<any[]> {
        let params = 'getProjectsByDepartmentAndGestion/' + department + "/" + year;
        return this.http.get(UtilsService.mapBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getPeopleByProjectId(projectId: number): Observable<any[]> {
        let params = 'getPeopleByProjectId/' + projectId;
        return this.http.get(UtilsService.mapBaseUrl + params)
                .map(UtilsService.extractData)
                .do(data => { })
                .catch(UtilsService.handleError);
    }

    getFeature(url: any) {        
        return this.http.get(url);
    }
}