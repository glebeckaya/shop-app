import {JetView} from "webix-jet";

import catalog from "../models/catalog";
import users from "../models/users";

export default class TopView extends JetView {
	config() {
		const header = {
			type: "toolbar",
			height: 55,
			localId: "header",
			borderless: true,
			cols: [
				{view: "label", template: "Varin shop"},
				{view: "label", localId: "headerUser", value: "Hi, varyas!", template: "#value#"},
				{view: "button", value: "Logout", width: 100},
				{
					view: "button",
					value: "History",
					width: 100,
					click: () => this.show("./history")
				},
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

		const menu = {
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

		return {
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
			this.setLabelValues(this.headerUser, `Hi, ${this.user.name}!`);
			this.setLabelValues(this.bagUser, this.getBagValue());
		});
		this.on(this.app, "onBagChange", () => this.setLabelValues(this.bagUser, this.getBagValue()));
	}

	urlChange() {
		catalog.waitData.then(() => {
			const model = this.getParam("model");
			if (model && model !== "all") this.menu.select(model);
		});
	}

	setLabelValues(container, value) {
		container.setValue(value);
		container.refresh();
	}

	getBagValue() {
		const bag = this.user.bag;
		const bagSize = (bag && bag.length) ? JSON.parse(bag).length : 0;
		return bagSize !== 0 ? `Bag(${bagSize})` : "Bag";
	}
}
