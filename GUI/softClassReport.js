const classReport = require("./classReport");
const softClassobj = new classReport.showClassReport('s');

const currentUserId = settings.getSync('key1.data');

window.addEventListener('storage', function(e) { 

	if(e.key==(currentUserId+"snewDataChanged")) {
		softClassobj.updateData();
	}
	
});