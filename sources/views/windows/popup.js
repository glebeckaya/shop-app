import {JetView} from "webix-jet";

import catalog from "../../models/catalog";

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
							<span class='webix_icon icon_rating_star mdi mdi-${obj.stared ? "star" : "star-outline"}'></span>
						</p>
					</div>	
				</div>`,
				onClick: {
					icon_rating_star: () => this.changeRating()
				}
			}
		};
	}

	init() {
		this.template = this.$$("contactsTemplate");
	}

	showWindow(rowItem) {
		catalog.waitData.then(() => {
			this.product = catalog.getItem(rowItem.row);
			const headerWindow = `${this.product.name}`;
			this.$$("headerWindow").setValues({headerWindow});
			this.template.parse(this.product);
			this.getRoot().show();
		});
	}

	hideWindow() {
		this.getRoot().hide();
		catalog.updateItem(this.product.id, this.product);
	}

	changeRating() {
		const currentRating = this.product.rating;
		const currentStared = this.product.stared;
		this.product.rating = (!currentStared) ? currentRating + 1 : currentRating - 1;
		this.product.stared = !currentStared;
		this.template.parse(this.product);
	}
}
