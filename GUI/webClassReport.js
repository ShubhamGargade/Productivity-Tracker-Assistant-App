const classReport = require("./classReport");
const webClassobj = new classReport.showClassReport('w');

const currentUserId = settings.getSync('user.uid');

window.addEventListener('storage', function(e) { 

	if(e.key==(currentUserId+"wnewDataChanged")) {
		
		webClassobj.updateData();

		var classData = e.newValue.split("-*-").slice(1, 3);
		var category = classData[1];
		var subCategory = classData[0];

		webClassobj.updateTableData(category, subCategory);
	}

});