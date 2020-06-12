import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ParticlesConnectComponent } from './particles-connect/particles-connect.component';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CssSnippetsComponent } from './css-snippets/css-snippets.component';

import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AnimatedCollapseArrowComponent } from './animated-collapse-arrow/animated-collapse-arrow.component';
import { ParticleBannerComponent } from './particle-banner/particle-banner.component';
import { HomeComponent } from './home/home.component';
import { TypewriterDirective } from './typewriter.directive';
import { MatrixComponent } from './matrix/matrix.component';

@NgModule({
  declarations: [
    AppComponent,
    ParticlesConnectComponent,
    CssSnippetsComponent,
    AnimatedCollapseArrowComponent,
    ParticleBannerComponent,
    HomeComponent,
    TypewriterDirective,
    MatrixComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatListModule,
    MatRippleModule,
    MatSliderModule,
    MatSidenavModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
