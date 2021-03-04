import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapComponent } from './map.component';
import { MapRoutingModule } from './map.routing.module';
import { MapService } from './map.service';
import { MapPersonComponent } from './map-person/map-person.component';
import { GeoService } from '../geo/geo.service';
import { SafehtmlMap } from './safehtmlMap.pipe';
import { MapProjectComponent } from './map-project/map-project.component';

@NgModule({
    declarations: [
      MapComponent,
      MapPersonComponent,
      MapProjectComponent,
      SafehtmlMap
    ],
    imports: [
      CommonModule,
      RouterModule, 
      FormsModule, 
      AgmCoreModule.forRoot({
        apiKey: 'AIzaSyBX8whC1OH81ha6rVZh9uy19FvodcNJ6D8'
      }),
      NgbModule.forRoot(),
      MapRoutingModule
    ],
    entryComponents: [ MapPersonComponent, MapProjectComponent ],
    providers: [GeoService, MapService],
    bootstrap: []
  })
export class MapModule {}