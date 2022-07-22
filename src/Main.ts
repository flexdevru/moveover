import * as PIXI from 'pixi.js';
import MultiStyleText from 'pixi-multistyle-text';
import {AssetsManager} from './managers/AssetsManager';
import {SoundManager} from './managers/SoundManager';
import {FontStyle} from "./utils/FontStyle";
import {StorylineManager} from './managers/StorylineManager';


export class Main extends PIXI.Container {

	public static DEBUG: boolean = true;
	public static instance: Main;

	private data?: Object;

	constructor() {

		super();
		this.addChild(AssetsManager.instance).start(this.onAssetsLoadComplete);
		SoundManager.instance.init();
	}

	private onAssetsLoadComplete = () => {

		Main.instance = this;
		this.removeChild(AssetsManager.instance);
		this.createChildren();
	}

	private createChildren = () => {

		this.data = AssetsManager.instance.getObject('data');

		this.addChild(AssetsManager.instance.getSprite(this.data['background']));

		let multistyle_label: MultiStyleText = new MultiStyleText(this.data['title'], new FontStyle('Regular', 32).fill(0xff00ff).addTag('br', new FontStyle('Light').fill(0x55ff55).fontSize(40)).multistyle);
		this.addChild(multistyle_label).position.set(20, 25);

		console.log('showhelp_var', new StorylineManager().getTaskVar('showhelp_var'));
		console.log('completed_var', new StorylineManager().getTaskVar('completed_var'));
		console.log('store_var', new StorylineManager().getTaskVar('store_var'));
	}
}