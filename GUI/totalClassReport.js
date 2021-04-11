const classReport = require("./classReport");
const totalClassobj = new classReport.showClassReport('t');

const currentUserId = settings.getSync('key1.data');

window.addEventListener('storage', function(e) { 
	if(e.key==(currentUserId+"wnewDataChanged") || e.key==(currentUserId+"snewDataChanged")) {
		totalClassobj.updateData();
	}
	
});