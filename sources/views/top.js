import {JetView} from "webix-jet";

import catalog from "../models/catalog";
import users from "../models/users";

export default class TopView extends JetView {
	config() {
		let header = {
			type: "toolbar",
			height: 55,
			localId: "header",
			borderless: true,
			cols: [
				{view: "label", template: "Varin shop"},
				{view: "label", localId: "headerUser", value: "Hi, varyas!", template: "#value#"},
				{view: "button", value: "Logout", width: 100},
				{view: "button", value: "History", width: 100},
				{
					view: "button",
					localId: "bagUser",
					value: "Bag",
					width: 120,
					click: () => this.show("./bag")
				}
			],
			css: "webix_header app_header"
		};

		let menu = {
			view: "tree",
			localId: "menu",
			select: true,
			template: "{common.icon()} {common.folder()} <span>#value#</span>",
			css: "app_menu",
			width: 200,
			layout: "y",
			on: {
				onAfterSelect: (id) => {
					if (id === "root") {
						this.setParam("model", "all", true);
					}
					else {
						const headerName = this.menu.getItem(id).value;
						this.setParam("model", headerName, true);
					}
					this.show("./catalog");
				}
			}
		};

		let ui = {
			paddingX: 5,
			rows: [
				header,
				{
					cols: [
						menu,
						{
							type: "wide",
							rows: [{$subview: true}]
						}
					]
				}
			]
		};

		return ui;
	}

	init() {
		this.menu = this.$$("menu");
		this.headerUser = this.$$("headerUser");
		this.bagUser = this.$$("bagUser");

		catalog.waitData.then(() => {
			const labels = [];
			catalog.data.order.forEach(el => labels.push(catalog.data.pull[el].name.split(" ")[0]));
			const uniqLabels = new Set(labels);

			this.data = [];
			uniqLabels.forEach((el, index) => this.data.push({id: index, value: el}));
			this.menuData = [
				{id: "root", value: "Phones", data: this.data}
			];

			this.menu.parse(this.menuData);
		});
		users.waitData.then(() => {
			this.user = users.getItem(users.getFirstId());
			this.setParam("id", this.user._id, true);
			const bagSize = this.getBagLength(this.user.bag);
			this.setValues(this.headerUser, `Hi, ${this.user.name}!`);
			this.setValues(this.bagUser, `Bag(${bagSize})`);
		});
		this.on(this.app, "onBagChange", () => {
			const bagSize = this.getBagLength(this.user.bag);
			this.setValues(this.bagUser, `Bag(${bagSize})`);
		});
	}

	urlChange() {
		catalog.waitData.then(() => {
			const model = this.getParam("model");
			if (model && model !== "all") this.menu.select(model);
		});
	}

	setValues(container, value) {
		container.setValue(value);
		container.refresh();
	}

	getBagLength(bag) {
		return (bag && bag.length) ? JSON.parse(bag).length : 0;
	}
}
