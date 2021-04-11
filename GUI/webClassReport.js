const classReport = require("./classReport");
const webClassobj = new classReport.showClassReport('w');

const currentUserId = settings.getSync('key1.data');

window.addEventListener('storage', function(e) { 

	if(e.key==(currentUserId+"wnewDataChanged")) {
		webClassobj.updateData();
	}

});