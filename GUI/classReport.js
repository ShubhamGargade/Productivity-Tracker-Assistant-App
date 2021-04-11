
const time_arith = require("./time_arith");
var timeArith = new time_arith.TimeArith();
all_charts = require("./all_charts");
var Chart = require('chart.js');
// const settings = require('electron-settings');
var currentUserId = settings.getSync('key1.data');

class showClassReport{
  constructor(webOrSoft){
    this.webOrSoft = webOrSoft;
    console.log("inside classreport");
    this.ctxP = document.getElementById('canvas-'+this.webOrSoft+'-Prod').getContext('2d');
    this.ctxUnP = document.getElementById('canvas-'+this.webOrSoft+'-Unprod').getContext('2d');
    this.labelForDashboardProd = ["Business", "Computers", "Health", "News", "Recreation", "Science", "Sports"];
    this.labelForDashboardUnprod = ["Arts", "Games", "Home", "Reference", "Shopping", "Society"];
    this.graphType = "bar";
    this.showClassBar = document.getElementById('show-'+this.webOrSoft+'-bar-graph');
    this.showClassPie = document.getElementById('show-'+this.webOrSoft+'-pie-chart');
    this.drawChartProd = new all_charts.AllCharts(this.ctxP, 'Productive Class', this.labelForDashboardProd, this.dataProd);
    this.drawChartUnprod = new all_charts.AllCharts(this.ctxUnP, 'Unproductive Class', this.labelForDashboardUnprod, this.dataUnprod);
    
    this.listenUserChoice();

    this.updateData();
  }

  updateData(){

    this.totalWTT = settings.getSync('Dic.dataDic.'+currentUserId+'.twtt');
    this.totalSTT = settings.getSync('Dic.dataDic.'+currentUserId+'.tstt');
    console.log(this.totalWTT);
    console.log(this.totalSTT);

    this.getClassData();

    console.log("dataProd:", this.dataProd);
    console.log("dataUnprod:", this.dataUnprod);

    this.showReport();

  }

  listenUserChoice(){
    this.showClassBar.addEventListener('click', (e) => {
      this.graphType = "bar";
      this.showReport();
    });
    this.showClassPie.addEventListener('click', (e) => {
      this.graphType = "pie";
      this.showReport();
    });
  }


  showReport(){
    this.drawChartProd.setChart(this.graphType, this.dataProd);
    this.drawChartUnprod.setChart(this.graphType, this.dataUnprod);
  }


  getClassData(){

    this.dataProd = [];
    this.dataUnprod = [];

    var c;
    var prodClass = settings.getSync('setClassTime.dataClass.'+currentUserId+'.'+this.webOrSoft+'.Productive');
    console.log("prodClass Dict: ", prodClass);

    var totalTime = '0-h 0-m 1-s';

    if(this.webOrSoft=='w'){
      totalTime = timeArith.calTime(this.totalWTT);
    }
    else if(this.webOrSoft=='s'){
      totalTime = timeArith.calTime(this.totalSTT);
    }
    else{
      totalTime = timeArith.calTime(this.totalWTT)+timeArith.calTime(this.totalSTT);
    }

    for(c in prodClass){
      if(prodClass[c] != ""){
        console.log((timeArith.calTime(prodClass[c])/totalTime)*100);
        this.dataProd.push(((timeArith.calTime(prodClass[c])/totalTime)*100).toFixed(2));
      }
      else{
        this.dataProd.push("");
      }
    }

    var UnprodClass = settings.getSync('setClassTime.dataClass.'+currentUserId+'.'+this.webOrSoft+'.Unproductive');
    console.log("UnprodClass Dict: ", UnprodClass);
    for(c in UnprodClass){
      if(UnprodClass[c] != ""){
        this.dataUnprod.push(((timeArith.calTime(UnprodClass[c])/totalTime)*100).toFixed(2));
      }
      else{
        this.dataUnprod.push("");
      }
    }
  }
}
// var objReport = new showClassReport();
module.exports = { showClassReport }
