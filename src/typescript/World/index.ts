import * as THREE from 'three'
import Time from '../Utils/Time'
import Sizes from '../Utils/Sizes'
import Resources from '../Resources'
import Camera from '../Camera'

import Prompt from './Prompt'
import SpawnIsland from './SpawnIsland'

export default class
{
  // Utilities
  /** Time */
  time: Time
  /** Sizes */
  sizes: Sizes
  /** Resources */
  resources: Resources

  // Functionality
  /** Config */
  config: {debug: boolean}
  /** Debug */
  debug: dat.GUI
  /** Renderer */
  renderer: THREE.WebGLRenderer
  /** Camera */
  camera: Camera

  // World Functionality
  /** Container */
  container: THREE.Object3D
  /** Question Prompt */
  prompt: Prompt
  /** Spawn Island */
  spawnIsland: SpawnIsland

  /**
   * Constructor
   */
  constructor(
    _params: {
      time: Time,
      sizes: Sizes,
      resources: Resources,
      config: {debug: boolean},
      debug: dat.GUI,
      renderer: THREE.WebGLRenderer,
      camera: Camera
    })
  {
    // Options
    this.time = _params.time
    this.sizes = _params.sizes
    this.resources = _params.resources
    this.config = _params.config
    this.debug = _params.debug
    this.renderer = _params.renderer
    this.camera = _params.camera

    // Set up
    this.container = new THREE.Object3D()
    this.container.matrixAutoUpdate = false

    // Objects
    //this.setPrompt()
    this.setSpawnIsland()

    // Positions
    this.setPositions()
  }

  /**
   * Set Prompt
   */
  setPrompt()
  {
    this.prompt = new Prompt()
    this.container.add(this.prompt.container)
  }

  /**
   * Set Spawn Island
   */
  setSpawnIsland()
  {
    this.spawnIsland = new SpawnIsland()
    this.container.add(this.spawnIsland.container)
  }

  /**
   * Sets the positions of each object in the world
   */
  setPositions()
  {
    this.spawnIsland.container.position.set(0, -10, 0)
  }
}