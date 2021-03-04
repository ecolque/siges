import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/subscription';

import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from './../services/register.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  inscription: Subscription;
  projectId: number;
  register: any;

  constructor(private route: ActivatedRoute, private registerService: RegisterService) {
     this.inscription = this.route.params.subscribe((params: any) => {
      this.projectId = params['id'];
      // this.getRegisters(this.projectId,1,250);
      // his.pageChange(1);
       console.log('DE LIST' + this.projectId);
      this.registerService.registerSelectedEmitter.subscribe(register => {
        if (register) {
          this.register = register;
         }
      });
      });
   }

  ngOnInit() { }
}
