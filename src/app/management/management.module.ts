import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ManagementComponent } from './management.component';
import { ManagementService } from './management.service';
import { ManagementRoutingModule } from './management.routing.module';


@NgModule({
  declarations: [
    ManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule.forRoot(),
    ManagementRoutingModule
  ],
  entryComponents: [ ],
  providers: [ ManagementService ],
  bootstrap: [ ]
})
export class ManagementModule { }
