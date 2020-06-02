import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';

import * as p5 from 'p5';

@Component({
  selector: 'app-particle-banner',
  templateUrl: './particle-banner.component.html',
  styleUrls: ['./particle-banner.component.css'],
})
export class ParticleBannerComponent implements AfterViewInit {
  constructor() {}

  @ViewChild('rendererContainer', { read: ElementRef, static: false })
  private container: ElementRef;

  private static rgba = {
    rMin: 0,
    rMax: 36,
    gMin: 160,
    gMax: 255,
    bMin: 0,
    bMax: 36,
    aMin: 0.3,
    aMax: 0.6,
  };

  // an array to add multiple particles
  private particles = [];
  private canvas: p5;

  ngAfterViewInit(): void {
    const sketch = (s) => {
      s.preload = () => {
        // preload code
      };

      s.setup = () => {
        this.setup();
      };

      s.draw = () => this.draw();
    };
    this.canvas = new p5(sketch.bind(this));

    this.canvas.resizeCanvas(
      this.container.nativeElement.offsetWidth,
      this.container.nativeElement.offsetHeight
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    event.target.innerWidth;
    console.log(
      'resize: ' +
        this.container.nativeElement.offsetWidth +
        ',' +
        this.container.nativeElement.offsetHeight
    );

    this.canvas.resizeCanvas(
      this.container.nativeElement.offsetWidth,
      this.container.nativeElement.offsetHeight
    );
  }

  public static randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public static randomFloatFromInterval(min, max) {
    return Math.random() * (min - max) + max;
  }

  public static getRandomColor() {
    return (
      'rgba(' +
      this.randomIntFromInterval(
        ParticleBannerComponent.rgba.rMin,
        ParticleBannerComponent.rgba.rMax
      ) +
      ',' +
      this.randomIntFromInterval(
        ParticleBannerComponent.rgba.gMin,
        ParticleBannerComponent.rgba.gMax
      ) +
      ',' +
      this.randomIntFromInterval(
        ParticleBannerComponent.rgba.bMin,
        ParticleBannerComponent.rgba.bMax
      ) +
      ',' +
      this.randomFloatFromInterval(
        ParticleBannerComponent.rgba.aMin,
        ParticleBannerComponent.rgba.aMax
      ) +
      ')'
    );
  }

  private setup() {
    let renderer = this.canvas
      .createCanvas(
        this.container.nativeElement.offsetWidth,
        this.container.nativeElement.offsetHeight
      )
      .parent(this.container.nativeElement);
    for (let i = 0; i < this.container.nativeElement.offsetWidth / 10; i++) {
      this.particles.push(
        new Particle(
          this.container.nativeElement.offsetWidth,
          this.container.nativeElement.offsetWidth,
          this.canvas
        )
      );
    }
  }

  private draw() {
    this.canvas.background('#0f0f0f');
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].createParticle();
      this.particles[i].moveParticle();
      this.particles[i].joinParticles(this.particles.slice(i));
    }
  }
}

class Particle {
  private x: number;
  private y: number;
  private r: number;
  private xSpeed: number;
  private ySpeed: number;
  private width: number;
  private height: number;
  private canvas;
  private color: string;

  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
  constructor(width: number, height: number, canvas) {
    this.width = width;
    this.height = height;
    this.canvas = canvas;
    this.x = ParticleBannerComponent.randomIntFromInterval(0, this.width);
    this.y = ParticleBannerComponent.randomIntFromInterval(0, this.height);
    this.r = ParticleBannerComponent.randomIntFromInterval(1, 8);
    this.xSpeed = ParticleBannerComponent.randomFloatFromInterval(-1, 1);
    this.ySpeed = ParticleBannerComponent.randomFloatFromInterval(-0.75, 0.75);
    this.color = ParticleBannerComponent.getRandomColor();
  }

  // creation of a particle.
  createParticle() {
    this.canvas.noStroke();
    this.canvas.fill(this.color);
    this.canvas.circle(this.x, this.y, this.r);
  }

  // setting the particle in motion.
  moveParticle() {
    if (this.x < 0 || this.x > this.width) this.xSpeed *= -1;
    if (this.y < 0 || this.y > this.height) this.ySpeed *= -1;
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  // this function creates the connections(lines)
  // between particles which are less than a certain distance apart
  joinParticles(particles) {
    particles.forEach((element) => {
      let dis = this.canvas.dist(this.x, this.y, element.x, element.y);
      if (dis < 85) {
        this.canvas.stroke('rgba(255,255,255,0.04)');
        this.canvas.line(this.x, this.y, element.x, element.y);
      }
    });
  }
}
