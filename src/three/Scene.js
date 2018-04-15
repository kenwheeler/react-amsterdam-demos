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
      .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

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

    for (var i = 0, il = this.balls.length; i < il; i++) {
      var ball = this.balls[i];

      ball.position.x = 5000 * Math.cos(timer + i);
      ball.position.y = 5000 * Math.sin(timer + i * 1.1);
      ball.rotation.x += 0.02;
      ball.rotation.y += 0.03;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);

    var intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      if (this.intersected) {
        if (intersects[0].object !== this.intersected) {
          this.intersected.material.reflectivity = 1;
        }
      }
      this.intersected = intersects[0].object;
      this.intersected.material.reflectivity = 0.5;
    } else {
      if (this.intersected) this.intersected.material.reflectivity = 1;
      this.intersected = null;
    }

    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  };
  handleClick = () => {
    if (this.intersected) {
      this.intersected.callback();
    } else {
      this.props.onClick();
    }
  };
  componentDidMount() {
    this.init();
    this.animate();
  }
  render() {
    return (
      <Provider value={this.contextValue}>
        <div ref={this.containerRef} onClick={this.handleClick}>
          {this.props.children}
        </div>
      </Provider>
    );
  }
}

export default Scene;
