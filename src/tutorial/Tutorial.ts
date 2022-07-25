import * as PIXI from 'pixi.js';
import {ImageMarginButton} from '../buttons/ImageMarginButton';
import {AssetsManager} from '../managers/AssetsManager';
import {StorylineManager} from '../managers/StorylineManager';

export class Tutorial extends PIXI.Container {

	private data: Object;

	constructor() {
		super();
		this.visible = false;
		this.alpha = 0;

		this.data = AssetsManager.instance.getObject('data');

		if (this.data['tutorial'] == '') {
			//   this.emit('complete');
			return;
		}

		if (new StorylineManager().showHelpValue == 0) return;


		this.addChild(AssetsManager.instance.getSprite(this.data['tutorial']));

		let btn: ImageMarginButton = new ImageMarginButton('btn_tutorial_close');
		this.addChild(btn).position.set(1522, 918);
		btn.addListener('press', this.onNextClick);

		this.interactive = true;
	}

	private onNextClick = () => {

		this.emit('complete');
	}

	public show = () => {

		if (this.data['tutorial'] == '') {

			this.emit('complete');
			return;
		}

		if (new StorylineManager().showHelpValue == 0) {

			this.emit('complete');
			return;
		}

		this.visible = true;
		//TweenLite.to(this, 0.5, { alpha: 1 });
		this.alpha = 1;
		new StorylineManager().invoke_hideplayer();
		new StorylineManager().showHelpValue = 0;
	}

	public hide = () => {
		//TweenLite.to(this, 0.5, { alpha: 0, onComplete: this.onHideComplete });
		this.visible = false;
		this.alpha = 0;
		new StorylineManager().invoke_showplayer();
	}

	private onHideComplete = () => {
		this.visible = false;
	}
}
