import {JetView} from "webix-jet";

export default class PopupLoginView extends JetView {
	config() {
		return {
			view: "window",
			modal: true,
			position: "center",
			width: 500,
			head: {
				cols: [
					{localId: "headerWindow", template: "Login", type: "header"},
					{view: "icon", icon: "wxi-close", click: () => this.hideWindow()}
				]
			},
			body: {
				view: "form",
				localId: "formLogin",
				elements: [
					{
						view: "text",
						name: "email",
						label: "E-Mail Address",
						labelWidth: 120,
						bottomPadding: 25,
						invalidMessage: "Incorrect email"
					},
					{
						view: "text",
						type: "password",
						name: "password",
						label: "Password",
						labelWidth: 120,
						bottomPadding: 25,
						invalidMessage: "Incorrect password"
					},
					{
						view: "checkbox",
						name: "remember",
						labelRight: "Remember Me",
						labelWidth: 120,
						customCheckbox: false
					},
					{
						css: "login_buttons",
						cols: [
							{
								view: "button",
								value: "Login",
								autowidth: true
							},
							{
								view: "template",
								template: "Fogot Your Password?"
							}
						]
					}
				]
			}
		};
	}

	init() {
		this.formLogin = this.$$("formLogin");
	}

	showWindow() {
		this.getRoot().show();
	}

	hideWindow() {
		this.getRoot().hide();
	}
}
