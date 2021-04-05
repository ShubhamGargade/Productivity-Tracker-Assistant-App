
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
    this.data;

    this.bg = document.getElementById("show-bar-graph");
    this.lg = document.getElementById("show-line-graph");
    this.graphType = "bar";
    this.listenProductivityData();
    this.listenUserChoice();
  }

  listenUserChoice(){
    this.bg.addEventListener('click', (e) => {
      this.graphType = "bar";
      this.showReport();
    });
    this.lg.addEventListener('click', (e) => {
      this.graphType = "line";
      this.showReport();
    });
  }

  showReportProductivityPast(productivityDailyDates, productivityDailyPer){
    this.labelForProductivityPast = productivityDailyDates;
    console.log(productivityDailyPer);
    this.data = productivityDailyPer;
    console.log('datasetatxaxis', this.data);
    this.productivityChartPast = new all_charts.AllCharts(this.ctx, 'Weekly Productivity', this.labelForProductivityPast, this.data)
    this.showReport();
  }

  showReport(){
    this.productivityChartPast.setChart(this.graphType, this.data);
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

  sortDates(keysDatesOfWeek, arrayOfDailyDatesPer){
    var i;
    var j;
    var len = keysDatesOfWeek.length - 1;
    var tempDate;
    var tempDatePer;
    var min;

    //sort by year
    for(i=0; i<=len; i++){
      var wdi = keysDatesOfWeek[i].split('-');
      min = parseInt(wdi[2]);
      for(j=i+1;j<=len;j++){
        var wdj = keysDatesOfWeek[j].split('-');
        if(min > parseInt(wdj[2])){
          tempDate = keysDatesOfWeek[j];
          tempDatePer = arrayOfDailyDatesPer[j];
          keysDatesOfWeek[j] = keysDatesOfWeek[i];
          arrayOfDailyDatesPer[j] = arrayOfDailyDatesPer[i];
          keysDatesOfWeek[i] = tempDate;
          arrayOfDailyDatesPer[i] = tempDatePer;
          var wdi = keysDatesOfWeek[i].split('-');
          min = parseInt(wdi[2]);
        }
      }
    }

    //sort by month
    for(i=0; i<=len; i++){
      var wdi = keysDatesOfWeek[i].split('-');
      min = parseInt(wdi[1]);
      for(j=i+1;j<=len;j++){
        var wdj = keysDatesOfWeek[j].split('-');
        if(min > parseInt(wdj[1])){
          tempDate = keysDatesOfWeek[j];
          tempDatePer = arrayOfDailyDatesPer[j];
          keysDatesOfWeek[j] = keysDatesOfWeek[i];
          arrayOfDailyDatesPer[j] = arrayOfDailyDatesPer[i];
          keysDatesOfWeek[i] = tempDate;
          arrayOfDailyDatesPer[i] = tempDatePer;
          var wdi = keysDatesOfWeek[i].split('-');
          min = parseInt(wdi[1]);
        }
      }
    }

    //sort by dates with help of month
    for(i=0; i<=len; i++){
      var wdi = keysDatesOfWeek[i].split('-');
      min = parseInt(wdi[0]);
      for(j=i+1;j<=len;j++){
        var wdj = keysDatesOfWeek[j].split('-');
        if(min > parseInt(wdj[0]) && wdi[1] == wdj[1]){
          tempDate = keysDatesOfWeek[j];
          tempDatePer = arrayOfDailyDatesPer[j];
          keysDatesOfWeek[j] = keysDatesOfWeek[i];
          arrayOfDailyDatesPer[j] = arrayOfDailyDatesPer[i];
          keysDatesOfWeek[i] = tempDate;
          arrayOfDailyDatesPer[i] = tempDatePer;
          console.log(keysDatesOfWeek);
          var wdi = keysDatesOfWeek[i].split('-');
          min = parseInt(wdi[0]);
        }
      }
    }

    //remove current date's productivity
    keysDatesOfWeek.pop();
    arrayOfDailyDatesPer.pop();

    return {
      keysDatesOfWeek: keysDatesOfWeek,
      arrayOfDailyDatesPer: arrayOfDailyDatesPer
    };

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

          console.log(dataUthId[keysDatesOfWeek[dates]]);
          arrayOfDailyDatesPer[dates] = this.getEachDateTimePer(dataUthId[keysDatesOfWeek[dates]]);
        }
        var sortedArrayDates = this.sortDates(keysDatesOfWeek, arrayOfDailyDatesPer);
        this.showReportProductivityPast(sortedArrayDates.keysDatesOfWeek, sortedArrayDates.arrayOfDailyDatesPer);
        // console.log(arrayOfDailyDatesPer);
      }
    });
  }



}
var obj = new showDataProductivity();
