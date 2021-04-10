const webSoftDetails = require("./insertwebSoft");
const soft = 's';
var softObj = new webSoftDetails.insertWebSoftReport(soft);

window.addEventListener('storage', function(e) { 
	if(e.key=="snewDataChanged"){
		softObj.updateTotalTimes();
		softObj.updateData(e.newValue.split("-*-").slice(0,2).join(","));	
		softObj.updateProgressBars();
	}

	if(e.key=="togglePbAnimation"){
		webObj.togglePBAnimation();
	}
});