import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import ReactDOM from "react-dom";
import * as THREE from "three";
var OrbitControls = require('three-orbitcontrols');

import { get, post } from "../../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "117624971444-gmdmhm8712dc3hriss8spnt1vgvmeqkn.apps.googleusercontent.com";

class BlochSphere extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.display()
  }

  componentDidUpdate() {
    this.updateAnimation()
  }

  calculate_multiplier = (x, y) => {

    return Math.floor(Math.abs(Math.abs(y-x)**0.5/Math.abs(x-0.5))*200)/100

  }

  display() {
    var mousePos={x:0, y:0};

    function handleMouseMove(event) {

    	// here we are converting the mouse position value received
    	// to a normalized value varying between -1 and 1;
    	// this is the formula for the horizontal axis:

    	var tx = -1 + (event.clientX / WIDTH)*2;

    	// for the vertical axis, we need to inverse the formula
    	// because the 2D y-axis goes the opposite direction of the 3D y-axis

    	var ty = 1 - (event.clientY / HEIGHT)*2;
    	mousePos = {x:tx, y:ty};

    }

    function normalize(v,vmin,vmax,tmin, tmax){

    	var nv = Math.max(Math.min(v,vmax), vmin);
    	var dv = vmax-vmin;
    	var pc = (nv-vmin)/dv;
    	var dt = tmax-tmin;
    	var tv = tmin + (pc*dt);
    	return tv;

    }

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/(2*700), 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth/2, 700 );
    renderer.setClearColor( 0x262626, 0 );
    renderer.setPixelRatio( window.devicePixelRatio );

    scene.background = new THREE.Color( 0x262626 );

    var canvas = this.mount.appendChild( renderer.domElement );
    canvas.style.outline = 0;

    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize(){

        camera.aspect = window.innerWidth/1400;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth/2, 700 );

    }
    // var geometry = new THREE.SphereGeometry( 2, 50, 50, 0, Math.PI * 2, 0, Math.PI*22 );
    // var material = new THREE.MeshNormalMaterial();
    var geometry = new THREE.SphereGeometry( 2, 25, 25);
    var material = new THREE.MeshNormalMaterial({ wireframe: true, transparent: true, opacity: 0.25 });
    var cube = new THREE.Mesh( geometry, material );

    var state_geometry = new THREE.SphereGeometry( 0.2, 50, 50 );
    var state_material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var state_final_material = new THREE.MeshBasicMaterial( {color: 0xaa00ff} );

    this.current_state = new THREE.Mesh( state_geometry, state_material );

    this.state_final = new THREE.Mesh( state_geometry, state_final_material );

    var controls = new OrbitControls(camera, renderer.domElement);
    // controls.addEventListener('change', render);
    controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 0;
		controls.panSpeed = 0;

		controls.keys = [ 65, 83, 68 ];

    var axesHelper = new THREE.AxesHelper( 2.5 );
    scene.add( axesHelper );

    scene.add(cube);
    scene.add(this.current_state);
    scene.add(this.state_final);

    camera.position.y = 0;
    camera.position.z = 5;

    this.reverse_theta = false;
    this.reverse_phi = false;

    // Identity

    this.final_theta = 0;
    this.final_phi = 0;
    this.current_theta = 0;
    this.current_phi = 0;

    switch(this.props.gate) {

      case "H":
        //Hadamard
        this.final_theta = 0;
        this.final_phi = 3.14/2;
        this.current_theta = -3.14/2;
        this.current_phi = 0;
        break;
      case "X":
        //X Gate
        this.final_theta = -3.14/2;
        this.final_phi = 3.14;
        this.current_theta = -3.14/2;
        this.current_phi = 0;
        break;
      case "Y":
        //Y Gate
        this.final_theta = 0;
        this.final_phi = 3.14;
        this.current_theta = 0;
        this.current_phi = 0;
        break;
      case "Z":
        //Z Gate
        this.final_theta = 3.14;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 3.14/2;
        break;
      case "RX":
        //Rx Gate
        this.final_theta = -3.14/2;
        this.final_phi = 3.14/2;
        this.current_theta = -3.14/2;
        this.current_phi = 0;
        break;
      case "RY":
        //RY Gate
        this.final_theta = 0;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 0;
        break;
      case "RZ":
        //RZ Gate
        this.final_theta = 3.14;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 3.14/2;
        break;
      case "S":
        //S Gate
        this.final_theta = 3.14/2;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 3.14/2;
        break;
      case "Sdg":
        //Sdg Gate
        this.final_theta = -3.14/2;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 3.14/2;
        this.reverse_theta = true;
        break;
      case "T":
        //T Gate
        this.final_theta = 3.14/4;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 3.14/2;
        break;
      case "Tdg":
        //Tdg Gate
        this.final_theta = -3.14/4;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 3.14/2;
        this.reverse_theta = true;
        break;
    }

    this.setInit = () => {
      this.current_state.position.setFromSpherical(THREE.Spherical(2,this.current_phi,this.current_theta));
      this.state_final.position.setFromSpherical(THREE.Spherical(2,this.current_phi+0.001,this.current_theta+1.57));
    }

    this.animate = () => {
      // controls.update();

      if (Math.round(this.current_phi*100) !== Math.round(this.final_phi*100) || Math.round(this.current_theta*100) !== Math.round(this.final_theta*100)) {

        if (((this.current_phi <= this.final_phi) ^ this.reverse_phi) || ((this.current_theta <= this.final_theta) ^ this.reverse_theta)) {

          if (this.reverse_phi) { this.current_phi = (this.current_phi > this.final_phi) ? this.current_phi - 0.01*this.calculate_multiplier(this.final_phi, this.current_phi) : this.current_phi }
          else { this.current_phi = (this.current_phi < this.final_phi) ? this.current_phi + 0.01*this.calculate_multiplier(this.final_phi, this.current_phi) : this.current_phi }

          if (this.reverse_theta) { this.current_theta = (this.current_theta > this.final_theta) ? this.current_theta - 0.01*this.calculate_multiplier(this.final_theta, this.current_theta) : this.current_theta }
          else { this.current_theta = (this.current_theta < this.final_theta) ? this.current_theta + 0.01*this.calculate_multiplier(this.final_theta, this.current_theta) : this.current_theta }

          this.state_final.position.setFromSpherical(THREE.Spherical(2,this.current_phi,this.current_theta));

        }

      }

      requestAnimationFrame( this.animate );
      controls.update();
      render()
    };
    function render() {
      controls.update();
    	renderer.render(scene, camera);
    }

    this.setInit();
    this.animate();
    render();
  }

  updateAnimation = () => {

    this.reverse_theta = false;
    this.reverse_phi = false;

    // Identity

    this.final_theta = 0;
    this.final_phi = 0.01;
    this.current_theta = 0;
    this.current_phi = 0;

    switch(this.props.gate) {

      case "H":
        //Hadamard
        this.final_theta = 0;
        this.final_phi = 3.14/2;
        this.current_theta = -3.14/2;
        this.current_phi = 0;
        break;
      case "X":
        //X Gate
        this.final_theta = -3.14/2;
        this.final_phi = 3.14;
        this.current_theta = -3.14/2;
        this.current_phi = 0;
        break;
      case "Y":
        //Y Gate
        this.final_theta = 0;
        this.final_phi = 3.14;
        this.current_theta = 0;
        this.current_phi = 0;
        break;
      case "Z":
        //Z Gate
        this.final_theta = 3.14;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 3.14/2;
        break;
      case "RX":
        //Rx Gate
        this.final_theta = -3.14/2;
        this.final_phi = 3.14/2;
        this.current_theta = -3.14/2;
        this.current_phi = 0;
        break;
      case "RY":
        //RY Gate
        this.final_theta = 0;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 0;
        break;
      case "RZ":
        //RZ Gate
        this.final_theta = 3.14/2;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 3.14/2;
        break;
      case "S":
        //S Gate
        this.final_theta = 3.14/2;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 3.14/2;
        break;
      case "Sdg":
        //Sdg Gate
        this.final_theta = -3.14/2;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 3.14/2;
        this.reverse_theta = true;
        break;
      case "T":
        //T Gate
        this.final_theta = 3.14/4;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 3.14/2;
        break;
      case "Tdg":
        //Tdg Gate
        this.final_theta = -3.14/4;
        this.final_phi = 3.14/2;
        this.current_theta = 0;
        this.current_phi = 3.14/2;
        this.reverse_theta = true;
        break;
    }

    if (this.setInit) { this.setInit(); }

    if (this.animate) { this.animate(); }

  }

  render() {
    return (
      <div ref={ref => (this.mount = ref)} style={{width: "200px", display: "inline-block", verticalAlign: "middle"}}/>
    );
  }
}

export default BlochSphere;
