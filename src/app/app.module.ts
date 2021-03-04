
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { TreeModule } from 'angular-tree-component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app.routing.modules';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from './services/auth.service';
import { UtilsService } from './services/utils.service';

import { ProjectModule } from './project/project.module';
import { VerBeneficioComponent } from './shared/ver-beneficio/ver-beneficio.component';

import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginPopupComponent } from './login/login.popup.component';
// import { GeoComponent } from './geo/geo.component';
// import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, HomeComponent, LoginPopupComponent// , GeoComponent //, SearchComponent // , VerBeneficioComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ProjectModule,
    HttpModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    AppRoutingModule
  ],
  entryComponents: [VerBeneficioComponent, LoginPopupComponent],
  providers: [UtilsService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
