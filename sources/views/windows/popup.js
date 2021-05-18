import {JetView} from "webix-jet";

import catalog from "../../models/catalog";
import users from "../../models/users";

export default class PopupView extends JetView {
	config() {
		return {
			view: "window",
			modal: true,
			position: "center",
			width: 600,
			height: 344,
			head: {
				cols: [
					{localId: "headerWindow", template: "#headerWindow#", type: "header"},
					{view: "icon", icon: "wxi-close", click: () => this.hideWindow()}
				]
			},
			body: {
				localId: "contactsTemplate",
				type: "clean",
				template: obj => `<div class=' webix_template popup_info_product'>
					<div>
						<div class='photo'>
							<img src= ${obj.image || ""} alt="">
						</div>
					</div>
					<div>
						<p><span class="">Name:</span> ${obj.name || ""}</p>
						<p><span class="">Price:</span> ${obj.price || ""}$</p>
						<p>
							<span class="rating">Rating:</span> ${obj.rating || ""} 
							<span class='webix_icon icon_rating_star mdi mdi-${this.productStar ? "star" : "star-outline"}'></span>
						</p>
					</div>	
				</div>`,
				onClick: {
					icon_rating_star: () => {
						const stars = this.getStarsArray(this.user.stars);
						const indexProd = stars.findIndex(el => el.productId === this.product._id);
						if (indexProd === -1) {
							const starProduct = {
								productId: this.product._id,
								stared: true
							};
							stars.push(starProduct);
						}
						if (indexProd >= 0) stars[indexProd].stared = !stars[indexProd].stared;
						this.user.stars = JSON.stringify(stars);
						users.updateItem(this.user.id, this.user);
					}
				}
			}
		};
	}

	init() {
		users.waitData.then(() => {
			this.user = users.getItem(users.getFirstId());
		});
	}

	showWindow(rowItem) {
		this.product = catalog.getItem(rowItem.row);
		const headerWindow = `${this.product.name}`;
		this.$$("headerWindow").setValues({headerWindow});
		this.$$("contactsTemplate").parse(this.product);
		this.getRoot().show();
	}

	hideWindow() {
		this.getRoot().hide();
	}

	getStarsArray(arr) {
		return (arr && arr.length) ? JSON.parse(arr) : [];
	}
}
