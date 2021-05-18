const catalog = new webix.DataCollection({
	url: "http://localhost:3000/catalog/",
	save: "rest->http://localhost:3000/catalog/",
	scheme: {
		// $init: (obj) => {
		// 	obj.value = `${obj.FirstName} ${obj.LastName}`;
		// }
	}
});

export default catalog;
