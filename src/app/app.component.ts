import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit } from '@angular/core';

import { User } from './login/user';
import { AuthService } from './services/auth.service';
import { UtilsService } from './services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  user: User;
  change: any = {curr: '', newpass:'', repeatpass:'', username:'', ssp: false}
  showBtnPass: boolean;
  isSpp: boolean;
  constructor(
    private authService: AuthService    
    ) {}

  ngOnInit() {
    this.authService.userAuthEmitter.subscribe(
            user => { 
              this.user = user; console.log(this.user); 
              this.isSpp = this.user['type'] === 1 ? true : false;
              console.log("**************");
              console.log(this.isSpp);
            }
          );        
  }
  
  logout() {
    this.authService.logout().subscribe(
      data => {
        this.user = null;
      }, error => {
        alert(error);
    });
  }

  changePass() {
    if(this.change.newpass === this.change.repeatpass) {
      this.change.ssp = this.isSpp;   
      console.log(this.change);   
      this.authService.changePassword(this.change).subscribe(
        data => {
          this.showBtnPass = false;
          this.reset();          
          alert("Ok");
        }, error => {          
          alert(error);
      });
    }else {
      alert("Contraseñas no son iguales");
    }
  }

  isAcceses(param: number) {    
    return UtilsService.isAcceses(param);   
  }

  reset(){
    this.change.curr = '';
    this.change.newpass = '';
    this.change.repeatpass = '';
  }
}

