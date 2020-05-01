import * as THREE from 'three';
import Time from './Utils/Time';
import Sizes from './Utils/Sizes';
import CameraControls from 'camera-controls';

export default class Camera {
  // Utilities
  /** Time */
  readonly time: Time;
  /** Sizes */
  readonly sizes: Sizes;

  // Functionality
  /** Config */
  readonly config: {debug: boolean};
  /** Debug */
  readonly debug: dat.GUI;
  /** Debug Folder */
  readonly debugFolder!: dat.GUI;
  /** Renderer */
  readonly renderer: THREE.WebGLRenderer;

  // Container
  container: THREE.Object3D;

  // Camera details
  instance!: THREE.PerspectiveCamera;
  target: THREE.Vector3;
  oldTarget: THREE.Vector3;
  targetOffset: THREE.Vector3;
  positionOffset: THREE.Vector3;

  /** Orbit Controls */
  cameraControls!: CameraControls;

  constructor(_params: {
    time: Time;
    sizes: Sizes;
    config: {debug: boolean};
    debug: dat.GUI;
    renderer: THREE.WebGLRenderer;
  }) {
    // Options
    this.time = _params.time;
    this.sizes = _params.sizes;
    this.config = _params.config;
    this.debug = _params.debug;
    this.renderer = _params.renderer;

    // Set up
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    if (this.debug) {
      this.debugFolder = this.debug.addFolder('camera');
      this.debugFolder.open();
    }

    this.target = new THREE.Vector3(0, 0, 0);
    this.oldTarget = new THREE.Vector3(0, 0, 0);
    this.targetOffset = new THREE.Vector3(0, 0, 0);
    this.positionOffset = new THREE.Vector3(0, 10, 25);

    this.instance = new THREE.PerspectiveCamera(
      60, // fov
      this.sizes.viewport.aspect,
      0.1, // near
      580
    ); // far

    this.setupCamera();
  }

  /**
   * Creates and sets up the camera instance
   */
  setupCamera() {
    this.instance.position.x = 0;
    this.instance.position.y = 15;
    this.instance.position.z = 30;

    CameraControls.install({THREE: THREE});

    this.cameraControls = new CameraControls(
      this.instance,
      this.renderer.domElement
    );

    this.instance.lookAt(this.target.add(this.targetOffset));

    this.sizes.on('resize', () => {
      this.instance.aspect = this.sizes.viewport.aspect;
      this.instance.updateProjectionMatrix();
    });

    this.time.on('tick', () => {
      const diff = this.target.clone().sub(this.oldTarget);
      this.instance.position.add(diff);

      this.cameraControls.moveTo(this.target.x, this.target.y, this.target.z);
      this.cameraControls.update(this.time.delta);
    });

    if (this.debug) {
      this.debugFolder
        .add(this.instance.position, 'x')
        .name('position x')
        .step(0.001)
        .min(-20)
        .max(20)
        .listen();
      this.debugFolder
        .add(this.instance.position, 'y')
        .name('position y')
        .step(0.001)
        .min(-20)
        .max(20)
        .listen();
      this.debugFolder
        .add(this.instance.position, 'z')
        .name('position z')
        .step(0.001)
        .min(-20)
        .max(20)
        .listen();

      this.debugFolder
        .add(this.targetOffset, 'x')
        .name('offset x')
        .step(0.001)
        .min(-20)
        .max(20)
        .listen();
      this.debugFolder
        .add(this.targetOffset, 'y')
        .name('offset y')
        .step(0.001)
        .min(-20)
        .max(20)
        .listen();
      this.debugFolder
        .add(this.targetOffset, 'z')
        .name('offset z')
        .step(0.001)
        .min(-20)
        .max(20)
        .listen();

      this.debugFolder
        .add(this.instance, 'near')
        .name('near')
        .min(0)
        .max(100)
        .listen()
        .onChange(() => this.instance.updateProjectionMatrix());
      this.debugFolder
        .add(this.instance, 'far')
        .name('far')
        .min(0)
        .max(1000)
        .listen()
        .onChange(() => this.instance.updateProjectionMatrix());
    }
  }
}
