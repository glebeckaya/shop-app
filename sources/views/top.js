import {JetView} from "webix-jet";

import catalog from "../models/catalog";
import users from "../models/users";
import PopupLoginView from "./windows/popupLogin";
import PopupRegisterView from "./windows/popupRegister";

export default class TopView extends JetView {
	config() {
		const header = {
			type: "toolbar",
			height: 55,
			localId: "header",
			borderless: true,
			cols: [
				{view: "label", template: "Varin shop"},
				{
					view: "label",
					localId: "headerUser",
					value: "Hi, varyas!",
					template: "#value#",
					hidden: true
				},
				{
					view: "button",
					localId: "loginButton",
					value: "Login",
					width: 100,
					hidden: true,
					click: () => this.PopupLogin.showWindow()
				},
				{
					view: "button",
					localId: "registerButton",
					value: "Register",
					width: 150,
					hidden: true,
					click: () => this.PopupRegister.showWindow()
				},
				{
					view: "button",
					localId: "logoutButton",
					value: "Logout",
					width: 100,
					hidden: true
				},
				{
					view: "button",
					localId: "historyButton",
					value: "History",
					width: 100,
					click: () => this.show("./history"),
					hidden: true
				},
				{
					view: "button",
					localId: "bagButton",
					value: "Bag",
					width: 120,
					click: () => this.show("./bag"),
					hidden: true
				}
			],
			css: "webix_header app_header"
		};

		const menu = {
			width: 200,
			rows: [
				{
					view: "tree",
					localId: "menu",
					select: true,
					template: "{common.icon()} {common.folder()} <span>#value#</span>",
					css: "app_menu",
					layout: "y",
					hidden: true,
					on: {
						onAfterSelect: (id) => {
							if (id === "root") {
								this.setParam("model", "all", true);
							}
							else {
								const headerName = this.menuTree.getItem(id).value;
								this.setParam("model", headerName, true);
							}
							this.show("./catalog");
						}
					}
				},
				{
					view: "menu",
					localId: "menuAdmin",
					css: "app_menu",
					width: 180,
					layout: "y",
					select: true,
					data: [
						{value: "Clients info", id: "clientsInfo", click: () => this.show("./clientsInfo")},
						{value: "Orders", id: "allOrders", click: () => this.show("./allOrders")},
						{value: "Add new product", id: "newProduct", click: () => this.show("./newProduct")}
					],
					hidden: true
				}
			]
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
		this.menuTree = this.$$("menu");
		this.menuAdmin = this.$$("menuAdmin");
		this.headerUser = this.$$("headerUser");

		this.loginButton = this.$$("loginButton");
		this.registerButton = this.$$("registerButton");
		this.logoutButton = this.$$("logoutButton");
		this.historyButton = this.$$("historyButton");
		this.bagButton = this.$$("bagButton");

		this.PopupLogin = this.ui(PopupLoginView);
		this.PopupRegister = this.ui(PopupRegisterView);

		this.generateMenuTree();
		this.setContentAccordingToUser();

		this.on(this.app, "onBagChange", () => this.setLabelValues(this.bagUser, this.getBagValue()));
	}

	urlChange() {
		catalog.waitData.then(() => {
			const model = this.getParam("model");
			if (model && model !== "all") this.menuTree.select(model);
		});
	}

	generateMenuTree() {
		catalog.waitData.then(() => {
			const labels = [];
			catalog.data.order.forEach(el => labels.push(catalog.data.pull[el].name.split(" ")[0]));
			const uniqLabels = new Set(labels);

			this.data = [];
			uniqLabels.forEach((el, index) => this.data.push({id: index, value: el}));
			this.menuData = [
				{id: "root", value: "Phones", data: this.data}
			];

			this.menuTree.parse(this.menuData);
		});
	}

	setContentAccordingToUser() {
		users.waitData.then(() => {
			this.user = users.getItem(users.getFirstId());
			if (this.user && this.user.role !== "admin") {
				this.setParam("id", this.user._id, true);
				this.setLabelValues(this.bagButton, this.getBagValue());

				if (this.user.role !== "admin") {
					this.setLabelValues(this.headerUser, `Hi, ${this.user.name}!`);
					this.menuTree.show();
				}
				else {
					this.setLabelValues(this.headerUser, `Hi, ${this.user.role}!`);
					this.menuAdmin.show();
				}

				this.headerUser.show();
				this.logoutButton.show();
				this.historyButton.show();
				this.bagButton.show();
			}
			else {
				this.setParam("id", "guest", true);
				this.menuTree.show();
				this.loginButton.show();
				this.registerButton.show();
			}
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
