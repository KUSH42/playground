import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-animated-collapse-arrow',
  templateUrl: './animated-collapse-arrow.component.html',
  styleUrls: ['./animated-collapse-arrow.component.css'],
})
export class AnimatedCollapseArrowComponent implements OnInit {
  constructor() {}

  @Input()
  public expanded: boolean;

  @Output()
  public collapseButtonClick = new EventEmitter<boolean>();

  ngOnInit(): void {}

  public handleClick(event: MouseEvent) {
    this.toggle();
    console.log("parent click; state: " + this.expanded);
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
