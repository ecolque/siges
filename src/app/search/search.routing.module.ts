import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search.component';

const registerRoutes: Routes = [
    { path: '', component: SearchComponent }// , children:[
  //      { path: 'list', component: RegisterListComponent },
    //    { path: ':id/edit', component: RegisterEditComponent}
    // ]}
  //  { path: 'register/:id/edit', component: RegisterEditComponent }
  // { path: '', redirectTo: '/register', pathMatch: 'full' },
  /*{ path: 'register/:id', component: RegisterComponent, children:[
    { path: 'new', component: RegisterEditComponent },
    { path: 'edit', component: RegisterEditComponent },
    { path: 'agregate', component: AgregateComponent },
    { path: 'production', component: ProductionComponent, children:[
        {path: 'agricola', component: AgricolaComponent},
        {path: 'pecuario', component: PecuarioComponent}
      ] },
  ]}*/
];

@NgModule({
  imports: [ RouterModule.forChild(registerRoutes) ],
  exports: [ RouterModule ]
})
export class SearchRoutingModule {}
