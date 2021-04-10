

class Dates {

	getCurrentTrackingDate(){
		var cD = new Date().getDate().toString();
	    var cM = (parseInt(new Date().getMonth())+1).toString();
	    var cY = new Date().getFullYear().toString().substr(2,2);
	    console.log('current month', cM);

	    if(cM.length == 1){
	      cM = "0"+cM;
	    }
	    var currentTrackingDate = cD+'-'+cM+'-'+cY;

	    return currentTrackingDate;
	}
}

module.exports = { Dates }