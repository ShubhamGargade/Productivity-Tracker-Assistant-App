const classReport = require("./classReport");
const softClassobj = new classReport.showClassReport('s');

const currentUserId = settings.getSync('user.uid');

window.addEventListener('storage', function(e) { 

	if(e.key==(currentUserId+"snewDataChanged")) {

		softClassobj.updateData();

		var classData = e.newValue.split("-*-").slice(1, 3);
		var category = classData[1];
		var subCategory = classData[0];

		softClassobj.updateTableData(category, subCategory);		
	}
	
});