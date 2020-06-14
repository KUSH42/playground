import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalManagerService } from 'src/app/services/global-manager/global-manager.service';

@Component({
  selector: 'app-animated-collapse-arrow',
  templateUrl: './animated-collapse-arrow.component.html',
  styleUrls: ['./animated-collapse-arrow.component.css'],
})
export class AnimatedCollapseArrowComponent implements OnDestroy {
  @Input()
  public expanded: boolean;

  @Output()
  public collapseButtonClick = new EventEmitter<boolean>();

  private _selectedColor: string = 'green';
  private _subscritpions: Subscription[] = [];

  get selectedColor() {
    return this._selectedColor;
  }

  set selectedColor(color: string) {
    if (color == null) {
      return;
    }
    switch (color.toLowerCase()) {
      case 'green': {
        this._selectedColor = 'green';
        break;
      }
      case 'blue': {
        this._selectedColor = 'blue';
        break;
      }
      case 'red': {
        this._selectedColor = 'red';
        break;
      }
      default: {
        break;
      }
    }
  }

  constructor(private _GlobalManagerSerice: GlobalManagerService) {
    // subscribe to global color change
    this._subscritpions.push(
      this._GlobalManagerSerice.colorObservable.subscribe((color: string) => {
        this.selectedColor = color;
      })
    );
  }

  ngOnDestroy(): void {
    this._subscritpions.forEach((subscription) => subscription.unsubscribe());
  }
  public handleClick(event: MouseEvent) {
    this.toggle();
    console.log('parent click; state: ' + this.expanded);
    this.collapseButtonClick.emit(this.expanded);
  }

  public toggle() {
    this.expanded = !this.expanded;
  }

  public open() {
    this.expanded = true;
  }

  public close() {
    this.expanded = false;
  }
}
