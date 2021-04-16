const webSoftDetails = require("./insertIndividualWebSoft");
const web = 'w';
var webObj = new webSoftDetails.insertIndividualWebSoftReport(web);

const currentUserId = settings.getSync('user.uid');

window.addEventListener('storage', (e) => {

	if(e.key==(currentUserId+"wnewDataChanged")) { 

    var t = e.newValue.split('-*-');
        console.log('-------------------------------------------------------------DYNAMIC', t[0]);
    webObj.updateTotalTimes();
    webObj.updateData(t[0]);
    webObj.updateProgressBars();
	}

  if(e.key=="togglePbAnimation"){
		webObj.togglePBAnimation(e.newValue);
	}

});
