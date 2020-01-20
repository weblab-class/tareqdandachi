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
    // Initialize Default State
    this.state = {
      state: [1, 0],
    };

  }

  componentDidMount() {
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
    // var geometry = new THREE.SphereGeometry( 2, 50, 50, 0, Math.PI * 2, 0, Math.PI*22 );
    // var material = new THREE.MeshNormalMaterial();
    var geometry = new THREE.SphereGeometry( 2, 25, 25);
    var material = new THREE.MeshNormalMaterial({ wireframe: true, transparent: true, opacity: 0.25 });
    var cube = new THREE.Mesh( geometry, material );

    var state_geometry = new THREE.SphereGeometry( 0.2, 50, 50 );
    var state_material = new THREE.MeshBasicMaterial( {color: 0xffff00} );

    var state = new THREE.Mesh( state_geometry, state_material );

    var controls = new OrbitControls(camera, renderer.domElement);
    // controls.addEventListener('change', render);
    controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 0;
		controls.panSpeed = 0;

		controls.keys = [ 65, 83, 68 ];

    var axesHelper = new THREE.AxesHelper( 2.5 );
    scene.add( axesHelper );

    scene.add(cube);
    scene.add(state);

    state.position.y = 2
    camera.position.z = 5;

    var animate = function () {
      requestAnimationFrame( animate );
      controls.update();
      render()
    };
    function render() {
    	renderer.render(scene, camera);
    }
    animate();
    render();
  }

  render() {
    return (
      <div ref={ref => (this.mount = ref)}/>
    );
  }
}

export default BlochSphere;
