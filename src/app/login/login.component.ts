import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

import { UtilsService } from './../services/utils.service';
import { AuthService } from './../services/auth.service';

import { FormBuilder, FormGroup  } from '@angular/forms';

import { Subscription } from 'rxjs/subscription';

import { Router } from '@angular/router';
import { User } from './user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { ResetPassComponent } from './reset-pass/reset-pass.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() isLoginPopup: boolean = false;
  @Output() loginPopupSuccess: EventEmitter<any> = new EventEmitter();

  busy: Subscription;

  error: string;

  form: FormGroup;
  private user: User = new User('', '');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
     this.form = this.fb.group(this.user);
     this.authService.userAuthenticate = false;
  }

  onSubmit(user) {
    this.error = '';
    if (this.isLoginPopup && UtilsService.USER.username == user.username ) {
      this.busy = this.authService.authWhenInvalidateSession(user).subscribe(
          data => {
            this.loginPopupSuccess.emit(true);
        },
        error => this.error = error);
    }else {
      this.busy = this.authService.authenticate(user).subscribe(
            data => {
              let u = data['user'];
              if(u.passReset){
                  this.openFormResetPassw(u);
              }else{
                this.loginPopupSuccess.emit(true);
                if(UtilsService.isAcceses(11)) {
                  this.router.navigate(['project']);
                }else if(UtilsService.isAcceses(9)) {
                  this.router.navigate(['geo']);
                }else if(UtilsService.isAcceses(7)){
                          this.router.navigate(['search']);
                }else if(UtilsService.isAcceses(8)){
                  this.router.navigate(['management']);
                }
              }
            }, error => this.error = error);
        }
  }

  openFormResetPassw(u) {
    const modalRef = this.modalService.open(ResetPassComponent, {size: 'sm', backdrop: 'static', keyboard: false});    
    modalRef.componentInstance.username = u.username;
    modalRef.result.then((result) => {
      console.log('++++++++++++++++',result);
      // if (result.ok === true) {
        // this.form.get('password').setValue('');
        // this.router.navigate(['project']);
      // }
    });
  }
}
