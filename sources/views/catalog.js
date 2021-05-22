import {JetView} from "webix-jet";

import catalog from "../models/catalog";
import users from "../models/users";
import PopupView from "./windows/popup";

export default class ContactsView extends JetView {
	config() {
		const catalogTable = {
			view: "datatable",
			localId: "shopTable",
			css: "webix_header_border webix_data_border",
			rowHeight: 80,
			type: {
				myCounter: (obj) => {
					let html = "<div class='webix_el_group' style='width:102px; height:32px;'>";
					html +=  "<button type='button' class='webix_inp_counter_prev' tabindex='-1' >-</button>";
					html += `<input type='text' readonly class='webix_inp_counter_value' style='height:28px;' value='${obj.count || 0}'></input>`;
					html += "<button type='button' class='webix_inp_counter_next' tabindex='-1'>+</button></div>";
					return html;
				}
			},
			columns: [
				{
					id: "image",
					header: "Image",
					width: 100,
					template: obj => `<img src="${obj.image}" width="80" height="80" alt="">`,
				},
				{
					id: "name",
					header: ["Name", {content:"textFilter"}],
					fillspace: true,
					sort: "text"
				},
				{
					id: "price",
					header: "Price",
					width: 100,
				},
				{
					id: "rating",
					header: "Rating",
					width: 100,
				},
				{
					id: "amount",
					css: "cell_counter",
					header: "Amount",
					template: "{common.myCounter()}",
					width: 150,
				},
				{
					id: "buy",
					css: "cell_cart",
					header: "Buy",
					template: "<span class='fas fa-cart-plus cart'></span>",
					width: 100
				}
			],
			onClick: {
				webix_inp_counter_prev: (e, id) => this.changeCount(id, "prev"),
				webix_inp_counter_next: (e, id) => this.changeCount(id, "next"),
				cart: (e, id) => this.addToBag(id)
			},
			on: {
				onItemDblClick: (id) => this.popupInfo.showWindow(id)
			}
			
		};

		return {
			rows: [catalogTable]
		}
	}

	init() {
		this.shopTable = this.$$("shopTable");
		this.popupInfo = this.ui(PopupView);
		users.waitData.then(() => {
			this.user = users.getItem(users.getFirstId());
			
		});
		this.shopTable.sync(catalog);
	}

	urlChange() {
		catalog.waitData.then(() => {
			const model = this.getParam("model", true);
			if (model) {
				if (model === "all") {
					catalog.filter()
				}
				else catalog.filter(obj => obj.name.split(" ")[0] === model)
			}
		});
	}

	changeCount(id, direction) {
		const item = catalog.getItem(id.row);
		let count = item.count ?? 0;
		if (direction === "prev") {
			item.count = (count > 0) ? (count -= 1) : 0;
		}
		if (direction === "next") {
			item.count = count += 1;
		}
		catalog.updateItem(item.id, item)
	}

	addToBag(id) {
		const item = catalog.getItem(id.row);
		if (!item.count || item.count === 0) {
			this.webix.message(`Please, select the quantity of ${item.name} to add in your bag`);
			return
		}
		const bag = (this.user.bag && this.user.bag.length) ? JSON.parse(this.user.bag) : [];
		const indexProd = bag.findIndex(el => el.productId === item._id);
		if (indexProd === -1) {
			const addedProduct = {
				id: this.generateRandomID(),
				productId: item._id,
				quantity: item.count
			};
			bag.push(addedProduct);
		}
		if (indexProd >= 0) bag[indexProd].quantity = item.count;
		this.user.bag = JSON.stringify(bag);
		users.updateItem(this.user.id, this.user);
		this.app.callEvent("onBagChange");
		this.webix.message(`${item.name} has been added to your bag`);
	}

	generateRandomID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		  	let r = Math.random() * 16 | 0; 
		  	let v = (c === "x") ? r : (r & 0x3 | 0x8);
		  	return v.toString(16);
		});
	}
}
