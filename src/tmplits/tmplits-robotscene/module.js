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
{{tmplit 'RobotScene' robotFile=''}}

Options:
*/

import * as util from "../tmplits-utilities/module.js"
import * as THREE from './three.module.js'
import { GLTFLoader } from './GLTFLoader.js'
import { OrbitControls } from './OrbitControls.js'

let scene, orbit, renderer, camera, canvasHeight, canvasWidth;

window.robotData = {
	joints: {
		objects: [],		// populated in loader
		pose: undefined,	// populated in loader
		set: undefined		// populated in loader
	},
}

function init() {

	canvasHeight = $('#robot').height() - 5;
	canvasWidth = $('#robot').width() - 5;

	camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 1000);
	camera.position.set(0, 0, 8);
	camera.up.set(0, 1, 0)

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setClearColor(0xfcfcfc);
	renderer.setSize(canvasWidth*2, canvasHeight*2);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	renderer.domElement.id = 'robotcanvas';
	renderer.domElement.style.width = canvasWidth + 'px';
	renderer.domElement.style.height = canvasHeight + 'px';

	// Add light to the scene
	var hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
	hemisphereLight.position.z = 10;
	scene.add(hemisphereLight);

	// Update camera and renderer settings if the window is resized
	window.addEventListener('resize', onWindowResize, false);
	
	orbit = new OrbitControls(
		camera,
		renderer.domElement
	);
	orbit.target.set(0, 0, -0.75);

	render()
}

function onWindowResize() {
	canvasHeight = $('#robot').height() - 5;
	canvasWidth = $('#robot').width() - 5;

	camera.aspect = canvasWidth / canvasHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(canvasWidth*2, canvasHeight*2);
	renderer.domElement.style.width = canvasWidth + 'px';
	renderer.domElement.style.height = canvasHeight + 'px';
}

function render() {

	setTimeout(function(){requestAnimationFrame(render);}, 5);

	orbit.update();
	let el = $('#robot')

	// Render and update stats
	if(el.is(":visible")){
		if(el[0].children.length == 0){
			el[0].appendChild(renderer.domElement);
		}
		renderer.render(scene, camera);
	}

}

export function TmplitRobotScene(context, args) {
    let {
		['robotFile']:robotFile,
        ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = util.cleanArgs(_args)

    // Create threeJS scene
    scene = new THREE.Scene();

    // link glb model files
    const loader = new GLTFLoader();

    // Initialize the renderer, camera, and scene
    init();

    loader.load(robotFile, function(gltf) {
        scene.add(gltf.scene);

        // Load objects
        robotData.scene = gltf.scene

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

    return `
        <div id="robot" class="" style="height:600px"></div>
    `
}