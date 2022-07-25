import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import {Main} from '../Main';
import {AssetsManager} from '../managers/AssetsManager';
import {FontStyle} from '../utils/FontStyle';
import {Point, Rectangle} from '../utils/Utils';

export class Item extends PIXI.Sprite {

	public static ITEM_WIDTH: number = 1083;
	public static ITEM_HEIGHT: number = 106;
	public static locked: boolean = false;

	private data: Object;
	public locked: boolean = false;
	private moved: boolean = false;
	private delta: PIXI.Point;
	private text: PIXI.Text;
	private old_pos: PIXI.Point = new PIXI.Point();

	public dragTarget: Item | null = null;

	public pos: PIXI.Point;

	private margin: number = 0;

	constructor(data: Object, pos: PIXI.Point) {

		super();

		this.data = data;

		this.texture = AssetsManager.instance.getTexture('item_normal');

		this.text = new PIXI.Text(data['text'], new FontStyle('Regular', 30).black().wordWrap().left().style);
		this.addChild(this.text);
		this.text.position.set(25, Item.ITEM_HEIGHT / 2);
		this.text.anchor.set(0, 0.5);

		this.pos = pos;
		this.position.copyFrom(pos);

		let txt: PIXI.Text = new PIXI.Text((this.type + 1).toString(), new FontStyle('Regular', 12).black().right().style);
		this.addChild(txt).position.set(Item.ITEM_WIDTH - 10, 5);
		txt.anchor.set(1, 0);
		txt.visible = Main.DEBUG;

		this.interactive = true;
		this.buttonMode = true;

		this.addListener('pointerdown', this.onPointerEvent);
		this.addListener('pointerup', this.onPointerEvent);
		this.addListener('pointerupoutside', this.onPointerEvent);

		this.addListener('pointermove', this.onPointerEvent);
		this.addListener('pointerover', this.onPointerEvent);
		this.addListener('pointerout', this.onPointerEvent);

		this.hitArea = new PIXI.Rectangle(this.margin, this.margin, this.width - this.margin * 2, this.height - this.margin * 2);

		this.delta = new PIXI.Point();
	}

	private onPointerEvent = (event: PIXI.InteractionEvent) => {

		if (Item.locked == true) return;

		if (this.locked == true) return;

		switch (event.type) {

			case 'pointerdown':

				this.moved = true;

				this.old_pos.copyFrom(this.position);

				this.delta.set(event.data.global.x - this.x, event.data.global.y - this.y);
				this.alpha = 1;
				this.parent.setChildIndex(this, this.parent.children.length - 1);
				this.emit('drag', this);
				break;

			case 'pointerup':
			case 'pointerupoutside':
				if (this.moved == false) return;
				this.moved = false;
				this.emit('drop', this);

				break;

			case 'pointermove':

				if (this.moved == false) return;
				this.dragTarget = null;
				this.y = Math.round(event.data.global.y - this.delta.y);
				this.emit('move', this);

				break;

			case 'pointerover':
				this.texture = AssetsManager.instance.getTexture('item_over');
				break;

			case 'pointerout':
				this.texture = AssetsManager.instance.getTexture('item_normal');
				break;
		}
	}

	public checkDrag = (item: Item, target: string) => {

		if (this.locked == true) return;
		this.clear();

		let point: Point = new Point();

		if (target == 'lt') {
			point.x = item.rect.x;
			point.y = item.rect.y;
		}
		else if (target == 'rt') {
			point.x = item.rect.right;
			point.y = item.rect.y;
		}
		else if (target == 'rb') {
			point.x = item.rect.right;
			point.y = item.rect.bottom;
		}
		else if (target == 'lb') {
			point.x = item.rect.x;
			point.y = item.rect.bottom;
		}

		if (this.rect.hasPoint(point) == true) {
			this.showDrag();
			item.dragTarget = this;
		}
	}

	public get rect(): Rectangle {

		return new Rectangle(this.position.x + this.margin, this.position.y + this.margin, Item.ITEM_WIDTH - 2 * this.margin, Item.ITEM_HEIGHT - 2 * this.margin);
	}

	public returnBack = () => {

		this.visible = true;
		gsap.to(this.position, {duration: 0.5, x: this.old_pos.x, y: this.old_pos.y});
		gsap.to(this, {duration: 0.5, alpha: 1});
	}

	public fix = (point: PIXI.Point) => {

		this.parent.setChildIndex(this, this.parent.children.length - 1);
		this.clear();
		gsap.to(this.position, {duration: 0.5, x: point.x, y: point.y, onComplete: this.onFixComplete});
	}

	private onFixComplete = () => {

		this.pos.copyFrom(this.position);
	}

	public lock = () => {

		this.interactive = false;
	}

	public unlock = () => {

		if (this.locked == false) this.interactive = true;
	}

	public get type(): number {

		return this.data['type'];
	}

	public showDrag = () => {

		this.texture = AssetsManager.instance.getTexture('item_normal');
	}

	public showCorrect = () => {

		this.texture = AssetsManager.instance.getTexture('item_right');
		this.lock();
		this.locked = true;
	}

	public showIncorrect = () => {

		this.texture = AssetsManager.instance.getTexture('item_wrong');
		this.lock();
	}

	public clear = () => {

		this.texture = AssetsManager.instance.getTexture('item_normal');
	}
}