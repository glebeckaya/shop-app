const users = new webix.DataCollection({
	url: "http://localhost:3000/users/",
	save: "http://localhost:3000/users/"
});

export default users;
