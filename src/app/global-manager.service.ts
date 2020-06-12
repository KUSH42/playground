import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalManagerService {

  readonly colorChoices: string[] = ['Red', 'Green', 'Blue'];
  private _selectedColor: string = 'Green';
  readonly colorObsservable:BehaviorSubject<string>;

  set selectedColor(color: string) {
    this._selectedColor = color;
    this.colorObsservable.next(this._selectedColor);
    console.log(`Global color changed: ${this._selectedColor}`);
  }

  constructor() {
   this.colorObsservable = new BehaviorSubject(this._selectedColor);
  }
}
