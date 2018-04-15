import React, { Component } from 'react';
import { Provider } from './Context';
const THREE = require('three');

class Scene extends Component {
  containerRef = React.createRef();
  mouseX = 0;
  mouseY = 0;
  intersected = null;
  balls = [];
  removeMesh = id => {
    const selectedObject = this.scene.getObjectByName(id);
    this.scene.remove(selectedObject);
  };
  addMesh = ({ id, callback }) => {
    const geometry = new THREE.SphereBufferGeometry(100, 32, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      envMap: this.scene.background,
      reflectivity: 1,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 10000 - 5000;
    mesh.position.y = Math.random() * 10000 - 5000;
    mesh.position.z = Math.random() * 10000 - 5000;
    mesh.name = id;
    mesh.callback = callback;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
    this.scene.add(mesh);
    this.balls.push(mesh);
  };
  contextValue = {
    addMesh: this.addMesh,
    removeMesh: this.removeMesh,
  };
  init = () => {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      100000
    );

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera.position.z = 3200;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.CubeTextureLoader()
      .setPath(this.props.backgroundPath)
      .load(['pz.png', 'px.png', 'nz.png', 'py.png', 'px.png', 'nx.png']);

    this.group = new THREE.Group();
    var geometry = new THREE.BoxBufferGeometry(16, 32, 100);
    var material = new THREE.MeshPhongMaterial({
      color: 0xfed330,
      shininess: 25,
      side: THREE.DoubleSide,
      envMap: this.scene.background,
      // ***** Clipping setup (material): *****
      clipShadows: true,
    });

    material.reflectivity = 0.75;

    for (var i = 0; i < 64; i++) {
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = -1025 + i * 32;
      mesh.position.y = 0;
      mesh.position.z = 1500;
      mesh.castShadow = true;
      mesh.originalScale = mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
      this.group.add(mesh);
      this.balls.push(mesh);
    }

    this.scene.add(this.group);

    this.scene.add(new THREE.AmbientLight(0x505050));
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.2;
    spotLight.position.set(2, 3, 3);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 3;
    spotLight.shadow.camera.far = 10;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    this.scene.add(spotLight);

    var dirLight = new THREE.DirectionalLight(0x55505a, 3);
    dirLight.position.set(0, 3, 3);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 10;
    dirLight.shadow.camera.right = 1;
    dirLight.shadow.camera.left = -1;
    dirLight.shadow.camera.top = 1;
    dirLight.shadow.camera.bottom = -1;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    this.scene.add(dirLight);

    var ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(9, 9, 1, 1),
      new THREE.MeshPhongMaterial({ color: 0xa0adaf, shininess: 150 })
    );
    ground.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.containerRef.current.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);

    window.addEventListener('resize', this.onWindowResize, false);
    document.addEventListener('mousemove', this.onDocumentMouseMove, false);
  };
  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
  onDocumentMouseMove = evt => {
    this.mouse.x = evt.clientX / window.innerWidth * 2 - 1;
    this.mouse.y = -(evt.clientY / window.innerHeight) * 2 + 1;

    this.mouseX = (evt.clientX - window.innerWidth / 2) * 10;
    this.mouseY = (evt.clientY - window.innerHeight / 2) * 10;
  };
  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderScene();
  };
  renderScene = () => {
    var timer = 0.0001 * Date.now();

    let scaleAvg = 0;
    let dataArray = null;

    if (this.props.analyser) {
      this.props.analyser.fftSize = 256;
      var bufferLength = this.props.analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      this.props.analyser.getByteFrequencyData(dataArray);
      for (var i = 0, il = this.balls.length; i < il; i++) {
        var ball = this.balls[i];
        let scale = dataArray[i * 2] / 10;
        let scaleAmt = 1 + scale;
        ball.scale.set(1, scaleAmt, 1);
      }
    }
    //this.group.rotation.y += 0.02;

    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.005;
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.005;
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  };
  componentDidMount() {
    this.init();
    this.animate();
  }
  render() {
    return (
      <Provider value={this.contextValue}>
        <div ref={this.containerRef}>{this.props.children}</div>
      </Provider>
    );
  }
}

export default Scene;
