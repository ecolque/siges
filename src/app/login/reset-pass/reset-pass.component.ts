import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {

  @Output() loginPopupSuccess: EventEmitter<any> = new EventEmitter();

  change: any = {curr: '', newpass:'', repeatpass:'', username:'', ssp: false}
  username: string;
  error: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  changePass() {
    this.error = "";
    if(this.change.newpass === this.change.repeatpass) {
      this.change.username = this.username;
      this.authService.changePassword(this.change).subscribe(
        data => {
          this.reset();
          this.activeModal.dismiss()
          // this.router.navigate(['login']);
          alert("SE CAMBIO LA CLAVE DE MANERA CORRECTA");

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
        }, er => {   
          this.error = er;      
          // alert(error);
      });
    }else {
      alert("Contraseñas no son iguales");
    }
  }

  reset(){
    this.change.curr = '';
    this.change.newpass = '';
    this.change.repeatpass = '';
  }

}
