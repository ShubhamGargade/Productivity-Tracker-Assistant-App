

class AppSettings {

	setSyncSettings(key, value){

		try {
	        settings.setSync(key, value);
		}
		catch(e){
			console.log("Error in setSyncSettings",e)
			setTimeout(function(){
				settings.setSync(key, value);
			}, 1000);
		}
	}
}

module.exports = { AppSettings }