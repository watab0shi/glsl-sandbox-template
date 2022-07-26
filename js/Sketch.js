import * as THREE from 'three';
import * as dat from 'dat.gui';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { Vector2 } from 'three';

class Sketch {
  /**
   * @param {Object} options 
   * @param {Element} options.dom 
   */
  constructor({ dom }) {
    this.scene = new THREE.Scene();

    this.container = dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xEEEEEE, 1.0);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);
    
    this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10);

    this.time = 0;
    this.isPlaying = true;

    this.boundRender = this.render.bind(this);
    this.boundMouseMove = this.mouseMove.bind(this);
    this.boundResize = this.resize.bind(this);

    this.addObjects();
    // this.initGui();

    window.addEventListener('mousemove', this.boundMouseMove);
    window.addEventListener('resize', this.boundResize);
    window.requestAnimationFrame(this.boundRender);
  }

  initGui() {
    this.settings = {
      pause: false
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'pause');
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable'
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: this.time },
        mouse: { value: new Vector2(0, 0) },
        resolution: { value: new Vector2(this.width, this.height) }
      },
      // wireframe: true,
      transparent: true,
      vertexShader,
      fragmentShader
    });

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  render() {
    this.time = performance.now() / 1000;
    this.material.uniforms.time.value = this.time;
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.boundRender);
  }

  /**
   * @param {MouseEvent} event 
   */
  mouseMove(event) {
    const { clientX, clientY } = event;
    this.material.uniforms.mouse.value.set(clientX, this.height - clientY);
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.material.uniforms.resolution.value.set(this.width, this.height);
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }
}

export { Sketch };
