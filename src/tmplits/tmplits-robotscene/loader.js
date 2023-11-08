//DO NOT DELETE THIS FILE
//- Doing so will cause 404 errors on the client side which will not break anything, but will throw errors in the console.

//Example RobotScene Usage
function tmplit_test_UpdateScene(scene, userData) {
    if (userData.init) {
        userData.joint1.rotation.y += 0.1;
    }
    else {
        userData.init = true;
        userData.joint1 = scene.getObjectByName("Cube");
        userData.joint1.rotation.x = 0.5;
    }
}
