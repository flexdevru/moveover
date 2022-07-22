import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { Application } from '../Application';
import * as Utils from "../utils/Utils";
import MultiStyleText, { TextStyleSet } from 'pixi-multistyle-text';
import { FontStyle } from "../utils/FontStyle"; 

export class Preloader extends PIXI.Sprite {

	private counter: MultiStyleText;
	
	constructor() {
		super();

		this.addChild(Utils.GraphicsHelper.createRect(Application.WIDTH, Application.HEIGHT, 0x005eab));

		this.addChild(this.counter = new MultiStyleText('0%', new FontStyle('Regular', 135).fill(0x000000).multistyle)).position.set(Application.WIDTH / 2, Application.HEIGHT / 2);
		this.counter.anchor.set(0.5, 0.5);

		
	}

	public init = () => {
		this.emit('ready');
	}

	public progress = (value: number) => {
		this.counter.text = Math.floor(value).toString() + '%';
	}
}