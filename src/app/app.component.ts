import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'playground';
  settings = {
    expanded: true
  };

  public log() {
    console.log(this.settings.expanded);
  }

  public onCollapseButtonClick(state: boolean) {
    this.settings.expanded = state;
  }
}
