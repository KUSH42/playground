import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  OnDestroy,
  AfterContentInit
} from '@angular/core';

import * as p5 from 'p5';

@Component({
  selector: 'app-particle-banner2',
  templateUrl: './particle-banner2.component.html',
  styleUrls: ['./particle-banner2.component.css'],
})
export class ParticleBanner2Component implements AfterContentInit, OnDestroy{

  constructor() {}

  ngOnDestroy(): void {
    this.renderer.remove();
    this.canvas.remove();
    this.canvas = null;
  }

  @ViewChild('rendererContainer2', { static: true })
  private container: ElementRef;

  private canvas: p5;

  private renderer: p5.Renderer;

  ngAfterContentInit(): void {
    console.log('particle-banner2');
    console.log(this.container);
    const sketch = ((s: { preload: () => void; setup: () => void; draw: () => void; }) => {
      s.preload = () => {
        // preload code
      };

      s.setup = () => {
        this.setup();
      };

      s.draw = () => this.draw();
    });
    p5.prototype
    this.canvas = new p5(sketch.bind(this), this.container.nativeElement);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: void;}; }) {
    event.target.innerWidth;
    this.canvas.resizeCanvas(
      this.container.nativeElement.clientWidth,
      this.container.nativeElement.clientHeight
    );
  }


  private setup() {
    this.renderer = this.canvas
      .createCanvas(
        this.container.nativeElement.clientWidth,
        this.container.nativeElement.clientHeight
      );
  }

  private draw() {
    this.canvas.background('#0f0f0f');
  }
}
