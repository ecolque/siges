import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { BrowserModule  } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { ReportComponent } from './report.component';
import { ReportService } from './report.service';
import { ReportRoutingModule } from './report.routing.module';


@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule.forRoot(),
    ReportRoutingModule
  ],
  entryComponents: [ ],
  providers: [ ReportService ],
  bootstrap: []
})
export class ReportModule {}
