import * as PIXI from 'pixi.js';
import {AssetsManager} from './managers/AssetsManager';
import {StorylineManager} from './managers/StorylineManager';
import {ImageMarginButton} from './buttons/ImageMarginButton';
import {Tutorial} from './tutorial/Tutorial';
import {ReflectionRight} from './reflection/ReflectionRight';
import {Application} from './Application';
import {Game} from './game/Game';


export class Main extends PIXI.Container {

	public static DEBUG: boolean = false;

	public static instance: Main;

	private tutorial!: Tutorial;
	private game!: Game;
	private reflection_right!: ReflectionRight;
	private btn_look!: ImageMarginButton;

	constructor() {
		super();
		this.addChild(AssetsManager.instance).start(this.onAssetsLoadComplete);
	}

	private onAssetsLoadComplete = () => {

		Main.instance = this;
		this.removeChild(AssetsManager.instance);
		AssetsManager.instance.stopPreloader();
		this.onRestore();
	}

	private onRestore = () => {

		this.createChildren();
	}

	private createChildren = () => {

		this.game = new Game();
		this.addChild(this.game);
		this.game.addListener('complete', this.onGameComplete);

		this.btn_look = new ImageMarginButton('btn_look');
		this.addChild(this.btn_look).position.set(Application.WIDTH / 2 - this.btn_look.width / 2, 924);
		this.btn_look.addListener('press', this.onLookClick);
		this.btn_look.visible = false;

		this.reflection_right = new ReflectionRight();
		this.addChild(this.reflection_right);
		this.reflection_right.addListener('complete', this.onReflectionRightComplete);
		this.reflection_right.addListener('next', this.onReflectionNext);

		this.tutorial = new Tutorial();
		this.addChild(this.tutorial);
		this.tutorial.addListener('complete', this.onTutorialComplete);

		this.tutorial.show();
	}

	private onTutorialComplete = () => {

		this.tutorial.hide();
	}

	private onGameComplete = () => {

		new StorylineManager().completedValue = 1;
		setTimeout(this.reflection_right.show, 1000);
	}

	private onReflectionRightComplete = () => {

		this.reflection_right.hide();
		this.btn_look.visible = true;
	}

	private onReflectionNext = () => {

		new StorylineManager().invoke_jumptonextslide();
	}

	private onLookClick = () => {

		this.reflection_right.show();
	}
}