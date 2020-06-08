import { Directive, AfterViewInit, ElementRef } from '@angular/core';
import { from, of, Observable } from 'rxjs';
import {
  concatMap,
  delay,
  mergeMap,
  mergeAll,
  concatAll,
} from 'rxjs/operators';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';

@Directive({
  selector: '[appTypewriter]',
})
export class TypewriterDirective implements AfterViewInit {
  private static TEXT_NODE_TYPE: number = 3;

  private el: ElementRef;

  private mementos: {
    node: Node;
    data: string;
    previousNodeLength: number;
  }[] = [];

  constructor(el: ElementRef) {
    this.el = el;
  }

  ngAfterViewInit(): void {
    this.el.nativeElement.childNodes.forEach((element: HTMLElement) => {
      this.analyzeChildNode(element);
    });

    console.log(this.mementos);
    /*let targetString = this.el.nativeElement.childNodes[0].data;

    this.el.nativeElement.childNodes[0].data = '';

    from(Array.from(targetString))
      .pipe(concatMap((item) => of(item).pipe(delay(200))))
      .subscribe((c) => {
        this.el.nativeElement.childNodes[0].data += c;
      }); */

    /*
    for (let memento of this.mementos) {
      obs.push(
        from(Array.from(memento.data))
.pipe(concatMap((item) => of(item).pipe(delay(150)))).subscribe((c) => {
            memento.node.data += c;
          })
      );
    }
  }*/

    from(this.mementos)
      .pipe(
        concatMap((memento) =>
          of(memento).pipe(delay(memento.previousNodeLength * 60))
        )
      )
      .subscribe((memento) =>
        from(Array.from(memento.data))
          .pipe(concatMap((text) => of(text).pipe(delay(100))))
          .subscribe((c) => {
            memento.node.data += c;
          })
      );
  }

  gatherMementoMetaData() {
    for (let i = 1; i < this.mementos.length; i++) {
      console.log(
        this.mementos[i] + ' size ' + this.mementos[i].node.data.length
      );
      this.mementos[i - 1].previousNodeLength = this.mementos[
        i
      ].node.data.length;
    }
  }

  analyzeChildNode(element: Node) {
    if (element.nodeType === TypewriterDirective.TEXT_NODE_TYPE) {
      console.log('Found text, pushing: ' + element.data);
      let nodeLength = 0;
      if (this.mementos.length > 0) {
        nodeLength = this.mementos[this.mementos.length - 1].data.length;
      }
      this.mementos.push({
        node: element,
        data: element.data,
        previousNodeLength: nodeLength,
      });

      element.data = '';
    } else {
      element.childNodes.forEach((childElement: HTMLElement) => {
        console.log('going deeper');
        this.analyzeChildNode(childElement);
      });
    }
  }
}
