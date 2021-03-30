var theme_bg_dark = localStorage.getItem("theme_bg_dark");
var theme_bg_light = localStorage.getItem("theme_bg_light");
var theme_color_dark = localStorage.getItem("theme_color_dark");
var theme_color_light = localStorage.getItem("theme_color_light");
var tracking_btn_dark = localStorage.getItem("tracking_btn_light");
var tracking_btn_light = localStorage.getItem("tracking_btn_dark");

function changeTheme(){
	var current_theme = localStorage.getItem("current_theme");
	// alert(current_theme)
	if(current_theme=="light" || current_theme==null){
		document.documentElement.style.setProperty('--bg', theme_bg_light);
		document.documentElement.style.setProperty('--color', theme_color_light);
		$('.btn-outline-light').addClass('btn-outline-dark');
		$('.btn-outline-light').removeClass('btn-outline-light');
	}
	else{
		document.documentElement.style.setProperty('--bg', theme_bg_dark);
		document.documentElement.style.setProperty('--color', theme_color_dark);
		$('.btn-outline-dark').addClass('btn-outline-light');
		$('.btn-outline-dark').removeClass('btn-outline-dark');
	}
}

changeTheme();