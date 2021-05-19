const orders = new webix.DataCollection({
	url: "http://localhost:3000/orders/",
	save: "rest->http://localhost:3000/orders/"
});

export default orders;
