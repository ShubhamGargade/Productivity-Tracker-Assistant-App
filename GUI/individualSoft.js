const webSoftDetails = require("./insertIndividualWebSoft");
const soft = 's';
var softObj = new webSoftDetails.insertIndividualWebSoftReport(soft);
const currentUserId = settings.getSync('user.uid');

window.addEventListener('storage', (e) => {


  	if(e.key==(currentUserId+"snewDataChanged")) {
      var t = e.newValue.split('-*-');
      softObj.updateTotalTimes();
      softObj.updateData(t[0]);
      softObj.updateProgressBars();
  	}

    if(e.key=="togglePbAnimation"){
		softObj.togglePBAnimation(e.newValue);
	}

});
