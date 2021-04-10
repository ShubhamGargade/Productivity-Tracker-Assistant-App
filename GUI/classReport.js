
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
    this.ctxUnP = document.getElementById('canvas-'+this.webOrSoft+'-UnProd').getContext('2d');
    this.labelForDashboardProd = ["Business", "Computers", "Health", "News", "Recreation", "Science", "Sports"];
    this.labelForDashboardUnProd = ["Arts", "Games", "Home", "Reference", "Shopping", "Society"];
    this.dataProd = [];
    this.dataUnProd = [];
    this.graphType = "bar";
    this.showClassBar = document.getElementById('show-'+this.webOrSoft+'-bar-graph');
    this.showClassPie = document.getElementById('show-'+this.webOrSoft+'-pie-chart');
    this.totalWTT = settings.getSync('Dic.dataDic.'+currentUserId+'.twtt');
    this.totalSTT = settings.getSync('Dic.dataDic.'+currentUserId+'.tstt');
    console.log(this.totalWTT);
    console.log(this.totalWTT);
    this.drawChartProd = new all_charts.AllCharts(this.ctxP, 'Productive Class', this.labelForDashboardProd, this.dataProd);
    this.drawChartUnProd = new all_charts.AllCharts(this.ctxUnP, 'UnProductive Class', this.labelForDashboardUnProd, this.dataUnProd);
    this.getClassData();
    this.listenUserChoice();
    console.log("dataProd:", this.dataProd);
    console.log("dataUnProd:", this.dataUnProd);
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
    this.drawChartUnProd.setChart(this.graphType, this.dataUnProd);
  }


  getClassData(){
    var c;
    var prodClass = settings.getSync('setClassTime.dataClass.'+currentUserId+'.'+this.webOrSoft+'.Productive');
    console.log("prodClass Dict: ", prodClass);
    for(c in prodClass){
      if(prodClass[c] != ""){
        console.log((timeArith.calTime(prodClass[c])/(timeArith.calTime(this.totalWTT)+timeArith.calTime(this.totalSTT)))*100);
        this.dataProd.push(((timeArith.calTime(prodClass[c])/(timeArith.calTime(this.totalWTT)+timeArith.calTime(this.totalSTT)))*100).toFixed(2));
      }
      else{
        this.dataProd.push("");
      }
    }

    var unprodClass = settings.getSync('setClassTime.dataClass.'+currentUserId+'.'+this.webOrSoft+'.UnProductive');
    console.log("prodClass Dict: ", unprodClass);
    for(c in unprodClass){
      if(unprodClass[c] != ""){
        this.dataUnProd.push(((timeArith.calTime(unprodClass[c])/(timeArith.calTime(this.totalWTT)+timeArith.calTime(this.totalSTT)))*100).toFixed(2));
      }
      else{
        this.dataUnProd.push("");
      }
    }

    this.showReport();
  }
}
// var objReport = new showClassReport();
module.exports = { showClassReport }
