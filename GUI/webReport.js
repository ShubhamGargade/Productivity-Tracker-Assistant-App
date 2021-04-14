const webSoftDetails = require("./insertwebSoft");
const web = 'w';
var webObj = new webSoftDetails.insertWebSoftReport(web);

const currentUserId = settings.getSync('user.uid');

window.addEventListener('storage', function(e) { 

	if(e.key==(currentUserId+"wnewDataChanged")) {
		webObj.updateTotalTimes();
		webObj.updateData(e.newValue.split("-*-").slice(0,2).join(","));	
		webObj.updateProgressBars();
	}

	if(e.key=="togglePbAnimation"){
		webObj.togglePBAnimation(e.newValue);
	}
});