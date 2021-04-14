var current_theme = settings.getSync("current_theme");

var gridColor = "#fafafa";
var textColor = "#404244";
var textSize = 13;

if(current_theme=="dark"){
  gridColor = "#395565",
  textColor = "#a0b7c2"
}
else{
  gridColor = "#eeeeee"
}