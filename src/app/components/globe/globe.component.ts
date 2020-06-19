import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import globeData from './globe.json';
import { Subscription } from 'rxjs';
import { GlobalManagerService } from 'src/app/services/global-manager/global-manager.service';

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css'],
})
export class GlobeComponent implements AfterViewInit {
  @ViewChild('globe', { read: ElementRef, static: false })
  private container: ElementRef;
  @ViewChild('canvas', { read: ElementRef, static: false })
  private canvas: ElementRef;

  private width = 1000;
  private height = 800;
  private globeRadius = 200;
  private globeSegments = 64;
  private globeWidth = 4098 / 2;
  private globeHeight = 1968 / 2;

  // A group to hold everything
  private groups = {
    globe: null,
    globePoints: null,
  };

  private data = globeData;
  private scene;
  private renderer;
  private globe;

  private camera = {
    object: null,
    orbitControls: null,
    angles: {
      current: {
        azimuthal: null,
        polar: null,
      },
      target: {
        azimuthal: null,
        polar: null,
      },
    },
    transition: {
      current: 0,
      target: 30,
    },
  };

  // Visual state
  private state = {
    targets: [
      {
        id: 0,
        name: 'John Yang',
        geo: {
          lat: 31.2304,
          lng: 121.4737,
          name: 'Shanghai, CN',
        },
        date: '01.23.2018',
      },
      {
        id: 1,
        name: 'Emma S.',
        geo: {
          lat: 55.6761,
          lng: 12.5683,
          name: 'Denmark, CPH',
        },
        date: '09.20.2018',
      },
      {
        id: 2,
        name: 'Spencer S.',
        geo: {
          lat: 34.0522,
          lng: -118.2437,
          name: 'Los Angeles, CA',
        },
        date: '12.25.2018',
      },
    ],
    currentTargetIndex: null,
    previousTargetIndex: null,
    isGlobeAnimating: true,

    // Property to save setInterval id to auto rotate the globe every n seconds
    autoRotateGlobeTimer: null,
  };

  private subscriptions: Subscription[] = [];

  private _selectedColor: string = '#00ff00';
  set selectedColor(color: string) {
    if (color == null) {
      return;
    }
    switch (color.toLowerCase()) {
      case 'green': {
        this._selectedColor = '#00ff00';
        this.groups.globePoints.material.color = new THREE.Color(0x00ff00);
        break;
      }
      case 'blue': {
        this._selectedColor = '#0000ff';
        this.groups.globePoints.material.color = new THREE.Color(0x0000ff);
        break;
      }
      case 'red': {
        this._selectedColor = '#ff0000';
        this.groups.globePoints.material.color = new THREE.Color(0xff0000);
        break;
      }
      default: {
        break;
      }
    }
  }

  get selectedColor() {
    return this._selectedColor;
  }

  private onWindowResize() {
    this.camera.object.aspect =
      this.container.nativeElement.offsetWidth /
      this.container.nativeElement.offsetHeight;

    this.camera.object.updateProjectionMatrix();

    this.renderer.setSize(
      this.container.nativeElement.offsetWidth,
      this.container.nativeElement.offsetHeight
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private setup() {
    this.scene = new THREE.Scene();
    this.camera.object = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      1,
      4000
    );
    this.camera.object.position.z = -400;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,
      antialias: true,
    });
    this.renderer.setSize(this.width, this.height);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    this.setupGlobe();
    this.setupOrbitControls();
    this.setupAutoRotate();
    this.render();

    // Subscribe to global color change
    this.subscriptions.push(
      this._GlobalManagerSerice.colorObservable.subscribe((color: string) => {
        this.selectedColor = color;
      })
    );
  }

  private setupGlobe() {
    const canvasSize = 128;
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = canvasSize;
    textureCanvas.height = canvasSize;

    const canvasContext = textureCanvas.getContext('2d');
    canvasContext.rect(0, 0, canvasSize, canvasSize);
    const texture = new THREE.Texture(textureCanvas);

    const geometry = new THREE.SphereGeometry(
      this.globeRadius,
      this.globeSegments,
      this.globeSegments
    );
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.5,
    });
    this.globe = new THREE.Mesh(geometry, material);

    this.groups.globe = this.globe;
    this.groups.globe.name = 'Globe';

    this.scene.add(this.groups.globe);

    this.addPoints();
  }

  private addPoints() {
    const mergedGeometry = new THREE.Geometry();
    // The geometry that will contain all of our points.
    const pingGeometry = new THREE.SphereGeometry(0.5, 5, 5);
    // The material that our ping will be created from.
    const material = new THREE.MeshBasicMaterial({
      color: this._selectedColor,
      opacity: 0.5,
    });

    for (let point of this.data.points) {
      // Transform our latitude and longitude values to points on the sphere.
      const pos = this.convertFlatCoordsToSphereCoords(point.x, point.y);

      if (pos.x && pos.y && pos.z) {
        // Position ping item.
        pingGeometry.translate(pos.x, pos.y, pos.z);
        // Merge ping item onto our mergedGeometry object.
        mergedGeometry.merge(pingGeometry);
        // Reset ping item position.
        pingGeometry.translate(-pos.x, -pos.y, -pos.z);
      }
    }

    // We end up with 1 mesh to add to the scene rather than our (n) number of points.
    const total = new THREE.Mesh(mergedGeometry, material);
    this.groups.globePoints = total;
    this.groups.globePoints.name = 'Globe Points';
    this.scene.add(this.groups.globePoints);
  }

  private setupOrbitControls() {
    this.camera.orbitControls = new OrbitControls(
      this.camera.object,
      this.canvas.nativeElement
    );

    this.camera.object.position.z = -550;
    this.camera.orbitControls.update();
  }

  private setupAutoRotate() {
    this.state.autoRotateGlobeTimer = setInterval(() => {
      this.focusUser();
    }, 10000);
  }

  private focusUser() {
    if (this.state.targets.length > 0) {
      if (this.state.currentTargetIndex === null) {
        // If there is no current target, pick one randomly
        this.state.currentTargetIndex = this.getRandomNumberBetween(
          0,
          this.state.targets.length - 1
        );
      } else {
        this.state.previousTargetIndex = this.state.currentTargetIndex;
        this.state.currentTargetIndex =
          (this.state.currentTargetIndex + 1) % this.state.targets.length;
      }

      this.focusGlobe();
    }
  }

  private focusGlobe() {
    const { geo } = this.state.targets[this.state.currentTargetIndex];

    this.camera.angles.current.azimuthal = this.camera.orbitControls.getAzimuthalAngle();
    this.camera.angles.current.polar = this.camera.orbitControls.getPolarAngle();

    const { x, y } = this.convertLatLngToFlatCoords(geo.lat, geo.lng);

    const { azimuthal, polar } = this.returnCameraAngles(x, y);

    this.camera.angles.target.azimuthal = azimuthal;
    this.camera.angles.target.polar = polar;

    this.state.isGlobeAnimating = true;
  }

  private render() {
    this.renderer.render(this.scene, this.camera.object);
    requestAnimationFrame(this.render.bind(this));
    this.animate();
  }

  private animate() {
    if (this.state.isGlobeAnimating) {
      // Update azimuthal and polar angles
      this.animateGlobeToNextLocation()
      this.camera.orbitControls.update();
      return;
    }
  }

  private animateGlobeToNextLocation() {
    const { current, target } = this.camera.transition;
    if (current <= target) {
      const progress = this.easeInOutCubic(current / target);
      const {
        current: { azimuthal: currentAzimuthal, polar: currentPolar },
        target: { azimuthal: targetAzimuthal, polar: targetPolar },
      } = this.camera.angles;
      let azimuthalDifference = (currentAzimuthal - targetAzimuthal) * progress;
      azimuthalDifference = currentAzimuthal - azimuthalDifference;
      this.camera.orbitControls.minAzimuthAngle = azimuthalDifference;
      this.camera.orbitControls.maxAzimuthAngle = azimuthalDifference;
      let polarDifference = (currentPolar - targetPolar) * progress;
      polarDifference = currentPolar - polarDifference;
      this.camera.orbitControls.minPolarAngle = polarDifference;
      this.camera.orbitControls.maxPolarAngle = polarDifference;
      this.camera.transition.current++;

    } else {
      this.state.isGlobeAnimating = false;
      this.camera.transition.current = 0;
    }
  }

  private convertLatLngToSphereCoords(latitude, longitude) {
    const phi = (latitude * Math.PI) / 180;
    const theta = ((longitude - 180) * Math.PI) / 180;
    const x = -(this.globeRadius + -1) * Math.cos(phi) * Math.cos(theta);
    const y = (this.globeRadius + -1) * Math.sin(phi);
    const z = (this.globeRadius + -1) * Math.cos(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  }

  private convertFlatCoordsToSphereCoords(x, y) {
    // Calculate relative 3d coordinates using Mercator projection relative to the radius of the globe
    // Convert latitude and longitude on the 90/180 degree axis
    let latitude = ((x - this.globeWidth) / this.globeWidth) * -180;
    let longitude = ((y - this.globeHeight) / this.globeHeight) * -90;
    latitude = (latitude * Math.PI) / 180; //(latitude / 180) * Math.PI
    longitude = (longitude * Math.PI) / 180; //(longitude / 180) * Math.PI
    // Calculate projected starting point
    const radius = Math.cos(longitude) * this.globeRadius;
    const targetX = Math.cos(latitude) * radius;
    const targetY = Math.sin(longitude) * this.globeRadius;
    const targetZ = Math.sin(latitude) * radius;
    return {
      x: targetX,
      y: targetY,
      z: targetZ,
    };
  }

  private convertLatLngToFlatCoords(latitude, longitude) {
    // Reference: https://stackoverflow.com/questions/7019101/convert-pixel-location-to-latitude-longitude-vise-versa
    const x = Math.round((longitude + 180) * (this.globeWidth / 360)) * 2;
    const y = Math.round((-1 * latitude + 90) * (this.globeHeight / 180)) * 2;
    return { x, y };
  }

  // Returns a 2d position based off of the canvas width and height to position popups on the globe.
  private getProjectedPosition(
    width,
    height,
    position,
    contentWidth,
    contentHeight
  ) {
    position = position.clone();
    let projected = position.project(this.camera.object);
    return {
      x: projected.x * width + width - contentWidth / 2,
      y: -(projected.y * height) + height - contentHeight - 10, // -10 for a small offset
    };
  }

  // Returns an object of the azimuthal and polar angles of a given a points x,y coord on the globe
  private returnCameraAngles(x, y) {
    let targetAzimuthalAngle =
      ((x - this.globeWidth) / this.globeWidth) * Math.PI;
    targetAzimuthalAngle = targetAzimuthalAngle + Math.PI / 2;
    targetAzimuthalAngle += 0.3; // Add a small horizontal offset
    let targetPolarAngle = (y / (this.globeHeight * 2)) * Math.PI;
    targetPolarAngle += 0.1; // Add a small vertical offset
    return {
      azimuthal: targetAzimuthalAngle,
      polar: targetPolarAngle,
    };
  }

  private easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  private getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  constructor(private _GlobalManagerSerice: GlobalManagerService) {
  }

  ngAfterViewInit(): void {
    this.width = this.container.nativeElement.clientWidth;
    this.height = this.container.nativeElement.clientHeight;
    this.setup();
    this.animate();
  }
}
