import * as PIXI from 'pixi.js';
import {Application} from '../Application';
import {ImageMarginButton} from '../buttons/ImageMarginButton';
import {AssetsManager} from '../managers/AssetsManager';
import {FontStyle} from '../utils/FontStyle';

import {Item} from './Item';
import MultiStyleText from 'pixi-multistyle-text';

export class Game extends PIXI.Container {

	private data: Object;
	private items: Array<Item>;
	private btn_check: ImageMarginButton;
	private items_holder: PIXI.Container;
	private pattern: string = '';

	constructor() {

		super();
		this.data = AssetsManager.instance.getObject('data');
		this.addChild(AssetsManager.instance.getSprite(this.data['background']));

		let title: PIXI.Text = new PIXI.Text(this.data['title'], new FontStyle('Bold', 43).fill(0x0c1356).left().wordWrap().style);
		this.addChild(title).position.set(90, 95);

		let subtitle: PIXI.Text = new PIXI.Text(this.data['subtitle'], new FontStyle('Regular', 30).black().left().wordWrap().style);
		this.addChild(subtitle).position.set(90, 210);

		let subtitle2: PIXI.Text = new PIXI.Text(this.data['subtitle2'], new FontStyle('Italic', 30).black().left().wordWrap().style);
		this.addChild(subtitle2).position.set(90, 279);

		this.addChild(this.items_holder = new PIXI.Container());

		this.items = new Array<Item>();

		let items: Array<Object> = this.data['items'];
		this.guaranted_randomize(items);


		let cols: number = 1;

		for (let i: number = 0; i < items.length; i++) {

			let x_modificator: number = i - cols * Math.floor(i / cols);
			let y_modificator: number = Math.floor(i / cols);

			let xx: number = 167 + 331 * x_modificator;
			let yy: number = 365 + 134 * y_modificator;

			let item: Item = new Item(items[i], new PIXI.Point(xx, yy));
			this.items_holder.addChild(item);
			item.addListener('move', this.onItemMove);
			item.addListener('drop', this.onItemDrop);

			this.items.push(item);
		}

		this.btn_check = new ImageMarginButton('btn_check_answer');
		this.addChild(this.btn_check).position.set(Application.WIDTH / 2 - this.btn_check.width / 2, 924);
		this.btn_check.addListener('pointerdown', this.onCheckClick);
		this.btn_check.visible = false;

	}

	private onItemMove = (item: Item) => {
		for (let i: number = 0; i < this.items.length; i++) {
			if (this.items[i] == item) continue;
			this.items[i].checkDrag(item, 'lt');
			if (item.dragTarget != null) return;
		}

		for (let i: number = 0; i < this.items.length; i++) {
			if (this.items[i] == item) continue;
			this.items[i].checkDrag(item, 'rt');
			if (item.dragTarget != null) return;
		}

		for (let i: number = 0; i < this.items.length; i++) {
			if (this.items[i] == item) continue;
			this.items[i].checkDrag(item, 'lb');
			if (item.dragTarget != null) return;
		}

		for (let i: number = 0; i < this.items.length; i++) {
			if (this.items[i] == item) continue;
			this.items[i].checkDrag(item, 'rb');
			if (item.dragTarget != null) return;
		}
	}

	private guaranted_randomize = (items: Array<Object>) => {

		if (this.pattern == '') {
			for (let i: number = 0; i < items.length; i++) {

				items[i]['type'] = i;
				this.pattern = this.pattern + i.toString();
			}
		}

		items.sort(this.randomize);
		let current_pattern: string = '';

		for (let i: number = 0; i < items.length; i++) {

			current_pattern = current_pattern + items[i]['type'].toString();
		}

		if (current_pattern == this.pattern) this.guaranted_randomize(items);
	}

	private randomize = (val1: Object, val2: Object): number => {

		if (Math.random() > 0.5) return 1;
		return -1;
	}

	private onItemDrop = (item: Item) => {
		Item.locked = true;
		setTimeout(this.unlock, 600);

		if (item.dragTarget == null) {
			item.returnBack();
			return;
		}

		item.fix(item.dragTarget.pos);
		item.dragTarget.fix(item.pos);
	}

	private unlock = () => {

		Item.locked = false;
		this.btn_check.visible = true;
	}

	private onCheckClick = () => {

		this.btn_check.visible = false;

		this.items.sort(this.sort_items);

		let res: boolean = true;

		for (let i: number = 0; i < this.items.length; i++) {

			if (this.items[i].type == i) {

				this.items[i].showCorrect();
			}
			else {

				this.items[i].showIncorrect();
				res = false;
			}
		}

		if (res == false) {

			setTimeout(this.retry, 1000);
		}
		else {

			setTimeout(this.complete, 1000);
		}
	}

	private sort_items = (val1: Item, val2: Item): number => {

		if (val1.position.y > val2.position.y) return 1;
		return -1;
	}

	private complete = () => {

		this.emit('complete');
	}

	private retry = () => {

		for (let i: number = 0; i < this.items.length; i++) {
			if (this.items[i].locked == false) {
				this.items[i].clear();
				this.items[i].unlock();
			}
		}

		this.btn_check.visible = false;
	}

}