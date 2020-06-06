import { Directive, AfterViewInit, ElementRef } from '@angular/core';
import { from, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

@Directive({
  selector: '[appTypewriter]'
})
export class TypewriterDirective implements AfterViewInit {
  private el: ElementRef;

  constructor(el: ElementRef) {
    this.el = el;
  }

  ngAfterViewInit(): void {

    let targetString = this.el.nativeElement.childNodes[0].data;

    this.el.nativeElement.childNodes[0].data = '';

    from(Array.from(targetString))
      .pipe(concatMap((item) => of(item).pipe(delay(200))))
      .subscribe((c) => {
        this.el.nativeElement.childNodes[0].data += c;
      });
  }
}
