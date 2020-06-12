import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalManagerService {

  readonly colorChoices: string[] = ['Red', 'Green', 'Blue'];
  private _selectedColor: string = 'Green';
  readonly colorObservable:BehaviorSubject<string>;

  set selectedColor(color: string) {
    this._selectedColor = color;
    this.colorObservable.next(this._selectedColor);
  }

  constructor() {
   this.colorObservable = new BehaviorSubject(this._selectedColor);
  }
}
