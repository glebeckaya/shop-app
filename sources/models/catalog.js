const catalog = new webix.DataCollection({
	url: "http://localhost:3000/catalog/",
	save: "rest->http://localhost:3000/catalog/"
});

export default catalog;
