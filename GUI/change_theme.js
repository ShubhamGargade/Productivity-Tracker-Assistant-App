var theme_bg_light1 = localStorage.getItem("theme_bg_light1");
var theme_bg_dark1 = localStorage.getItem("theme_bg_dark1");
var theme_bg_dark2 = localStorage.getItem("theme_bg_dark2");
var theme_color_light = localStorage.getItem("theme_color_light");
var theme_color_dark = localStorage.getItem("theme_color_dark");

var card_body_bg_light1 = localStorage.getItem("card_body_bg_light1");
var card_body_bg_dark1 = localStorage.getItem("card_body_bg_dark1");
var card_body_bg_dark2 = localStorage.getItem("card_body_bg_dark2");

var p_bar_bg_light1 = localStorage.getItem("p_bar_bg_light1");
var p_bar_bg_dark1 = localStorage.getItem("p_bar_bg_dark1");
var p_bar_bg_dark2 = localStorage.getItem("p_bar_bg_dark2");


function changeTheme(){
	var current_theme = settings.getSync("current_theme");

	if(current_theme=="light" || current_theme==null){

		var theme_id = settings.getSync("light_theme_id");

		if(theme_id=="l1" || theme_id==null){
			document.documentElement.style.setProperty('--bg', theme_bg_light1);
			document.documentElement.style.setProperty('--card-body-bg', card_body_bg_light1);
			document.documentElement.style.setProperty('--p-bar-bg', p_bar_bg_light1);
		}
		document.documentElement.style.setProperty('--color', theme_color_light);
		$('.btn-outline-light').addClass('btn-outline-dark');
		$('.btn-outline-light').removeClass('btn-outline-light');
	}
	else{

		var theme_id = settings.getSync("dark_theme_id");


		if(theme_id=="d1" || theme_id==null){
			document.documentElement.style.setProperty('--bg', theme_bg_dark1);
			document.documentElement.style.setProperty('--card-body-bg', card_body_bg_dark1);
			document.documentElement.style.setProperty('--p-bar-bg', p_bar_bg_dark1);
		}
		else if(theme_id=="d2"){
			document.documentElement.style.setProperty('--bg', theme_bg_dark2);
			document.documentElement.style.setProperty('--card-body-bg', card_body_bg_dark2);
			document.documentElement.style.setProperty('--p-bar-bg', p_bar_bg_dark2);

		}
		
		document.documentElement.style.setProperty('--color', theme_color_dark);
		$('.btn-outline-dark').addClass('btn-outline-light');
		$('.btn-outline-dark').removeClass('btn-outline-dark');
	}
}

changeTheme();