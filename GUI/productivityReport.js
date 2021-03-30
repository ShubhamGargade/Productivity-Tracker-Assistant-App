
var firebase = require("firebase/app");

var Chart = require('chart.js');

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

var all_charts = require("./all_charts");

class showDataProductivity {
  constructor() {

    this.ctx = document.getElementById('myChartProductivityPast').getContext('2d');
    this.listenProductivityData();
  }


  showReportProductivityPast(productivityDailyDates, productivityDailyPer){
    this.labelForProductivityPast = productivityDailyDates;
    var data = productivityDailyPer;
    this.graphType = "bar";
    console.log('datasetatxaxis', data);
    this.productivityChartPast = new all_charts.AllCharts(this.ctx, 'Productivity', this.labelForProductivityPast, data)
  }

  calTime(tempT){
        var sPTH=0, sPTM=0, sPTS=0;
        tempT = tempT.split(" ");
        sPTH = tempT[0].split("-");
        sPTH = parseInt(sPTH[0])*3600;
        sPTM = tempT[1].split("-");
        sPTM = parseInt(sPTM[0])*60;
        sPTS = tempT[2].split("-");
        sPTS = parseInt(sPTS[0]);
        tempT = sPTH + sPTM + sPTS;
        return tempT;
  }


  getEachDateTimePer(timeVal){
    this.tptInSec = this.calTime(timeVal['tpt']).toFixed(2);
    this.tttInSec = this.calTime(timeVal['ttt']).toFixed(2);
    // console.log(this.tptInSec);
    // console.log(this.tttInSec);
    return ((this.tptInSec / this.tttInSec)*100).toFixed(2);
  }

  listenProductivityData() {
    var calUserUthId = firebase.database().ref('uth/'+ currentUserId + '/id');
    calUserUthId.on('value', (snapshot) => {
      const dataUthId = snapshot.val();
      // console.log(data);
      if(dataUthId != null)
      {
        var keysDatesOfWeek = Object.keys(dataUthId);//dates of week
        console.log(keysDatesOfWeek);
        // console.log(dataUthId[keysDatesOfWeek[0]]);
        var dates;
        var arrayOfDailyDatesPer = [];

        for(dates in keysDatesOfWeek){

          // console.log(dataUthId[keysDatesOfWeek[dates]]);
          arrayOfDailyDatesPer[dates] = this.getEachDateTimePer(dataUthId[keysDatesOfWeek[dates]]);
        }
        this.showReportProductivityPast(keysDatesOfWeek, arrayOfDailyDatesPer);
        // console.log(arrayOfDailyDatesPer);
      }
    });
  }



}
var obj = new showDataProductivity();
