import * as PIXI from 'pixi.js';
import {Application} from '../Application';
import {ImageMarginButton} from '../buttons/ImageMarginButton';
import {AssetsManager} from '../managers/AssetsManager';
import {StorylineManager} from '../managers/StorylineManager';
import {FontStyle} from '../utils/FontStyle';

export class ReflectionRight extends PIXI.Container {

	private data: Object;

	private btnNext: ImageMarginButton;
	private btnClose: ImageMarginButton;

	constructor() {

		super();
		this.visible = false;
		this.alpha = 0;

		this.interactive = true;

		this.data = AssetsManager.instance.getObject('data');

		let icon: PIXI.Sprite = AssetsManager.instance.getSprite('reflection_right');
		this.addChild(icon);

		this.btnNext = new ImageMarginButton('btn_next');
		this.addChild(this.btnNext).position.set(Application.WIDTH / 2 - this.btnNext.width / 2, 762);
		this.btnNext.addListener('pointerdown', this.onNextClick);

		this.btnClose = new ImageMarginButton('btn_reflection_close');
		this.addChild(this.btnClose).position.set(1451, 200);
		this.btnClose.addListener('pointerdown', this.onCloseClick);

		let title: PIXI.Text = new PIXI.Text(this.data['reflection'], new FontStyle('Regular', 32).black().center().wordWrap().style);
		this.addChild(title).position.set(Application.WIDTH / 2, 545);
		title.anchor.set(0.5, 0);
	}

	public show = () => {

		this.visible = true;
		this.alpha = 1;
		//TweenLite.to(this, 0.5, { alpha: 1 });
		new StorylineManager().invoke_hideplayer();
	}

	public hide = () => {

		//TweenLite.to(this, 0.5, { alpha: 0, onComplete: this.onHideComplete });
		this.alpha = 0;
		this.visible = false;
		new StorylineManager().invoke_showplayer();
	}

	private onHideComplete = () => {

		this.visible = false;
	}

	private onNextClick = () => {

		this.emit('next');
	}

	private onCloseClick = () => {

		this.emit('complete');
	}
}