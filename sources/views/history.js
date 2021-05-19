import {JetView} from "webix-jet";

import catalog from "../models/catalog";
import orders from "../models/orders";

export default class HistoryView extends JetView {
	config() {
		const historyTable = {
			view: "datatable",
			localId: "historyTable",
			css: "webix_header_border webix_data_border",
			rowHeight: 80,
			columns: [
				{
					id: "productId",
					header: ["Product", {content: "textFilter"}],
					template: (obj) => {
						const product = catalog.find(item => item._id === obj.productId)[0];
						return product.name;
					},
					fillspace: true,
					sort: "text"
				},
				{
					id: "amount",
					header: "Amount",
					width: 100
				},
				{
					id: "address",
					header: "Address",
					width: 100
				},
				{
					id: "delivery",
					header: "Delivery",
					width: 150
				},
				{
					id: "payment",
					header: "Payment",
					width: 100
				},
				{
					id: "date",
					header: "Order date",
					width: 180
				},
				{
					id: "status",
					header: "Status",
					width: 100
				}
			]
		};

		return {
			rows: [historyTable]
		};
	}

	init() {
		this.historyTable = this.$$("historyTable");
		this.historyTable.sync(orders);
	}
}
