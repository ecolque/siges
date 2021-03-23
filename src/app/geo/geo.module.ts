import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { BrowserModule  } from '@angular/platform-browser';
import { GeoComponent } from './geo.component';
import { GeoRoutingModule } from './geo.routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { GeoService } from './geo.service';
import { Safehtml } from './safehtml.pipe';
import { GeoZoomComponent } from './geo-zoom/geo-zoom.componente';
import { GeoReportComponent } from './geo-report/geo-report.component';
import { GeoEvaluationComponent } from './geo-evaluation/geo-evaluation.component';

@NgModule({
  declarations: [
    GeoComponent,
    Safehtml,
    GeoZoomComponent,
    GeoEvaluationComponent,
    GeoReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule, 
    FormsModule, 
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBJBf7TuD0d_FM6l4aRw_w_PjcVmfl4XoU'
      
    }),
    NgbModule.forRoot(),
    GeoRoutingModule
  ],
  entryComponents: [ GeoZoomComponent, GeoEvaluationComponent, GeoReportComponent ],
  providers: [GeoService],
  bootstrap: []
})
export class GeoModule {}
