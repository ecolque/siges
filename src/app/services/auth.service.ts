import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UtilsService } from './utils.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import 'rxjs/Rx';

@Injectable()
export class AuthService {
    public static userType: number = 1;

    public userAuthenticate: boolean = false;
    userAuthEmitter = new EventEmitter<any>();

    constructor(
        private http: Http,
        private router: Router,
// private utilsService: UtilsService
        ) {}

authenticate(user: any): Observable<any[]> {
    this.userAuthenticate = false;
    console.log('authenticate:' + this.userAuthenticate);
    return this.http.post(UtilsService.authenticateBaseUrl, user)
            .map(UtilsService.extractData)
            .do(data => {
                // console.log(data);
                UtilsService.setDataRequired(data);
                this.userAuthenticate = true;
                this.userAuthEmitter.emit(data.user);
                AuthService.userType = data.user.type;                
                // this.router.navigate(['project']);
            })
            .catch(UtilsService.handleError);
}

changePassword(obj: any): Observable<any[]> {        
    return this.http.post(UtilsService.changepassBaseUrl, obj)
            .map(UtilsService.extractData)
            .do(data => {})
            .catch(UtilsService.handleError);
}

authWhenInvalidateSession(user: any): Observable<any[]> {
    this.userAuthenticate = false;
    return this.http.post(UtilsService.authWhenInvalidateSessionBaseUrl, user)
            .map(UtilsService.extractData)
            .do(data => {
                console.log(data);
                AuthService.userType = data.type;
            })
            .catch(UtilsService.handleError);
}

  getUserAuthenticate() {
    console.log('getUserAuthenticate:' + this.userAuthenticate);
    return this.userAuthenticate;
  }

  logout() {
    return this.http.get(UtilsService.logoutBaseUrl)
                .map(UtilsService.extractData)
                .do(data => {
                    this.userAuthenticate = false;
                    this.router.navigate(['login']);        
                })
                .catch(UtilsService.handleError);
  }
}
