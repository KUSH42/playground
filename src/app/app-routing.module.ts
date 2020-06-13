import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent }from './components/home/home.component';
import { MatrixComponent } from './components/matrix/matrix.component';
import { ParticleBannerComponent } from './components/particle-banner/particle-banner.component';
import { ParticlesConnectComponent } from './components/particles-connect/particles-connect.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'matrix', component: MatrixComponent },
  { path: 'particle-banner', component: ParticleBannerComponent },
  { path: 'particles-connect', component: ParticlesConnectComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
]
})
export class AppRoutingModule { }
