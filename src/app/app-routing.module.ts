import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CssSnippetsComponent } from './css-snippets/css-snippets.component';
import { HomeComponent }from './home/home.component';
import { ParticleBannerComponent } from './particle-banner/particle-banner.component';
import { ParticlesConnectComponent } from './particles-connect/particles-connect.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'css-snippets', component: CssSnippetsComponent },
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
