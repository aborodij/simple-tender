import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { environment } from '../environments/environment';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AuthGuard } from './shared/guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: environment.routerPath.list,
    pathMatch: 'full'
  },
  {
    path: environment.routerPath.list,
    loadChildren: () => import('./tender-list-module/tender-list.module').then(m => m.TenderListModule)
  },
  {
    path: environment.routerPath.create,
    loadChildren: () => import('./tender-create-module/tender-create.module').then(m => m.TenderCreateModule),
    canActivate: [AuthGuard]
  },
  {
    path: environment.routerPath.view,
    loadChildren: () => import('./tender-view-module/tender-view.module').then(m => m.TenderViewModule)
  },
  {
    path: environment.routerPath.login,
    loadChildren: () => import('./login-module/login.module').then(m => m.LoginModule)
  },
  {
    path: environment.routerPath.signup,
    loadChildren: () => import('./signup-module/signup.module').then(m => m.SignUpModule)
  },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
