import { Component, ViewChild, AfterViewInit, ElementRef } from "@angular/core";

import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

@Component({
  selector: "app-particles-connect",
  templateUrl: "./particles-connect.component.html",
  styleUrls: ["./particles-connect.component.css"],
})
export class ParticlesConnectComponent implements AfterViewInit {
  @ViewChild("rendererContainer")
  private container: ElementRef;
  private group: any;
  private particlesData = [];
  private camera: any;
  private scene: any;
  private renderer = new THREE.WebGLRenderer({ antialias: true });
  private positions: any;
  private colors: any;

  private particles: THREE.BufferGeometry;
  private pointCloud: any;
  private particlePositions: any;
  private linesMesh: any;
  private gui: GUI;

  public maxParticleCount = 1000;
  private r = 800;
  private rHalf = this.r / 2;

  private effectController = {
    showDots: true,
    showLines: true,
    minDistance: 150,
    limitConnections: false,
    maxConnections: 20,
    particleCount: 500,
    color: 0x000ff00,
  };

  constructor() {}

  ngAfterViewInit() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.nativeElement.appendChild(this.renderer.domElement);
    this.init();
    this.animate();
  }

  private initGUI() {
    this.gui = new GUI();

    this.gui.add(this.effectController, "showDots");
    this.gui.add(this.effectController, "showLines");
    this.gui.add(this.effectController, "minDistance", 10, 300);
    this.gui.add(this.effectController, "limitConnections");
    this.gui.add(this.effectController, "maxConnections", 0, 30, 1);
    this.gui.add(
      this.effectController,
      "particleCount",
      0,
      this.maxParticleCount,
      1
    );
    this.gui.addColor(this.effectController, "color");
  }

  private init() {
    this.initGUI();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      4000
    );
    this.camera.position.z = 1750;

    const controls = new OrbitControls(
      this.camera,
      this.container.nativeElement
    );
    controls.minDistance = 1000;
    controls.maxDistance = 3000;

    this.scene = new THREE.Scene();

    this.group = new THREE.Group();
    this.scene.add(this.group);

    const helper = new THREE.BoxHelper(
      new THREE.Mesh(new THREE.BoxBufferGeometry(this.r, this.r, this.r))
    );
    (<any>helper.material).color.setHex(0x101010);
    (<any>helper.material).blending = THREE.AdditiveBlending;
    (<any>helper.material).transparent = true;
    this.group.add(helper);

    const segments = this.maxParticleCount * this.maxParticleCount;

    this.positions = new Float32Array(segments * 3);
    this.colors = new Float32Array(segments * 3);

    const pMaterial = new THREE.PointsMaterial({
      color: 0x101010,
      size: 3,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: false,
    });

    this.particles = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(this.maxParticleCount * 3);

    for (let i = 0; i < this.maxParticleCount; i++) {
      let x = Math.random() * this.r - this.r / 2;
      let y = Math.random() * this.r - this.r / 2;
      let z = Math.random() * this.r - this.r / 2;

      this.particlePositions[i * 3] = x;
      this.particlePositions[i * 3 + 1] = y;
      this.particlePositions[i * 3 + 2] = z;

      // add it to the geometry
      this.particlesData.push({
        velocity: new THREE.Vector3(
          -1 + Math.random() * 2,
          -1 + Math.random() * 2,
          -1 + Math.random() * 2
        ),
        numConnections: 0,
      });
    }

    this.particles.setDrawRange(0, this.effectController.particleCount);
    this.particles.setAttribute(
      "position",
      new THREE.BufferAttribute(this.particlePositions, 3).setUsage(
        THREE.DynamicDrawUsage
      )
    );

    // create the particle system
    this.pointCloud = new THREE.Points(this.particles, pMaterial);
    this.group.add(this.pointCloud);

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3).setUsage(
        THREE.DynamicDrawUsage
      )
    );
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(this.colors, 3).setUsage(THREE.DynamicDrawUsage)
    );

    geometry.computeBoundingSphere();

    geometry.setDrawRange(0, 0);

    const material = new THREE.LineBasicMaterial({
      color: this.effectController.color,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    this.linesMesh = new THREE.LineSegments(geometry, material);
    this.group.add(this.linesMesh);

    //

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.nativeElement.appendChild(this.renderer.domElement);

    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate() {
    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;

    this.pointCloud.visible = this.effectController.showDots;
    this.linesMesh.visible = this.effectController.showLines;

    this.particles.setDrawRange(0, this.effectController.particleCount);

    for (let i = 0; i < this.effectController.particleCount; i++) {
      this.particlesData[i].numConnections = 0;
    }

    for (let i = 0; i < this.effectController.particleCount; i++) {
      // get the particle
      let particleData = this.particlesData[i];

      this.particlePositions[i * 3] += particleData.velocity.x;
      this.particlePositions[i * 3 + 1] += particleData.velocity.y;
      this.particlePositions[i * 3 + 2] += particleData.velocity.z;

      if (
        this.particlePositions[i * 3 + 1] < -this.rHalf ||
        this.particlePositions[i * 3 + 1] > this.rHalf
      )
        particleData.velocity.y = -particleData.velocity.y;

      if (
        this.particlePositions[i * 3] < -this.rHalf ||
        this.particlePositions[i * 3] > this.rHalf
      )
        particleData.velocity.x = -particleData.velocity.x;

      if (
        this.particlePositions[i * 3 + 2] < -this.rHalf ||
        this.particlePositions[i * 3 + 2] > this.rHalf
      )
        particleData.velocity.z = -particleData.velocity.z;

      if (
        this.effectController.limitConnections &&
        particleData.numConnections >= this.effectController.maxConnections
      )
        continue;

      // Check collision
      for (let j = i + 1; j < this.effectController.particleCount; j++) {
        let particleDataB = this.particlesData[j];
        if (
          this.effectController.limitConnections &&
          particleDataB.numConnections >= this.effectController.maxConnections
        )
          continue;

        let dx = this.particlePositions[i * 3] - this.particlePositions[j * 3];
        let dy =
          this.particlePositions[i * 3 + 1] - this.particlePositions[j * 3 + 1];
        let dz =
          this.particlePositions[i * 3 + 2] - this.particlePositions[j * 3 + 2];
        let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < this.effectController.minDistance) {
          particleData.numConnections++;
          particleDataB.numConnections++;

          let alpha = 1.0 - dist / this.effectController.minDistance;

          this.positions[vertexpos++] = this.particlePositions[i * 3];
          this.positions[vertexpos++] = this.particlePositions[i * 3 + 1];
          this.positions[vertexpos++] = this.particlePositions[i * 3 + 2];

          this.positions[vertexpos++] = this.particlePositions[j * 3];
          this.positions[vertexpos++] = this.particlePositions[j * 3 + 1];
          this.positions[vertexpos++] = this.particlePositions[j * 3 + 2];

          this.colors[colorpos++] = alpha;
          this.colors[colorpos++] = alpha;
          this.colors[colorpos++] = alpha;

          this.colors[colorpos++] = alpha;
          this.colors[colorpos++] = alpha;
          this.colors[colorpos++] = alpha;

          numConnected++;
        }
      }
    }

    this.linesMesh.material.color = new THREE.Color(
      this.effectController.color
    );

    this.linesMesh.geometry.setDrawRange(0, numConnected * 2);
    this.linesMesh.geometry.attributes.position.needsUpdate = true;
    this.linesMesh.geometry.attributes.color.needsUpdate = true;
    this.pointCloud.geometry.attributes.position.needsUpdate = true;

    requestAnimationFrame(this.animate.bind(this));

    this.render();
  }

  private render() {
    var time = Date.now() * 0.001;

    this.group.rotation.y = time * 0.1;
    this.renderer.render(this.scene, this.camera);
  }
}
