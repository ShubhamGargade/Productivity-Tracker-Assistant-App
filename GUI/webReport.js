const webSoftDetails = require("./insertwebSoft");
const web = 'w';
var webObj = new webSoftDetails.insertWebSoftReport(web);

window.addEventListener('storage', function(e) { 

	if(e.key=="wnewDataChanged"){
		webObj.updateTotalTimes();
		webObj.updateData(e.newValue.split("-*-").slice(0,2).join(","));	
		webObj.updateProgressBars();
	}

	if(e.key=="togglePbAnimation"){
		webObj.togglePBAnimation();
	}
});