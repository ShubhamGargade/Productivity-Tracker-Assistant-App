
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");

const time_arith = require("./time_arith");
var timeArith = new time_arith.TimeArith();

var currentUserId = settings.getSync('user.uid');

console.log('Outside',currentUserId);
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("Signed in");
    // console.log(user.uid);
    settings.setSync('user.uid', user.uid);

    var currentUserId = user.uid;
    console.log('Inside auth',currentUserId);
  }
});

var all_charts = require("./all_charts");

class showDataProductivity {
  constructor() {
    this.ctx = document.getElementById('myChartProductivityPast').getContext('2d');
    this.datasets;

    this.bg = document.getElementById("show-bar-graph");
    this.lg = document.getElementById("show-line-graph");
    this.graphType = "bar";
    this.updateLocalData();
    this.listenProductivityData();
    this.listenUserChoice();
  }

  updateLocalData(){
    var datesIdLocal = settings.getSync('Dic.dataDic.'+currentUserId+'.uth.id');
    var timeAdsLocal = settings.getSync('Dic.dataDic.'+currentUserId+'.uth.ads');
    this.calIdDateData(datesIdLocal);
    this.calAdsTimeData(timeAdsLocal);
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

  showReportProductivityPast(productivityDailyDates, datasets){
    this.labelForProductivityPast = productivityDailyDates;
    console.log(datasets);
    this.datasets = datasets;
    console.log('datasetatxaxis', this.datasets);
    this.productivityChartPast = new all_charts.AllCharts(this.ctx, 'Weekly Productivity', this.labelForProductivityPast, this.datasets, this.graphType)
    this.showReport();
  }

  showReport(){
    if (this.productivityChartPast != null) {
      this.productivityChartPast.setChart({graphType: this.graphType, datasets: this.datasets});
    }
  }


  sortDates(keysDatesOfWeek, arrayOfDailyDatesProdPer, arrayOfDailyDatesUnprodPer, arrayOfDailyDatesOthersPer){
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
          keysDatesOfWeek[j] = keysDatesOfWeek[i];
          keysDatesOfWeek[i] = tempDate;

          tempDatePer = arrayOfDailyDatesProdPer[j];
          arrayOfDailyDatesProdPer[j] = arrayOfDailyDatesProdPer[i];
          arrayOfDailyDatesProdPer[i] = tempDatePer;

          tempDatePer = arrayOfDailyDatesUnprodPer[j];
          arrayOfDailyDatesUnprodPer[j] = arrayOfDailyDatesUnprodPer[i];
          arrayOfDailyDatesUnprodPer[i] = tempDatePer;

          tempDatePer = arrayOfDailyDatesOthersPer[j];
          arrayOfDailyDatesOthersPer[j] = arrayOfDailyDatesOthersPer[i];
          arrayOfDailyDatesOthersPer[i] = tempDatePer;

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
          keysDatesOfWeek[j] = keysDatesOfWeek[i];
          keysDatesOfWeek[i] = tempDate;

          tempDatePer = arrayOfDailyDatesProdPer[j];
          arrayOfDailyDatesProdPer[j] = arrayOfDailyDatesProdPer[i];
          arrayOfDailyDatesProdPer[i] = tempDatePer;

          tempDatePer = arrayOfDailyDatesUnprodPer[j];
          arrayOfDailyDatesUnprodPer[j] = arrayOfDailyDatesUnprodPer[i];
          arrayOfDailyDatesUnprodPer[i] = tempDatePer;

          tempDatePer = arrayOfDailyDatesOthersPer[j];
          arrayOfDailyDatesOthersPer[j] = arrayOfDailyDatesOthersPer[i];
          arrayOfDailyDatesOthersPer[i] = tempDatePer;

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
          keysDatesOfWeek[j] = keysDatesOfWeek[i];
          keysDatesOfWeek[i] = tempDate;

          tempDatePer = arrayOfDailyDatesProdPer[j];
          arrayOfDailyDatesProdPer[j] = arrayOfDailyDatesProdPer[i];
          arrayOfDailyDatesProdPer[i] = tempDatePer;

          tempDatePer = arrayOfDailyDatesUnprodPer[j];
          arrayOfDailyDatesUnprodPer[j] = arrayOfDailyDatesUnprodPer[i];
          arrayOfDailyDatesUnprodPer[i] = tempDatePer;

          tempDatePer = arrayOfDailyDatesOthersPer[j];
          arrayOfDailyDatesOthersPer[j] = arrayOfDailyDatesOthersPer[i];
          arrayOfDailyDatesOthersPer[i] = tempDatePer;

          console.log(keysDatesOfWeek);
          var wdi = keysDatesOfWeek[i].split('-');
          min = parseInt(wdi[0]);
        }
      }
    }

    //remove current date's productivity

    var currentDate = this.getCurrentDate();
    if(currentDate == keysDatesOfWeek[keysDatesOfWeek.length - 1]){
      keysDatesOfWeek.pop();
      arrayOfDailyDatesProdPer.pop();
      arrayOfDailyDatesUnprodPer.pop();
      arrayOfDailyDatesOthersPer.pop();
    }


    // comment out this for loop only to see more number of days in graph, then comment it again
    // for (var i = 0; i < 6; i++) {
    //   keysDatesOfWeek = keysDatesOfWeek.concat(keysDatesOfWeek);
    //   arrayOfDailyDatesProdPer = arrayOfDailyDatesProdPer.concat(arrayOfDailyDatesProdPer);
    //   arrayOfDailyDatesUnprodPer = arrayOfDailyDatesUnprodPer.concat(arrayOfDailyDatesUnprodPer);
    //   arrayOfDailyDatesOthersPer = arrayOfDailyDatesOthersPer.concat(arrayOfDailyDatesOthersPer);
    // }


    return {
      keysDatesOfWeek: this.joinWithSlash(keysDatesOfWeek),
      arrayOfDailyDatesProdPer: arrayOfDailyDatesProdPer,
      arrayOfDailyDatesUnprodPer: arrayOfDailyDatesUnprodPer,
      arrayOfDailyDatesOthersPer: arrayOfDailyDatesOthersPer
    };

  }

  getCurrentDate(){
    var cD = new Date().getDate().toString();
    var cM = (parseInt(new Date().getMonth())+1).toString();
    var cY = new Date().getFullYear().toString().substr(2,2);
    console.log('current month', cM);
    if(cM.length == 1){
      cM = "0"+cM;
    }
    var currentDate = cD+'-'+cM+'-'+cY;

    return currentDate;
  }

  joinWithSlash(arr){
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('-').join('-');
    }
    return arr;
  }

  getEachDateTimeProdPer(timeVal){
    this.tptInSec = timeArith.calTime(timeVal['tpt']).toFixed(2);
    this.tttInSec = timeArith.calTime(timeVal['ttt']).toFixed(2);
    // console.log(this.tptInSec);
    // console.log(this.tttInSec);
    return ((this.tptInSec / this.tttInSec)*100).toFixed(2);
  }

  getEachDateTimeUnprodPer(timeVal){
    this.tuptInSec = timeArith.calTime(timeVal['tupt']).toFixed(2);
    this.tttInSec = timeArith.calTime(timeVal['ttt']).toFixed(2);
    // console.log(this.tptInSec);
    // console.log(this.tttInSec);
    return ((this.tuptInSec / this.tttInSec)*100).toFixed(2);
  }

  getDatasets(sortedArrayDates){

    var datasets = [];

    datasets = [
      {
        label: 'Productive %',
        fill: '+1',
        data: sortedArrayDates.arrayOfDailyDatesProdPer,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1
      },
      {
        label: 'Unproductive %',
        fill: '+1',
        data: sortedArrayDates.arrayOfDailyDatesUnprodPer,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1
      },
      {
        label: 'Others %',
        fill: 'start',
        data: sortedArrayDates.arrayOfDailyDatesOthersPer,
        backgroundColor: "rgba(201, 203, 207, 0.5)",
        borderColor: "rgb(201, 203, 207)", 
        borderWidth: 1
      },
    ]
    return datasets;

  }

  calIdDateData(dataUthId){
    var keysDatesOfWeek = Object.keys(dataUthId);//dates of week
    console.log(keysDatesOfWeek);
    // console.log(dataUthId[keysDatesOfWeek[0]]);
    var dates;
    var arrayOfDailyDatesProdPer = [];
    var arrayOfDailyDatesUnprodPer = [];
    var arrayOfDailyDatesOthersPer = [];

    for(dates in keysDatesOfWeek){

      console.log(dataUthId[keysDatesOfWeek[dates]]);
      arrayOfDailyDatesProdPer[dates] = this.getEachDateTimeProdPer(dataUthId[keysDatesOfWeek[dates]]);
      arrayOfDailyDatesUnprodPer[dates] = this.getEachDateTimeUnprodPer(dataUthId[keysDatesOfWeek[dates]]);
      arrayOfDailyDatesOthersPer[dates] = (100 - arrayOfDailyDatesProdPer[dates] - arrayOfDailyDatesUnprodPer[dates]).toFixed(2);
    }

    var sortedArrayDates = this.sortDates(keysDatesOfWeek, arrayOfDailyDatesProdPer, arrayOfDailyDatesUnprodPer, arrayOfDailyDatesOthersPer);
    console.log("arrayOfDailyDatesProdPer: ",sortedArrayDates.arrayOfDailyDatesProdPer);
    this.showReportProductivityPast(sortedArrayDates.keysDatesOfWeek, this.getDatasets(sortedArrayDates));
  }

  calAdsTimeData(dataUthAds){
    document.getElementById("show-ads-ttt-prodReport").innerHTML = timeArith.removeDashesFromTimeStr(dataUthAds['ttt']);
    document.getElementById("show-ads-tpt-prodReport").innerHTML = timeArith.removeDashesFromTimeStr(dataUthAds['tpt']);
    document.getElementById("show-ads-tupt-prodReport").innerHTML = timeArith.removeDashesFromTimeStr(dataUthAds['tupt']);
    document.getElementById("show-ads-prod-percent-prodReport").innerHTML = this.getEachDateTimePer(dataUthAds) + ' %';
  }

  listenProductivityData() {
    // individual day
    var calUserUthId = firebase.database().ref('uth/'+ currentUserId + '/id');
    calUserUthId.on('value', (snapshot) => {
      const dataUthId = snapshot.val();
      settings.setSync('Dic.dataDic.'+currentUserId+'.uth.id', dataUthId);
      // console.log(data);
      if(dataUthId != null)
      {

        this.calIdDateData(dataUthId);

      }
    });

    // all days
    var calUserUthAds = firebase.database().ref('uth/'+ currentUserId + '/ads');
    calUserUthAds.on('value', (snapshot) => {
      const dataUthAds = snapshot.val();
          settings.setSync('Dic.dataDic.'+currentUserId+'.uth.ads', dataUthAds);

      if(dataUthAds != null)
      {

        this.calAdsTimeData(dataUthAds);
        
      }
    });
  }



}
var obj = new showDataProductivity();
