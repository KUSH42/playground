import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ParticlesConnectComponent} from './particles-connect/particles-connect.component';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    ParticlesConnectComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
