import {JetView} from "webix-jet";

export default class PopupRegisterView extends JetView {
	config() {
		return {
			view: "window",
			modal: true,
			position: "center",
			width: 600,
			head: {
				cols: [
					{localId: "headerWindow", template: "Register", type: "header"},
					{view: "icon", icon: "wxi-close", click: () => this.hideWindow()}
				]
			},
			body: {
				width: 600,
				view: "form",
				localId: "formRegisrer",
				elements: [
					{
						view: "text",
						name: "name",
						label: "Name",
						labelWidth: 150,
						bottomPadding: 25,
						invalidMessage: "Incorrect email"
					},
					{
						view: "text",
						name: "email",
						label: "E-Mail Address",
						labelWidth: 150,
						bottomPadding: 25,
						invalidMessage: "Incorrect email"
					},
					{
						view: "text",
						type: "password",
						name: "password",
						label: "Password",
						labelWidth: 150,
						bottomPadding: 25,
						invalidMessage: "Incorrect password"
					},
					{
						view: "text",
						type: "password",
						name: "confirmPassword",
						label: "Confirm Password",
						labelWidth: 150,
						bottomPadding: 25,
						invalidMessage: "Incorrect password"
					},
					{
						css: "register_buttons",
						view: "button",
						value: "Register",
						autowidth: true
					}
				]
			}
		};
	}

	init() {
		this.formLogin = this.$$("formRegisrer");
	}

	showWindow() {
		this.getRoot().show();
	}

	hideWindow() {
		this.getRoot().hide();
	}
}
