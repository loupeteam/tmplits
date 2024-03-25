//DO NOT DELETE THIS FILE 
//- Doing so will cause 404 errors on the client side which will not break anything, but will throw errors in the console.

/* Example RobotScene Usage
{{tmplit 'RobotScene' robotFile='./path/to/robot/file/robot.glb' lightColor='0xCC6666' lightIntensity='1.5'}}

Options:
robotFile: gltf file to load into scene
lightColor: Hexidecimal number as a string that represents the desired color (e.g. 0xCC6666)
lightIntensity: an integer that represents the intensity of the light (1.0 is a good starting point)
*/

import * as util from "../tmplits-utilities/module.js"
import { robotScene } from "./robot.js"

//Define a webcomponent that can be used in the html
export class RobotSceneElement extends HTMLElement {
	constructor() {
		super()
	}
	connectedCallback() {
		let robotFile = this.getAttribute('robotFile') || './robot.glb'
		let lightColor = parseInt(this.getAttribute('lightColor') || '0xFFFFFF')
		let lightIntensity = parseFloat(this.getAttribute('lightIntensity') || '1.0')

		console.log("RobotScene loaded!")
		this.robotData = new robotScene(this)
		this.robotData.init(lightColor, lightIntensity)
		try {
			let onrenderCallback = this.getAttribute('onrender')
			if (onrenderCallback) {
				this.robotData.onrenderCallback = eval(onrenderCallback);
			}
			else {
				this.robotData.onrenderCallback = () => { };
			}
		} catch (e) {
			console.error('Error parsing onrender callback: ', e)
		}

		this.robotData.loadRobotModel(robotFile)
	}
	disconnectedCallback() {
		this.robotData.destroy();
		delete this.robotData;
	}
}

//Register the webcomponent
customElements.define('robot-scene', RobotSceneElement)

// Define tmplit function
export function TmplitRobotScene(context, args) {
	let {
		onrender,
		..._args
	} = args.hash

	//Get cleaned up values from args
	let {
		classList,
		attr
	} = util.cleanArgs(_args)

	return `<robot-scene ${classList} ${attr} onrender="${onrender}" ></robot-scene>`

}