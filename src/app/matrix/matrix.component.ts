import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  HostListener,
  OnDestroy,
} from '@angular/core';
import * as dat from 'dat.gui';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css'],
})
export class MatrixComponent implements AfterViewInit, OnDestroy {

  private font_size = 10;

  private drops: number[] = []; // an array of drops - one per column
  // random characters - taken from the unicode charset
  private charsA = 'АВЕДЁЗИЛМНОЯЩЦХТСРП漢字は日本語で使われる文字で中国からやってきました。ひらがなとカタカナは日本で作られました©®¶$#!(*<=>?@¥ͶΔΛΞΠΣΩΨΧ☺ت0123456798ABCDEF田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑'.split(
    ''
  );
  // array of colors to randomize characters with
  private colorsB = [
    '#00F',
    '#00F',
    '#02F',
    '#20F',
    '#30A',
    '#118',
    '#01A',
    '#00A',
    '#002',
    '#31F',
  ];
  private colorsG = [
    '#0F0',
    '#0F0',
    '#2F0',
    '#0F2',
    '#0A3',
    '#181',
    '#1A0',
    '#0A0',
    '#020',
    '#1F3',
  ];
  private colorsR = [
    '#F00',
    '#F00',
    '#F02',
    '#F20',
    '#A30',
    '#811',
    '#A01',
    '#A00',
    '#200',
    '#F31',
  ];
  private colors = this.colorsG;
  private scanlinesDone = false;
  private scanlineInitDone = false;

  private effectController = {
    red: false,
    green: true,
    blue: false,
  };

  private gui: dat.GUI;

  constructor() {}

  ngOnDestroy(): void {
    this.gui.destroy();
    }

  @ViewChild('canvas') canvas: ElementRef;
  // canvas context
  private ctx: CanvasRenderingContext2D;

  @HostListener('window:resize', ['$event'])
  sizeChange(event: any) {
    // get current image
    const imgData = this.ctx.getImageData(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    // init new drops array with correct size
    // set canvas to full size
    this.canvas.nativeElement.height = this.canvas.nativeElement.clientHeight;
    this.canvas.nativeElement.width = this.canvas.nativeElement.clientWidth;

    // fill new area black
    this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    this.ctx.fillRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );

    const columns = this.canvas.nativeElement.width / this.font_size; // number of columns for the rain
    const newDrops = [];
    for (let x = 0; x < columns; x++) {
      newDrops[x] = 0;
    }
    // get sliceIndex => min of either new # of columns or old array size
    let sliceIndex;
    if (columns > this.drops.length) {
      sliceIndex = this.drops.length - 1;
    } else {
      sliceIndex = columns;
    }
    // copy old drop data up to slice index
    for (let x = 0; x <= sliceIndex; x++) {
      newDrops[x] = this.drops[x];
    }
    // randomize new drops so they don't appear in a scanline
    for (sliceIndex; sliceIndex < columns; sliceIndex++) {
      newDrops[sliceIndex] = Math.random() * this.canvas.nativeElement.height;
    }
    // set new drop data
    this.drops = newDrops;

    // reload image
    this.ctx.putImageData(imgData, 0, 0);
    console.log('size changed.', event);
  }

  ngAfterViewInit(): void {
    this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext(
      '2d'
    );

    // making the canvas full screen
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    this.ctx.fillRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );

    this.initGUI();

    const columns = this.canvas.nativeElement.width / this.font_size; // number of columns for the rain

    // x == x coordinate
    // drops[x] = y co-ordinate of the drop(same for every drop initially to create scanline effect)
    for (let x = 0; x < columns; x++) {
      this.drops[x] = 1;
    }

    setInterval(() => {
      this.draw();
    }, 33);
    setTimeout(() => {
      this.scanlinesDone = true;
    }, (this.canvas.nativeElement.height / this.font_size) * 34);
    setTimeout(() => {
      this.scanlineInitDone = true;
    }, (this.canvas.nativeElement.height / this.font_size) * 34 + 2000);
  }

  private initGUI() {
    this.gui = new dat.GUI();
    this.gui.close();

    let redController = this.gui.add(this.effectController, 'red');
    let greenController = this.gui.add(this.effectController, 'green');
    let blueController = this.gui.add(this.effectController, 'blue');

    redController.onChange(() => {
      if (redController.getValue()) {
        blueController.setValue(false);
        greenController.setValue(false);
        this.colors = this.colorsR;
      }
    });

    blueController.onChange(() => {
      if (blueController.getValue()) {
        redController.setValue(false);
        greenController.setValue(false);
        this.colors = this.colorsB;
      }
    });

    greenController.onChange(() => {
      if (greenController.getValue()) {
        blueController.setValue(false);
        redController.setValue(false);
        this.colors = this.colorsG;
      }
    });
  }

  draw() {
    // translucent BG to show trail
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    this.ctx.fillRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    this.ctx.font = this.font_size + "px 'Courier New'";
    // looping over drops
    for (let i = 0; i < this.drops.length; i++) {
      let random = Math.random();
      // a random character to print
      this.ctx.fillStyle = this.colors[
        (i + Math.floor(random * this.colors.length)) % this.colors.length
      ]; // green text
      const text = this.charsA[Math.floor(random * this.charsA.length)];

      // x = i*font_size, y = value of drops[i]*font_size
      this.ctx.fillText(
        text,
        i * this.font_size,
        this.drops[i] * this.font_size
      );

      // sending the drop back to the top randomly after it has crossed the screen
      // adding a randomness to the reset to make the drops scattered on the Y axis
      if (
        this.drops[i] * this.font_size > this.canvas.nativeElement.height &&
        random > 0.975
      ) {
        this.drops[i] = 0;
      }
      // incrementing Y coordinate
      if (!this.scanlinesDone) {
        random = 1;
      }
      // when init is done + 1s, repaint after and before trails to clean up artifacts
      if (this.scanlineInitDone) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        this.ctx.fillRect(
          i * this.font_size,
          (this.drops[i] - 48) * this.font_size,
          this.font_size,
          this.font_size + random + 0.5
        );
        if (
          this.drops[i] < 96 &&
          this.canvas.nativeElement.height > this.font_size * 96
        ) {
          this.ctx.fillRect(
            i * this.font_size,
            this.canvas.nativeElement.height -
              (96 - this.drops[i]) * this.font_size,
            this.font_size,
            this.font_size * 3
          );
        }
      }
      this.drops[i] = this.drops[i] + random;
    }
  }
}
