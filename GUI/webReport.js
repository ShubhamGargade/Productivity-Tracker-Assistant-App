
var firebase = require("firebase/app");

var Chart = require('chart.js');
const settings = require('electron-settings');

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");


var currentUserId = settings.getSync('key1.data');

console.log('Outside',currentUserId);
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("Signed in");
    // console.log(user.uid);
    settings.setSync('key1', {
      data: user.uid
    });

    var currentUserId = user.uid;
    console.log('Inside auth',currentUserId);
  }
});

class showDataToWebReport{
  constructor(){
    this.listenWebActivities()
  }
  listenWebActivities(){
    var calUsertwtt = firebase.database().ref('wa/'+ currentUserId + '/twtt');
    calUsertwtt.on('value', (snapshot) => {
      const datatwtt = snapshot.val();
      // console.log(data);
      if(datatwtt != null)
      {
        console.log(datatwtt.toString());
        document.getElementById("show-twtt-webreport").innerHTML = datatwtt;

      }
    });

    var calUserwPT = firebase.database().ref('wa/'+ currentUserId + '/p/twpt');
    calUserwPT.on('value', (snapshot) => {
    if(snapshot.val() != null)
    {

      var wPT = snapshot.val();
      document.getElementById("show-twpt-webreport").innerHTML = wPT;
    }
    });

    var calUserwebBusiness = firebase.database().ref('wa/'+ currentUserId + '/p/Computers/');
    calUserwebBusiness.on('value', (snapshot) => {
    if(snapshot.val() != null)
    {

      var webBusiness = snapshot.val();
      console.log('webbusiness: ', webBusiness);
      // document.getElementById("show-twpt-webreport").innerHTML = wPT;
    }
    });


  }
}
var obj = new showDataToWebReport();
