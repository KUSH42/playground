import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ParticlesConnectComponent } from './particles-connect/particles-connect.component';
import { CssSnippetsComponent } from './css-snippets/css-snippets.component';
import { ParticleBannerComponent } from './particle-banner/particle-banner.component';

const appRoutes: Routes = [
  { path: 'particles-connect', component: ParticlesConnectComponent },
  { path: 'css-snippets', component: CssSnippetsComponent },
  { path: 'particle-banner', component: ParticleBannerComponent }
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
