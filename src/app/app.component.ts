import {
  Component,
  HostListener,
  HostBinding,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { GlobalManagerService } from './services/global-manager/global-manager.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, AfterViewInit {
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
        this.textColor = this.textColorGreen;
        this.alternateTextColor = this.textColorBlue;
        break;
      }
      case 'blue': {
        this._selectedColor = 'blue';
        this.routerActive = this.routerActiveBlue;
        this.textColor = this.textColorBlue;
        this.alternateTextColor = this.textColorGreen;
        break;
      }
      case 'red': {
        this._selectedColor = 'red';
        this.routerActive = this.routerActiveRed;
        this.textColor = this.textColorRed;
        this.alternateTextColor = this.textColorBlue;
        break;
      }
      default: {
        break;
      }
    }
  }
  get selectedColor() {
    return this._selectedColor;
  }

  private subscriptions: Subscription[] = [];

  routerActiveGreen = '#00bb00aa';
  routerActiveBlue = '#0000bbaa';
  routerActiveRed = '#bb0000aa';
  routerActive = this.routerActiveGreen;

  textColorGreen = '#33ff00';
  textColorBlue = '#0033ff';
  textColorRed = '#ff0005';
  textColor = this.textColorGreen;

  alternateTextColor = this.textColorBlue;

  @HostBinding('attr.style')
  public get valueAsStyle(): any {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--router-active: ${this.routerActive}; --text-Color: ${this.textColor}; --alternate-text-Color: ${this.alternateTextColor};`
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
  }

  ngAfterViewInit(): void {
    this._GlobalManagerSerice.colorObservable.subscribe(
      (color) => (this.selectedColor = color)
    );
  }

  onColorChange(value: string) {
    this._GlobalManagerSerice.selectedColor = value;
  }
}
