import { Component, HostListener } from '@angular/core';
import { GlobalManagerService } from './global-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'playground';
  settings = {
    expanded: true,
  };
  appropriateClass: string = '';
  selectedColor: string = 'green';

  public log() {
    console.log(this.settings.expanded);
  }

  public onCollapseButtonClick(state: boolean) {
    this.settings.expanded = !this.settings.expanded;
  }

  @HostListener('window:resize', ['$event'])
  getScreenHeight(event?) {
    //console.log(window.innerHeight);
    if (window.innerHeight <= 412) {
      this.appropriateClass = 'bottomRelative';
    } else {
      this.appropriateClass = 'bottomStick';
    }
  }
  constructor(private _GlobalManagerSerice:GlobalManagerService) {
    this.getScreenHeight();
  }

  onColorChange(value:string) {
    this._GlobalManagerSerice.selectedColor = value;
  }
}
