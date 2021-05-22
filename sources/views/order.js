import {JetView} from "webix-jet";

import catalog from "../models/catalog";
import orders from "../models/orders";
import users from "../models/users";

export default class OrderFormView extends JetView {
	config() {
		const orderForm = {
			view: "form",
			localId: "orderForm",
			elements: [
				{
					padding: 20,
					rows: [
						{
							view: "text",
							label: "Your Name",
							name: "name",
							placeholder: "Type your name",
							bottomPadding: 25,
							labelWidth: 200,
							required: true,
							invalidMessage: "Your Name can not be empty"
						},
						{
							view: "text",
							label: "Email",
							name: "email",
							placeholder: "Type your email",
							bottomPadding: 25,
							labelWidth: 200,
							required: true,
							invalidMessage: "Incorrect email"
						},
						{
							view: "text",
							label: "Phone",
							name: "phone",
							placeholder: "Type your phone mobile",
							bottomPadding: 25,
							labelWidth: 200,
							required: true,
							invalidMessage: "Incorrect phone"
						},
						{
							view: "combo",
							label: "Delivery type",
							name: "delivery",
							bottomPadding: 25,
							labelWidth: 200,
							value: "Master",
							options: ["Master", "Pickup"]
						},
						{
							view: "text",
							label: "Delivery address",
							name: "deliveryAddress",
							placeholder: "Type your address",
							bottomPadding: 25,
							labelWidth: 200,
							required: true,
							invalidMessage: "Delivery Address can not be empty"
						},
						{
							view: "combo",
							label: "Payment type",
							name: "payment",
							bottomPadding: 25,
							labelWidth: 200,
							value: "Card",
							options: ["Card", "Cash"]
						}
					]
				},
				{}
			],
			rules: {
				email: webix.rules.isEmail
			}
		};

		return {
			rows: [
				orderForm,
				{
					view: "button",
					value: "Checkout",
					click: () => this.makeOrder()
				}
			]
		};
	}

	init() {
		this.form = this.$$("orderForm");
	}

	urlChange() {
		webix.promise.all([
			users.waitData,
			catalog.waitData
		]).then(() => {
			const userId = this.getParam("id", true);
			this.user = users.find(user => user._id === userId)[0];
			this.userBag = JSON.parse(this.user.bag);
		});
	}

	makeOrder() {
		this.form.validate();
		if (!this.form.validate()) return;
		const formValues = this.form.getValues();

		this.userBag.forEach((order) => {
			const newOrder = {
				user: this.user._id,
				productId: order.productId,
				amount: order.quantity,
				address: formValues.deliveryAddress,
				delivery: formValues.delivery,
				payment: formValues.payment,
				date: webix.Date.dateToStr("%Y-%m-%d %h:%i")(new Date()),
				status: "In process",
				customerName: formValues.name,
				customerEmail: formValues.email,
				customerPhone: formValues.phone
			};
			orders.add(newOrder);
		});

		this.clearBag();
		this.throwCounters();
		this.show("../history");
	}

	throwCounters() {
		catalog.data.order.forEach((id) => {
			const product = catalog.getItem(id);
			product.count = 0;
			catalog.updateItem(product.id, product);
		});
	}

	clearBag() {
		this.user.bag = "";
		users.updateItem(this.user.id, this.user);
		this.app.callEvent("onBagChange");
	}
}
