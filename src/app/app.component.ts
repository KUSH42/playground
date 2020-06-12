import { Component, HostListener, HostBinding, OnDestroy } from '@angular/core';
import { GlobalManagerService } from './global-manager.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'playground';
  settings = {
    expanded: true,
  };
  appropriateClass: string = '';
  private _selectedColor: string = 'green';

  set selectedColor(color: string) {
    if (color == null) {
      return;
    }
    switch (color.toLowerCase()) {
      case 'green': {
        this._selectedColor = 'green';
        this.routerActive = this.routerActiveGreen;
        break;
      }
      case 'blue': {
        this._selectedColor = 'blue';
        this.routerActive = this.routerActiveBlue;
        break;
      }
      case 'red': {
        this._selectedColor = 'red';
        this.routerActive = this.routerActiveRed;
        break;
      }
      default: {
        break;
      }
    }
  }

  private subscriptions: Subscription[] = [];

  routerActiveGreen = '#00bb00aa';
  routerActiveBlue = '#0000bbaa';
  routerActiveRed = '#bb0000aa';
  routerActive = this.routerActiveGreen;

  @HostBinding('attr.style')
  public get valueAsStyle(): any {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--router-active: ${this.routerActive}`
    );
  }

  public onCollapseButtonClick(state: boolean) {
    this.settings.expanded = !this.settings.expanded;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  @HostListener('window:resize', ['$event'])
  getScreenHeight(event?) {
    if (window.innerHeight <= 290) {
      this.appropriateClass = 'bottomRelative';
    } else {
      this.appropriateClass = 'bottomStick';
    }
  }
  constructor(
    private _GlobalManagerSerice: GlobalManagerService,
    private sanitizer: DomSanitizer
  ) {
    this.getScreenHeight();
    this._GlobalManagerSerice.colorObsservable.subscribe(color =>
      this.selectedColor = color
    );
  }

  onColorChange(value: string) {
    this._GlobalManagerSerice.selectedColor = value;
  }
}
