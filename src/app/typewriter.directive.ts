import { Directive, AfterViewInit, ElementRef } from '@angular/core';
import { from, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

@Directive({
  selector: '[appTypewriter]',
})
export class TypewriterDirective implements AfterViewInit {

  private static TEXT_NODE_TYPE: number = 3;
  private el: ElementRef;
  private mementos: {
    node: any;
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

    from(this.mementos)
      .pipe(
        concatMap((memento) =>
          from(memento.data).pipe(
            // each memento
            concatMap((char) =>
              of({ node: memento.node, char }).pipe(delay(25))
            ) // each char
          )
        )
      )
      .subscribe(({ node, char }) => {
        node.data += char;
      });
  }

  analyzeChildNode(element: any) {
    if (element.nodeType === TypewriterDirective.TEXT_NODE_TYPE) {
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
        this.analyzeChildNode(childElement);
      });
    }
  }
}
