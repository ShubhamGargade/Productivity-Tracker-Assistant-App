const classReport = require("./classReport");
const totalClassobj = new classReport.showClassReport('t');

const currentUserId = settings.getSync('user.uid');

window.addEventListener('storage', function(e) { 
	if(e.key==(currentUserId+"wnewDataChanged") || e.key==(currentUserId+"snewDataChanged")) {
		
		totalClassobj.updateData();

		var classData = e.newValue.split("-*-").slice(1, 3);
		var category = classData[1];
		var subCategory = classData[0];

		totalClassobj.updateTableData(category, subCategory);
	}
	
});