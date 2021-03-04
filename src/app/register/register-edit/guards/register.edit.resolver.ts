import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Params } from '@angular/router';

import { Subscription } from 'rxjs/subscription';
import { RegisterService } from './../../../services/register.service';



@Injectable()
export class RegisterEditResolver implements Resolve<any>, OnDestroy {
    inscription: Subscription;
    public id: number;

    constructor(private registerService: RegisterService) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
        ): Observable<any>|Promise<any>|any {
          this.id = Number(route.params['id']);
          return this.registerService.getRegisterById(this.id);
    }

  ngOnDestroy() {
    this.inscription.unsubscribe();
   }
}
