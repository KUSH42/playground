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
    parentNodeOldDisplay: string;
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
        concatMap((memento) => {
          console.log('map');
          console.log(
            'current: ' +
              memento.node.parentNode.style.display +
              ' old: ' +
              memento.parentNodeOldDisplay
          );
          memento.node.parentElement.style.display =
            memento.parentNodeOldDisplay;
          return from(memento.data).pipe(
            // each memento
            concatMap((char) =>
              of({ node: memento.node, char }).pipe(delay(25))
            ) // each char
          );
        })
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
        parentNodeOldDisplay: element.parentElement.style.display,
      });

      element.data = '';
    } else {
      element.childNodes.forEach((childElement: HTMLElement) => {
        this.analyzeChildNode(childElement);
      });
      if (this.hasTextChild(element)) {
        element.style.display = 'none';
      }
    }
  }

  private hasTextChild(element: HTMLElement) {
    for (let i = 0; i < element.childNodes.length; i++) {
      if (
        element.childNodes[i].nodeType == TypewriterDirective.TEXT_NODE_TYPE
      ) {
        return true;
      }
    }

    return false;
  }
}
