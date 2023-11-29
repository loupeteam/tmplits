import * as THREE from 'three'
import { GLTFLoader, OrbitControls } from 'three/addons/Addons.js'

// Define global variables
class robotScene {
    constructor(domElement) {

        //Initialize the private variables
        this.domElement = $(domElement)
        this.scene = null
        this.camera = null
        this.renderer = null
        this.orbit = null
        this.userData = {}
        this.modelLoaded = false
    }

    // Initialize robot scene
    init(lightColor, lightIntensity) {
        this.scene = new THREE.Scene();

        // Define canvas size based on the size of robot scene
        let canvasHeight = this.domElement.height() - 5;
        let canvasWidth = this.domElement.width() - 5;

        // Create and postion camera
        this.camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 8);
        this.camera.up.set(0, 1, 0)

        // Set up light
        let light = new THREE.AmbientLight(lightColor, lightIntensity);
        this.scene.add(light);

        // Create and set up renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0xfcfcfc);
        this.renderer.setSize(canvasWidth * 2, canvasHeight * 2);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.renderer.domElement.id = 'robotcanvas';
        this.renderer.domElement.style.width = canvasWidth + 'px';
        this.renderer.domElement.style.height = canvasHeight + 'px';

        // Update camera and renderer settings if the window is resized
        window.addEventListener('resize', () => { this.onWindowResize() }, false);

        // Set up orbit controls for user input
        this.orbit = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        this.orbit.target.set(0, 0, -0.75);

        this.domElement.append(this.renderer.domElement);


        // Render the scene
        this.render();
    }

    // Handle loading robot gltf file into scene
    loadRobotModel(robotFile) {
        let scope = this
        const loader = new GLTFLoader();

        loader.load(robotFile, function (gltf) {
            scope.scene.add(gltf.scene);

            // Go through the scene and make sure all objects accurately cast/receive shadows
            scope.scene.traverse(function (object) {
                if (object.isMesh) {
                    object.castShadow = true
                    object.receiveShadow = true
                }
            });

            scope.onWindowResize()

            scope.modelLoaded = true

        }, undefined, function (error) {
            console.error(error);
        });
    }

    // Redefine canvas size based on new size of robot scene
    onWindowResize() {
        let canvasHeight = this.domElement.height() - 5;
        let canvasWidth = this.domElement.width() - 5;

        this.camera.aspect = canvasWidth / canvasHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(canvasWidth * 2, canvasHeight * 2);
        this.renderer.domElement.style.width = canvasWidth + 'px';
        this.renderer.domElement.style.height = canvasHeight + 'px';
    }

    // Call the render function
    render() {
        // If the scene has been destroyed, don't render
        if (this.destroyed) {
            return;
        }
        requestAnimationFrame(() => { this.render() });
        try {
            if (this.modelLoaded) {
                this.onrenderCallback(this.scene, this.userData);
            }
        }
        catch (e) {

        }
        // Update orbit based on user input
        this.orbit.update();

        // Render and update stats
        if (this.domElement.is(":visible")) {
            this.renderer.render(this.scene, this.camera);
        }

    }

    // Destroy the scene
    destroy() {
        //Make this as destroyed so that the render isn't called again
        this.destroyed = true;

        //Delete all the things we created
        delete this.domElement
        delete this.scene
        delete this.camera
        delete this.renderer
        delete this.orbit

        //Remove an even listeners so we actually get destroyed..
        window.removeEventListener('resize', () => { this.onWindowResize() }, false);
    }
}

export { robotScene }