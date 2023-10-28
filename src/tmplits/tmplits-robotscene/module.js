//DO NOT DELETE THIS FILE 
//- Doing so will cause 404 errors on the client side which will not break anything, but will throw errors in the console.

//This file will get loaded as a javascript module, meaning you can import other modules from here.
//You can also export functions from here, which will be available to the client side.

//import * from "./module2.js"//Import relative to this file inside node_modules/this-module-name/
//import * from "../tmplits-some-other/module.js"//Import relative to this file inside node_modules/tmplits-some-other/
//import * from "/somewhere.js"//Import from the root of the project

//Define your tmplit functions here and export them to make them globally available
//export function TmplitHelloWorld(context, args){
//    return `Hello ${context[0]}!`
//}

/* Example RobotScene Usage
{{tmplit 'RobotScene' robotFile='./path/to/robot/file/robot.glb'}}

Options:
robotFile: gltf file to load into scene
*/

import * as util from "../tmplits-utilities/module.js"
import * as THREE from './three.module.js'
import { GLTFLoader } from './GLTFLoader.js'
import { OrbitControls } from './OrbitControls.js'

// Define global variables
let scene, orbit, renderer, camera, canvasHeight, canvasWidth, light;

window.robotData = {
	joints: {
		objects: [],		// populated in loader
		pose: undefined,	// populated in loader
		set: undefined		// populated in loader
	},
}

// Initialize robot scene
function init(lightColor, lightIntensity) {
	scene = new THREE.Scene();

	// Define canvas size based on the size of robot scene
	canvasHeight = $('#robot').height() - 5;
	canvasWidth = $('#robot').width() - 5;

	// Create and postion camera
	camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 1000);
	camera.position.set(0, 0, 8);
	camera.up.set(0, 1, 0)

	// Check if both color and intensity are provided, otherwise use defaults
    lightColor = parseInt(lightColor, 16) || 0xFFFFFF;
    lightIntensity = lightIntensity || 1;

	// Set up light
	light = new THREE.AmbientLight(lightColor, lightIntensity);
	scene.add(light);

	// Create and set up renderer
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setClearColor(0xfcfcfc);
	renderer.setSize(canvasWidth*2, canvasHeight*2);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	renderer.domElement.id = 'robotcanvas';
	renderer.domElement.style.width = canvasWidth + 'px';
	renderer.domElement.style.height = canvasHeight + 'px';

	// Update camera and renderer settings if the window is resized
	window.addEventListener('resize', onWindowResize, false);
	
	// Set up orbit controls for user input
	orbit = new OrbitControls(
		camera,
		renderer.domElement
	);
	orbit.target.set(0, 0, -0.75);

	// Render the scene
	render();
}

// Redefine canvas size based on new size of robot scene
function onWindowResize() {
	canvasHeight = $('#robot').height() - 5;
	canvasWidth = $('#robot').width() - 5;

	camera.aspect = canvasWidth / canvasHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(canvasWidth*2, canvasHeight*2);
	renderer.domElement.style.width = canvasWidth + 'px';
	renderer.domElement.style.height = canvasHeight + 'px';
}

// 
function render() {

	// Perform a request of animation frame every 5 milliseconds
	setTimeout(function(){requestAnimationFrame(render);}, 5);

	// Update orbit based on user input
	orbit.update();

	// Render and update stats
	let el = $('#robot')

	if(el.is(":visible")){
		if(el[0].children.length == 0){
			el[0].appendChild(renderer.domElement);
		}
		renderer.render(scene, camera);
	}

}

// Handle loading robot gltf file into scene
function loadRobotModel(robotFile) {
	const loader = new GLTFLoader();

	loader.load(robotFile, function(gltf) {
        scene.add(gltf.scene);

        // Load objects
        robotData.scene = gltf.scene

		// Go through the scene and make sure all objects accurately cast/receive shadows
        scene.traverse(function (object) {
            if (object.isMesh) {
                object.castShadow = true
                object.receiveShadow = true
            }
        });

        onWindowResize()
    }, undefined, function (error) {
        console.error(error);
    });
}

export function TmplitRobotScene(context, args) {
    let {
		['robotFile']:robotFile,
		['lightColor']:lightColor,
		['lightIntensity']:lightIntensity,
        ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = util.cleanArgs(_args)

    // Initialize the renderer, camera, lights, and scene
    init(lightColor, lightIntensity);

	// Load the robot model into the scene
	loadRobotModel(robotFile);

    return `
        <div id="robot" class="" style="height:600px"></div>
    `
}