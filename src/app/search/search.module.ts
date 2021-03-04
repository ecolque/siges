import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { BrowserModule  } from '@angular/platform-browser';
import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search.routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SearchService } from './search.service';
import { SearchContainerComponent } from './search-container/search.container.component';
import { SearchListContainerComponent } from './search-container/search.list.container.component';


@NgModule({
  declarations: [
    SearchComponent,
    SearchContainerComponent,
    SearchListContainerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule.forRoot(),
    SearchRoutingModule
  ],
  providers: [ SearchService ],
  bootstrap: []
})
export class SearchModule { }

