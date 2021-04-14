
var firebase = require("firebase/app");

var Chart = require('chart.js');
// const settings = require('electron-settings');

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
// // firebase.analytics();

// var database = firebase.database();
// function writeUserData(uid, fname, lname, email) {
//   firebase.database().ref('wa/123/Computers/cmd').set({
//     fn: fname,
//     ln: lname,
//     email: email,
//     isDBCleared: "t"
//   });
// }
// writeUserData(123, "shubham", "gargade", "g@gmail.com");

var prodPerctVar = 0;
var unprodPerctVar = 0;

var all_charts = require("./all_charts");

class showDataToDashboard {
    constructor(){
      this.ctx = document.getElementById('myChartDashboard').getContext('2d');
      this.labelForDashboard = [settings.getSync('lastTrackingDate.dataLtd.'+currentUserId)];
      this.graphType = "bar";

      var data = {prodPercent: prodPerctVar, unprodPercent: unprodPerctVar}

      this.dChartP = new all_charts.AllCharts(this.ctx, this.labelForDashboard, this.labelForDashboard, this.getDatasets(data), this.graphType)  // dChart1 => dashboard Chart for Productivity Unproductivity


      this.showDashboardBarGraph = document.getElementById('show-bar-graph');
      this.showDashboardPieChart = document.getElementById('show-pie-chart');
      this.showDashboardDoughnut = document.getElementById('show-doughnut');

      if (this.showDashboardBarGraph){
        this.showDashboardBarGraph.addEventListener('click', (e) => {
          this.graphType = 'bar';

          this.showReportDashboard();
          console.log('B');
        });
      }
      if (this.showDashboardPieChart){
        this.showDashboardPieChart.addEventListener('click', (e) => {
          this.graphType = 'pie';
          console.log('P');

          this.showReportDashboard();


        });
      }
      if(this.showDashboardDoughnut){
        this.showDashboardDoughnut.addEventListener('click', (e) => {
          this.graphType = 'doughnut';
          console.log('D');

          this.showReportDashboard();


        });
      }
      this.initFromDB();
    }

    getDatasets(data){

      var datasets = [];

      datasets = [
        {
          label: 'Productive %',
          fill: '+1',
          data: [data.prodPercent],
          backgroundColor: "rgba(75, 192, 192, 0.5)", 
          borderColor: "rgb(75, 192, 192)", 
          borderWidth: 1
        },
        {
          label: 'Unproductive %',
          fill: 'start',
          data: [data.unprodPercent],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgb(255, 99, 132)", 
          borderWidth: 1
        },
      ]

      return datasets;

    }

    showReportDashboard(){

        var data = {prodPercent: prodPerctVar, unprodPercent: unprodPerctVar}

        this.dChartP.setChart({graphType: this.graphType, datasets: this.getDatasets(data)});

    }

    updateTime(tempT, count){
      return {
            tempT: timeArith.calTime(tempT),
            count: count+1,
        };
    }

    calPercentage(sPT, wPT, tTT, count){
      if (count==3){
        // console.log(((sPT+wPT)/tTT)*100);
        var calPT = (((sPT+wPT)/tTT)*100).toFixed(2);
        console.log(calPT);
        if(calPT != 'NaN'){
          console.log(calPT);
            prodPerctVar = calPT;
            unprodPerctVar = (100 - prodPerctVar).toFixed(2);
            this.showReportDashboard();
            return calPT.toString() + ' %';
        }
        else {
          return "0%";
        }
      }
      return null;
    }

    calProdPercent(){
      var  sPT=0, wPT=0, tTT=0;
      var count = 0;
      var calUsersPT = firebase.database().ref('sa/'+ currentUserId + '/p/tspt');
      calUsersPT.on('value', (snapshot) => {
        if(snapshot.val() != null)
        {
          sPT = snapshot.val();
          var values = this.updateTime(sPT, count);
          sPT = values.tempT;
          count = values.count;
          var prodPer = this.calPercentage(sPT, wPT, tTT, count);
          this.setProdPercentInHTML(prodPer);
        }
      });
      var calUserwPT = firebase.database().ref('wa/'+ currentUserId + '/p/twpt');
      calUserwPT.on('value', (snapshot) => {
        if(snapshot.val() != null)
        {

          wPT = snapshot.val();
          var values = this.updateTime(wPT, count);
          wPT = values.tempT;
          count = values.count;

          var prodPer = this.calPercentage(sPT, wPT, tTT, count);
          this.setProdPercentInHTML(prodPer);
        }
      });
      var calUsertTT = firebase.database().ref('users/'+ currentUserId + '/ttt');
      calUsertTT.on('value', (snapshot) => {
        if(snapshot.val() != null)
        {

          tTT = snapshot.val();  // "0-h 0-m 0-s"
          var values = this.updateTime(tTT, count);
          tTT = values.tempT;
          count = values.count;

          var prodPer = this.calPercentage(sPT, wPT, tTT, count);
          this.setProdPercentInHTML(prodPer);
        }
      });

    }

    setProdPercentInHTML(val){
      console.log("Val",val);
      if(val != null){
        document.getElementById("show-prod-percent").innerHTML = val;
      }
    }

    initFromDB(){
      //ttt
      console.log("Inside initform db")
      var calUserttt = firebase.database().ref('users/'+ currentUserId + '/ttt');
      calUserttt.on('value', (snapshot) => {
        const datattt = snapshot.val();
        // console.log(data);
        console.log("Datattt val:", datattt)
        if(datattt != null)
        {
          console.log("Datattt:",datattt.toString());
          document.getElementById("show-ttt-dashboard").innerHTML = timeArith.removeDashesFromTimeStr(datattt);
          this.calProdPercent();
        }

      });

      var calUsertwtt = firebase.database().ref('wa/'+ currentUserId + '/twtt');
      calUsertwtt.on('value', (snapshot) => {
        const datatwtt = snapshot.val();
        // console.log(data);
        if(datatwtt != null)
        {
          console.log(datatwtt.toString());
          document.getElementById("show-twtt-dashboard").innerHTML = timeArith.removeDashesFromTimeStr(datatwtt);

        }

      });

      var calUsertstt = firebase.database().ref('sa/'+ currentUserId + '/tstt');
      calUsertstt.on('value', (snapshot) => {
        const datatstt = snapshot.val();
        // console.log(data);
        if(datatstt != null)
        {
          console.log(datatstt.toString());
          document.getElementById("show-tstt-dashboard").innerHTML = timeArith.removeDashesFromTimeStr(datatstt);

        }

      });

    }

}

var obj = new showDataToDashboard();
