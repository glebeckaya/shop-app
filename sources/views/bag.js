import {JetView} from "webix-jet";

import catalog from "../models/catalog";
import users from "../models/users";

export default class ContactsView extends JetView {
	config() {
		const bagTable = {
			view: "datatable",
			localId: "bagTable",
			css: "webix_header_border webix_data_border",
			scroll: true,
			rowHeight: 80,
			columns: [
				{
					id: "image",
					header: "Image",
					width: 100,
					template: (obj) => {
						const imageLink = this.getProduct(obj.productId).image;
						return `<img src="${imageLink}" width="80" height="80" alt="">`;
					}
				},
				{
					id: "name",
					header: "Name",
					template: obj => this.getProduct(obj.productId).name,
					fillspace: true,
					sort: "text"
				},
				{
					id: "quantity",
					header: "Amount",
					width: 100
				},
				{
					id: "price",
					header: "Price",
					template: obj => this.getProduct(obj.productId).price,
					width: 100
				},
				{
					id: "sum",
					header: "Sum",
					template: obj => obj.quantity * this.getProduct(obj.productId).price,
					width: 100
				},
				{
					id: "del",
					header: "",
					template: "{common.trashIcon()}",
					width: 50
				}
			],
			onClick: {
				"wxi-trash": (e, row) => {
					webix.confirm({
						ok: "OK",
						cancel: "Cancel",
						text: "Do you really want to delete this product from your bag"
					}).then(() => {
						const index = this.userBag.findIndex(el => el.id === row.id);
						this.userBag.splice(index, 1);
						this.bagTable.remove(row);
						this.user.bag = JSON.stringify(this.userBag);
						users.updateItem(this.user.id, this.user);
						this.app.callEvent("onBagChange");
					});
					return false;
				}
			}
		};

		return {
			rows: [
				bagTable,
				{
					cols: [
						{
							view: "button",
							value: "Make order",
							width: 300
						},
						{}
					]
				}
			]
		};
	}

	init() {
		this.bagTable = this.$$("bagTable");
	}

	urlChange() {
		webix.promise.all([
			users.waitData,
			catalog.waitData
		]).then(() => {
			const userId = this.getParam("id", true);
			this.user = users.find(user => user._id === userId)[0];
			this.userBag = JSON.parse(this.user.bag);
			this.bagTable.parse(this.userBag);
		});
	}

	getProduct(_id) {
		const product = catalog.find(item => item._id === _id);
		return product[0];
	}
}
