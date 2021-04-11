const webSoftDetails = require("./insertwebSoft");
const soft = 's';
var softObj = new webSoftDetails.insertWebSoftReport(soft);

const currentUserId = settings.getSync('key1.data');

window.addEventListener('storage', function(e) { 
	if(e.key==(currentUserId+"snewDataChanged")) {
		softObj.updateTotalTimes();
		softObj.updateData(e.newValue.split("-*-").slice(0,2).join(","));	
		softObj.updateProgressBars();
	}

	if(e.key=="togglePbAnimation"){
		softObj.togglePBAnimation(e.newValue);
	}
});